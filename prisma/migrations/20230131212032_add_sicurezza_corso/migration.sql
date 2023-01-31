-- CreateTable
CREATE TABLE "sicurezza_Corso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "creatoDa" INTEGER NOT NULL,
    "titolo" TEXT NOT NULL,
    "dataInizio" DATETIME NOT NULL,
    "dataFine" DATETIME NOT NULL,
    "tipo" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "_UtenteTosicurezza_Corso" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_UtenteTosicurezza_Corso_A_fkey" FOREIGN KEY ("A") REFERENCES "Utente" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_UtenteTosicurezza_Corso_B_fkey" FOREIGN KEY ("B") REFERENCES "sicurezza_Corso" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "_UtenteTosicurezza_Corso_AB_unique" ON "_UtenteTosicurezza_Corso"("A", "B");

-- CreateIndex
CREATE INDEX "_UtenteTosicurezza_Corso_B_index" ON "_UtenteTosicurezza_Corso"("B");
