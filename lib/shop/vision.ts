// Reconnaissance d'image réelle d'un pneu, par comparaison avec les visuels
// du catalogue boutique (cf. scripts/identify_tyre.py — ORB, pas d'IA ni de
// clé API). Module serveur uniquement (spawn un process Python + accès disque).

import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";

import { SHOP_CATALOG, type ShopTyre } from "@/lib/shop/catalog";

const execFileAsync = promisify(execFile);

// Chemins relatifs au cwd (passé explicitement à execFile) : on évite de les
// construire avec path.join(process.cwd(), …), un motif que le traçage de
// fichiers de Next.js tente de résoudre statiquement et qui casse sur le
// symlink Homebrew du venv (qui sort de la racine du projet).
const PYTHON_BIN = "./.venv/bin/python3";
const SCRIPT_PATH = "./scripts/identify_tyre.py";

type IdentifyResult = { slug: string | null };

/**
 * Identifie un pneu MICHELIN à partir d'une photo, en le comparant aux
 * visuels du catalogue boutique. Renvoie `null` si rien d'assez proche n'est
 * trouvé (mieux vaut ne pas reconnaître que de désigner le mauvais pneu).
 */
export async function identifyTyreFromPhoto(file: File): Promise<ShopTyre | null> {
  const dir = await mkdtemp(path.join(tmpdir(), "tyre-scan-"));
  const photoPath = path.join(dir, "photo");
  const catalogPath = path.join(dir, "catalog.json");

  try {
    await writeFile(photoPath, Buffer.from(await file.arrayBuffer()));
    const catalog = SHOP_CATALOG.map((t) => ({
      slug: t.slug,
      name: t.name,
      path: path.join(process.cwd(), "public", t.image),
    }));
    await writeFile(catalogPath, JSON.stringify(catalog));

    const { stdout } = await execFileAsync(PYTHON_BIN, [SCRIPT_PATH, photoPath, catalogPath], {
      cwd: process.cwd(),
    });
    const result = JSON.parse(stdout) as IdentifyResult;
    if (!result.slug) return null;
    return SHOP_CATALOG.find((t) => t.slug === result.slug) ?? null;
  } catch {
    // Script ou venv indisponible : on ne bloque pas le scan, on retombe sur
    // « non reconnu » plutôt que de planter la page.
    return null;
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}
