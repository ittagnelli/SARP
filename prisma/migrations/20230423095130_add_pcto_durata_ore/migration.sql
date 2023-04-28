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
    "durata_ore" INTEGER NOT NULL DEFAULT 0,
    "idAzienda" INTEGER NOT NULL,
    "contabilizzato" BOOLEAN NOT NULL DEFAULT false,
    "anno_scolastico" INTEGER,
    CONSTRAINT "pcto_Pcto_idTutor_fkey" FOREIGN KEY ("idTutor") REFERENCES "Utente" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "pcto_Pcto_idAzienda_fkey" FOREIGN KEY ("idAzienda") REFERENCES "pcto_Azienda" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_pcto_Pcto" ("anno_scolastico", "contabilizzato", "createdAt", "creatoDa", "dataFine", "dataInizio", "descrizione", "id", "idAzienda", "idTutor", "titolo", "tutor_aziendale", "updatedAt") SELECT "anno_scolastico", "contabilizzato", "createdAt", "creatoDa", "dataFine", "dataInizio", "descrizione", "id", "idAzienda", "idTutor", "titolo", "tutor_aziendale", "updatedAt" FROM "pcto_Pcto";
DROP TABLE "pcto_Pcto";
ALTER TABLE "new_pcto_Pcto" RENAME TO "pcto_Pcto";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
