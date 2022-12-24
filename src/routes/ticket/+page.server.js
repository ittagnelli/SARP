import { PrismaDB } from '../../js/prisma_db';
import { redirect } from '@sveltejs/kit';
import { route_protect } from '../../js/helper';
import { Logger } from '../../js/logger';

let logger = new Logger("seerver"); //instanzia il logger
const SARP = new PrismaDB(); //Istanzia il client SARP DB


export async function load({ locals }) {
    route_protect(locals);

    //query SQL al DB per tutte le entry nella tabella tocket
	const tickets = await SARP.Ticket.findMany({
		orderBy: [{ id: 'desc' }],
        include: {
			segnalatore: true
		}
	});

	//restituisco il risultato della query SQL
    return tickets;
}

export const actions = {
	create: async ({ cookies, request, locals }) => {
		const form_data = await request.formData();
        const applicazione = form_data.get('applicazione');
        const titolo = form_data.get('titolo');
        const descrizione = form_data.get('descrizione');

        SARP.set_session(locals); // passa la sessione all'audit
		await SARP.Ticket.create({
			data: {
                idUtente: locals.session.login.id,
                applicazione: applicazione,
                titolo: titolo,
                descrizione: descrizione
			}
		});
	}
};
