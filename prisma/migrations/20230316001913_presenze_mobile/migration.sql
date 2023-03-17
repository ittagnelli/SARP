-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Session" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "idUtente" INTEGER NOT NULL,
    "session_id" TEXT NOT NULL,
    "scadenza" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mobile" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Session_idUtente_fkey" FOREIGN KEY ("idUtente") REFERENCES "Utente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Session" ("createdAt", "id", "idUtente", "scadenza", "session_id") SELECT "createdAt", "id", "idUtente", "scadenza", "session_id" FROM "Session";
DROP TABLE "Session";
ALTER TABLE "new_Session" RENAME TO "Session";
CREATE UNIQUE INDEX "Session_idUtente_key" ON "Session"("idUtente");
CREATE UNIQUE INDEX "Session_session_id_key" ON "Session"("session_id");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
