# CatBoost + LightGBM + Random Forest ensemble

## Experiment

- Date: 2026-07-30
- Branch: `experiment/ensemble-cat-lgbm-rf`
- Implementation commit: `1dcf08f`
- Dataset splits:
  - Train: 38,505 rows
  - Development: 8,251 rows
  - Test: 8,252 rows
- Target:
  - `0`: low job satisfaction
  - `1`: medium job satisfaction
  - `2`: high job satisfaction
- Validation strategy: 5-fold stratified out-of-fold predictions
- Meta-model: balanced multinomial logistic regression

## Test results

| Model | Accuracy | Balanced accuracy | Macro F1 |
| --- | ---: | ---: | ---: |
| CatBoost | 0.444377 | 0.407837 | 0.349060 |
| LightGBM | 0.700921 | 0.334844 | 0.279357 |
| Random Forest | 0.590766 | 0.384096 | **0.383970** |
| Ensemble | 0.447770 | **0.406062** | 0.346068 |

### Ensemble test classification report

| Class | Precision | Recall | F1 | Support |
| --- | ---: | ---: | ---: | ---: |
| Low | 0.11 | 0.46 | 0.17 | 597 |
| Medium | 0.26 | 0.25 | 0.25 | 1,870 |
| High | 0.76 | 0.51 | 0.61 | 5,785 |
| Macro average | 0.37 | 0.41 | 0.35 | 8,252 |
| Weighted average | 0.60 | 0.45 | 0.50 | 8,252 |

## Development results

The ensemble achieved:

- Accuracy: `0.55`
- Macro F1: `0.38`
- Weighted F1: `0.57`

CatBoost alone achieved:

- Accuracy: `0.53`
- Macro F1: `0.38`
- Weighted F1: `0.56`

## Selected CatBoost parameters

Five Optuna trials were run. The best configuration reached an out-of-fold
macro F1 of `0.354859`:

```text
iterations=814
learning_rate=0.12711565966479774
depth=8
l2_leaf_reg=5.551042292301155
min_data_in_leaf=26
subsample=0.9554820236918711
```

## Artifacts

The generated model binaries are intentionally ignored by Git and remain local:

| Artifact | Size |
| --- | ---: |
| `models/trained/catboost.cbm` | 23,238,172 bytes |
| `models/trained/lgbm.txt` | 3,164,178 bytes |
| `models/trained/random_forest_ensemble.joblib` | 74,689,937 bytes |
| `models/trained/ensemble_cat_lgbm_rf.joblib` | 1,087 bytes |

They can be regenerated with:

```powershell
.\.venv\Scripts\python.exe scripts\train_ensemble_cat_lgbm_rf.py --catboost-trials 5
```

## Conclusion

The ensemble trained and evaluated successfully, but it did not improve macro
F1 over Random Forest on the test split. Random Forest is the strongest current
candidate by macro F1. The ensemble remains useful as an experiment because it
slightly improves development-set accuracy and preserves higher recall for the
minority low-satisfaction class.
