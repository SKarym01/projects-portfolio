# Limitations

This repository contains source code and aggregate results, not the clinical corpus, reversible mappings, model outputs or error reports. Reproduction requires separately authorized data and a compatible local environment.

## Evaluation

The recorded scores come from the original evaluator and are not privacy guarantees:

- Empty or truncated output can receive anonymization credit simply because source spans disappear.
- Pseudonymization credit can rely on mapping-token presence without proving correct contextual use.
- False positives use label/token heuristics rather than complete one-to-one span matching.
- Run-global mappings, overwritten helper definitions and partial-run skip behavior complicate consistency.
- Some annotated span types are outside the evaluated task sets.

The reported F1 values should not be used to claim that the system reliably removes identifying content or preserves clinical utility.

## Reproduction

- The original-text LLM pipeline has an inherited indentation error in code cell 14 (zero-based index).
- The regex stage and later pipeline use different input paths; the hand-off currently requires a manual copy/conversion step.
- Model and dependency compatibility has not been independently verified.
- A future evaluation should test residual identifying content, retained utility, per-document mapping consistency, contextual correctness and a clear span-matching protocol.
