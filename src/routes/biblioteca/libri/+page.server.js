import { PrismaDB } from '$js/prisma_db';

import {
	route_protect,
	multi_user_where,
	raise_error,
	access_protect
} from '$js/helper'; //PROF: usa l'helper raise_erorr che ho cretao qualche settimana fa
import { Logger } from '$js/logger';
import { PrismaClientValidationError } from '@prisma/client/runtime';

let logger = new Logger('server'); //instanzia il logger
const SARP = new PrismaDB(); //Istanzia il client SARP DB
let resource = 'biblioteca_libri'; // definisco il nome della risorsa di questo endpoint

// @ts-ignore
function catch_error(exception, type, code) {
    if(exception instanceof PrismaClientValidationError)
        logger.error(exception.message);
    else {  
        logger.error(JSON.stringify(exception));
        logger.error(exception.message);
        logger.error(exception.stack);
    }
    raise_error(
		500,
		code,
		`Errore irreversibile durante ${type} dell'azienda. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`
	); // TIMESTAMP ci serve per capire l'errore all'interno del log
}

// @ts-ignore
function catch_error_pdf(exception, type, code) {
	logger.error(JSON.stringify(exception)); //PROF: error è un oggetto ma serve qualcosa di più complicato. per il momento lascialo così. ho gia risolto in hooks nella versione 9.0
	raise_error(
		500,
		code,
		`${type} TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`
	);
}

// @ts-ignore
export async function load({ locals }) {
	let action = 'read';

	route_protect(locals);
	access_protect(100, locals, action, resource);

	try {
		// query SQL al DB per tutte le entry nella tabella todo
		const books = await SARP.biblioteca_Libri.findMany({
			orderBy: [{ id: 'desc' }]
		});

		// restituisco il risultato della query SQL
		return { 
            libri: books,
        };
	} catch (exception) {
		catch_error(exception, 'la ricerca', 200);
	}
}

export const actions = {
	// @ts-ignore
	create: async ({ cookies, request, locals }) => {
		let action = 'create';

		route_protect(locals);
		access_protect(101, locals, action, resource);

		const form_data = await request.formData();

		SARP.set_session(locals); // passa la sessione all'audit
		try {
			await SARP.biblioteca_Libri.create({
				data: {
					autori: form_data.get('autori'),
					titolo: form_data.get('titolo'),
					editore: form_data.get('editore'),
					anno: form_data.get('anno'),
                    isbn: form_data.get('isbn'),
                    scheda_libro: form_data.get('scheda_libro') == "SI" ? true : false
				}
			});
		} catch (exception) {
			// @ts-ignore
			if (exception.code != 'P2002') catch_error(exception, "l'inserimento", 201);
		}
	},

	// @ts-ignore
	update: async ({ cookies, request, locals }) => {
		let action = 'update';

		route_protect(locals);
		access_protect(102, locals, action, resource);

		const form_data = await request.formData();
		let id = form_data.get('id');

		SARP.set_session(locals); // passa la sessione all'audit
		try {
			await SARP.biblioteca_Libri.update({
				where: { id: +id },
				data: {
					autori: form_data.get('autori'),
					titolo: form_data.get('titolo'),
					editore: form_data.get('editore'),
					anno: form_data.get('anno'),
                    isbn: form_data.get('isbn'),
                    scheda_libro: form_data.get('scheda_libro') == "SI" ? true : false
				}
			});
		} catch (exception) {
			// @ts-ignore
			if (exception.code != 'P2002') catch_error(exception, "l'aggiornamento", 202);
		}
	},

	// @ts-ignore
	delete: async ({ cookies, request, locals }) => {
		let action = 'delete';

		route_protect(locals);
		access_protect(103, locals, action, resource);

		const form_data = await request.formData();
		const id = form_data.get('id');

		SARP.set_session(locals); // passa la sessione all'audit
		try {
			await SARP.biblioteca_Libri.delete({
				where: { id: +id }
			});
		} catch (exception) {
			catch_error(exception, "l'aggiornamento", 203);
		}
	},
};
