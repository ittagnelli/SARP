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
	// create: async ({ cookies, request }) => {
	// 	const form_data = await request.formData();

    //     console.log(form_data);

	// 	await SARP.pcto_Pcto.create({
	// 		data: {
    //             titolo: form_data.get('titolo'),
    //             descrizione: form_data.get('descrizione'),
	// 			dataInizio: new Date(form_data.get('data_inizo')),
	// 			dataFine: new Date(form_data.get('data_fine')),
    //             idAzienda: +form_data.get('azienda')
	// 		}
	// 	});
	// },

	// update: async ({ cookies, request }) => {
	// 	const form_data = await request.formData();
	// 	let id = form_data.get('id');

    //     console.log(form_data)
	// 	await SARP.pcto_Pcto.update({
	// 		where: { id: +id },
	// 		data: {
    //             titolo: form_data.get('titolo'),
    //             descrizione: form_data.get('descrizione'),
	// 			dataInizio: new Date(form_data.get('data_inizo')),
	// 			dataFine: new Date(form_data.get('data_fine')),
    //             idAzienda: +form_data.get('azienda')
	// 		}
	// 	});
	// },

	// delete: async ({ cookies, request }) => {
	// 	const form_data = await request.formData();
	// 	const id = form_data.get('id');

	// 	await SARP.pcto_Pcto.delete({
	// 		where: { id: +id }
	// 	});
	// }
};
