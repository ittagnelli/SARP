import { PrismaDB } from '../../js/prisma_db';
import { route_protect,user_id, multi_user_where, raise_error, access_protect } from '../../js/helper';
import { Logger } from '../../js/logger';

let logger = new Logger("server"); //instanzia il logger
const SARP = new PrismaDB(); //Istanzia il client SARP DB
let resource = "pcto_valutazioni"; // definisco il nome della risorsa di questo endpoint

// @ts-ignore
function catch_error(exception, type, code) {
    logger.error(JSON.stringify(exception)); //PROF: error è un oggetto ma serve qualcosa di più complicato. per il momento lascialo così. ho gia risolto in hooks nella versione 9.0
    raise_error(500, code, `Errore irreversibile durante ${type} della valutazione. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`);    // TIMESTAMP ci serve per capire l'errore all'interno del log
}

export async function load({ locals }) {
    let action = 'read';

    route_protect(locals);
    access_protect(800, locals, action, resource);

    try {
        // query SQL al DB per tutte le entry nella tabella valutazioni
        const evaluations = await SARP.pcto_Valutazione.findMany({
            orderBy: [{ id: 'desc' }],
            where: multi_user_where(locals),
            include: {
                utente: true,
                pcto: true
            }
        });
        const pcto = await SARP.pcto_Pcto.findMany();

        return { valutazioni: evaluations, stages: pcto };       
    } catch (error) {
        catch_error(error, "la ricerca", 500);
    }
}

export const actions = {
    create: async ({ cookies, request, locals }) => {
        let action = 'create';

        route_protect(locals);
        access_protect(801, locals, action, resource);

        const form_data = await request.formData();
        const id_pcto = form_data.get('id_pcto');
        const qna = form_data.get('qna');

        SARP.set_session(locals); // passa la sessione all'audit
        try {
            await SARP.pcto_Valutazione.create({
                data: {
                    creatoDa: user_id(locals),
                    idPcto: +id_pcto,
                    qna: qna
                }
            });
        } catch (error) {
            catch_error(error, "l'inserimento", 501);
        }
	},

	update: async ({ cookies, request, locals }) => {
        let action = 'update';

        route_protect(locals);
        access_protect(802, locals, action, resource);

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
                    qna: qna
                }
            });        
        } catch (error) {
            catch_error(error, "la modifica", 502);
        }
	},

	delete: async ({ cookies, request, locals }) => {
        let action = 'delete';

        route_protect(locals);
        access_protect(803, locals, action, resource);

		const form_data = await request.formData();
        const id = form_data.get('id');

        SARP.set_session(locals); // passa la sessione all'audit
        try {
            await SARP.pcto_Valutazione.delete({
                where: { id: +id }
            });  
        } catch (error) {
            catch_error(error, "l'eliminazione", 503);
        }
		
	}
};
