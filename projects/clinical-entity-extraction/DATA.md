# Data and execution inputs

No clinical letters, annotation exports, patient-level predictions, model weights or institution-specific paths are included.

The notebooks expect locally authorized resources:

| Relative path / input | Purpose |
|---|---|
| `data/raw/extracted_corpus/` | Source corpus and annotation resources for XMI parsing |
| `data/json/annotations/` | Parsed annotation JSON |
| `data/json/split/train/` and `data/json/split/test/` | Prepared training/test examples |
| `models/training/final_model/` | Training checkpoint output |
| `models/evaluation/final_model/` | Inference checkpoint input |
| `all_letters_with_pred_entity_type.csv` | Intermediate evaluation table expected by the original notebook |

Read the exact file/type expectations in the parsing notebook before running. Its original data preparation assumptions are preserved; the directory table does not imply that every missing conversion step has been supplied.

The training and evaluation checkpoints remain separate, as in the original project. The notebook-generated prediction CSV is not automatically transformed into the later evaluation CSV; this is a documented reproducibility gap.

The aggregate presentation figures contain no letter text or patient identifiers. Future notebook executions can print source spans and save sensitive CSVs; keep all such files and outputs outside publication copies. No fabricated patient data is supplied as a replacement.

