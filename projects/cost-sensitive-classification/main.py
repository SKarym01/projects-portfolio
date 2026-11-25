#!/usr/bin/env python3

from __future__ import annotations

import os
import argparse
from typing import List
from pathlib import Path

import numpy as np
import matplotlib.pyplot as plt

from model_utils import (
    load_dataset,
    preprocess,
    train_logistic_regression,
    train_naive_bayes,
    find_best_sampling_ratio,
    threshold_analysis,
    compute_cost,
    DEFAULT_COST_MATRIX,
)

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.naive_bayes import GaussianNB
from sklearn.linear_model import LogisticRegression


def evaluate_on_test(
    model,
    X_train: np.ndarray,
    y_train: np.ndarray,
    X_test: np.ndarray,
    y_test: np.ndarray,
    scaler=None,
    threshold: float = 0.5
) -> float:
  
    if scaler is not None:
        X_train_scaled = scaler.fit_transform(X_train)
        X_test_scaled = scaler.transform(X_test)
        model.fit(X_train_scaled, y_train)
        probs = model.predict_proba(X_test_scaled)[:, 1]
    else:
        model.fit(X_train, y_train)
        probs = model.predict_proba(X_test)[:, 1]

    preds = (probs >= threshold).astype(int)
    total_cost = compute_cost(y_true=y_test, y_pred=preds, cost_matrix=DEFAULT_COST_MATRIX)
    avg_cost = total_cost / len(y_test)
    return avg_cost


def plot_threshold_curve(
    thresholds: np.ndarray,
    costs: np.ndarray,
    n_instances: int,
    title: str,
    outfile: str
) -> None:
    
    plt.figure(figsize=(8, 5))
    profit_per_instance = -costs / n_instances
    plt.plot(thresholds, profit_per_instance, marker='o')
    plt.xlabel('Threshold für yes')
    plt.ylabel('Profit pro Instanz (−Kosten)')
    plt.title(title)
    plt.grid(True)
    plt.savefig(outfile)
    plt.close()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--data-dir",
        type=str,
        default=".",
        help="Verzeichnis mit den CSV-Dateien (bank-full.csv und bank.csv)",
    )
    args = parser.parse_args()

    data_dir = Path(args.data_dir).expanduser()

    train_path = data_dir / "final-bank.csv"
    test_path = data_dir / "bank.csv"
    print(f"Lade Trainingsdaten aus {train_path} …")
    df_full = load_dataset(train_path)
    print(f"Lade Testdaten aus {test_path} …")
    df_test = load_dataset(test_path)

    # Preprocessing
    X, y = preprocess(df_full)
    X_test_full, y_test_full = preprocess(df_test)

    # Aufteilung des Trainings in Train und Validierung (80/20)
    X_train, X_valid, y_train, y_valid = train_test_split(
        X, y, test_size=0.2, stratify=y, random_state=42
    )

    # in feineren Schritten
    candidate_ratios = np.arange(0.1, 5.1, 0.1)

    # 1) Suche bestes Sampling-Verhältnis (mit festem Threshold 0.5)

    # Logistische Regression: bestes Sampling suchen
    print("Suche bestes Sampling-Verhältnis für Logistische Regression …")
    best_ratio_lr, best_cost_lr = find_best_sampling_ratio(
        X_train, y_train, X_valid, y_valid,
        model_type='log_reg',
        candidate_ratios=candidate_ratios,
        random_state=42
    )
    print(f"Bestes Verhältnis für LogReg: {best_ratio_lr:.2f}, Kosten (Validierung bei Threshold 0.5): {best_cost_lr}")

    # Naiver Bayes: bestes Sampling suchen
    print("Suche bestes Sampling-Verhältnis für Naiven Bayes …")
    best_ratio_nb, best_cost_nb = find_best_sampling_ratio(
        X_train, y_train, X_valid, y_valid,
        model_type='naive_bayes',
        candidate_ratios=candidate_ratios,
        random_state=42
    )
    print(f"Bestes Verhältnis für NB: {best_ratio_nb:.2f}, Kosten (Validierung bei Threshold 0.5): {best_cost_nb}")

    # 2) Threshold-Analyse (ohne Over-/Undersampling)

    thresholds = np.linspace(0.0, 1.0, 50)

    # Logistische Regression ohne Sampling
    print("\nThreshold-Analyse für Logistische Regression (ohne Sampling) …")
    model_lr, probs_lr_valid, _, scaler_lr = train_logistic_regression(
        X_train, y_train, X_valid, y_valid,
        sampling_ratio=None,
        random_state=42
    )
    thr_arr_lr, costs_lr = threshold_analysis(
        probs_lr_valid, y_valid.values, thresholds, cost_matrix=DEFAULT_COST_MATRIX
    )
    idx_min_lr = np.argmin(costs_lr)
    best_threshold_lr = thr_arr_lr[idx_min_lr]
    print(
        f"Bester Threshold für LogReg: {best_threshold_lr:.2f} "
        f"(Profit={( -costs_lr[idx_min_lr]/len(y_valid) ):.2f} € pro Instanz)"
    )
    plot_threshold_curve(
        thr_arr_lr,
        costs_lr,
        n_instances=len(y_valid),
        title='Threshold-Analyse – Logistische Regression',
        outfile='threshold_logreg.png'
    )

    # Naiver Bayes ohne Sampling
    print("\nThreshold-Analyse für Naiven Bayes (ohne Sampling) …")
    model_nb, probs_nb_valid, _ = train_naive_bayes(
        X_train, y_train, X_valid, y_valid,
        sampling_ratio=None,
        random_state=42
    )
    thr_arr_nb, costs_nb = threshold_analysis(
        probs_nb_valid, y_valid.values, thresholds, cost_matrix=DEFAULT_COST_MATRIX
    )
    idx_min_nb = np.argmin(costs_nb)
    best_threshold_nb = thr_arr_nb[idx_min_nb]
    print(
        f"Bester Threshold für NB: {best_threshold_nb:.2f} "
        f"(Profit={( -costs_nb[idx_min_nb]/len(y_valid) ):.2f} € pro Instanz)"
    )
    plot_threshold_curve(
        thr_arr_nb,
        costs_nb,
        n_instances=len(y_valid),
        title='Threshold-Analyse – Naiver Bayes',
        outfile='threshold_naivebayes.png'
    )

    # 3) Bewertung auf dem Testdatensatz mit den gefundenen Thresholds
    

    print("\nBewertung der Modelle auf dem Testdatensatz …")

    # Logistische Regression
    avg_cost_lr_test = evaluate_on_test(
        LogisticRegression(max_iter=1000, solver='lbfgs'),
        X.values,
        y.values,
        X_test_full.values,
        y_test_full.values,
        scaler=StandardScaler(with_mean=False),
        threshold=best_threshold_lr
    )
    print(f"LogReg – durchschnittliche Kosten pro Testinstanz: {avg_cost_lr_test:.3f} €")

    # Naiver Bayes
    avg_cost_nb_test = evaluate_on_test(
        GaussianNB(),
        X.values,
        y.values,
        X_test_full.values,
        y_test_full.values,
        scaler=None,
        threshold=best_threshold_nb
    )
    print(f"Naiver Bayes – durchschnittliche Kosten pro Testinstanz: {avg_cost_nb_test:.3f} €")


if __name__ == '__main__':
    from sklearn.model_selection import train_test_split  
    from sklearn.preprocessing import StandardScaler  
    from sklearn.naive_bayes import GaussianNB  
    from sklearn.linear_model import LogisticRegression  
    main()
