import { PrismaDB } from '$js/prisma_db';
import { route_protect,user_id, pcto_valutazione_studenti_where, raise_error, access_protect } from '$js/helper';
import { Logger } from '$js/logger';
import { PrismaClientValidationError } from '@prisma/client/runtime';

let logger = new Logger("server"); //instanzia il logger
const SARP = new PrismaDB(); //Istanzia il client SARP DB
let resource = "pcto_valutazione_studenti"; // definisco il nome della risorsa di questo endpoint

// @ts-ignore
function catch_error(exception, type, code) {
    if(exception instanceof PrismaClientValidationError)
        logger.error(exception.message);
    else {  
        logger.error(JSON.stringify(exception));
        logger.error(exception.message);
        logger.error(exception.stack);
    }
    raise_error(500, code, `Errore irreversibile durante ${type} della valutazione. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`);    // TIMESTAMP ci serve per capire l'errore all'interno del log
}

export async function load({ locals }) {
    let action = 'read';

    route_protect(locals);
    access_protect(800, locals, action, resource);

    try {
        // query SQL al DB per tutte le entry nella tabella valutazioni
        const evaluations = await SARP.pcto_Valutazione_Studente.findMany({
            orderBy: [{ id: 'desc' }],
            where: pcto_valutazione_studenti_where(locals),
            include: {
                stagista: true,
                pcto: {
                    include: {
                        offertoDa: true
                    }
                }
            }
        });

        const pcto = await SARP.pcto_Pcto.findMany({
            where: {
                tutor_aziendale: `${locals.session.login.cognome} ${locals.session.login.nome}`
            },
            include: {
                svoltoDa: true
            }
        });

        return { valutazioni: evaluations, stages: pcto };
    } catch (exception) {
        catch_error(exception, "la ricerca", 1000);
    }
}

export const actions = {
    create: async ({ cookies, request, locals }) => {
        let action = 'create';

        route_protect(locals);
        access_protect(1001, locals, action, resource);

        const form_data = await request.formData();
        const id_pcto = form_data.get('id_pcto');
        const id_studente = form_data.get('studente');
        const valutazione = form_data.get('valutazione');

        SARP.set_session(locals); // passa la sessione all'audit
        try {
            await SARP.pcto_Valutazione_Studente.create({
                data: {
                    creatoDa: user_id(locals),
                    idPcto: +id_pcto,
                    idStagista: +id_studente,
                    valutazione: valutazione
                }
            });
        } catch (exception) {
            catch_error(exception, "l'inserimento", 1002);
        }
	},

	update: async ({ cookies, request, locals }) => {
        let action = 'update';

        route_protect(locals);
        access_protect(1003, locals, action, resource);

		const form_data = await request.formData();
        let id = form_data.get('id');
        const id_pcto = form_data.get('id_pcto');
        const id_studente = form_data.get('studente');
        const valutazione = form_data.get('valutazione');

        SARP.set_session(locals); // passa la sessione all'audit
        try {
            await SARP.pcto_Valutazione_Studente.update({
                where: { id: +id },
                data: {
                    creatoDa: user_id(locals),
                    valutazione: valutazione
                }
            });        
        } catch (exception) {
            catch_error(exception, "la modifica", 1004);
        }
	},

	delete: async ({ cookies, request, locals }) => {
        let action = 'delete';

        route_protect(locals);
        access_protect(1005, locals, action, resource);

		const form_data = await request.formData();
        const id = form_data.get('id');

        SARP.set_session(locals); // passa la sessione all'audit
        try {
            await SARP.pcto_Valutazione_Studente.delete({
                where: { id: +id }
            });  
        } catch (exception) {
            catch_error(exception, "l'eliminazione", 1006);
        }
	}
};
