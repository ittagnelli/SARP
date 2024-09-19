import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();  // Inizializzo il client di SARP

(async function () {
    try {
        //seleziona le classi V
        const classi = await prisma.classe.findMany({
            select: {
                id: true,
                classe: true,
                istituto: true,
                sezione: true
            },
            where: {
                classe: 'V'
            }
        });

        for (const classe of classi) {
            console.log(`Aggiornamento studenti as precedente della V ${classe.istituto} ${classe.sezione}`);
            await prisma.utente.updateMany({
                where: {
                    classeId: classe.id
                },
                data: {
                    can_login: false,
                    // classeId: 1
                }
            })
        }
        console.log("Fatto!!!")
    } catch (e) {
        console.log(e);
    }
})();

