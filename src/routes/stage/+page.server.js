import { PrismaDB } from '../../js/prisma_db';
import { route_protect, user_id, multi_user_where, raise_error  } from '../../js/helper';
import { Logger } from '../../js/logger';

let logger = new Logger("server"); //instanzia il logger
const SARP = new PrismaDB(); //Istanzia il client SARP DB

// @ts-ignore
function catch_error(exception, type) {
    logger.error(JSON.stringify(exception)); //PROF: error è un oggetto ma serve qualcosa di più complicato. per il momento lascialo così. ho gia risolto in hooks nella versione 9.0
    raise_error(500, 100, `Errore irreversibile durante ${type} dello stage. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`); // TIMESTAMP ci serve per capire l'errore all'interno del log
}


export async function load({ locals }) {
    route_protect(locals);
    try {
        // query SQL al DB per tutte le entry nella tabella todo
        const stages = await SARP.pcto_Pcto.findMany({
            orderBy: [{ id: 'desc' }],
            where: multi_user_where(locals), 
            include: {
                offertoDa: true,
                svoltoDa: true
            }
        });

        const companies = await SARP.pcto_Azienda.findMany({
            orderBy: [{ id: 'desc' }]
        });

        const utenti = await SARP.Utente.findMany({
            orderBy: [{ id: 'desc' }]
        });

        // restituisco il risultato della query SQL
        return {
            stages: stages,
            companies: companies,
            utenti: utenti
        }
    } catch (error) {
        logger.error(JSON.stringify(error)); //PROF: error è un oggetto ma serve qualcosa di più complicato. per il momento lascialo così. ho gia risolto in hooks nella versione 9.0
		raise_error(500, 100, `Errore durante la ricerca degli stage. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`);    // TIMESTAMP ci serve per capire l'errore all'interno del log
    }
}

export const actions = {
	create: async ({ cookies, request, locals }) => {
		const form_data = await request.formData();

        let studenti = form_data.get('studenti').split(',')
        let ids = [];
        
        if(studenti != '') {
            studenti.forEach(element => {
                ids.push({id: +element})
            });
        }

        SARP.set_session(locals); // passa la sessione all'audit
        try {
        await SARP.pcto_Pcto.create({
			data: {
                creatoDa: user_id(locals),
                titolo: form_data.get('titolo'),
                descrizione: form_data.get('descrizione'),
				tutor: form_data.get('tutor'),
                dataInizio: new Date(form_data.get('dataInizio')),
				dataFine: new Date(form_data.get('dataFine')),
                idAzienda: +form_data.get('azienda'),
                svoltoDa: {
                    connect: ids
                }
        }
    });
        } catch (error) {
            catch_error(error, "l'inserimento")
        }

	},

	update: async ({ cookies, request, locals }) => {
		const form_data = await request.formData();
		let id = form_data.get('id');
        let studenti = form_data.get('studenti').split(',');
        let ids = [];

        studenti.forEach(element => {
            if(+element > 0) ids.push({id: +element})
        });
        
        SARP.set_session(locals); // passa la sessione all'audit
        try {
            await SARP.pcto_Pcto.update({
                where: { id: +id },
                data: {
                    titolo: form_data.get('titolo'),
                    descrizione: form_data.get('descrizione'),
                    tutor: form_data.get('tutor'),
                    dataInizio: new Date(form_data.get('dataInizio')),
                    dataFine: new Date(form_data.get('dataFine')),
                    idAzienda: +form_data.get('azienda'),
                    svoltoDa: {
                        set: ids
                    }
                }
            });
        } catch (error) {
            catch_error(error, "l'aggiornamento");
        }

	},

	delete: async ({ cookies, request, locals }) => {
		const form_data = await request.formData();
		const id = form_data.get('id');

        SARP.set_session(locals); // passa la sessione all'audit
        try {
            await SARP.pcto_Pcto.delete({
                where: { id: +id }
            });       
        } catch (error) {
            catch_error(error, "l'eliminazione");
        }

	}
};
