-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_pcto_Presenza" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "svoltoDa" INTEGER NOT NULL DEFAULT 1,
    "creatoDa" INTEGER NOT NULL,
    "dataPresenza" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "oraInizio" DATETIME,
    "oraFine" DATETIME,
    "approvato" BOOLEAN NOT NULL DEFAULT false,
    "idPcto" INTEGER NOT NULL,
    CONSTRAINT "pcto_Presenza_svoltoDa_fkey" FOREIGN KEY ("svoltoDa") REFERENCES "Utente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pcto_Presenza_idPcto_fkey" FOREIGN KEY ("idPcto") REFERENCES "pcto_Pcto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_pcto_Presenza" ("createdAt", "creatoDa", "dataPresenza", "id", "idPcto", "oraFine", "oraInizio", "svoltoDa", "updatedAt") SELECT "createdAt", "creatoDa", "dataPresenza", "id", "idPcto", "oraFine", "oraInizio", "svoltoDa", "updatedAt" FROM "pcto_Presenza";
DROP TABLE "pcto_Presenza";
ALTER TABLE "new_pcto_Presenza" RENAME TO "pcto_Presenza";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
