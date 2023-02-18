-- CreateTable
CREATE TABLE "Classe" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "classe" TEXT NOT NULL,
    "istituto" TEXT NOT NULL,
    "sezione" TEXT NOT NULL
);

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
    "natoIl" DATETIME,
    "codiceF" TEXT,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "picture" TEXT,
    "bes" BOOLEAN,
    "can_login" BOOLEAN NOT NULL DEFAULT false,
    "istituto" TEXT,
    "classeId" INTEGER,
    CONSTRAINT "Utente_classeId_fkey" FOREIGN KEY ("classeId") REFERENCES "Classe" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Utente" ("bes", "can_login", "codiceF", "cognome", "createdAt", "creatoDa", "email", "id", "istituto", "natoA", "natoIl", "nome", "picture", "telefono", "tipo", "updatedAt") SELECT "bes", "can_login", "codiceF", "cognome", "createdAt", "creatoDa", "email", "id", "istituto", "natoA", "natoIl", "nome", "picture", "telefono", "tipo", "updatedAt" FROM "Utente";
DROP TABLE "Utente";
ALTER TABLE "new_Utente" RENAME TO "Utente";
CREATE UNIQUE INDEX "Utente_email_key" ON "Utente"("email");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
