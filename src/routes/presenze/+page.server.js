import { PrismaDB } from '../../js/prisma_db';
import { route_protect, user_id, pcto_presenze_where, raise_error, access_protect } from '../../js/helper';
import { Logger } from '../../js/logger';
import { PrismaClientValidationError } from '@prisma/client/runtime';

let logger = new Logger("server"); //instanzia il logger
const SARP = new PrismaDB(); //Istanzia il client SARP DB
let resource = "pcto_presenze"; // definisco il nome della risorsa di questo endpoint

// @ts-ignore
function catch_error(exception, type, code) {
    if(exception instanceof PrismaClientValidationError)
        logger.error(exception.message);
    else {  
        logger.error(JSON.stringify(exception));
        logger.error(exception.message);
        logger.error(exception.stack);
    }
    raise_error(500, code, `Errore irreversibile durante ${type} della presenza. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`);    // TIMESTAMP ci serve per capire l'errore all'interno del log
}

export async function load({ locals }) {
    let action = 'read';

    route_protect(locals);
    access_protect(400, locals, action, resource);
   
    try {
		// query SQL al DB per tutte le entry nella tabella todo
		const presenze = await SARP.pcto_Presenza.findMany({
			orderBy: [{ id: 'desc' }],
			where: pcto_presenze_where(locals), 
			include: {
				presenza: true,
				lavoraPer: true
			}
		});

        const stages = await SARP.pcto_Pcto.findMany({
			orderBy: [{ id: 'desc' }],
			include: {
				offertoDa: true,
				svoltoDa: true
			}
		});
	
		// restituisco il risultato della query SQL
		return {
			presenze: presenze,
			stages: stages
		}
	} catch (exception) {
        catch_error(exception, "load", 400) ;
	}
}

export const actions = {
	create: async ({ cookies, request, locals }) => {
        let action = 'create';

        route_protect(locals);
        access_protect(401, locals, action, resource);

		const form_data = await request.formData();
        let hh_inizio = form_data.get('oraInizio').split(':')[0];
        let mm_inizio = form_data.get('oraInizio').split(':')[1];
        let hh_fine = form_data.get('oraFine').split(':')[0];
        let mm_fine = form_data.get('oraFine').split(':')[1];
        
        SARP.set_session(locals); // passa la sessione all'audit
		try {
            logger.debug(+form_data.get('studente'));
			await SARP.pcto_Presenza.create({
				data: {
					creatoDa: user_id(locals),
					dataPresenza: new Date(form_data.get('dataPresenza')),
					oraInizio: new Date(1970, 1, 1, hh_inizio, mm_inizio),
					oraFine: new Date(1970,1 ,1, hh_fine, mm_fine),
					svoltoDa: +form_data.get('studente'),
					idPcto: +form_data.get('stage'),
                    approvato: form_data.get('approvato') == "SI" ? true : false
				}
			});	
		} catch (exception) {
			catch_error(exception, "l'inserimento", 401);
		}
	},

	update: async ({ cookies, request, locals }) => {
        let action = 'update';

        route_protect(locals);
        access_protect(402, locals, action, resource);

		const form_data = await request.formData();
		let id = form_data.get('id');
        let hh_inizio = form_data.get('oraInizio').split(':')[0];
        let mm_inizio = form_data.get('oraInizio').split(':')[1];
        let hh_fine = form_data.get('oraFine').split(':')[0];
        let mm_fine = form_data.get('oraFine').split(':')[1];
        
        SARP.set_session(locals); // passa la sessione all'audit
		try {
			await SARP.pcto_Presenza.update({
				where: { id: +id },
				data: {
					dataPresenza: new Date(form_data.get('dataPresenza')),
					oraInizio: new Date(1970, 1, 1, hh_inizio, mm_inizio),
					oraFine: new Date(1970,1 ,1, hh_fine, mm_fine),
					svoltoDa: +form_data.get('studente'),
					idPcto: +form_data.get('stage'),
                    approvato: form_data.get('approvato') == "SI" ? true : false
				}
			});
		} catch (exception) {
			catch_error(exception, "l'aggiornamento", 402)
		}
	},

	delete: async ({ cookies, request, locals }) => {
        let action = 'delete';

        route_protect(locals);
        access_protect(403, locals, action, resource);


		const form_data = await request.formData();
		const id = form_data.get('id');

        SARP.set_session(locals); // passa la sessione all'audit
		try {
			await SARP.pcto_Presenza.delete({
				where: { id: +id }
			});
		} catch (exception) {
			catch_error(exception, "l'eliminazione", 403);
		}
	}
};
