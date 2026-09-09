
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();  // Inizializzo il client di SARP

// ora settare tutti gli studenti con can_login=false a classeId=1
// update Utente set classeId=1 where can_login=0 and tipo='STUDENTE';

(async function () {
    try {
        console.log("Rimuovo la classe agli studenti non iscritti.");
        await prisma.utente.updateMany({
            where: {
                tipo: 'STUDENTE',
                can_login: false
            },
            data: {
              classeId: 1
            }
        })
        console.log("Fatto!!!")
    } catch (e) {
        console.log(e);
    }
})();

