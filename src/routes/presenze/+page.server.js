import { PrismaDB } from '../../js/prisma_db';
import { raise_error, route_protect } from '../../js/helper';
import { Logger } from '../../js/logger';

let logger = new Logger("server"); //instanzia il logger
const SARP = new PrismaDB(); //Istanzia il client SARP DB

// @ts-ignore
function catch_error(exception, type) {
    logger.error(JSON.stringify(exception)); //PROF: error è un oggetto ma serve qualcosa di più complicato. per il momento lascialo così. ho gia risolto in hooks nella versione 9.0
    raise_error(500, 100, `Errore irreversibile durante ${type} della presenza. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`);    // TIMESTAMP ci serve per capire l'errore all'interno del log
}

export async function load({ locals }) {
    route_protect(locals);
	try {
		// query SQL al DB per tutte le entry nella tabella todo
		const presenze = await SARP.pcto_Presenza.findMany({
			orderBy: [{ id: 'desc' }],
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
	} catch (error) {
		logger.error(JSON.stringify(exception)); //PROF: error è un oggetto ma serve qualcosa di più complicato. per il momento lascialo così. ho gia risolto in hooks nella versione 9.0
		raise_error(500, 100, `Errore durante la ricerca delle presenze. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`);    // TIMESTAMP ci serve per capire l'errore all'interno del log
	}

}

export const actions = {
	create: async ({ cookies, request, locals }) => {
		const form_data = await request.formData();
        let hh_inizio = form_data.get('oraInizio').split(':')[0];
        let mm_inizio = form_data.get('oraInizio').split(':')[1];
        let hh_fine = form_data.get('oraFine').split(':')[0];
        let mm_fine = form_data.get('oraFine').split(':')[1];
        
        SARP.set_session(locals); // passa la sessione all'audit
		try {
			await SARP.pcto_Presenza.create({
				data: {
					dataPresenza: new Date(form_data.get('dataPresenza')),
					oraInizio: new Date(1970, 1, 1, hh_inizio, mm_inizio),
					oraFine: new Date(1970,1 ,1, hh_fine, mm_fine),
					idUtente: +form_data.get('studente'),
					idPcto: +form_data.get('stage')
				}
			});			
		} catch (error) {
			catch_error(error, "l'inserimento");
		}

	},

	update: async ({ cookies, request, locals }) => {
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
					idUtente: +form_data.get('studente'),
					idPcto: +form_data.get('stage')
				}
			});	
		} catch (error) {
			catch_error(error, "l'aggiornamento")
		}
	},

	delete: async ({ cookies, request, locals }) => {
		const form_data = await request.formData();
		const id = form_data.get('id');

        SARP.set_session(locals); // passa la sessione all'audit
		try {
			await SARP.pcto_Presenza.delete({
				where: { id: +id }
			});
		} catch (error) {
			catch_error(error, "l'eliminazione");
		}
	}
};
