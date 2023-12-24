import { PrismaDB } from '$js/prisma_db';
import { route_protect, raise_error, multi_user_where, user_id, access_protect } from '$js/helper';
import { Logger } from '$js/logger';
import { fail } from '@sveltejs/kit';
import { PrismaClientValidationError } from '@prisma/client/runtime';


let logger = new Logger("server"); //instanzia il logger
const SARP = new PrismaDB(); //Istanzia il client SARP DB
let resource = "classi"; // definisco il nome della risorsa di questo endpoint

// @ts-ignore
function catch_error(exception, type, code) {
    if(exception instanceof PrismaClientValidationError)
        logger.error(exception.message);
    else {  
        logger.error(JSON.stringify(exception));
        logger.error(exception.message);
        logger.error(exception.stack);
    }
    raise_error(500, code, `Errore irreversibile durante ${type} della classe. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`);    // TIMESTAMP ci serve per capire l'errore all'interno del log
}

export async function load({ locals }) {
    let action = 'read';

    route_protect(locals);
    access_protect(1200, locals, action, resource);

	try {
		// query SQL al DB per tutte le entry nella tabella todo
		const classi = await SARP.Classe.findMany({
			orderBy: [{ classe: 'asc' }],
            where: {
                NOT: {
                    classe: {
                        startsWith: '--',
                    },
                }
            },
            include: {
                coordinatore: true
            }
		});

        const docenti = await SARP.Utente.findMany({
			orderBy: [{ cognome: 'asc' }],
			where: {
                tipo: 'DOCENTE'
            },
            include: {
                ruoli: true,
                classe: true
            } 
		});

		// restituisco il risultato della query SQL
		return {
			classi,
            docenti
		}
	} catch (exception) {
        catch_error(exception, "la ricerca", 100);
	}

}

export const actions = {
	update: async ({ cookies, request, locals }) => {
        let action = 'update';

        route_protect(locals);
        access_protect(1202, locals, action, resource);

		const form_data = await request.formData();
        
        SARP.set_session(locals); // passa la sessione all'audit
		try {
            await SARP.classe.update({
                where: { id: +form_data.get('id') },
				data: {
                    coordinatoreId: +form_data.get('tutor')
                }
            });
		} catch (exception) {
            // @ts-ignore
            if(exception.code != "P2002")
                catch_error(exception, "l'aggiornamento", 102);
            else
                return fail(400, { error_mex: "Classe non univoca" });   // La richiesta fallisce
		}
	}
};
