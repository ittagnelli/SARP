-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Classe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "classe" TEXT NOT NULL,
    "istituto" TEXT NOT NULL,
    "sezione" TEXT NOT NULL,
    "coordinatoreId" INTEGER,
    CONSTRAINT "Classe_coordinatoreId_fkey" FOREIGN KEY ("coordinatoreId") REFERENCES "Utente" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Classe" ("classe", "createdAt", "id", "istituto", "sezione", "updatedAt") SELECT "classe", "createdAt", "id", "istituto", "sezione", "updatedAt" FROM "Classe";
DROP TABLE "Classe";
ALTER TABLE "new_Classe" RENAME TO "Classe";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
