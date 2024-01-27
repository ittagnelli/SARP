-- AlterTable
ALTER TABLE "Utente" ADD COLUMN "griglia_valutazione" TEXT;

-- CreateTable
CREATE TABLE "pdp_Template" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "creatoDa" INTEGER NOT NULL,
    "nome" TEXT NOT NULL,
    "dispensative" TEXT NOT NULL,
    "compensative" TEXT NOT NULL,
    "valutazione" TEXT NOT NULL,
    "altro" TEXT,
    "note" TEXT,
    CONSTRAINT "pdp_Template_creatoDa_fkey" FOREIGN KEY ("creatoDa") REFERENCES "Utente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
