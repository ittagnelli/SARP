import { PrismaClient } from '@prisma/client';

// Istanzia il client per il SARP
const SARP = new PrismaClient();


export async function load({ params }) {
	// query SQL al DB per tutte le entry nella tabella todo
	const stages = await SARP.pcto_Pcto.findMany({
		orderBy: [{ id: 'desc' }],
        include: {
			offertoDa: true,
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
}

export const actions = {
	create: async ({ cookies, request }) => {
		const form_data = await request.formData();

        console.log(form_data);
        console.log(form_data.get('studenti'))
        let studenti = form_data.get('studenti').split(',')
        let ids = [];
        studenti.forEach(element => {
            ids.push({id: +element})
        });
        console.log("IDS:", ids)
        

		await SARP.pcto_Pcto.create({
			data: {
                titolo: form_data.get('titolo'),
                descrizione: form_data.get('descrizione'),
				dataInizio: new Date(form_data.get('data_inizo')),
				dataFine: new Date(form_data.get('data_fine')),
                idAzienda: +form_data.get('azienda'),
                // svoltoDa: {
                //     connect: [{id: 15189}, {id: 15191}]
                // }
                svoltoDa: {
                    connect: ids
                }
			}
		});
	},

	update: async ({ cookies, request }) => {
		const form_data = await request.formData();
		let id = form_data.get('id');

        console.log(form_data)
		await SARP.pcto_Pcto.update({
			where: { id: +id },
			data: {
                titolo: form_data.get('titolo'),
                descrizione: form_data.get('descrizione'),
				dataInizio: new Date(form_data.get('data_inizo')),
				dataFine: new Date(form_data.get('data_fine')),
                idAzienda: +form_data.get('azienda')
			}
		});
	},

	delete: async ({ cookies, request }) => {
		const form_data = await request.formData();
		const id = form_data.get('id');

		await SARP.pcto_Pcto.delete({
			where: { id: +id }
		});
	}
};
