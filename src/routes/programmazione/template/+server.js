import { json } from '@sveltejs/kit';
import { PrismaDB } from '$js/prisma_db';
import { route_protect, raise_error, user_id } from '$js/helper';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import { Logger } from '$js/logger';

let logger = new Logger("server"); //instanzia il logger
const SARP = new PrismaDB(); //Istanzia il client SARP DB

function catch_error(exception, code) {
    if(exception instanceof PrismaClientValidationError)
        logger.error(exception.message);
    else {  
        logger.error(JSON.stringify(exception));
        logger.error(exception.message);
        logger.error(exception.stack);
    }
    raise_error(500, code, `Errore irreversibile nella duplicazione del template. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`);
}
      
//Get all DOCENTI
export async function GET({ request, url, locals }) {
    route_protect(locals);
    SARP.set_session(locals); // passa la sessione all'audit

    // const json_data = await request.json();  
    try {
        const docenti = await SARP.Utente.findMany({
            where: { tipo: 'DOCENTE' },
            select: {
                id: true,
                nome: true,
                cognome: true
            }
        });
        
        return json(docenti);
    } catch (exception) {
        catch_error(exception, 1501);
    }
}
