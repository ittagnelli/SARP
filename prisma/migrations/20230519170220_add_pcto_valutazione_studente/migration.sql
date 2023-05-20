-- CreateTable
CREATE TABLE "pcto_Valutazione_Studente" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "creatoDa" INTEGER NOT NULL,
    "idPcto" INTEGER NOT NULL,
    "idStagista" INTEGER NOT NULL,
    "valutazione" TEXT NOT NULL,
    CONSTRAINT "pcto_Valutazione_Studente_idPcto_fkey" FOREIGN KEY ("idPcto") REFERENCES "pcto_Pcto" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "pcto_Valutazione_Studente_idStagista_fkey" FOREIGN KEY ("idStagista") REFERENCES "Utente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
