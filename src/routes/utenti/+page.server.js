import { PrismaDB } from '../../js/prisma_db';
import { route_protect, raise_error, multi_user_where, user_id, access_protect } from '../../js/helper';
import { Logger } from '../../js/logger';
import { fail } from '@sveltejs/kit';

let logger = new Logger("server"); //instanzia il logger
const SARP = new PrismaDB(); //Istanzia il client SARP DB
let resource = "utenti"; // definisco il nome della risorsa di questo endpoint

// @ts-ignore
function catch_error(exception, type) {
    logger.error(JSON.stringify(exception)); //PROF: error è un oggetto ma serve qualcosa di più complicato. per il momento lascialo così. ho gia risolto in hooks nella versione 9.0
    raise_error(500, 100, `Errore irreversibile durante ${type} dell'utente. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`);    // TIMESTAMP ci serve per capire l'errore all'interno del log
}

export async function load({ locals }) {
    let action = 'read';

    route_protect(locals);
    access_protect(700, locals, action, resource);

	try {
		// query SQL al DB per tutte le entry nella tabella todo
		const utenti = await SARP.Utente.findMany({
			orderBy: [{ id: 'desc' }],
			where: multi_user_where(locals),
            include: {ruoli: true} 
		});

		const tipi_utente = await SARP.tipo_Utente.findMany({
			orderBy: [{ id: 'desc' }]
		});
		
		const ruoli_utente = await SARP.ruolo_Utente.findMany({
			orderBy: [{ id: 'desc' }]
		});

		// restituisco il risultato della query SQL
		return {
			utenti: utenti,
			tipi_utente: tipi_utente,
			ruoli_utente: ruoli_utente
		}
	} catch (error) {
		logger.error(JSON.stringify(error)); //PROF: error è un oggetto ma serve qualcosa di più complicato. per il momento lascialo così. ho gia risolto in hooks nella versione 9.0
		raise_error(500, 100, `Errore durante la ricerca degli utenti. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`);    // TIMESTAMP ci serve per capire l'errore all'interno del log
	}

}

export const actions = {
	create: async ({ cookies, request, locals }) => {
        let action = 'create';

        route_protect(locals);
        access_protect(701, locals, action, resource);

		const form_data = await request.formData();
        let ids = [];
        const roles = form_data.getAll('ruolo');
        
        if(roles.length > 0) {
            roles.forEach(element => {
                ids.push({id: +element})
            });
        }

        SARP.set_session(locals); // passa la sessione all'audit
		try {
			await SARP.Utente.create({
				data: {
					creatoDa: user_id(locals),
					nome: form_data.get('nome'),
					cognome: form_data.get('cognome'),
					email: form_data.get('email'),
					telefono: form_data.get('telefono'),
                    tipo: form_data.get('tipo'),
                    picture: 'img/avatar.png',
					istituto: form_data.get('istituto'),
					bes: form_data.get('bes') == "SI" ? true : false,
					can_login: form_data.get('can_login') == "SI" ? true : false,
                    ruoli: {
                        connect: ids
                    }
				}
			});
		} catch (error) {
            // @ts-ignore
            if(error.code != "P2002")
                catch_error(error, "l'inserimento");
            else
                return fail(400, { error_mex: "Email non univoca" });   // La richiesta fallisce
		}
	},

	update: async ({ cookies, request, locals }) => {
        let action = 'update';

        route_protect(locals);
        access_protect(702, locals, action, resource);

		const form_data = await request.formData();
		let id = form_data.get('id');
        let ids = [];
        const roles = form_data.getAll('ruolo');
        
        if(roles.length > 0) {
            roles.forEach(element => {
                ids.push({id: +element})
            });
        }
        
        SARP.set_session(locals); // passa la sessione all'audit
		try {
			await SARP.Utente.update({
				where: { id: +id },
				data: {
					nome: form_data.get('nome'),
					cognome: form_data.get('cognome'),
					email: form_data.get('email'),
					telefono: form_data.get('telefono'),
					tipo: form_data.get('tipo'),
					istituto: form_data.get('istituto'),
					bes: form_data.get('bes') == "SI" ? true : false,
					can_login: form_data.get('can_login') == "SI" ? true : false,
                    ruoli: {
                        set: ids
                    }
				}
			});		
		} catch (error) {
            // @ts-ignore
            if(error.code != "P2002")
                catch_error(error, "l'aggiornamento");
            else
                return fail(400, { error_mex: "Email non univoca" });   // La richiesta fallisce
		}

	},

	delete: async ({ cookies, request, locals }) => {
        let action = 'delete';

        route_protect(locals);
        access_protect(703, locals, action, resource);

		const form_data = await request.formData();
		const id = form_data.get('id');

        SARP.set_session(locals); // passa la sessione all'audit
		try {
			await SARP.Utente.delete({
				where: { id: +id }
			});		
		} catch (error) {
			catch_error(error, "l'eliminazione");
		}

	}
};
