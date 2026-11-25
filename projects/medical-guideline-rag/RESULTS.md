# Evidence and metric definitions

- [Selected original study slides](evidence/retrieval_study_slides.pdf): methodology/result pages only; no title, answer-example slides, annotations, links or identifying PDF metadata. Two embedded images (a long gold-passage screenshot and an externally sourced architecture illustration) were removed; methodology bullets and original result charts remain.
- [Retrieval values](results/retrieval_results.csv): counts derived from reported percentages and the 15-question denominator.
- [English chart](results/retrieval_hit_rates.png): newly drawn from those recorded values, not a new experiment.

The presentation also reports guideline recall 0.93 and precision 0.16. The implementation counts distinct relevant guideline IDs but divides precision by requested chunks (k=6). With one relevant guideline per query this definition constrains precision; it is not ordinary document-level precision.

The passage evaluator can report a hit from the wrong guideline and does not require source/page agreement for that metric. No independently verified answer-quality score is claimed. Long gold quotations and model-answer screenshots were excluded rather than altering reference text and silently changing the benchmark.


The original slides contain optimistic interpretations of retrieval quality. They are retained as historical evidence, not endorsed conclusions. The claim that low passage hits arise only from strict matching is not established; this README and the limitations above provide the qualified interpretation.
