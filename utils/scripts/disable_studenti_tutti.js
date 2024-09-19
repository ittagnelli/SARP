import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();  // Inizializzo il client di SARP

(async function () {
    try {
        console.log("Disabilito tutti gli studenti");
        await prisma.utente.updateMany({
            where: {
                tipo: 'STUDENTE'
            },
            data: {
                can_login: false
            }
        })
        console.log("Fatto!!!")
    } catch (e) {
        console.log(e);
    }
})();

