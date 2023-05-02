import { PrismaDB } from '$js/prisma_db';
import { route_protect, user_id, multi_user_where, raise_error, access_protect  } from '$js/helper';
import { Logger } from '$js/logger';
import { PrismaClientValidationError } from '@prisma/client/runtime';

let logger = new Logger("server"); //instanzia il logger
const SARP = new PrismaDB(); //Istanzia il client SARP DB
let resource = "pcto_stage"; // definisco il nome della risorsa di questo endpoint

// @ts-ignore
function catch_error(exception, type, code) {
    if(exception instanceof PrismaClientValidationError)
        logger.error(exception.message);
    else {  
        logger.error(JSON.stringify(exception));
        logger.error(exception.message);
        logger.error(exception.stack);
    }
    raise_error(500, code, `Errore irreversibile durante ${type} dello stage. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`); // TIMESTAMP ci serve per capire l'errore all'interno del log
}


export async function load({ locals }) {
    let action = 'read';

    route_protect(locals);
    access_protect(500, locals, action, resource);

    try {
        // query SQL al DB per tutte le entry nella tabella todo
        const stages = await SARP.pcto_Pcto.findMany({
            orderBy: [{ anno_scolastico: 'desc' }],
            where: multi_user_where(locals), 
            include: {
                offertoDa: true,
                svoltoDa: true,
                tutor_scolastico: true
            }
        });

        const companies = await SARP.pcto_Azienda.findMany({
            orderBy: [{ nome: 'asc' }]
        });

        const utenti = await SARP.Utente.findMany({
            orderBy: [{ id: 'desc' }],
            include: {ruoli: true}
        });

        const classi = await SARP.classe.findMany();

        // restituisco il risultato della query SQL
        return {
            stages: stages,
            companies: companies,
            utenti: utenti,
            classi: classi
        }
    } catch (exception) {
        catch_error(exception, "la ricerca", 300);
    }
}

export const actions = {
	create: async ({ cookies, request, locals }) => {
        let action = 'create';

        route_protect(locals);
        access_protect(501, locals, action, resource);

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
                    anno_scolastico: +form_data.get('anno_scolastico'),
                    contabilizzato: form_data.get('contabilizzato') == "SI" ? true : false,
                    tutor_aziendale: form_data.get('tutor_aziendale'),
                    idTutor: +form_data.get('tutor_scolastico'),
                    dataInizio: new Date(form_data.get('dataInizio')),
                    dataFine: new Date(form_data.get('dataFine')),
                    durata_ore: +form_data.get('durata_ore'),
                    idAzienda: +form_data.get('azienda'),
                    idClasse: +form_data.get('classe'),
                    svoltoDa: {
                        connect: ids
                    },
                    firma_pcto: form_data.get('firma_pcto') == "SI" ? true : false,
                    task1: form_data.get('task1'),
                    task2: form_data.get('task2'),
                    task3: form_data.get('task3'),
                    task4: form_data.get('task4')
                }
            });
        } catch (exception) {
            catch_error(exception, "l'inserimento", 301)
        }

	},

	update: async ({ cookies, request, locals }) => {
        let action = 'update';

        route_protect(locals);
        access_protect(502, locals, action, resource);

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
                    anno_scolastico: +form_data.get('anno_scolastico'),
                    contabilizzato: form_data.get('contabilizzato') == "SI" ? true : false,
                    tutor_aziendale: form_data.get('tutor_aziendale'),
                    idTutor: +form_data.get('tutor_scolastico'),
                    dataInizio: new Date(form_data.get('dataInizio')),
                    dataFine: new Date(form_data.get('dataFine')),
                    durata_ore: +form_data.get('durata_ore'),
                    idAzienda: +form_data.get('azienda'),
                    idClasse: +form_data.get('classe'),
                    svoltoDa: {
                        set: ids
                    },
                    firma_pcto: form_data.get('firma_pcto') == "SI" ? true : false,
                    task1: form_data.get('task1'),
                    task2: form_data.get('task2'),
                    task3: form_data.get('task3'),
                    task4: form_data.get('task4')
                }
            });
        } catch (exception) {
            catch_error(exception, "l'aggiornamento", 302);
        }

	},

	delete: async ({ cookies, request, locals }) => {
        let action = 'delete';

        route_protect(locals);
        access_protect(503, locals, action, resource);

		const form_data = await request.formData();
		const id = form_data.get('id');

        SARP.set_session(locals); // passa la sessione all'audit
        try {
            await SARP.pcto_Pcto.delete({
                where: { id: +id }
            });       
        } catch (exception) {
            catch_error(exception, "l'eliminazione", 303);
        }

	}
};
