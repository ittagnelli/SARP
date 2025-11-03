-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_pcto_Azienda" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "creatoDa" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "indirizzo" TEXT,
    "piva" TEXT,
    "telefono" TEXT,
    "email_privacy" TEXT,
    "direttore_nome" TEXT,
    "direttore_natoA" TEXT,
    "direttore_natoIl" DATETIME,
    "direttore_codiceF" TEXT,
    "idConvenzione" TEXT NOT NULL,
    "dataConvenzione" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataProtocollo" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "istituto" TEXT NOT NULL DEFAULT 'ITT',
    "firma_convenzione" BOOLEAN NOT NULL DEFAULT false,
    "protocollata" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "pcto_Azienda_creatoDa_fkey" FOREIGN KEY ("creatoDa") REFERENCES "Utente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_pcto_Azienda" ("createdAt", "creatoDa", "dataConvenzione", "dataProtocollo", "direttore_codiceF", "direttore_natoA", "direttore_natoIl", "direttore_nome", "email_privacy", "firma_convenzione", "id", "idConvenzione", "indirizzo", "istituto", "nome", "piva", "telefono", "updatedAt") SELECT "createdAt", "creatoDa", "dataConvenzione", "dataProtocollo", "direttore_codiceF", "direttore_natoA", "direttore_natoIl", "direttore_nome", "email_privacy", "firma_convenzione", "id", "idConvenzione", "indirizzo", "istituto", "nome", "piva", "telefono", "updatedAt" FROM "pcto_Azienda";
DROP TABLE "pcto_Azienda";
ALTER TABLE "new_pcto_Azienda" RENAME TO "pcto_Azienda";
CREATE UNIQUE INDEX "pcto_Azienda_idConvenzione_key" ON "pcto_Azienda"("idConvenzione");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
