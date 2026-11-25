#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
PML Aufgabe 6 - Medical Guideline RAG 

Dies ist eine angepasste Version, die:
1) Die Passagen direkt als Text vergleicht (normalisiert), statt Hashes zu nutzen.
2) Eine Ähnlichkeitsprüfung (Ratio > 0.9) nutzt, um kleine Abweichungen zu tolerieren.
3) Evaluation auf 3 Ebenen bietet: PDF, Seite, Text-Inhalt (Chunk).

"""

import os
import re
import glob
import json
import warnings
import difflib  # Für Textähnlichkeit
from dataclasses import dataclass
from typing import List, Dict, Any, Optional, Tuple

warnings.filterwarnings("ignore")

# Loader + Splitter
from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter

# Vector DB
from langchain_chroma import Chroma

# Embeddings (HuggingFace)
from langchain_huggingface import HuggingFaceEmbeddings

# Prompt + Runnables (LCEL)
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough, RunnableParallel
from langchain_core.output_parsers import StrOutputParser

# LLM (Ollama)
try:
    from langchain_community.chat_models import ChatOllama
except Exception:
    from langchain_ollama import ChatOllama  # Fallback für neuere Versionen


# KONFIGURATION

@dataclass
class Config:
    # Pfade
    docs_path: str = "./results"                    # Ordner mit den PDF-Leitlinien
    db_path: str = "./chroma_db_bge_m3_1500"        # Pfad zur chroma datenbank
    
    # Modelle
    embedding_model: str = "BAAI/bge-m3"            # State-of-the-Art Embeddingmodell
    llm_model: str = "llama3"                       # Lokales LLM via Ollama
    
    # Chunking Parameter 
    chunk_size: int = 1500                          
    chunk_overlap: int = 200
    
    # Retrieval Parameter
    search_type: str = "mmr"                        # Maximum Marginal Relevance für Diversität
    k: int = 6                                      # Anzahl der abgerufenen Chunks (Top-k)
    fetch_k: int = 80                               # Suchpool für MMR
    lambda_mult: float = 0.15                       # Diversitätsgrad (0 = max divers, 1 = max relevant)
    
    # Schutzmechanismus
    read_only_db: bool = True                       # Verhindert versehentliches Neubauen der DB
    
    # Evaluations-Dateien
    gold_questions_path: str = "./gold_questions.json"
    gold_standard_path: str = "./gold_standard2.json"
    
    # Text-Matching Toleranz (0.9 = 90% Ähnlichkeit erforderlich)
    text_similarity_threshold: float = 0.9

CFG = Config()

# Regex zum Extrahieren der Leitlinien-ID aus Dateinamen
GUIDELINE_ID_RE = re.compile(r"^(nvl-\d+|\d{3}-\d{3})", re.IGNORECASE)

# HILFSFUNKTIONEN

def guideline_id(name: str) -> str:
    """Extrahiert die ID (z.B. 013-028) aus dem Dateinamen."""
    base = os.path.basename(name or "").lower()
    m = GUIDELINE_ID_RE.match(base)
    return m.group(1) if m else base

def device_auto() -> str:
    """Wählt automatisch GPU (cuda) oder CPU."""
    try:
        import torch
        return "cuda" if torch.cuda.is_available() else "cpu"
    except Exception:
        return "cpu"

def normalize_text(s: str) -> str:
    """
    Bereinigt Text von Formatierungsartefakten für den Vergleich.
    Entfernt doppelte Leerzeichen, Tabs und Zeilenumbrüche.
    """
    s = s or ""
    s = re.sub(r"\s+", " ", s).strip()
    return s

def calculate_similarity(text1: str, text2: str) -> float:
    """Berechnet die Ähnlichkeit zwischen zwei Texten (0.0 bis 1.0)."""
    return difflib.SequenceMatcher(None, text1, text2).ratio()


# RAG SYSTEM 

class MedicalGuidelineRAG:
    def __init__(self, cfg: Config):
        self.cfg = cfg
        self.embeddings = None
        self.llm = None
        self.vectorstore = None
        self.retriever = None
        self.chain = None

    def init_models(self):
        """Initialisiert Embedding-Modell und LLM."""
        dev = device_auto()
        print(f"init: embeddings={self.cfg.embedding_model} device={dev} | llm={self.cfg.llm_model}")
        
        self.embeddings = HuggingFaceEmbeddings(
            model_name=self.cfg.embedding_model,
            model_kwargs={"device": dev},
            encode_kwargs={"normalize_embeddings": True},
        )
        self.llm = ChatOllama(model=self.cfg.llm_model, temperature=0.0)

    def load_documents(self) -> List[Any]:
        """Lädt PDFs aus dem Verzeichnis."""
        pdf_files = glob.glob(os.path.join(self.cfg.docs_path, "**/*.pdf"), recursive=True)
        if not pdf_files:
            raise FileNotFoundError(f"Keine PDFs in {self.cfg.docs_path} gefunden.")
        
        print(f"PDFs gefunden: {len(pdf_files)} — lade Seiten ...")
        docs = []
        for fp in pdf_files:
            try:
                docs.extend(PyPDFLoader(fp).load())
            except Exception as e:
                print(f"Fehler beim Laden {fp}: {e}")
        return docs

    def build_or_load_db(self, rebuild: bool = False):
        """Lädt die ChromaDB oder baut sie neu (wenn rebuild=True)."""
        if self.embeddings is None:
            self.init_models()

        db_exists = os.path.isdir(self.cfg.db_path)

        if db_exists and not rebuild:
            print(f"Lade bestehende DB: {self.cfg.db_path}")
            self.vectorstore = Chroma(
                persist_directory=self.cfg.db_path,
                embedding_function=self.embeddings
            )
        else:
            if db_exists and rebuild and self.cfg.read_only_db:
                raise RuntimeError("READ-ONLY Schutz aktiv. Setze cfg.read_only_db=False für Rebuild.")

            print(" Baue neue DB ...")
            docs = self.load_documents()
            
            # Chunking
            print(f" Chunking: size={self.cfg.chunk_size}, overlap={self.cfg.chunk_overlap}")
            splitter = RecursiveCharacterTextSplitter(
                chunk_size=self.cfg.chunk_size,
                chunk_overlap=self.cfg.chunk_overlap,
                length_function=len,
                is_separator_regex=False,
            )
            chunks = splitter.split_documents(docs)
            
            # Metadaten setzen
            for i, d in enumerate(chunks):
                d.metadata["chunk_id"] = i

            os.makedirs(self.cfg.db_path, exist_ok=True)
            self.vectorstore = Chroma.from_documents(
                documents=chunks,
                embedding=self.embeddings,
                persist_directory=self.cfg.db_path
            )
            print(f" DB gespeichert unter: {self.cfg.db_path}")

        self._build_chain()

    def _build_chain(self):
        """Baut die RAG-Chain (Retrieval + Prompt + LLM)."""
        # Retriever Setup
        if self.cfg.search_type == "mmr":
            self.retriever = self.vectorstore.as_retriever(
                search_type="mmr",
                search_kwargs={"k": self.cfg.k, "fetch_k": self.cfg.fetch_k, "lambda_mult": self.cfg.lambda_mult}
            )
        else:
            self.retriever = self.vectorstore.as_retriever(
                search_type="similarity", search_kwargs={"k": self.cfg.k}
            )

        # Prompt Engineering
        template = (
            "Du bist ein hilfreicher medizinischer Assistent. "
            "Beantworte die Frage basierend auf den folgenden Textauszügen (Kontext).\n\n"
            "Wichtig:\n"
            "- Gib IMMER die Quelle an (Dateiname, Seite).\n"
            "- Wenn der Kontext die Antwort enthält, fasse sie zusammen.\n"
            "- Wenn der Kontext nur Hinweise gibt, formuliere diese vorsichtig.\n"
            "- Nur wenn absolut KEINE Informationen zum Thema da sind, antworte: 'Nicht gefunden'.\n\n"
            "Kontext:\n{context}\n\n"
            "Frage: {question}\n\n"
            "Antwort:"
        )
        prompt = ChatPromptTemplate.from_template(template)

        # Source Formatting Helper
        def format_docs(docs: List[Any]) -> str:
            seen = set()
            parts = []
            for d in docs:
                src = os.path.basename(d.metadata.get("source", "Unbekannt"))
                page = d.metadata.get("page", "Unbekannt")
                try: page = str(int(page) + 1)
                except: pass
                
                key = (src, page)
                if key in seen: continue
                seen.add(key)
                
                parts.append(f"[Quelle: {src}, Seite {page}] {d.page_content}")
            return "\n\n".join(parts)

        # Chain Construction
        retrieval_step = RunnableParallel({"docs": self.retriever, "question": RunnablePassthrough()})
        self.chain = (
            retrieval_step
            | {
                "answer": (
                    {"context": lambda x: format_docs(x["docs"]), "question": lambda x: x["question"]}
                    | prompt | self.llm | StrOutputParser()
                ),
                "source_documents": lambda x: x["docs"]
            }
        )

    def ask(self, question: str) -> Dict[str, Any]:
        """Stellt eine Frage an das System."""
        if self.chain is None:
            raise ValueError("System nicht initialisiert.")
        return self.chain.invoke(question)


# GOLD STANDARD 

def load_gold_standard(path: str) -> List[Dict[str, Any]]:
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


# EVALUATION (METRIKEN)

def evaluate_retrieval_levels(
    rag: MedicalGuidelineRAG,
    gold: List[Dict[str, Any]],
    k: Optional[int] = None,
    debug: bool = True
) -> Dict[str, float]:
    """
    Führt die Evaluation auf 3 Ebenen durch (TEXT-ÄHNLICHKEIT):
    1. Guideline Hit (PDF korrekt?)
    2. Page Hit (Seite korrekt?)
    3. Chunk Hit (Passagen-Text ähnlich > Threshold?)
    
    """
    if k is None: k = rag.cfg.k

    tp_pdf, tp_page, tp_chunk = 0, 0, 0
    n = len(gold)

    print(f"\n Starte Evaluation (n={n}, k={k}, similarity_threshold={rag.cfg.text_similarity_threshold}) ")

    for case in gold:
        q = case["question"]
        exp = case["expected"]
        
        # Erwartete Werte aus Goldstandard
        exp_gid = exp.get("guideline_id", "").lower()
        exp_page = exp.get("page")
        exp_passage = exp.get("passage", "") # Der Text!
        
        # Normierter erwarteter Text
        norm_exp_passage = normalize_text(exp_passage).lower()

        # Retrieval ausführen
        docs = rag.retriever.invoke(q)[:k]

        # Gefundene Werte extrahieren
        retrieved_metas = []
        
        # Hit Flags
        is_pdf_hit = False
        is_page_hit = False
        is_chunk_hit = False
        best_similarity = 0.0

        for d in docs:
            src = os.path.basename(d.metadata.get("source", ""))
            gid = guideline_id(src)
            pg = d.metadata.get("page")
            pg = int(pg) + 1 if pg is not None else None
            
            #  Text-Vergleich 
            # Wir normalisieren den gefundenen Text genauso wie den erwarteten
            norm_found_text = normalize_text(d.page_content).lower()
            
            # 1. PDF Check für dieses Doc
            if gid == exp_gid:
                is_pdf_hit = True
                
                # 2. Page Check für dieses Doc
                if exp_page and pg == exp_page:
                    is_page_hit = True
            
            # 3. Chunk Check (Text Ähnlichkeit)
            if norm_exp_passage:
                sim = calculate_similarity(norm_exp_passage, norm_found_text)
                if sim > best_similarity:
                    best_similarity = sim
                
                if sim >= rag.cfg.text_similarity_threshold:
                    is_chunk_hit = True

            retrieved_metas.append((gid, pg))

        # Statistik hochzählen
        if is_pdf_hit: tp_pdf += 1
        if is_page_hit: tp_page += 1
        if is_chunk_hit: tp_chunk += 1

        if debug:
            status = "OK" if is_chunk_hit else ("Warning" if is_page_hit else "Error")
            print(f"{status} Frage: {q[:60]}... (Max Sim: {best_similarity:.2f})")
            if not is_chunk_hit:
                # Zeige an, warum es kein Chunk Hit war
                if is_page_hit:
                    print(f"   -> Richtige Seite, aber Text weicht ab (Sim={best_similarity:.2f} < {rag.cfg.text_similarity_threshold})")
                else:
                    print(f"   -> Erwartet: {exp_gid} (S.{exp_page})")

    return {
        "n": n,
        "hit_rate_pdf": tp_pdf / n if n else 0,
        "hit_rate_page": tp_page / n if n else 0,
        "hit_rate_chunk": tp_chunk / n if n else 0,
    }


def print_passages(docs: List[Any], max_docs: int = 6):
    print("\n GEFUNDENE PASSAGEN \n")
    seen = set()
    for i, d in enumerate(docs[:max_docs], 1):
        src = os.path.basename(d.metadata.get("source", "?"))
        pg = d.metadata.get("page")
        pg_show = str(int(pg)+1) if pg is not None else "?"
        
        # Duplikate filtern
        if (src, pg) in seen: continue
        seen.add((src, pg))
        
        print(f"[{i}] {src} (S. {pg_show})")
        print(d.page_content[:400].replace("\n", " ") + "...")
        print()


def precision_recall_at_k_guideline(
    rag: MedicalGuidelineRAG,
    questions: List[Dict[str, Any]],
    k: Optional[int] = None,
    debug: bool = True
) -> Tuple[float, float]:
    """
    Berechnet klassische Precision & Recall auf Guideline-Ebene.
    """
    if k is None: k = rag.cfg.k
    total_p, total_r, n = 0.0, 0.0, 0

    print(f"\n--- Precision/Recall Evaluation (k={k}) ---")

    for case in questions:
        q = case["question"]
        
        # Flexibel bleiben
        expected_list = case.get("expected_guidelines", [])
        if not expected_list and "expected" in case:
             gid = case["expected"].get("guideline_id")
             if gid: expected_list = [gid]

        expected_ids = {guideline_id(x) for x in expected_list if x}
        if not expected_ids: continue

        docs = rag.retriever.invoke(q)[:k]
        retrieved_ids = {guideline_id(d.metadata.get("source", "")) for d in docs}

        # Schnittmenge
        tp = expected_ids.intersection(retrieved_ids)
        
        precision = len(tp) / float(k)
        recall = len(tp) / float(len(expected_ids))

        total_p += precision
        total_r += recall
        n += 1

        if debug:
            print(f"Frage: {q[:50]}... | P: {precision:.2f} | R: {recall:.2f}")

    if n == 0: return 0.0, 0.0
    return total_p / n, total_r / n


# HAUPTPROGRAMM (CLI)

def main():
    print(" MEDICAL GUIDELINE RAG (EVALUATION MODE - TEXT SIMILARITY)")
    rag = MedicalGuidelineRAG(CFG)

    # Initialisierung
    try:
        rag.build_or_load_db(rebuild=False)
    except Exception as e:
        print(f"Fehler beim DB-Laden: {e}")
        return

    while True:
        print("\nVerfügbare Befehle:")
        print("  1: ask <frage>              - Frage an das System stellen")
        print("  2: eval_gold                - Detaillierte Evaluation (PDF/Seite/Text Similarity Hit-Rate)")
        print("  3: eval_retrieval           - Klassische Precision/Recall Messung")
        print("  q: Beenden")
        
        user = input("\n> ").strip()
        
        if user.lower() in ["q", "exit"]:
            break

        # 1. Chat
        elif user.startswith("ask ") or user.startswith("1 "):
            q = user.replace("ask ", "").replace("1 ", "").strip()
            if not q: q = input("Frage eingeben: ")
            
            res = rag.ask(q)
            print("\n ANTWORT:\n" + "="*40)
            print(res["answer"])
            print("="*40)
            print_passages(res["source_documents"])

        # 2. Evaluation (Hit-Rate)
        elif user == "eval_gold" or user == "2":
            if not os.path.exists(CFG.gold_standard_path):
                print(" Goldstandard Datei fehlt.")
                continue
            gold_data = load_gold_standard(CFG.gold_standard_path)
            res = evaluate_retrieval_levels(rag, gold_data)
            
            print("\n ERGEBNISSE:")
            print(f"  Fragen (n):       {res['n']}")
            print(f"  PDF Hit-Rate:     {res['hit_rate_pdf']:.2%}")
            print(f"  Page Hit-Rate:    {res['hit_rate_page']:.2%}")
            print(f"  Chunk Hit-Rate:   {res['hit_rate_chunk']:.2%} (Sim >= {CFG.text_similarity_threshold})")

        # 3. Evaluation (Precision/Recall)
        elif user == "eval_retrieval" or user == "3":
            if not os.path.exists(CFG.gold_standard_path):
                print(" Goldstandard Datei fehlt.")
                continue
            gold_data = load_gold_standard(CFG.gold_standard_path)
            
            simple_gold = []
            for item in gold_data:
                simple_gold.append({
                    "question": item["question"],
                    "expected_guidelines": [item["expected"]["guideline_id"]]
                })
            
            p, r = precision_recall_at_k_guideline(rag, simple_gold, debug=True)
            print(f"\nDurchschnitt Precision@{CFG.k}: {p:.2f}")
            print(f"Durchschnitt Recall@{CFG.k}:     {r:.2f}")

        else:
            print("Unbekannter Befehl.")

if __name__ == "__main__":
    main()