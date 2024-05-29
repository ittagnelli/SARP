-- CreateTable
CREATE TABLE "biblioteca_Libri" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "autori" TEXT NOT NULL,
    "titolo" TEXT NOT NULL,
    "editore" TEXT NOT NULL,
    "anno" TEXT NOT NULL,
    "isbn" TEXT NOT NULL,
    "scheda_libro" BOOLEAN NOT NULL DEFAULT false
);
