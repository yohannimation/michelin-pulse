#!/usr/bin/env python3
"""Vérifie qu'une photo a une chance raisonnable de montrer un pneu.

Pas de reconnaissance de modèle ici (trop peu fiable sur une photo réelle,
cf. l'historique du projet) : juste un garde-fou rapide avant l'identification
simulée, pour éviter d'attribuer un pneu du catalogue à n'importe quelle photo.

Deux critères combinés :
1. Dominante de noir (un pneu, c'est du caoutchouc noir).
2. Texture « photo », pas « capture d'écran » : une vraie photo a du grain et
   des dégradés continus partout, alors qu'une UI (terminal, dashboard, app)
   est faite d'aplats de couleur unie très réguliers, même en thème sombre.
   Sans ce 2e critère, une capture d'écran sombre (éditeur de code, dashboard
   Grafana...) passait à tort le test du 1er critère seul.

Usage : looks_like_tyre.py <photo>
Sortie JSON sur stdout : {"isTyre": true|false, "darkRatio": 0.xx, "flatRatio": 0.xx}
"""
import json
import sys

import cv2
import numpy as np

# Seuil de luminosité sous lequel un pixel est considéré « sombre ».
DARK_LEVEL = 90

# Proportion minimale de pixels sombres pour considérer que la photo peut
# montrer un pneu (calibré sur une vraie photo de flanc : ~0.45).
MIN_DARK_RATIO = 0.2

# Proportion maximale de pixels « plats » (quasi identiques à leur voisin) :
# au-delà, c'est une UI vectorielle, pas une photo (calibré : ~0.66-0.72 pour
# de vraies photos de pneu, ~0.96 pour des captures d'écran).
MAX_FLAT_RATIO = 0.9


def main() -> None:
    photo_path = sys.argv[1]
    img = cv2.imread(photo_path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        print(json.dumps({"isTyre": False, "darkRatio": 0.0, "flatRatio": 1.0}))
        return

    dark_ratio = float((img < DARK_LEVEL).mean())

    diffs = img.astype(np.int16)
    flat_x = np.abs(np.diff(diffs, axis=1)) <= 1
    flat_y = np.abs(np.diff(diffs, axis=0)) <= 1
    flat_ratio = float((flat_x.mean() + flat_y.mean()) / 2)

    is_tyre = dark_ratio >= MIN_DARK_RATIO and flat_ratio <= MAX_FLAT_RATIO
    print(json.dumps({
        "isTyre": is_tyre,
        "darkRatio": round(dark_ratio, 3),
        "flatRatio": round(flat_ratio, 3),
    }))


if __name__ == "__main__":
    main()
