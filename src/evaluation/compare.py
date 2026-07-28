from src.evaluation.evaluate import evaluate


def compare(
    baseline: str = "xgboost_pipeline",
    tuned: str = "xgboost_tuned",
) -> None:
    print(f"=== {baseline} ===")
    m_base = evaluate(baseline)

    print(f"\n=== {tuned} ===")
    m_tuned = evaluate(tuned)

    print("\n--- Comparison ---")
    for metric in ("accuracy", "f1", "roc_auc"):
        diff = round(m_tuned[metric] - m_base[metric], 4)
        sign = "+" if diff >= 0 else ""
        print(f"{metric:<12} {m_base[metric]:.4f}  ->  {m_tuned[metric]:.4f}  ({sign}{diff})")
