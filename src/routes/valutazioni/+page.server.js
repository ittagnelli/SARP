import { PrismaDB } from '../../js/prisma_db';
import { route_protect,user_id, multi_user_where } from '../../js/helper';
import { Logger } from '../../js/logger';

let logger = new Logger("server"); //instanzia il logger
const SARP = new PrismaDB(); //Istanzia il client SARP DB

export async function load({ locals }) {
    route_protect(locals);

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
}

export const actions = {
    create: async ({ cookies, request, locals }) => {
        const form_data = await request.formData();
        const id_pcto = form_data.get('id_pcto');
        const qna = form_data.get('qna');

        SARP.set_session(locals); // passa la sessione all'audit
		await SARP.pcto_Valutazione.create({
            data: {
                creatoDa: user_id(locals),
				idPcto: +id_pcto,
                qna: qna
			}
		});
	},

	update: async ({ cookies, request, locals }) => {
		const form_data = await request.formData();
        let id = form_data.get('id');
        const id_pcto = form_data.get('id_pcto');
        const qna = form_data.get('qna');

        SARP.set_session(locals); // passa la sessione all'audit
		await SARP.pcto_Valutazione.update({
            where: { id: +id },
            data: {
                idPcto: +id_pcto,
                qna: qna
			}
		});
	},

	delete: async ({ cookies, request, locals }) => {
		const form_data = await request.formData();
        const id = form_data.get('id');

        SARP.set_session(locals); // passa la sessione all'audit
        await SARP.pcto_Valutazione.delete({
            where: { id: +id }
		});
		
	}
};
