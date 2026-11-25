# Recorded results

The supplied coursework report states MAE **0.8804**, standard deviation of absolute errors **0.6631**, and **4,881** parameters. These values are transcribed in [test_metrics.json](results/test_metrics.json); they were not measured again.

[learning_curve.png](results/learning_curve.png) is a raster rendering of the original training/validation loss PDF, with identifying metadata removed. It preserves the curve rather than reconstructing unprovided epoch values.

[saved_model_config.json](results/saved_model_config.json) was extracted from the supplied Keras model archive. Its structure agrees with the compact architecture in the source; no checkpoint weights are included.

The available evidence does not give a reliable test-set size, per-example predictions or repeated-run variation. No improvement over an external benchmark or production performance claim is made.

