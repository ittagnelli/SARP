/*
  Warnings:

  - You are about to drop the `_UtenteTopcto_Pcto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `tutor` on the `pcto_Pcto` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "_UtenteTopcto_Pcto_B_index";

-- DropIndex
DROP INDEX "_UtenteTopcto_Pcto_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_UtenteTopcto_Pcto";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "_iscritto" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_iscritto_A_fkey" FOREIGN KEY ("A") REFERENCES "Utente" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_iscritto_B_fkey" FOREIGN KEY ("B") REFERENCES "pcto_Pcto" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_pcto_Pcto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "creatoDa" INTEGER NOT NULL,
    "titolo" TEXT NOT NULL,
    "descrizione" TEXT,
    "tutor_aziendale" TEXT,
    "idTutor" INTEGER,
    "dataInizio" DATETIME NOT NULL,
    "dataFine" DATETIME NOT NULL,
    "idAzienda" INTEGER NOT NULL,
    CONSTRAINT "pcto_Pcto_idTutor_fkey" FOREIGN KEY ("idTutor") REFERENCES "Utente" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "pcto_Pcto_idAzienda_fkey" FOREIGN KEY ("idAzienda") REFERENCES "pcto_Azienda" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_pcto_Pcto" ("createdAt", "creatoDa", "dataFine", "dataInizio", "descrizione", "id", "idAzienda", "titolo", "updatedAt") SELECT "createdAt", "creatoDa", "dataFine", "dataInizio", "descrizione", "id", "idAzienda", "titolo", "updatedAt" FROM "pcto_Pcto";
DROP TABLE "pcto_Pcto";
ALTER TABLE "new_pcto_Pcto" RENAME TO "pcto_Pcto";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_iscritto_AB_unique" ON "_iscritto"("A", "B");

-- CreateIndex
CREATE INDEX "_iscritto_B_index" ON "_iscritto"("B");
