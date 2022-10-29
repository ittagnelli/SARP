import { PrismaClient } from '@prisma/client';

// Istanzia il client per il SARP
const SARP = new PrismaClient();


export async function load({ params }) {
	// query SQL al DB per tutte le entry nella tabella todo
	const companies = await SARP.pcto_Azienda.findMany({
		orderBy: [{ id: 'desc' }]
	});

	// restituisco il risultato della query SQL
	return companies;
}

export const actions = {
	create: async ({ cookies, request }) => {
		const form_data = await request.formData();

		await SARP.pcto_Azienda.create({
			data: {
				nome: form_data.get('azienda'),
				idConvenzione: form_data.get('no_convenzione'),
				idUtente: 1,
				dataConvenzione: new Date(form_data.get('data_convenzione')),
				dataProtocollo: new Date(form_data.get('data_protocollo')),
				istituto: form_data.get('istituto')
			}
		});
	},

	update: async ({ cookies, request }) => {
		const form_data = await request.formData();
		let id = form_data.get('id');

		await SARP.pcto_Azienda.update({
			where: { id: +id },
			data: {
				nome: form_data.get('azienda'),
				idConvenzione: form_data.get('no_convenzione'),
				idUtente: 1,
				dataConvenzione: new Date(form_data.get('data_convenzione')),
				dataProtocollo: new Date(form_data.get('data_protocollo')),
				istituto: form_data.get('istituto')
			}
		});
	},

	delete: async ({ cookies, request }) => {
		const form_data = await request.formData();
		const id = form_data.get('id');

		await SARP.pcto_Azienda.delete({
			where: { id: +id }
		});
	}
};
