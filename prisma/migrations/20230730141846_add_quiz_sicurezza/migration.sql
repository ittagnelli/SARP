-- CreateTable
CREATE TABLE "sicurezza_Test" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creatoDa" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "svolto" BOOLEAN NOT NULL DEFAULT false,
    "superato" BOOLEAN NOT NULL DEFAULT false,
    "domande" TEXT,
    "risposte" TEXT,
    "punti" INTEGER NOT NULL DEFAULT 0,
    "punti_max" INTEGER NOT NULL DEFAULT 0,
    "svoltoDa" INTEGER NOT NULL,
    "idCorso" INTEGER NOT NULL,
    CONSTRAINT "sicurezza_Test_svoltoDa_fkey" FOREIGN KEY ("svoltoDa") REFERENCES "Utente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "sicurezza_Test_idCorso_fkey" FOREIGN KEY ("idCorso") REFERENCES "sicurezza_Corso" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
