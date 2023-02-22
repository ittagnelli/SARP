-- CreateTable
CREATE TABLE "kpi_Stats" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "n_utenti" INTEGER,
    "n_pcto_aziende_attive" INTEGER,
    "n_pcto_attivi" INTEGER,
    "n_studenti_pcto_attivi" INTEGER,
    "n_ore_tot_pcto_attivi" INTEGER,
    "n_ore_tot_pcto" INTEGER
);
