// Vérification rapide « est-ce que cette photo ressemble à un pneu » avant
// l'identification simulée (cf. scripts/looks_like_tyre.py). On a essayé une
// vraie reconnaissance (OCR + similarité visuelle avec le catalogue), mais
// trop peu fiable sur des photos réelles : un pneu peut être identifié à tort.
// On garde donc juste ce garde-fou, puis lib/tyres.ts choisit un modèle du
// catalogue de façon déterministe (pas une vraie reconnaissance de modèle).

import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

// Chemins relatifs au cwd (passé explicitement à execFile) : on évite de les
// construire avec path.join(process.cwd(), …), un motif que le traçage de
// fichiers de Next.js tente de résoudre statiquement et qui casse sur le
// symlink Homebrew du venv (qui sort de la racine du projet).
const PYTHON_BIN = "./.venv/bin/python3";
const SCRIPT_PATH = "./scripts/looks_like_tyre.py";

type LooksLikeTyreResult = { isTyre: boolean };

/**
 * Renvoie `true` si la photo a une chance raisonnable de montrer un pneu
 * (dominante de noir/caoutchouc). En cas de souci (script ou venv
 * indisponible), on ne bloque pas le scan : on laisse passer plutôt que de
 * planter la page.
 */
export async function looksLikeTyre(file: File): Promise<boolean> {
  const dir = await mkdtemp(path.join(tmpdir(), "tyre-scan-"));
  const photoPath = path.join(dir, "photo");

  try {
    await writeFile(photoPath, Buffer.from(await file.arrayBuffer()));
    const { stdout } = await execFileAsync(PYTHON_BIN, [SCRIPT_PATH, photoPath], {
      cwd: process.cwd(),
    });
    const result = JSON.parse(stdout) as LooksLikeTyreResult;
    return result.isTyre;
  } catch {
    return true;
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
