import { PrismaDB } from '$js/prisma_db';
import { route_protect, raise_error, multi_user_where, user_id, access_protect } from '$js/helper';
import { Logger } from '$js/logger';
import { fail } from '@sveltejs/kit';
import { PrismaClientValidationError } from '@prisma/client/runtime';


let logger = new Logger("server"); //instanzia il logger
const SARP = new PrismaDB(); //Istanzia il client SARP DB
let resource = "utenti"; // definisco il nome della risorsa di questo endpoint

// @ts-ignore
function catch_error(exception, type, code) {
    if(exception instanceof PrismaClientValidationError)
        logger.error(exception.message);
    else {  
        logger.error(JSON.stringify(exception));
        logger.error(exception.message);
        logger.error(exception.stack);
    }
    raise_error(500, code, `Errore irreversibile durante ${type} dell'utente. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`);    // TIMESTAMP ci serve per capire l'errore all'interno del log
}

export async function load({ locals }) {
    let action = 'read';

    route_protect(locals);
    access_protect(700, locals, action, resource);

	try {
		// query SQL al DB per tutte le entry nella tabella todo
		const utenti = await SARP.Utente.findMany({
			orderBy: [{ tipo: 'desc' }],
			where: multi_user_where(locals),
            include: {
                ruoli: true,
                classe: true
            } 
		});

		const tipi_utente = await SARP.tipo_Utente.findMany({
			orderBy: [{ id: 'desc' }]
		});
		
		const ruoli_utente = await SARP.ruolo_Utente.findMany({
			orderBy: [{ id: 'desc' }]
		});

        const classi = await SARP.Classe.findMany({
			orderBy: [{ id: 'desc' }]
		});

		// restituisco il risultato della query SQL
		return {
			utenti: utenti,
			tipi_utente: tipi_utente,
			ruoli_utente: ruoli_utente,
            classi: classi
		}
	} catch (exception) {
        catch_error(exception, "la ricerca", 100);
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
                    natoA: form_data.get('natoA'),
                    natoIl: new Date(form_data.get('natoIl')),
					codiceF: form_data.get('codiceF'),
                    cartaI: form_data.get('cartaI'),
					email: form_data.get('email'),
					telefono: form_data.get('telefono'),
                    tipo: form_data.get('tipo'),
                    picture: 'img/avatar.png',
					istituto: form_data.get('istituto'),
					bes: form_data.get('bes') == "SI" ? true : false,
					can_login: form_data.get('can_login') == "SI" ? true : false,
                    ruoli: {
                        connect: ids
                    },
                    classe: {
                        connect: {id: +form_data.get('classe')},
                    }
				}
			});
		} catch (exception) {
            // @ts-ignore
            if(exception.code != "P2002")
                catch_error(exception, "l'inserimento", 101);
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
                    natoA: form_data.get('natoA'),
                    natoIl: new Date(form_data.get('natoIl')),
					codiceF: form_data.get('codiceF'),
                    cartaI: form_data.get('cartaI'),
					email: form_data.get('email'),
					telefono: form_data.get('telefono'),
					tipo: form_data.get('tipo'),
					istituto: form_data.get('istituto'),
					bes: form_data.get('bes') == "SI" ? true : false,
					can_login: form_data.get('can_login') == "SI" ? true : false,
                    ruoli: {
                        set: ids
                    },
                    classe: {
                        connect: {id: +form_data.get('classe')}
                    }
				}
			});		
		} catch (exception) {
            // @ts-ignore
            if(exception.code != "P2002")
                catch_error(exception, "l'aggiornamento", 102);
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
		} catch (exception) {
			catch_error(exception, "l'eliminazione", 103);
		}

	}
};
