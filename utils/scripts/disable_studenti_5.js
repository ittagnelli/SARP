import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();  // Inizializzo il client di SARP

(async function () {
    const QUINTE = [10, 13, 16, 19, 24, 29]; //dirty list of classi quinte
    try {
        console.log("UPDATING Studenti 5 anno precedente....")
        QUINTE.forEach(async classe => {
            await prisma.utente.updateMany({
                where: {
                    classeId: classe
                },
                data: {
                    can_login: false,
                    classeId: 1
                }
            })
        })
        console.log("FATTO!!!")            
    } catch(e) {
        console.log(e);
    }
})();

