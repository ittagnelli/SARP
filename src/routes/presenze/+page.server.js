import { PrismaClient } from '@prisma/client';

// Istanzia il client per il SARP
const SARP = new PrismaClient();


export async function load({ params }) {
	// query SQL al DB per tutte le entry nella tabella todo
	const presenze = await SARP.pcto_Presenza.findMany({
		orderBy: [{ id: 'desc' }],
        include: {
			presenza: true,
            lavoraPer: true
		}
	});

    console.log(presenze)

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
	create: async ({ cookies, request }) => {
		const form_data = await request.formData();

        console.log(form_data)

        let hh_inizio = form_data.get('oraInizio').split(':')[0];
        let mm_inizio = form_data.get('oraInizio').split(':')[1];
        let hh_fine = form_data.get('oraFine').split(':')[0];
        let mm_fine = form_data.get('oraFine').split(':')[1];
        
          
		await SARP.pcto_Presenza.create({
			data: {
                dataPresenza: new Date(form_data.get('dataPresenza')),
                oraInizio: new Date(1970, 1, 1, hh_inizio, mm_inizio),
                oraFine: new Date(1970,1 ,1, hh_fine, mm_fine),
                idUtente: +form_data.get('studente'),
                idPcto: +form_data.get('stage')
			}
		});
	},

	update: async ({ cookies, request }) => {
		const form_data = await request.formData();
		let id = form_data.get('id');

        console.log(form_data)

        let hh_inizio = form_data.get('oraInizio').split(':')[0];
        let mm_inizio = form_data.get('oraInizio').split(':')[1];
        let hh_fine = form_data.get('oraFine').split(':')[0];
        let mm_fine = form_data.get('oraFine').split(':')[1];
        
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
	},

	delete: async ({ cookies, request }) => {
		const form_data = await request.formData();
		const id = form_data.get('id');

		await SARP.pcto_Presenza.delete({
			where: { id: +id }
		});
	}
};
