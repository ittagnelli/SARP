import { PrismaClient } from '@prisma/client';

// Istanzia il client per il SARP
const SARP = new PrismaClient();


export async function load({ params }) {
	// query SQL al DB per tutte le entry nella tabella todo
	const valutation = await SARP.pcto_Valutazione.findMany();

	let valutations = [];

	for(let i = 0; i < valutation.length; i++) {	// foreach don't work with array.push
		const pcto = await SARP.pcto_Pcto.findUnique({	// Get single PCTO contract from valutation, we need this to get company name
			where: {
				id: valutation[i].idPcto
			}
		});
		
		const company = await SARP.pcto_Azienda.findUnique({	// Get company of PCTO
			where: {
				id: pcto?.idAzienda
			}
		});

		const autor = await SARP.utente.findUnique({	// Get the autor
			where: {
				id: valutation[i].idUtente
			}
		})

		valutations.push({					// Push name in array
				nome: company?.nome,
				valutation: valutation[i].voto,
				valutatore: valutation[i].valutatore,
				autore: `${autor?.cognome} ${autor?.nome}`,
				id: [valutation[i].idUtente, valutation[i].idPcto, valutation[i].valutatore]
		//      id:{	// Object don't work so I use an array
		// 			id_utente: ,
		// 			id_pcto: ,
		// 			valutatore: 
		// 		}
		});

	}

	return valutations;
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

		const raw_data = form_data.get('id').split(',');	// array from form data is a string without brackets so we parse it 
												// index 0 = id_utente, 1 = id_pcto, 2 = valutatore
		
												await SARP.pcto_Valutazione.delete({
			where: { 
				idUtente_idPcto_valutatore: {
					idUtente: parseInt(raw_data[0]),	// This index is a string by default so we need to convert it to a number
					idPcto: parseInt(raw_data[1]),
					valutatore: raw_data[2]
				}
			 }
		});
		
	}
};
