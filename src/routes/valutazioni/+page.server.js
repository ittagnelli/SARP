import { PrismaDB } from '../../js/prisma_db';
import { route_protect } from '../../js/helper';
import { Logger } from '../../js/logger';

let logger = new Logger("seerver"); //instanzia il logger
const SARP = new PrismaDB(); //Istanzia il client SARP DB

export async function load({ locals }) {
    route_protect(locals);

	// query SQL al DB per tutte le entry nella tabella valutazioni
	const valutations = await SARP.pcto_Valutazione.findMany({
		include: {
			utente: true,
			pcto: true
		}
	});
    const pcto = await SARP.pcto_Pcto.findMany();
	// const companies = await SARP.pcto_Azienda.findMany();

	valutations.forEach(val => {
    //     const company = pcto.filter(company => company.id == val.pcto.idAzienda)[0];
	// 	// @ts-ignore
    //     val["company"] = company.nome;
	});

    return { vals: valutations, stages: pcto };

}

export const actions = {
	create: async ({ cookies, request }) => {
        const form_data = await request.formData();
		const id_pcto = form_data.get('id_pcto');
        const answers = form_data.get('answers');

        SARP.set_session(locals); // passa la sessione all'audit
		await SARP.pcto_Valutazione.create({
            data: {
				idPcto: parseInt(id_pcto),
                idUtente: 1,	// Default user, we need to change this
                risposte: answers
			}
		});
	},

	update: async ({ cookies, request, locals }) => {
		const form_data = await request.formData();
        let id = form_data.get('id');
        const id_pcto = form_data.get('id_pcto');
        const answers = form_data.get('answers');

        SARP.set_session(locals); // passa la sessione all'audit
		await SARP.pcto_Valutazione.update({
            where: { id: +id },
            data: {
                idPcto: parseInt(id_pcto),
                idUtente: 1,	// Default user, we need to change this
                risposte: answers
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
