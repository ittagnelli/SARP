-- CreateTable
CREATE TABLE "Materia" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Insegnamenti" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "idDocente" INTEGER NOT NULL,
    "idMateria" INTEGER NOT NULL,
    "idClasse" INTEGER NOT NULL,
    "titolare" BOOLEAN NOT NULL DEFAULT false,
    "anno" INTEGER NOT NULL,
    CONSTRAINT "Insegnamenti_idDocente_fkey" FOREIGN KEY ("idDocente") REFERENCES "Utente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Insegnamenti_idMateria_fkey" FOREIGN KEY ("idMateria") REFERENCES "Materia" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Insegnamenti_idClasse_fkey" FOREIGN KEY ("idClasse") REFERENCES "Classe" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
