-- CreateTable
CREATE TABLE "programmazione_Template" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "creatoDa" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "libro" TEXT NOT NULL,
    "idMateria" INTEGER NOT NULL,
    CONSTRAINT "programmazione_Template_creatoDa_fkey" FOREIGN KEY ("creatoDa") REFERENCES "Utente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "programmazione_Template_idMateria_fkey" FOREIGN KEY ("idMateria") REFERENCES "Materia" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
