# EchoCLIP Echocardiography Representation Learning

**Multimodal representation learning and interpretability analysis with a pre-trained EchoCLIP model.**

This academic project applies EchoCLIP to echocardiography video data for cross-modal embedding analysis, left-ventricular volume reconstruction, zero-shot ejection-fraction estimation and explainability experiments.

## Experiment scope

- Dataset: 10,030 echocardiography videos, split into 7,465 training, 1,288 validation and 1,277 test videos.
- Model: OpenCLIP checkpoint `hf-hub:mkaichristensen/echo-clip` with a ConvNeXt-based visual encoder.
- Embeddings: 512-dimensional video and text representations for a reproducible 1,000-video subset.
- Analyses: Simpson volume reconstruction, nearest-image retrieval, image-text matching, Grad-CAM and channel-activation maps.

## Recorded highlights

| Experiment | Recorded result |
|---|---|
| Simpson EF reconstruction | Correlation 0.967; MAE 1.07 percentage points |
| End-systolic volume reconstruction | MAE 18.34 mL |
| End-diastolic volume reconstruction | MAE 38.25 mL |
| Image-text matching | Mean cosine similarity 0.2678 for matching pairs |
| Zero-shot EF estimation | MAE 15.32 percentage points |
| Nearest-image EF comparison | Mean absolute EF difference 8.69 |

The zero-shot estimate had an upward bias of 13.49 percentage points and substantial low-Ejection-Fraction misclassification. These results describe the saved experiment only and are not clinically validated.

## Files

- [echocardiography_echoclip.ipynb](echocardiography_echoclip.ipynb) - executable 8-task analysis notebook.
- [echocardiography_echoclip_report.pdf](echocardiography_echoclip_report.pdf) - 22-page final report.

## Technology

Python, Jupyter, PyTorch, OpenCLIP, ConvNeXt/Timm, NumPy, pandas, scikit-learn, Matplotlib and Grad-CAM-style feature visualization.

The notebook requires EchoCLIP model access and the original echocardiography dataset. Review the notebook's installation and data-loading cells before execution. The retained notebook and report are academic artifacts, not a reproducible deployment package.

## Interpretability and limitations

EchoCLIP exposes convolutional features rather than conventional vision-transformer attention heads. The report therefore describes its channel activation maps as attention-like, not as true attention.

The 1,000-video embedding subset and training-only volume calibration are important limitations. Grad-CAM targets and low-EF error patterns do not establish anatomical correctness or clinical safety. The report preserves AI-assistance information and separates implementation from interpretive claims.
