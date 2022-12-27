import { PrismaDB } from '../../js/prisma_db';
import { route_protect, user_id, multi_user_where } from '../../js/helper';
import { Logger } from '../../js/logger';

let logger = new Logger("seerver"); //instanzia il logger
const SARP = new PrismaDB(); //Istanzia il client SARP DB

export async function load({ locals }) {
    route_protect(locals);

	// query SQL al DB per tutte le entry nella tabella todo
	const presenze = await SARP.pcto_Presenza.findMany({
		orderBy: [{ id: 'desc' }],
        where: multi_user_where(locals), 
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
}

export const actions = {
	create: async ({ cookies, request, locals }) => {
		const form_data = await request.formData();
        let hh_inizio = form_data.get('oraInizio').split(':')[0];
        let mm_inizio = form_data.get('oraInizio').split(':')[1];
        let hh_fine = form_data.get('oraFine').split(':')[0];
        let mm_fine = form_data.get('oraFine').split(':')[1];
        
        SARP.set_session(locals); // passa la sessione all'audit
		await SARP.pcto_Presenza.create({
			data: {
                creatoDa: user_id(locals),
                dataPresenza: new Date(form_data.get('dataPresenza')),
                oraInizio: new Date(1970, 1, 1, hh_inizio, mm_inizio),
                oraFine: new Date(1970,1 ,1, hh_fine, mm_fine),
                idPcto: +form_data.get('stage')
			}
		});
	},

	update: async ({ cookies, request, locals }) => {
		const form_data = await request.formData();
		let id = form_data.get('id');
        let hh_inizio = form_data.get('oraInizio').split(':')[0];
        let mm_inizio = form_data.get('oraInizio').split(':')[1];
        let hh_fine = form_data.get('oraFine').split(':')[0];
        let mm_fine = form_data.get('oraFine').split(':')[1];
        
        SARP.set_session(locals); // passa la sessione all'audit
		await SARP.pcto_Presenza.update({
			where: { id: +id },
			data: {
                dataPresenza: new Date(form_data.get('dataPresenza')),
                oraInizio: new Date(1970, 1, 1, hh_inizio, mm_inizio),
                oraFine: new Date(1970,1 ,1, hh_fine, mm_fine),
                idPcto: +form_data.get('stage')
			}
		});
	},

	delete: async ({ cookies, request, locals }) => {
		const form_data = await request.formData();
		const id = form_data.get('id');

        SARP.set_session(locals); // passa la sessione all'audit
		await SARP.pcto_Presenza.delete({
			where: { id: +id }
		});
	}
};
