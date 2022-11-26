import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const ruoli = ["Studente", "Professore", "Tutor aziendale"];

const tipo = ["Utente", "Amministratore"];

async function main() {
    ruoli.forEach(async ruolo => {
        await prisma.ruolo_Utente.create({
            data: {
                ruolo: ruolo
            }
          });
    });

    tipo.forEach(async tipo => {
        await prisma.tipo_Utente.create({
            data: {
                tipo: tipo
            }
        });
    });
}

main();