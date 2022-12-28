import { PrismaDB } from '../../js/prisma_db';
import { raise_error, route_protect } from '../../js/helper';
import { Logger } from '../../js/logger';

let logger = new Logger("server"); //instanzia il logger
const SARP = new PrismaDB(); //Istanzia il client SARP DB

// @ts-ignore
function catch_error(exception, type) {
    logger.error(JSON.stringify(exception)); //PROF: error è un oggetto ma serve qualcosa di più complicato. per il momento lascialo così. ho gia risolto in hooks nella versione 9.0
    raise_error(500, 100, `Errore irreversibile durante ${type} della valutazione. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`);    // TIMESTAMP ci serve per capire l'errore all'interno del log
}

export async function load({ locals }) {
    route_protect(locals);
    try {
        // query SQL al DB per tutte le entry nella tabella valutazioni
        const evaluations = await SARP.pcto_Valutazione.findMany({
            include: {
                utente: true,
                pcto: true
            }
        });
        const pcto = await SARP.pcto_Pcto.findMany();

        return { valutazioni: evaluations, stages: pcto };       
    } catch (error) {
        logger.error(JSON.stringify(exception)); //PROF: error è un oggetto ma serve qualcosa di più complicato. per il momento lascialo così. ho gia risolto in hooks nella versione 9.0
		raise_error(500, 100, `Errore durante la ricerca delle valutazioni. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`);    // TIMESTAMP ci serve per capire l'errore all'interno del log
    }

}

export const actions = {
    create: async ({ cookies, request, locals }) => {
        const form_data = await request.formData();
        const id_pcto = form_data.get('id_pcto');
        const qna = form_data.get('qna');

        SARP.set_session(locals); // passa la sessione all'audit
        try {
            await SARP.pcto_Valutazione.create({
                data: {
                    idPcto: +id_pcto,
                    idUtente: locals.session.login.id,
                    qna: qna
                }
            });
        } catch (error) {
            catch_error(error, "l'inserimento");
        }

	},

	update: async ({ cookies, request, locals }) => {
		const form_data = await request.formData();
        let id = form_data.get('id');
        const id_pcto = form_data.get('id_pcto');
        const qna = form_data.get('qna');

        SARP.set_session(locals); // passa la sessione all'audit
        try {
            await SARP.pcto_Valutazione.update({
                where: { id: +id },
                data: {
                    idPcto: +id_pcto,
                    idUtente: locals.session.login.id,	// Default user, we need to change this
                    qna: qna
                }
            });          
        } catch (error) {
            catch_error(error, "la modifica");
        }

	},

	delete: async ({ cookies, request, locals }) => {
		const form_data = await request.formData();
        const id = form_data.get('id');

        SARP.set_session(locals); // passa la sessione all'audit
        try {
            await SARP.pcto_Valutazione.delete({
                where: { id: +id }
            });  
        } catch (error) {
            catch_error(error, "l'eliminazione");
        }
		
	}
};
