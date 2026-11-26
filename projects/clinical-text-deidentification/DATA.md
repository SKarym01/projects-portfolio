# Withheld data and reproduction gaps

The original project uses 63 documents with 1,436 annotated spans. The original evaluator covers 1,402 spans in its task sets (846 anonymization and 556 pseudonymization); 34 spans, including age/fax categories, fall outside those task sets.

The following are intentionally absent: original text/XML/annotation corpus, compressed source corpus, per-document names, input/processed JSON containing text, reversible pseudonym mappings, model predictions, error reports and full evaluation workbooks with detailed sheets.

The regex stage writes `data_regex/processed/grascco_canonical_regex.json`, whereas the later processed pipeline expects `data/input/grascco_input.json`. The archived artifacts match at that hand-off, but an automated copy/conversion step is not supplied. This gap has not been silently patched.

Reproduction requires separately authorized inputs, compatible models and dependencies, and addressing the implementation gaps described in [LIMITATIONS.md](LIMITATIONS.md). No dataset access or redistribution license is granted here.
