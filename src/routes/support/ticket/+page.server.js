import { PrismaDB } from '$js/prisma_db';
import { redirect } from '@sveltejs/kit';
import { raise_error, route_protect, access_protect } from '$js/helper';
import { Logger } from '$js/logger';
import { PrismaClientValidationError } from '@prisma/client/runtime';


let logger = new Logger("server"); //instanzia il logger
const SARP = new PrismaDB(); //Istanzia il client SARP DB
let resource = "ticket"; // definisco il nome della risorsa di questo endpoint

// @ts-ignore
function catch_error(exception, type, code) {
    if(exception instanceof PrismaClientValidationError)
        logger.error(exception.message);
    else {  
        logger.error(JSON.stringify(exception));
        logger.error(exception.message);
        logger.error(exception.stack);
    }
    raise_error(500, code, `Errore irreversibile durante ${type} del ticket. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`); // TIMESTAMP ci serve per capire l'errore all'interno del log
}

export async function load({ locals }) {
    let action = 'read';

    route_protect(locals);
    access_protect(600, locals, action, resource);

	try {
		//query SQL al DB per tutte le entry nella tabella tocket
		const tickets = await SARP.Ticket.findMany({
			orderBy: [{ id: 'desc' }],
			include: {
				segnalatore: true
			}
		});
		//restituisco il risultato della query SQL
		return {tickets: tickets};
	} catch (exception) {
        catch_error(exception, "la ricerca", 600);
    }

}

export const actions = {
	create: async ({ cookies, request, locals }) => {
        let action = 'create';

        route_protect(locals);
        access_protect(601, locals, action, resource);

		const form_data = await request.formData();
        const applicazione = form_data.get('applicazione');
        const titolo = form_data.get('titolo');
        const descrizione = form_data.get('descrizione');

        SARP.set_session(locals); // passa la sessione all'audit
		try {
			await SARP.Ticket.create({
				data: {
					idUtente: locals.session.login.id,
					applicazione: applicazione,
					titolo: titolo,
					descrizione: descrizione
				}
			});		
		} catch (erexceptionor) {
			catch_error(exception, "l'aggiunta", 601);
		}

	}
};
