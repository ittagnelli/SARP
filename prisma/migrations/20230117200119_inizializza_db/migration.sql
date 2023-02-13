-- CreateTable
CREATE TABLE "Versione" (
    "versione" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("versione", "createdAt")
);

-- CreateTable
CREATE TABLE "Utente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "creatoDa" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'STUDENTE',
    "nome" TEXT NOT NULL,
    "cognome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT,
    "picture" TEXT,
    "bes" BOOLEAN,
    "can_login" BOOLEAN NOT NULL DEFAULT false,
    "istituto" TEXT
);

-- CreateTable
CREATE TABLE "Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idUtente" INTEGER NOT NULL,
    "session_id" TEXT NOT NULL,
    "scadenza" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Session_idUtente_fkey" FOREIGN KEY ("idUtente") REFERENCES "Utente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "tipo_Utente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "tipo" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ruolo_Utente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "ruolo" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Ticket" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "idUtente" INTEGER NOT NULL,
    "applicazione" TEXT NOT NULL,
    "titolo" TEXT NOT NULL,
    "descrizione" TEXT NOT NULL,
    "risolto" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Ticket_idUtente_fkey" FOREIGN KEY ("idUtente") REFERENCES "Utente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pcto_Presenza" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "creatoDa" INTEGER NOT NULL,
    "dataPresenza" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "oraInizio" DATETIME,
    "oraFine" DATETIME,
    "idPcto" INTEGER NOT NULL,
    CONSTRAINT "pcto_Presenza_creatoDa_fkey" FOREIGN KEY ("creatoDa") REFERENCES "Utente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pcto_Presenza_idPcto_fkey" FOREIGN KEY ("idPcto") REFERENCES "pcto_Pcto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pcto_Valutazione" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "creatoDa" INTEGER NOT NULL,
    "idPcto" INTEGER NOT NULL,
    "qna" TEXT NOT NULL,
    CONSTRAINT "pcto_Valutazione_creatoDa_fkey" FOREIGN KEY ("creatoDa") REFERENCES "Utente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pcto_Valutazione_idPcto_fkey" FOREIGN KEY ("idPcto") REFERENCES "pcto_Pcto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pcto_Azienda" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "creatoDa" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "indirizzo" TEXT,
    "piva" TEXT,
    "telefono" TEXT,
    "direttore_nome" TEXT,
    "direttore_natoA" TEXT,
    "direttore_natoIl" DATETIME,
    "direttore_codiceF" TEXT,
    "idConvenzione" TEXT NOT NULL,
    "dataConvenzione" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataProtocollo" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "istituto" TEXT NOT NULL DEFAULT 'ITT',
    CONSTRAINT "pcto_Azienda_creatoDa_fkey" FOREIGN KEY ("creatoDa") REFERENCES "Utente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pcto_Pcto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "creatoDa" INTEGER NOT NULL,
    "titolo" TEXT NOT NULL,
    "descrizione" TEXT,
    "tutor" TEXT,
    "dataInizio" DATETIME NOT NULL,
    "dataFine" DATETIME NOT NULL,
    "idAzienda" INTEGER NOT NULL,
    CONSTRAINT "pcto_Pcto_idAzienda_fkey" FOREIGN KEY ("idAzienda") REFERENCES "pcto_Azienda" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_UtenteTopcto_Pcto" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_UtenteTopcto_Pcto_A_fkey" FOREIGN KEY ("A") REFERENCES "Utente" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UtenteTopcto_Pcto_B_fkey" FOREIGN KEY ("B") REFERENCES "pcto_Pcto" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_UtenteToruolo_Utente" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_UtenteToruolo_Utente_A_fkey" FOREIGN KEY ("A") REFERENCES "Utente" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UtenteToruolo_Utente_B_fkey" FOREIGN KEY ("B") REFERENCES "ruolo_Utente" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Utente_email_key" ON "Utente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session_idUtente_key" ON "Session"("idUtente");

-- CreateIndex
CREATE UNIQUE INDEX "Session_session_id_key" ON "Session"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "tipo_Utente_tipo_key" ON "tipo_Utente"("tipo");

-- CreateIndex
CREATE UNIQUE INDEX "ruolo_Utente_ruolo_key" ON "ruolo_Utente"("ruolo");

-- CreateIndex
CREATE UNIQUE INDEX "pcto_Azienda_idConvenzione_key" ON "pcto_Azienda"("idConvenzione");

-- CreateIndex
CREATE UNIQUE INDEX "_UtenteTopcto_Pcto_AB_unique" ON "_UtenteTopcto_Pcto"("A", "B");

-- CreateIndex
CREATE INDEX "_UtenteTopcto_Pcto_B_index" ON "_UtenteTopcto_Pcto"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_UtenteToruolo_Utente_AB_unique" ON "_UtenteToruolo_Utente"("A", "B");

-- CreateIndex
CREATE INDEX "_UtenteToruolo_Utente_B_index" ON "_UtenteToruolo_Utente"("B");
