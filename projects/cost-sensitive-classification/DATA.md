# Required inputs

Provide `final-bank.csv` and `bank.csv` in a local data directory and pass that directory to `--data-dir`. The original loader expects semicolon-delimited bank-marketing-style records and a `y` target containing `yes`/`no`.

The supplied archive contains 40,690 training rows and 4,521 test rows. Raw records are excluded from this portfolio; no redistribution permission is asserted.

The preprocessing function creates dummy columns independently for each input table. Ensure feature categories and column order match before interpreting a run. This known implementation limitation has not been repaired because the original algorithm and workflow are being preserved.

The original files contain duration information. A future pre-contact evaluation should revisit feature availability and re-evaluate the model; that is separate work, not an improvement claimed here.

