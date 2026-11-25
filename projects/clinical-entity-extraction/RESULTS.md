# Results and evidence

The [original metric image](results/original_entity_metrics.png) and [entity distribution](results/entity_distribution.png) were extracted from the supplied presentation. They retain aggregate numerical evidence while excluding author slides and clinical screenshots. Image metadata was removed.

[entity_metrics.csv](results/entity_metrics.csv) transcribes the 18 displayed entity rows. English labels are used for readability. [entity_f1.png](results/entity_f1.png) is a new visualization of those existing F1 values, excluding rows with zero reported support. It is not a new experiment.

## Interpretation limits

The original table's support column does not consistently equal TP + FN (for example, vascular disease reports support 114 but TP 30 and FN 5). These values were preserved rather than silently reconciled. F1 values are rounded as displayed.

The evaluator uses substring/value matching rather than a complete one-to-one span matching procedure. A wrong prediction can be counted as a false positive without also accounting for the missed true value, and multiple predictions can match the same reference. Accordingly, this table should not be compared directly with standardized NER benchmark scores.

High performance on some frequent categories coexists with weak performance for heart failure, diabetes and stroke/TIA. There is no validated aggregate clinical score accuracy, external validation, uncertainty interval or repeated-seed study in the retained evidence.

No patient-level predictions are redistributed, and the original results cannot be independently regenerated from this portfolio alone.

