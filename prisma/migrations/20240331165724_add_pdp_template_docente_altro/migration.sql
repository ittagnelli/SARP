/*
  Warnings:

  - You are about to drop the column `altro` on the `PDP` table. All the data in the column will be lost.
  - You are about to drop the column `altro` on the `pdp_Template` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PDP" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "idDocente" INTEGER NOT NULL,
    "idInsegnamento" INTEGER NOT NULL,
    "idStudente" INTEGER NOT NULL,
    "anno" INTEGER NOT NULL,
    "dispensative" TEXT NOT NULL,
    "compensative" TEXT NOT NULL,
    "valutative" TEXT NOT NULL,
    "altro_compensative" TEXT,
    "altro_dispensative" TEXT,
    "altro_valutative" TEXT,
    "note" TEXT,
    "completo" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "PDP_idInsegnamento_fkey" FOREIGN KEY ("idInsegnamento") REFERENCES "Insegnamenti" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PDP_idStudente_fkey" FOREIGN KEY ("idStudente") REFERENCES "Utente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PDP" ("anno", "compensative", "completo", "createdAt", "dispensative", "id", "idDocente", "idInsegnamento", "idStudente", "note", "updatedAt", "valutative") SELECT "anno", "compensative", "completo", "createdAt", "dispensative", "id", "idDocente", "idInsegnamento", "idStudente", "note", "updatedAt", "valutative" FROM "PDP";
DROP TABLE "PDP";
ALTER TABLE "new_PDP" RENAME TO "PDP";
CREATE TABLE "new_pdp_Template" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "creatoDa" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "dispensative" TEXT NOT NULL,
    "compensative" TEXT NOT NULL,
    "valutazione" TEXT NOT NULL,
    "altro_compensative" TEXT,
    "altro_dispensative" TEXT,
    "altro_valutative" TEXT,
    "note" TEXT,
    CONSTRAINT "pdp_Template_creatoDa_fkey" FOREIGN KEY ("creatoDa") REFERENCES "Utente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_pdp_Template" ("compensative", "createdAt", "creatoDa", "dispensative", "id", "nome", "note", "updatedAt", "valutazione") SELECT "compensative", "createdAt", "creatoDa", "dispensative", "id", "nome", "note", "updatedAt", "valutazione" FROM "pdp_Template";
DROP TABLE "pdp_Template";
ALTER TABLE "new_pdp_Template" RENAME TO "pdp_Template";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
