# Machine Learning Modeling

**Version:** 1.0
**Status:** Draft

---

# 1. Problem Definition

The model aims to predict a developer's job satisfaction level based on their professional profile.

This is a **supervised classification** problem. The class grouping strategy was determined during EDA after analyzing the real distribution of `job_satisfaction` in the dataset.

Initial proposal (subject to EDA validation):

| Class | Label | Description |
|---|---|---|
| 1 | Satisfied | Groups "Slightly satisfied" and "Very satisfied" |
| 0 | Not satisfied | Groups "Very dissatisfied", "Slightly dissatisfied" and "Neither satisfied nor dissatisfied" |

> After EDA, the distribution justified a multiclass strategy, so the final implementation uses 3-class and binary variants.

**Target variable:** `job_satisfaction`
**Dataset:** Stack Overflow Developer Survey
**Source:** `https://huggingface.co/datasets/Anahia/stackoverflow_survey`
**Data library:** Polars

> The pipeline supports any year available in the repository.

---

# 2. Baseline Model

A simple reference model (DummyClassifier predicting the majority class) is trained as a starting point.

- Purpose: establish the minimum performance any real model must exceed.
- Implementation: `src/training/baseline.py`

---

# 3. Candidate Models

## Random Forest

- Ensemble of decision trees trained with bagging.
- Robust against overfitting and outliers.
- Provides native feature importance.
- Implementation: `src/training/random_forest.py`

## XGBoost

- Optimized gradient boosting.
- High performance on tabular data.
- Supports regularization to control overfitting.
- Implementation: `src/training/xgboost.py`

## Ensemble (candidate model)

- Combination of the above models via voting or stacking.
- Goal: exceed individual model performance.
- Implementation: `src/training/ensemble.py`

---

# 4. Training Strategy

- Data split: 70% training, 15% validation, 15% test.
- Split strategy: stratified by class to preserve class proportions.
- Hyperparameter search: `src/training/tuning.py`
- Cross-validation: stratified k-fold (k=5).

---

# 5. Evaluation Metrics

Given the potential class imbalance in the target variable, the main metrics are:

| Metric | Justification |
|---|---|
| F1-score | Balance between precision and recall |
| ROC-AUC | Model discriminative capacity |
| Accuracy | General reference |
| Confusion matrix | Detailed error analysis |

Implementation: `src/evaluation/metrics.py`

---

# 6. Explainability (XAI)

To comply with Responsible AI principles, the selected model incorporates:

- Feature importance (native to Random Forest and XGBoost).
- Analysis of the factors that most influence each individual prediction.

---

# 7. Final Model Selection

The final model will be selected by comparing all candidates on the test set.

Primary criterion: **F1-score**.

The best-performing model will be saved as a complete pipeline (preprocessing + model) in `models/pipelines/`. No model is assumed to be the winner beforehand — selection depends on the results obtained.

---

## Model Selection and Performance

### Approach

TalentCare AI implements two Random Forest classifiers trained on the same
feature set, serving different purposes:

- **Binary classifier** (satisfied vs not satisfied, threshold JobSat ≥ 7) —
  production model served by the API and frontend.
- **3-class classifier** (low: 0–3, medium: 4–6, high: 7–10) — report model
  demonstrating multiclass classification as required by the project brief.

Random Forest was selected as the ensemble method. It qualifies as an ensemble
by definition: it aggregates predictions from 300 decision trees (bagging),
each trained on a bootstrap sample with a random feature subset at each split.
This reduces variance compared to a single tree and provides native feature
importance for explainability (XAI).

### Target Encoding

JobSat is an ordinal 0–10 survey scale. The binning thresholds follow
psychometric convention for Likert-style scales: scores 0–3 represent clear
dissatisfaction, 4–6 represent ambivalence, and 7–10 represent clear
satisfaction. The binary threshold (≥ 7) aligns with Stack Overflow's own
historical reporting of developer satisfaction tiers.

### Class Imbalance

The training set is heavily skewed toward high satisfaction:

| Class | Label | Train samples | % |
|---|---|---|---|
| 0 | low | 2,912 | 7.6% |
| 1 | medium | 8,516 | 22.1% |
| 2 | high | 27,077 | 70.3% |

Two complementary strategies were applied to address this:

- `class_weight="balanced"` on the RandomForestClassifier — scales the loss
  function inversely proportional to class frequency, penalising minority class
  errors more heavily during training.
- SMOTENC (Synthetic Minority Oversampling Technique for Nominal and Continuous
  features) — generates synthetic minority class samples by interpolating
  numeric features (`YearsCodeNum`, `ConvertedCompYearly`) and copying
  categorical values from nearest neighbors. SMOTENC was preferred over plain
  SMOTE because it treats categorical and numeric columns differently during
  synthesis, avoiding semantically invalid interpolations between encoded
  categorical values.

SMOTENC runs before the preprocessor in the pipeline so it operates on raw
categorical strings, not one-hot encoded outputs.

### Feature Scope

The model uses 8 features: `YearsCodeNum`, `ConvertedCompYearly`,
`MainBranch`, `Employment`, `EdLevel`, `Age`, `OrgSize`, `Country`.
Multi-select columns (`LanguageHaveWorkedWith`, `DatabaseHaveWorkedWith`,
`PlatformHaveWorkedWith`, `WebframeHaveWorkedWith`, `DevType`, `LearnCode`)
were excluded from this pipeline. These columns contain semicolon-delimited
values requiring custom parsing incompatible with the sklearn/imblearn Pipeline
preprocessor. They are incorporated in the separate ensemble approach
(CatBoost + LightGBM + XGBoost).

### Results

#### 3-Class Model

| Metric | Train | Dev | Test |
|---|---|---|---|
| Accuracy | 0.4845 | 0.4615 | 0.4457 |
| Balanced accuracy | 0.4485 | 0.4004 | 0.3831 |
| Precision (macro) | 0.4073 | 0.3770 | 0.3629 |
| Recall (macro) | 0.4485 | 0.4004 | 0.3831 |
| F1 (macro) | 0.3868 | 0.3549 | 0.3371 |
| ROC-AUC (OVR macro) | 0.6330 | 0.5842 | 0.5688 |

Overfitting gap (F1 train–dev): **3.2pp ✅ under 5pp threshold**

```
                Predicted
          low   mid   high

Actual low [ 232  129  236]
Actual mid [ 602  456  812]
Actual high [1568 1227 2990]
```

The model shows a systematic bias toward predicting "high" — consistent with
the class distribution even after rebalancing. Performance on class 0 (low) is
limited by the small number of real training examples (376 after split). This
reflects a genuine data limitation rather than a modelling error: demographic
and compensation features alone carry insufficient signal to reliably
distinguish three satisfaction tiers.

#### Binary Model

| Metric | Train | Dev | Test |
|---|---|---|---|
| Accuracy | 0.5871 | 0.5706 | 0.5547 |
| Balanced accuracy | 0.5860 | 0.5664 | 0.5483 |
| Precision (macro) | 0.5733 | 0.5561 | 0.5407 |
| Recall (macro) | 0.5860 | 0.5664 | 0.5483 |
| F1 (macro) | 0.5638 | 0.5451 | 0.5283 |
| ROC-AUC | 0.6241 | 0.5930 | 0.5816 |

Overfitting gap (F1 train–dev): **1.9pp ✅ under 5pp threshold**

```
                Predicted
                not sat   sat

Actual not sat [1314 1153]
Actual sat     [2522 3263]
```

The binary model generalises stably across all three splits with a 1.9pp
overfitting gap. Balanced accuracy of 0.55 confirms the model performs above
random on both classes equally — the expected outcome of combining
`class_weight="balanced"` with SMOTENC. This model is used in production.

### Interpretation

Both models confirm that compensation (`ConvertedCompYearly`) and experience
(`YearsCodeNum`) are the dominant predictors of satisfaction within this
feature set — consistent with established research on developer job
satisfaction. The modest absolute metrics reflect the inherent difficulty of
predicting a subjective survey response from demographic and employment
attributes alone, and set a baseline against which the full 19-feature ensemble
model (incorporating tech stack and learning preferences) can be compared.
