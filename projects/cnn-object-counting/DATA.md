# Required inputs

Supply appropriately licensed PNG images locally in `data/` for training/validation and `test/` for evaluation. These folders are intentionally absent.

Images must already be 600 × 800 pixels. The loader reads them as grayscale and scales values by 255. Counts come from the first regex match `O(\d+)` in each filename; for example, `sample_O12.png` encodes 12 objects. This is a schema example, not a supplied image.

The original dataset is excluded because its redistribution terms and source-image provenance were not established. The original trained Keras file is also excluded; its architecture is retained as a small JSON record under `results/`.

Run from this project directory so relative paths resolve. The source does not recursively search subdirectories.

