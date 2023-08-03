-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_sicurezza_Corso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "creatoDa" INTEGER NOT NULL,
    "titolo" TEXT NOT NULL,
    "dataInizio" DATETIME NOT NULL,
    "dataFine" DATETIME NOT NULL,
    "dataTest" DATETIME,
    "tipo" TEXT NOT NULL,
    "somministrato" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_sicurezza_Corso" ("createdAt", "creatoDa", "dataFine", "dataInizio", "dataTest", "id", "tipo", "titolo", "updatedAt") SELECT "createdAt", "creatoDa", "dataFine", "dataInizio", "dataTest", "id", "tipo", "titolo", "updatedAt" FROM "sicurezza_Corso";
DROP TABLE "sicurezza_Corso";
ALTER TABLE "new_sicurezza_Corso" RENAME TO "sicurezza_Corso";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
