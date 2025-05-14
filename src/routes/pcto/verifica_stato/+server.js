import { json } from '@sveltejs/kit';
import { PrismaDB } from '$js/prisma_db';
import { route_protect, raise_error, access_protect  } from '$js/helper';
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
    raise_error(500, code, `Errore irreversibile durante verifica PCTO studente. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`);
}

export async function GET({ request, url, locals }) {
    let action = 'get';
    let resource = "verifica_stato"; // definisco il nome della risorsa di questo endpoint
    route_protect(locals);
    access_protect(500, locals, action, resource);
    
    let cognome = url.searchParams.get("cognome");
    let nome = url.searchParams.get("nome");
    let whereobj = {};

    if(cognome)
        whereobj['cognome'] = cognome;
    if(nome)
        whereobj['nome'] = nome;
    
    try {
        const studente = await SARP.utente.findMany({
            where: whereobj,
            include: {
                iscritto: {
                    include: {
                        offertoDa: true
                    }
                },
                presente: true
            }
        });

        return json(studente);
    } catch (exception) {
        catch_error(exception, 901);
    }
}


export async function POST({ request, url, locals }) {
    route_protect(locals);
    const json_data = await request.json();

    SARP.set_session(locals); // passa la sessione all'audit
   
    try {
        console.log("POST:", json_data)
    } catch (exception) {
        console.log("EXCEPTION:", exception)
        catch_error(exception, 1001);
    }

    return json('ok');
}
