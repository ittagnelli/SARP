-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Materia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "has_pdp" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Materia" ("id", "nome") SELECT "id", "nome" FROM "Materia";
DROP TABLE "Materia";
ALTER TABLE "new_Materia" RENAME TO "Materia";
CREATE UNIQUE INDEX "Materia_nome_key" ON "Materia"("nome");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
