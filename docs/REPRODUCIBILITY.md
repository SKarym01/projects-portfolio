# Reproducibility status

This repository preserves the submitted implementations and selected evidence. It is not a single installable application, and the model experiments were not rerun during preparation.

| Project | Included evidence | Missing execution prerequisites / known issues |
|---|---|---|
| Diabetic Retinopathy Classification | Full executable notebook; aggregate outputs; curves; confusion matrices; timing comparison | Authorized images, compatible GPU environment; no patient-level split evidence or recorded hardware |
| Medical Guideline RAG | Original script; 15-question index; selected study slides; retrieval chart | Authorized source PDFs, full private gold file, embedding weights and Ollama model/service |
| Clinical Entity Extraction | Three notebooks; entity metrics and distribution figures | Authorized annotation corpus, checkpoints, missing evaluation-table conversion, fixed CUDA/test-count assumptions |
| Compact CNN Object Counting | Original script; saved architecture; learning curve and reported metrics | Licensed image folders, TensorFlow runtime; test-set size not established |
| Text Clustering | Original algorithm; elbow plot and redacted aggregate terms | Authorized corpus and NLTK resources |
| Cost-Sensitive Classification | Original modules; two threshold curves | Authorized CSVs; encoding alignment, sampling behavior and feature-availability limitations |

## Environment policy

Use a separate environment per project. Newly added Python dependency files are minimal import inventories, not verified version locks. The bank-classification and review-only de-identification requirements are original files. Installing current packages may expose API incompatibilities.

Unused or exploratory imports in original implementations have not been removed, because doing so would change the submitted source. Unused bundled binaries, local environments, caches, datasets and generated training artifacts are excluded.

No network services, external credentials, model downloads or full training runs were used for the portfolio cleanup.

## Working-directory expectations

Run each project from its own directory. Relative data paths remain project-local. Required external input directories may be absent from the ZIP by design; each project's `DATA.md` explains them. No empty placeholder data is represented as a real dataset.

Source comments and original figures may remain in German. New project documentation is in English. Original technical identifiers and file structure are preserved where changing them would affect execution or attribution.

