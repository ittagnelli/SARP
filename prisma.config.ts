// prisma.config.ts
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: { path: "prisma/migrations" },
  datasource: { url: env("DATABASE_URL") },
  experimental: {
    externalTables: true,
  },
  tables: {
    external: ["utente_backup"], // su SQLite basta il nome tabella, senza prefisso schema
  },
});
