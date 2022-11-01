-- CreateTable
CREATE TABLE "Utente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "tipo" TEXT NOT NULL DEFAULT 'STUDENTE',
    "ruolo" TEXT,
    "nome" TEXT NOT NULL,
    "cognome" TEXT NOT NULL,
    "email" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "pcto_Presenza" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "data" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "oraInizio" DATETIME,
    "oraFine" DATETIME,
    "idUtente" INTEGER NOT NULL,
    "idPcto" INTEGER NOT NULL,
    CONSTRAINT "pcto_Presenza_idUtente_fkey" FOREIGN KEY ("idUtente") REFERENCES "Utente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pcto_Presenza_idPcto_fkey" FOREIGN KEY ("idPcto") REFERENCES "pcto_Pcto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pcto_Valutazione" (
    "idUtente" INTEGER NOT NULL,
    "idPcto" INTEGER NOT NULL,
    "valutatore" TEXT NOT NULL,
    "voto" INTEGER NOT NULL,

    PRIMARY KEY ("idUtente", "idPcto", "valutatore"),
    CONSTRAINT "pcto_Valutazione_idUtente_fkey" FOREIGN KEY ("idUtente") REFERENCES "Utente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pcto_Valutazione_idPcto_fkey" FOREIGN KEY ("idPcto") REFERENCES "pcto_Pcto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pcto_Azienda" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "indirizzo" TEXT,
    "idConvenzione" TEXT,
    "idUtente" INTEGER NOT NULL,
    "dataConvenzione" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dataProtocollo" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "istituto" TEXT NOT NULL DEFAULT 'ITT',
    CONSTRAINT "pcto_Azienda_idUtente_fkey" FOREIGN KEY ("idUtente") REFERENCES "Utente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "pcto_Pcto" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dataInizio" DATETIME,
    "dataFine" DATETIME,
    "titolo" TEXT NOT NULL,
    "descrizione" TEXT NOT NULL,
    "idAzienda" INTEGER NOT NULL,
    CONSTRAINT "pcto_Pcto_idAzienda_fkey" FOREIGN KEY ("idAzienda") REFERENCES "pcto_Azienda" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Utente_email_key" ON "Utente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pcto_Azienda_indirizzo_key" ON "pcto_Azienda"("indirizzo");

-- CreateIndex
CREATE UNIQUE INDEX "pcto_Azienda_idConvenzione_key" ON "pcto_Azienda"("idConvenzione");

-- CreateIndex
CREATE UNIQUE INDEX "pcto_Pcto_idAzienda_key" ON "pcto_Pcto"("idAzienda");
