# Local corpus and evaluation inputs

The unchanged script expects guideline PDFs beneath `./results` and creates `./chroma_db_bge_m3_1500`. The repository's `results/` contains only numeric/PNG evidence, so it supplies no input PDFs. Place permitted guideline PDFs there or configure `Config.docs_path` to a separate local directory. Selected historical presentation slides are in `evidence/`, outside the configured ingestion directory.

The exact guideline corpus and database were not supplied. Obtain documents from authorized sources and record versions and permissions. Model weights are also external.

Evaluation expects `gold_standard2.json` in the project root: a list of objects with `question` and `expected`, where `expected` contains `guideline_id`, `page` and `passage` (optionally `source_file`).

[questions_index.json](evaluation/questions_index.json) retains all 15 supplied questions, source filenames, guideline IDs and expected pages. Long passage quotations, embedded author/contact information and original PDFs are omitted. This index intentionally uses a different filename/schema and is not an executable replacement benchmark. Obtain the private original or build a separately versioned benchmark from authorized sources before evaluation.

