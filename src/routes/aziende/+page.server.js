import { PrismaClient } from '@prisma/client';

// Istanzia il client per il SARP
const SARP = new PrismaClient();

export async function load({ params }) {
	// query SQL al DB per tutte le entry nella tabella todo
	const companies = await SARP.pCTO_Azienda.findMany({
        orderBy: [ { id: 'desc' } ]
    });

	// console.log('Query Aziende da SARP: ', companies);

	// restituisco il risultato della query SQL
	return companies;
}

/** @type {import('./$types').Actions} */
export const actions = {
	create: async ({ cookies, request }) => {
		console.log('SERVER REGISTER ACTION');
		const form_data = await request.formData();

		//     no_convenzione', value: '1' },
		// { name: 'azienda', value: 'aaaaaaaaaaa' },
		// { name: 'data_convenzione', value: '2022-10-14' },
		// { name: 'data_protocollo', value: '2022-10-07' },
		// { name: 'istituto', value: 'ITT' }

		await SARP.pCTO_Azienda.create({
			data: {
				nome: form_data.get('azienda'),
				idConvenzione: form_data.get('no_convenzione'),
				idUtente: 1,
				dataConvenzione: new Date(form_data.get('data_convenzione')),
				dataProtocollo: new Date(form_data.get('data_protocollo')),
				istituto: form_data.get('istituto')
			}
		});

		console.log('FORM DATA:', form_data);
	},
    update: async ({ cookies, request }) => {
        console.log("UPDATE LATO SERVER")
    },
	delete: async ({ cookies, request }) => {
		console.log('SERVER DELETE ACTION');
		const form_data = await request.formData();
		const id = form_data.get('id');

		console.log('TIPO:', typeof +id);

		await SARP.pCTO_Azienda.delete({
			where: { id: +id }
		});

		console.log('FORM DATA:', form_data.get('id'));
	}
	// create_todo: async ({ cookies, request }) => {
	// 	const form_data = await request.formData();
	// 	const todo_text = form_data.get('new-todo');

	//     // inserisco un nuovo todo nel DB
	// 	await DB.todo.create({
	// 		data: {
	// 			text: todo_text
	// 		}
	// 	});
	// 	console.log("Inserito nel DB il todo: ", todo_text);

	// 	return { success: true };
	// },
};
