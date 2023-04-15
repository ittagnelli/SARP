import { json } from '@sveltejs/kit';
import { PrismaDB } from '../../js/prisma_db';
import { route_protect, raise_error  } from '../../js/helper';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import { Logger } from '../../js/logger';

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
    raise_error(500, code, `Errore irreversibile durante la lettura delle ore lavorate dagli studenti per un PCTO. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`);
}

export async function GET({ request, url, locals }) {
	
    route_protect(locals);
    let pcto_id = Number(url.searchParams.get("pcto"));
    
    try {
        // cerca tutte le presenze approvate per un dato pcto_id
        const presenze = await SARP.pcto_Presenza.findMany({
            where: {
                idPcto: pcto_id,
                approvato: true
            },
            include: {
                presenza: true
            }
        });

        return json(presenze);

    } catch (exception) {
        catch_error(exception, 304);
    }
}
