# Recorded results and their limits

[recorded_evaluation_summary.csv](results/recorded_evaluation_summary.csv) contains only the aggregate Summary sheet from the original workbook. The [F1 comparison](results/recorded_f1_comparison.png) is a new chart of those values. No document-level details, patient text or mappings are retained.

The original summary includes four model/input combinations and two tasks. Its span totals correspond to 846 anonymization and 556 pseudonymization references. These 1,402 references do not cover all 1,436 annotated spans in the 63-document corpus.

During source analysis, raw exact-match figures were also checked against existing outputs; no new model inference was performed. The original reported workbook values remain labeled as such, rather than being replaced by a different evaluation.

## Why these scores are not privacy guarantees

- Empty or truncated output can receive anonymization credit simply because source spans disappear.
- Pseudonymization credit can rely on mapping-token presence without proving correct use in the document.
- False positives use label/token heuristics, not a complete one-to-one span match. Parsing compound token labels can assign them incorrectly.
- Run-global mappings, overwritten helper definitions and partial-run skip behavior complicate consistency.
- The original-text LLM pipeline has an inherited indentation error; the complete experiment cannot be assumed reproducible by running every cell unchanged.

The higher recorded anonymization F1 after preprocessing is an observation under this evaluator, not verified evidence of a safe deployed system. See [LIMITATIONS.md](LIMITATIONS.md) before interpreting these aggregate results.
