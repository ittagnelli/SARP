/*
  Warnings:

  - A unique constraint covering the columns `[nome]` on the table `Materia` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Materia_nome_key" ON "Materia"("nome");
