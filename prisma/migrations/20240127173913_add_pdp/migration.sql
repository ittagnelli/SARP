-- CreateTable
CREATE TABLE "PDP" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "idDocente" INTEGER NOT NULL,
    "idInsegnamento" INTEGER NOT NULL,
    "idStudente" INTEGER NOT NULL,
    "anno" INTEGER NOT NULL,
    "dispensative" TEXT NOT NULL,
    "compensative" TEXT NOT NULL,
    "valutative" TEXT NOT NULL,
    "altro" TEXT,
    "completo" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "PDP_idInsegnamento_fkey" FOREIGN KEY ("idInsegnamento") REFERENCES "Insegnamenti" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PDP_idStudente_fkey" FOREIGN KEY ("idStudente") REFERENCES "Utente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
