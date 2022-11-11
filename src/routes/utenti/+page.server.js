import { PrismaClient } from '@prisma/client';

// Istanzia il client per il SARP
const SARP = new PrismaClient();


export async function load({ params }) {
	// query SQL al DB per tutte le entry nella tabella todo
	const users = await SARP.Utente.findMany({
		orderBy: [{ id: 'desc' }]
	});

	// restituisco il risultato della query SQL
	return users;
}

export const actions = {
	create: async ({ cookies, request }) => {
		const form_data = await request.formData();

        console.log("UTENTE:", form_data);

		await SARP.Utente.create({
			data: {
				nome: form_data.get('nome'),
                cognome: form_data.get('cognome'),
                email: form_data.get('email'),
                tipo: form_data.get('tipo'),
                ruolo: form_data.get('ruolo'),
                istituto: form_data.get('istituto')
			}
		});
	},

	update: async ({ cookies, request }) => {
		const form_data = await request.formData();
		let id = form_data.get('id');

		await SARP.Utente.update({
			where: { id: +id },
			data: {
				nome: form_data.get('nome'),
                cognome: form_data.get('cognome'),
                email: form_data.get('email'),
                tipo: form_data.get('tipo'),
                ruolo: form_data.get('ruolo'),
                istituto: form_data.get('istituto')
			}
		});
	},

	delete: async ({ cookies, request }) => {
		const form_data = await request.formData();
		const id = form_data.get('id');

        console.log("USER ID:", id)

		await SARP.Utente.delete({
			where: { id: +id }
		});
	}
};
