"""Hilfsfunktionen für Aufgabe 3"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable, List, Tuple, Dict, Optional

import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import GaussianNB
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split


# Kostenmatrix für Aufgabe 3 – entspricht Tabelle 1 aus der
# Aufgabenstellung. Die Schlüssel sind Tupel aus (vorhergesagte
# Klasse, wahre Klasse) und die Werte stellen die Kosten in Euro dar.
DEFAULT_COST_MATRIX: Dict[Tuple[int, int], float] = {
    (0, 0): 0.0,     # predicted no, true no
    (0, 1): 0.0,     # predicted no, true yes
    (1, 0): 20.0,    # predicted yes, true no – Kosten
    (1, 1): -100.0,  # predicted yes, true yes – Profit
}


def load_dataset(filepath: str) -> pd.DataFrame:
    """Lädt den Bank-Marketing-Datensatz."""
    return pd.read_csv(filepath, sep=';')


def preprocess(df: pd.DataFrame) -> Tuple[pd.DataFrame, pd.Series]:
    """
    Bereitet den Datensatz für das Training vor.
    - Zielvariable 'y' in 0/1 umcodieren
    - One-Hot-Kodierung aller kategorialen Variablen
    """
    data = df.copy()
    # Zielvariable extrahieren und in 0/1 umwandeln
    y = data.pop('y').map({'no': 0, 'yes': 1})

    # One-Hot-Kodierung aller kategorialen Variablen
    X = pd.get_dummies(data, drop_first=False)
    return X, y


def resample_pos_neg(
    X: pd.DataFrame,
    y: pd.Series,
    ratio: float,
    random_state: Optional[int] = None
) -> Tuple[pd.DataFrame, pd.Series]:
    """
    Passt das Verhältnis zwischen positiven und negativen Klassen an.

    ratio = (#positiv / #negativ) im resampleten Datensatz.
    Je nach Verhältnis wird Over- bzw. Under-Sampling durchgeführt.
    """
    rng = np.random.default_rng(random_state)

    # Indexer für positive und negative Klassen
    pos_indices = np.flatnonzero(y.values == 1)
    neg_indices = np.flatnonzero(y.values == 0)
    pos_count = len(pos_indices)
    neg_count = len(neg_indices)

    if neg_count == 0 or pos_count == 0:
        # nichts zu resamplen
        return X.copy(), y.copy()

    current_ratio = pos_count / neg_count

    if ratio <= 0:
        raise ValueError("ratio must be positive")

    # Wenn Verhältnis bereits (näherungsweise) passt, nichts tun
    if np.isclose(current_ratio, ratio, atol=1e-6):
        return X.copy(), y.copy()

    if ratio > current_ratio:
        # Over-Sampling der positiven Klasse
        target_pos = int(np.ceil(ratio * neg_count))
        # Zufällige Auswahl mit Zurücklegen aus den positiven Indizes
        pos_sample_indices = rng.choice(pos_indices, size=target_pos, replace=True)
        neg_sample_indices = neg_indices
    else:
        # Under-Sampling der negativen Klasse
        target_neg = int(np.ceil(pos_count / ratio))
        # Zufällige Auswahl der negativen Instanzen ohne Zurücklegen
        if target_neg > neg_count:
            target_neg = neg_count
        neg_sample_indices = rng.choice(neg_indices, size=target_neg, replace=False)
        pos_sample_indices = pos_indices

    # Zusammensetzen der Indizes
    res_indices = np.concatenate([pos_sample_indices, neg_sample_indices])
    rng.shuffle(res_indices)

    X_res = X.iloc[res_indices].reset_index(drop=True)
    y_res = y.iloc[res_indices].reset_index(drop=True)
    return X_res, y_res


def compute_cost(
    y_true: Iterable[int],
    y_pred: Iterable[int],
    cost_matrix: Dict[Tuple[int, int], float] = DEFAULT_COST_MATRIX
) -> float:
    """
    Berechnet die Gesamtkosten für eine Vorhersagesequenz
    gemäß gegebener Kostenmatrix.
    """
    total_cost = 0.0
    for pred, true in zip(y_pred, y_true):
        total_cost += cost_matrix.get((pred, true), 0.0)
    return total_cost


def train_logistic_regression(
    X_train: pd.DataFrame,
    y_train: pd.Series,
    X_valid: pd.DataFrame,
    y_valid: pd.Series,
    sampling_ratio: Optional[float] = 1.0,
    random_state: Optional[int] = None
) -> Tuple[LogisticRegression, np.ndarray, float, StandardScaler]:
    """
    Trainiert eine logistische Regression mit optionalem Resampling.

    Wenn sampling_ratio None ist, wird KEIN Over-/Undersampling gemacht.
    Ansonsten wird das Verhältnis mit resample_pos_neg angepasst.
    """
    if sampling_ratio is None:
        X_res, y_res = X_train, y_train
    else:
        X_res, y_res = resample_pos_neg(
            X_train, y_train, ratio=sampling_ratio, random_state=random_state
        )

    scaler = StandardScaler(with_mean=False)
    X_res_scaled = scaler.fit_transform(X_res)
    X_valid_scaled = scaler.transform(X_valid)

    model = LogisticRegression(max_iter=1000, solver='lbfgs')
    model.fit(X_res_scaled, y_res)

    probs = model.predict_proba(X_valid_scaled)[:, 1]
    preds = (probs >= 0.5).astype(int)
    cost = compute_cost(y_true=y_valid, y_pred=preds)
    return model, probs, cost, scaler


def train_naive_bayes(
    X_train: pd.DataFrame,
    y_train: pd.Series,
    X_valid: pd.DataFrame,
    y_valid: pd.Series,
    sampling_ratio: Optional[float] = 1.0,
    random_state: Optional[int] = None
) -> Tuple[GaussianNB, np.ndarray, float]:
    """
    Trainiert einen Naiven Bayes mit optionalem Resampling.

    Wenn sampling_ratio None ist, wird KEIN Over-/Undersampling gemacht.
    """
    if sampling_ratio is None:
        X_res, y_res = X_train, y_train
    else:
        X_res, y_res = resample_pos_neg(
            X_train, y_train, ratio=sampling_ratio, random_state=random_state
        )

    model = GaussianNB()
    model.fit(X_res, y_res)

    probs = model.predict_proba(X_valid)[:, 1]
    preds = (probs >= 0.5).astype(int)
    cost = compute_cost(y_true=y_valid, y_pred=preds)
    return model, probs, cost


def find_best_sampling_ratio(
    X_train: pd.DataFrame,
    y_train: pd.Series,
    X_valid: pd.DataFrame,
    y_valid: pd.Series,
    model_type: str,
    candidate_ratios: Iterable[float],
    random_state: Optional[int] = None
) -> Tuple[float, float]:
    """
    Findet den Sampling-Parameter, der die geringsten Gesamtkosten (höchsten Profit)
    auf dem Validierungsset liefert. Es wird jeweils mit Threshold 0.5 evaluiert.
    """
    best_ratio: float = None  # type: ignore
    best_cost = float('inf')

    for ratio in candidate_ratios:
        if model_type == 'log_reg':
            _, _, cost, _ = train_logistic_regression(
                X_train, y_train, X_valid, y_valid,
                sampling_ratio=ratio,
                random_state=random_state
            )
        elif model_type == 'naive_bayes':
            _, _, cost = train_naive_bayes(
                X_train, y_train, X_valid, y_valid,
                sampling_ratio=ratio,
                random_state=random_state
            )
        else:
            raise ValueError(f"Unbekannter model_type: {model_type}")

        # Minimale Gesamtkosten entsprechen höchstem Profit (negativer Wert)
        if cost < best_cost:
            best_cost = cost
            best_ratio = ratio

    return best_ratio, best_cost


def threshold_analysis(
    probs: np.ndarray,
    y_true: Iterable[int],
    thresholds: Iterable[float],
    cost_matrix: Dict[Tuple[int, int], float] = DEFAULT_COST_MATRIX
) -> Tuple[np.ndarray, np.ndarray]:
    """
    Berechnet die Kosten für verschiedene Schwellenwerte.

    Gibt Arrays (thresholds, costs) zurück.
    """
    thr_array = np.array(list(thresholds))
    costs = []
    for t in thr_array:
        preds = (probs >= t).astype(int)
        cost = compute_cost(y_true=y_true, y_pred=preds, cost_matrix=cost_matrix)
        costs.append(cost)
    return thr_array, np.array(costs)
