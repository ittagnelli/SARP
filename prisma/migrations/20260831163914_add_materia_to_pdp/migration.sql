-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PDP" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "idDocente" INTEGER NOT NULL,
    "idInsegnamento" INTEGER NOT NULL,
    "idStudente" INTEGER NOT NULL,
    "idMateria" INTEGER NOT NULL DEFAULT 0,
    "anno" INTEGER NOT NULL,
    "dispensative" TEXT NOT NULL,
    "compensative" TEXT NOT NULL,
    "valutative" TEXT NOT NULL,
    "strategie_classe" TEXT,
    "strategie_didattiche" TEXT,
    "obiettivi_minimi" TEXT,
    "altro_compensative" TEXT,
    "altro_dispensative" TEXT,
    "altro_valutative" TEXT,
    "note" TEXT,
    "completo" BOOLEAN NOT NULL DEFAULT false,
    "sintesi_vocale" BOOLEAN NOT NULL DEFAULT false,
    "tempo_esteso" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "PDP_idInsegnamento_fkey" FOREIGN KEY ("idInsegnamento") REFERENCES "Insegnamenti" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PDP_idStudente_fkey" FOREIGN KEY ("idStudente") REFERENCES "Utente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PDP_idMateria_fkey" FOREIGN KEY ("idMateria") REFERENCES "Materia" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_PDP" ("altro_compensative", "altro_dispensative", "altro_valutative", "anno", "compensative", "completo", "createdAt", "dispensative", "id", "idDocente", "idInsegnamento", "idStudente", "note", "obiettivi_minimi", "sintesi_vocale", "strategie_classe", "strategie_didattiche", "tempo_esteso", "updatedAt", "valutative") SELECT "altro_compensative", "altro_dispensative", "altro_valutative", "anno", "compensative", "completo", "createdAt", "dispensative", "id", "idDocente", "idInsegnamento", "idStudente", "note", "obiettivi_minimi", "sintesi_vocale", "strategie_classe", "strategie_didattiche", "tempo_esteso", "updatedAt", "valutative" FROM "PDP";
DROP TABLE "PDP";
ALTER TABLE "new_PDP" RENAME TO "PDP";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
