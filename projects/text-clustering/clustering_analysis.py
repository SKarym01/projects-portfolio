import json
import numpy as np
import matplotlib.pyplot as plt
import os
import re
import nltk

from nltk.corpus import stopwords
from nltk.stem.snowball import SnowballStemmer
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_distances


nltk.download("punkt")
nltk.download("stopwords")
try:
    nltk.download("punkt_tab")
except:
    
    pass


# Daten laden
def load_data(filepath):
    """Loads the dataset from a JSON file."""
    with open(filepath, "r", encoding="utf-8") as f:
        data = json.load(f)
    return data


# Stopwörter & Boilerplate
def get_stopwords(stemmer):
    """
    Gibt zwei Mengen zurück:
    - stop_words_raw: werden VOR dem Stemming entfernt
    - stop_words_stemmed: werden NACH dem Stemming entfernt (v.a. Boilerplate-Stems)
    """
    stop_words_raw = set(stopwords.words("german"))
    stop_words_raw.update(stopwords.words("english"))

    # Domain-spezifische Boilerplate-Wörter (roh)
    boilerplate_raw = {
        "daten", "zweck", "zwecke", "verarbeitung", "verarbeiten",
        "datenschutzeinstellungen", "einstellungen",
        "uns", "nutzen", "nutzung", "website", "webseiten",
        "cookie", "cookies"
    }
    stop_words_raw.update(boilerplate_raw)

    # Boilerplate als Stems, damit z.B. "daten" -> "dat" nach dem Stemming rausfliegt
    boilerplate_stems = {
        "dat", "zweck", "verarbeit", "datenschutzeinstell",
        "einstell", "uns", "nutz", "websit", "cooky", "cookies"
    }
    stop_words_stemmed = {stemmer.stem(w) for w in boilerplate_stems}

    return stop_words_raw, stop_words_stemmed


# Preprocessing
def preprocess_text(text, stemmer, stop_words_raw, stop_words_stemmed):
    """
    Tokenizing, Stopwort-Filterung, Stemming.
    Entfernt domain-spezifische Boilerplate sowohl vor als auch nach dem Stemming.
    """
    if not text:
        return ""

    # Kleinbuchstaben, nur Buchstaben und Leerzeichen erlauben
    text = re.sub(r"[^a-zA-ZäöüÄÖÜß\s]", " ", text.lower())

    # Tokenize
    tokens = word_tokenize(text, language="german")

    # Vor-Stemming-Filter: normale Stopwörter und zu kurze Tokens raus
    tokens = [t for t in tokens if len(t) > 2 and t not in stop_words_raw]

    # Stemming
    stems = [stemmer.stem(t) for t in tokens]

    # Nach-Stemming-Filter: Boilerplate-Stems raus
    stems = [s for s in stems if s not in stop_words_stemmed]

    return " ".join(stems)


def prepare_documents(data):
    """
    Prepares documents with term boosting for the title (parse_title * 5).
    """
    documents = []
    titles = []

    stemmer = SnowballStemmer("german")
    stop_words_raw, stop_words_stemmed = get_stopwords(stemmer)

    print("Preprocessing documents...")
    for entry in data:
        content = entry.get("content", "")
        title = entry.get("parse_title", "")

        # Term Boosting: Titel 5x anhängen
        combined_text = content + " " + (title + " ") * 5

        processed_text = preprocess_text(
            combined_text,
            stemmer,
            stop_words_raw,
            stop_words_stemmed,
        )
        documents.append(processed_text)
        titles.append(title)

    return documents, titles


# k-Means-Implementierung mit Kosinusdistanz
class CosineKMeansResult:
  

    def __init__(self, centers, labels, inertia):
        self.cluster_centers_ = centers  
        self.labels_ = labels            
        self.inertia_ = inertia          
        self.n_clusters = centers.shape[0]


def cosine_kmeans(X, n_clusters, max_iter=50, n_init=3, random_state=42):
    """
    K-Means mit Kosinusdistanz d(x, c) = 1 - cos(x, c).
    X: TF-IDF-Matrix (scipy sparse)
    """
    rng = np.random.RandomState(random_state)
    n_samples = X.shape[0]
    best_result = None

    for init_no in range(n_init):
        # Zufällige Initialisierung
        initial_idx = rng.choice(n_samples, n_clusters, replace=False)
        centers = X[initial_idx].toarray()  # (k, d)

        for it in range(max_iter):
            # Distanzmatrix: (n_samples, n_clusters)
            dist = cosine_distances(X, centers)
            labels = np.argmin(dist, axis=1)

            # Neue Zentren = Mittelwert der Vektoren im Cluster
            new_centers = np.zeros_like(centers)
            for j in range(n_clusters):
                mask = labels == j
                if not np.any(mask):
                    # leeres Cluster -> zufällig neu initialisieren
                    new_centers[j] = X[rng.randint(0, n_samples)].toarray()
                else:
                    cluster_mean = X[mask].mean(axis=0)  # 1 x d sparse
                    new_centers[j] = np.asarray(cluster_mean).ravel()

            # Konvergenzcheck
            if np.allclose(new_centers, centers):
                centers = new_centers
                break

            centers = new_centers

        # SSE über Kosinusdistanz (d^2)
        dist = cosine_distances(X, centers)
        closest = dist[np.arange(n_samples), labels]
        inertia = np.sum(closest ** 2)

        if best_result is None or inertia < best_result.inertia_:
            best_result = CosineKMeansResult(centers=centers,
                                             labels=labels,
                                             inertia=inertia)

    return best_result


# Clustering + Elbow-Methode
def perform_clustering_analysis(documents, output_dir):
    """
    Performs TF-IDF, k-Means clustering with cosine distance, and generates elbow plot.
    """
    # Vectorization (TF-IDF, min_df=5 )
    print("Vectorizing documents...")
    vectorizer = TfidfVectorizer(min_df=5)
    tfidf_matrix = vectorizer.fit_transform(documents)
    print(f"TF-IDF Matrix shape: {tfidf_matrix.shape}")

    # Elbow-Methode
    print("Running k-Means (cosine) for Elbow Method...")
    k_range = range(5, 40, 5) 
    sse_values = {}
    for k in k_range:
        print(f"Clustering with k={k}...")
        model = cosine_kmeans(tfidf_matrix, n_clusters=k,
                              max_iter=40, n_init=3, random_state=42)
        sse_values[k] = model.inertia_

    # Plot SSE
    ks = sorted(sse_values.keys())
    sses = [sse_values[k] for k in ks]

    plt.figure(figsize=(10, 6))
    plt.plot(ks, sses, marker="o")
    plt.title("Elbow Method for Optimal k (Cosine Distance)")
    plt.xlabel("Number of Clusters (k)")
    plt.ylabel("Sum of Squared Error (SSE, cosine)")
    plt.grid(True)
    plt.savefig(os.path.join(output_dir, "elbow_plot.png"))
    plt.close()

    optimal_k = 15
    print(f"Selected optimal k = {optimal_k}")
    final_model = cosine_kmeans(tfidf_matrix,
                                n_clusters=optimal_k,
                                max_iter=60,
                                n_init=5,
                                random_state=42)

    return final_model, vectorizer, optimal_k


# Top-Terme je Cluster
def extract_cluster_terms(model, vectorizer, n_terms=10):
    """
    Extracts top terms for each cluster from cluster centers.
    """
    print("Extracting top terms...")
    centers = model.cluster_centers_
    order_centroids = centers.argsort()[:, ::-1]
    terms = vectorizer.get_feature_names_out()

    cluster_terms = {}
    for i in range(model.n_clusters):
        top_terms = [terms[ind] for ind in order_centroids[i, :n_terms]]
        cluster_terms[i] = top_terms

    return cluster_terms


# Main
def main():
    data_path = r"webpages.json"
    output_dir = "app/output"
    os.makedirs(output_dir, exist_ok=True)

    if not os.path.exists(data_path):
        print(f"Error: Data file not found at {data_path}")
        return

    data = load_data(data_path)
    documents, titles = prepare_documents(data)

    model, vectorizer, k = perform_clustering_analysis(documents, output_dir)
    cluster_terms = extract_cluster_terms(model, vectorizer)

    # Save results to a text file 
    results_path = os.path.join(output_dir, "cluster_results.txt")
    with open(results_path, "w", encoding="utf-8") as f:
        f.write(f"Number of Documents: {len(documents)}\n")
        f.write(f"Optimal k used: {k}\n\n")
        for cluster_id, terms in cluster_terms.items():
            f.write(f"Cluster {cluster_id}:\n")
            f.write(", ".join(terms) + "\n\n")

    print(f"Analysis complete. Results saved to {output_dir}")


if __name__ == "__main__":
    main()
