# Recorded evidence and checks

The two PNGs in `results/` are original validation threshold/profit curves. Only image metadata was removed; their pixels were preserved. No numeric optimum or final test result was estimated from the plot.

The source data have 40,690 training rows and 4,521 test rows. An exact full-row intersection check in archive analysis found no identical records across these files. This is a narrow overlap check, not proof of independent customers or absence of temporal leakage.

A small preparation-time check of the original resampling helper confirmed that requesting a positive-to-negative ratio of 0.10 can leave the ratio at approximately 0.1327. The implementation is preserved and this behavior is documented, not presented as a new model experiment.

The profit model is a coursework assumption. No realized business benefit, production deployment or external benchmark result is claimed. No full model training was rerun for this portfolio.

