# Applied AI & Machine Learning Portfolio

This portfolio brings together selected projects from my studies in Medical Informatics, Data Science and Machine Learning. I enjoy exploring how machine learning can help make complex data easier to work with, from clinical text and medical images to information retrieval and classical ML. Most projects are implemented in Python.

The emphasis is on technically credible work: source-code implementation, careful model comparison, recorded experimental evidence and an honest account of limitations. The projects are university coursework rather than commercial or clinically validated systems.

## Technical skills

| Area | Skills and technologies demonstrated |
|---|---|
| Programming and data | Python, NumPy, pandas, JSON/CSV, Python APIs and command-line scripts |
| Machine and deep learning | PyTorch, TensorFlow/Keras, torchvision, transfer learning, PEFT/LoRA, weighted losses and learning-rate schedules |
| NLP and LLMs | Transformers, Unsloth, TRL, TF-IDF, NLTK, prompt workflows and parameter-efficient fine-tuning |
| Computer vision | CNN architecture design, image augmentation, convolutional feature extraction, Grad-CAM and ViT attention analysis |
| Retrieval and applied AI | LangChain, Chroma, Hugging Face embeddings, Ollama, PDF ingestion and MMR retrieval |
| Web application development | Angular, TypeScript, NestJS, TypeORM, PostgreSQL and Keycloak |
| Evaluation | Precision, recall, F1, confusion matrices, MAE, retrieval hit rates, threshold analysis and cost curves |

## Featured projects

### [EchoCLIP Echocardiography Representation Learning](projects/echocardiography-echoclip/README.md)

Applies the pre-trained EchoCLIP model to echocardiography videos for multimodal embeddings, ventricular-volume reconstruction, zero-shot ejection-fraction estimation and explainability experiments. The retained 1,000-video subset reports **0.967 EF correlation** for Simpson reconstruction and **15.32 EF-point MAE** for zero-shot estimation.

**Technologies:** PyTorch, OpenCLIP, ConvNeXt/Timm, NumPy, pandas, scikit-learn

### [Email Template Builder](projects/html-template-builder/README.md)

My bachelor's thesis project focused on a full-stack application for creating and managing HTML email templates. It combines an Angular editor with reusable placeholders and draft/release workflows, plus a NestJS API backed by PostgreSQL.

**Technologies:** Angular, TypeScript, NestJS, TypeORM, PostgreSQL, Keycloak

### [Diabetic Retinopathy Classification](projects/diabetic-retinopathy-classification/README.md)

Compares a transfer-learned ResNet-18 with a ViT adapted using LoRA on a binary retinopathy severity task. The saved 500-image test run reports **88.20% accuracy** for ViT+LoRA and **86.80%** for ResNet-18. The project includes learning curves, confusion matrices, timing and limited explainability analysis.

**Technologies:** PyTorch, Transformers, PEFT/LoRA, torchvision, scikit-learn

### [Medical Guideline RAG](projects/medical-guideline-rag/README.md)

Builds a local PDF question-answering workflow using BGE-M3 embeddings, persistent Chroma storage and an Ollama-hosted generator. In the retained 15-question retrieval study, **14/15 guidelines, 3/15 pages and 2/15 passages** were retrieved by the recorded matching methods.

**Technologies:** Python, LangChain, Chroma, Hugging Face embeddings, Ollama

### [Clinical Entity Extraction](projects/clinical-entity-extraction/README.md)

Processes UIMA/XMI clinical annotations, prepares structured training examples and fine-tunes a Meta-Llama 3.1 model with LoRA for cardiovascular entity extraction. The retained presentation evidence includes an entity-level F1 range of **0.00–0.93** and clear caveats around parsing and evaluation.

**Technologies:** Transformers, Unsloth, PEFT/LoRA, TRL, Pydantic, DKPro Cassis

### [Clinical Text De-identification](projects/clinical-text-deidentification/README.md)

Explores regex-assisted and LLM-based anonymization and pseudonymization of German clinical text. The public project contains source notebooks and aggregate results only; the corpus, document-level outputs and reversible mappings are not included. Reported scores come from an evaluator with documented limitations.

**Technologies:** Python, regular expressions, Transformers, PyTorch, pandas, span-based evaluation

### [Cost-Sensitive Classification](projects/cost-sensitive-classification/README.md)

Compares logistic regression and Gaussian Naive Bayes under an explicit campaign decision-cost model. It implements stratified sampling, 50-point probability-threshold searches and profit-based threshold plots.

**Technologies:** Python, pandas, scikit-learn, NumPy, Matplotlib

## All projects

| Project | What I built | Technologies | Key result or technical highlight | Link |
|---|---|---|---|---|
| EchoCLIP Echocardiography | Multimodal EchoCLIP embeddings, volume reconstruction and interpretability analysis | PyTorch, OpenCLIP, ConvNeXt/Timm | 0.967 EF correlation for Simpson reconstruction; 15.32 EF-point zero-shot MAE | [View project](projects/echocardiography-echoclip/README.md) |
| Email Template Builder | Full-stack application for authoring and managing reusable email templates | Angular, TypeScript, NestJS, TypeORM, PostgreSQL | Bachelor's thesis project with editing, placeholders and draft/release workflows | [View project](projects/html-template-builder/README.md) |
| Diabetic Retinopathy Classification | Binary ResNet-18 and LoRA-adapted ViT pipeline with checkpointing and error analysis | PyTorch, Transformers, PEFT, torchvision | 500-image test: ViT+LoRA 88.20% accuracy vs. ResNet-18 86.80% | [View project](projects/diabetic-retinopathy-classification/README.md) |
| Medical Guideline RAG | PDF ingestion, chunking, vector retrieval and local answer generation | LangChain, Chroma, BGE-M3, Ollama | 93.33% guideline, 20.00% page and 13.33% passage hit rates | [View project](projects/medical-guideline-rag/README.md) |
| Clinical Entity Extraction | UIMA/XMI parsing, structured data preparation and LoRA language-model adaptation | Unsloth, Transformers, PEFT, TRL, Pydantic | Recorded entity F1 varies from 0.00 to 0.93; methodology limitations preserved | [View project](projects/clinical-entity-extraction/README.md) |
| Clinical Text De-identification | Regex-assisted and LLM-based anonymization and pseudonymization workflows | Python, Transformers, PyTorch, pandas | Aggregate scores retained with evaluator limitations; no source corpus or document-level output included | [View project](projects/clinical-text-deidentification/README.md) |
| Compact CNN Object Counting | Small 4,881-parameter CNN for regression of object counts from images | TensorFlow/Keras, OpenCV, NumPy | Reported test MAE 0.8804 objects/image | [View project](projects/cnn-object-counting/README.md) |
| Cost-Sensitive Classification | Resampling and threshold sweeps for two probabilistic classifiers | pandas, scikit-learn, NumPy | Modular campaign-cost experiment; no unverified final profit claim | [View project](projects/cost-sensitive-classification/README.md) |
| Text Clustering | Custom cosine-distance clustering with TF-IDF preprocessing and term interpretation | NumPy, SciPy, scikit-learn, NLTK | 3,526-document corpus clustered into 15 explicitly selected themes | [View project](projects/text-clustering/README.md) |

## What this portfolio demonstrates

- Implementing and evaluating machine-learning models across tabular, text and image inputs
- Comparing architectures and adaptation strategies against saved experimental evidence
- Building and testing an end-to-end retrieval and local-generation workflow
- Using structured annotation formats and entity-level error analysis
- Documenting class imbalance, split limitations, evaluation defects and implementation constraints
- Preserving and presenting meaningful notebooks, plots and machine-readable result summaries

## Academic context

These are university projects, including coursework, collaborative submissions and my bachelor's thesis. Project documentation distinguishes submitted implementations and recorded results from independently rerun experiments. It does not claim sole authorship of group work or present academic prototypes as production systems or clinically validated products.

The clinical-text de-identification project includes source notebooks and aggregate evidence only. The clinical corpus, reversible mappings, document-level outputs and model artifacts are not included.

## Explore or reproduce

Start with a project's README and `RESULTS.md`; aggregate evidence can be inspected without GPU runtimes or datasets. Projects are independent and should use separate environments.

For execution, follow each project's `DATA.md`. Datasets, weights, confidential examples and local environments are not redistributed. Python dependency files are import-derived inventories rather than universally tested lockfiles. Known implementation defects are documented rather than silently repaired.

## Provenance and scope

Personal identifiers, local paths and sensitive examples have been removed or excluded where appropriate. No blanket license is assigned to collaborative coursework or datasets. Supplied third-party notices remain in force.

See [Attribution](ATTRIBUTION.md) and [Reproducibility](docs/REPRODUCIBILITY.md).

