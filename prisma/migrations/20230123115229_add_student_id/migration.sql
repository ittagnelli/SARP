/*
  Warnings:

  - Added the required column `svoltoDa` to the `pcto_Presenza` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_pcto_Presenza" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "svoltoDa" INTEGER NOT NULL,
    "creatoDa" INTEGER NOT NULL,
    "dataPresenza" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "oraInizio" DATETIME,
    "oraFine" DATETIME,
    "idPcto" INTEGER NOT NULL,
    CONSTRAINT "pcto_Presenza_svoltoDa_fkey" FOREIGN KEY ("svoltoDa") REFERENCES "Utente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pcto_Presenza_idPcto_fkey" FOREIGN KEY ("idPcto") REFERENCES "pcto_Pcto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_pcto_Presenza" ("createdAt", "creatoDa", "dataPresenza", "id", "idPcto", "oraFine", "oraInizio", "updatedAt") SELECT "createdAt", "creatoDa", "dataPresenza", "id", "idPcto", "oraFine", "oraInizio", "updatedAt" FROM "pcto_Presenza";
DROP TABLE "pcto_Presenza";
ALTER TABLE "new_pcto_Presenza" RENAME TO "pcto_Presenza";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
