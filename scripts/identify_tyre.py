#!/usr/bin/env python3
"""Identifie un pneu MICHELIN photographié, par rapport au catalogue boutique.

Pas d'IA ni de clé API, deux signaux combinés :

1. Lecture du nom imprimé sur le flanc (OCR Tesseract) puis rapprochement avec
   les noms du catalogue, en pondérant les mots par leur rareté façon TF-IDF
   (« Line », « Competition »… reviennent partout et ne comptent presque pas ;
   un mot comme « Lithion » est très discriminant). C'est le signal le plus
   fiable : c'est littéralement ce qui est écrit sur le pneu.
2. À défaut (texte illisible), repli sur la similarité visuelle (points
   caractéristiques ORB) avec les visuels du catalogue — plus tolérant qu'un
   hash perceptuel global aux conditions réelles d'une photo (flou, angle,
   luminosité), car il compare des détails locaux plutôt que la structure
   globale de l'image.

Usage : identify_tyre.py <photo> <catalog.json>
  catalog.json : [{"slug": "...", "name": "...", "path": "/abs/path.webp"}, ...]

Sortie JSON sur stdout : {"slug": "...", "method": "name"|"visual", "score": N}
ou {"slug": None}.

Setup : python3 -m venv .venv && .venv/bin/pip install -r scripts/requirements.txt
        + `brew install tesseract` (binaire requis par pytesseract)
"""
import json
import math
import re
import sys
from collections import Counter

import cv2
import pytesseract
from PIL import Image

# Score TF-IDF minimal pour faire confiance au texte lu sur le flanc plutôt
# qu'à la similarité visuelle (à peu près un mot assez rare, type « Lithion »).
MIN_NAME_SCORE = 1.2

# Nombre minimal de points ORB correspondants pour accepter un match visuel.
MIN_VISUAL_MATCHES = 12

# Ratio de Lowe : un point n'est retenu que si son meilleur voisin est
# nettement plus proche que le second (élimine les correspondances ambiguës).
LOWE_RATIO = 0.75

orb = cv2.ORB_create(nfeatures=500)
bf = cv2.BFMatcher(cv2.NORM_HAMMING)


def tokenize(name: str) -> list[str]:
    # Les points/apostrophes ne séparent pas un mot (« A.T. » -> AT,
    # « Grip'R » -> GRIPR), et on ignore les tokens de moins de 3 caractères :
    # trop courts pour être discriminants, ils collisionnent avec des mots
    # anglais courants (« A », « OF »…) et faussent le score IDF.
    cleaned = re.sub(r"[.']", "", name.upper())
    return [t for t in re.findall(r"[A-Z0-9]+", cleaned) if len(t) >= 3]


def best_name_match(photo_path: str, catalog: list[dict]) -> tuple[str | None, float]:
    try:
        text = pytesseract.image_to_string(Image.open(photo_path))
    except Exception:
        return None, 0.0
    text_tokens = set(tokenize(text))
    if not text_tokens:
        return None, 0.0

    entry_tokens = {entry["slug"]: set(tokenize(entry["name"])) for entry in catalog}

    doc_freq = Counter()
    for tokens in entry_tokens.values():
        doc_freq.update(tokens)
    n = len(entry_tokens)

    def idf(token: str) -> float:
        return math.log(n / doc_freq[token]) if doc_freq[token] else 0.0

    best_slug, best_score = None, 0.0
    for slug, tokens in entry_tokens.items():
        score = sum(idf(t) for t in tokens if t in text_tokens)
        if score > best_score:
            best_score = score
            best_slug = slug
    return best_slug, best_score


def features(path: str):
    img = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
    if img is None:
        return None
    return orb.detectAndCompute(img, None)[1]


def good_match_count(query_des, ref_des) -> int:
    if query_des is None or ref_des is None or len(ref_des) < 2:
        return 0
    matches = bf.knnMatch(query_des, ref_des, k=2)
    return sum(1 for m in matches if len(m) == 2 and m[0].distance < LOWE_RATIO * m[1].distance)


def best_visual_match(photo_path: str, catalog: list[dict]) -> tuple[str | None, int]:
    query_des = features(photo_path)
    if query_des is None:
        return None, 0

    best_slug, best_score = None, 0
    for entry in catalog:
        score = good_match_count(query_des, features(entry["path"]))
        if score > best_score:
            best_score = score
            best_slug = entry["slug"]
    return best_slug, best_score


def main() -> None:
    photo_path, catalog_path = sys.argv[1], sys.argv[2]
    with open(catalog_path, "r", encoding="utf-8") as f:
        catalog = json.load(f)

    name_slug, name_score = best_name_match(photo_path, catalog)
    if name_slug and name_score >= MIN_NAME_SCORE:
        print(json.dumps({"slug": name_slug, "method": "name", "score": round(name_score, 2)}))
        return

    visual_slug, visual_score = best_visual_match(photo_path, catalog)
    if visual_slug and visual_score >= MIN_VISUAL_MATCHES:
        print(json.dumps({"slug": visual_slug, "method": "visual", "score": visual_score}))
        return

    print(json.dumps({"slug": None}))


if __name__ == "__main__":
    main()
