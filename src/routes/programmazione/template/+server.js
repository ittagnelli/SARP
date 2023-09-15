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
      
// duplica un template programmazione annuale
export async function POST({ request, url, locals }) {
    route_protect(locals);
    SARP.set_session(locals); // passa la sessione all'audit

    const json_data = await request.json();  
    try {
        const template = await SARP.programmazione_Template.findUnique({
            where: { id: +json_data },
        });
        
        await SARP.programmazione_Template.create({
            data: {
                creatoDa: user_id(locals),
                idMateria: template.idMateria,
                template: template.template,
                libro: template.libro,
                nome: `${template.nome}-DUP`,
                note: template.note
            }
        });
    } catch (exception) {
        catch_error(exception, 1101);
    }

    return json('ok');
}
