-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Utente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "creatoDa" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'STUDENTE',
    "nome" TEXT NOT NULL,
    "cognome" TEXT NOT NULL,
    "natoA" TEXT,
    "provincia" TEXT,
    "natoIl" DATETIME,
    "codiceF" TEXT,
    "cartaI" TEXT,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "residenza" TEXT,
    "picture" TEXT,
    "bes" BOOLEAN,
    "can_login" BOOLEAN NOT NULL DEFAULT false,
    "istituto" TEXT,
    "classeId" INTEGER,
    "griglia_valutazione" TEXT,
    "griglia_pdp_a1" TEXT,
    "griglia_pdp_a1_done" BOOLEAN NOT NULL DEFAULT false,
    "griglia_pdp_c1" TEXT,
    "griglia_pdp_c1_done" BOOLEAN NOT NULL DEFAULT false,
    "griglia_pdp_c2" TEXT,
    "griglia_pdp_c2_done" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Utente_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "Classe" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Utente" ("bes", "can_login", "cartaI", "classeId", "codiceF", "cognome", "createdAt", "creatoDa", "email", "griglia_pdp_a1", "griglia_pdp_a1_done", "griglia_pdp_c1", "griglia_pdp_c1_done", "griglia_valutazione", "id", "istituto", "natoA", "natoIl", "nome", "picture", "provincia", "residenza", "telefono", "tipo", "updatedAt") SELECT "bes", "can_login", "cartaI", "classeId", "codiceF", "cognome", "createdAt", "creatoDa", "email", "griglia_pdp_a1", "griglia_pdp_a1_done", "griglia_pdp_c1", "griglia_pdp_c1_done", "griglia_valutazione", "id", "istituto", "natoA", "natoIl", "nome", "picture", "provincia", "residenza", "telefono", "tipo", "updatedAt" FROM "Utente";
DROP TABLE "Utente";
ALTER TABLE "new_Utente" RENAME TO "Utente";
CREATE UNIQUE INDEX "Utente_email_key" ON "Utente"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
