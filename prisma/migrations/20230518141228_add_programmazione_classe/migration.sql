-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Insegnamenti" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idDocente" INTEGER NOT NULL,
    "idMateria" INTEGER NOT NULL,
    "idClasse" INTEGER NOT NULL,
    "titolare" BOOLEAN NOT NULL DEFAULT false,
    "anno" INTEGER NOT NULL,
    "programma_primo_quadrimestre" TEXT,
    "programma_secondo_quadrimestre" TEXT,
    "programma_primo_quadrimestre_completo" BOOLEAN NOT NULL DEFAULT false,
    "programma_secondo_quadrimestre_completo" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Insegnamenti_idDocente_fkey" FOREIGN KEY ("idDocente") REFERENCES "Utente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Insegnamenti_idMateria_fkey" FOREIGN KEY ("idMateria") REFERENCES "Materia" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Insegnamenti_idClasse_fkey" FOREIGN KEY ("idClasse") REFERENCES "Classe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Insegnamenti" ("anno", "id", "idClasse", "idDocente", "idMateria", "titolare") SELECT "anno", "id", "idClasse", "idDocente", "idMateria", "titolare" FROM "Insegnamenti";
DROP TABLE "Insegnamenti";
ALTER TABLE "new_Insegnamenti" RENAME TO "Insegnamenti";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
