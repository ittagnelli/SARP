import { PrismaClient } from '@prisma/client';

// Istanzia il client per il SARP
const SARP = new PrismaClient();


export async function load({ params }) {
	// query SQL al DB per tutte le entry nella tabella valutazioni
	const valutation = await SARP.pcto_Valutazione.findMany();
	const companies_raw = await SARP.pcto_Azienda.findMany();	// Get all companies, we need for the modal and if present for valutation

	let valutations = [];
	let companies = [];

	for(let i = 0; i < valutation.length; i++) {	// foreach don't work with array.push
		const pcto = await SARP.pcto_Pcto.findUnique({	// Get single PCTO contract from valutation, we need this to get company name
			where: {
				id: valutation[i].idPcto
			}
		});
		
		const autor = await SARP.utente.findUnique({	// Get the autor
			where: {
				id: valutation[i].idUtente
			}
		})

		let company_name = "";

		companies_raw?.forEach(company => {
			if(company.id == pcto?.idAzienda)
				company_name = company.nome;
		});

		valutations.push({					// Push name in array
				nome: company_name,
				valutation: valutation[i].voto,
				valutatore: valutation[i].valutatore,
				autore: `${autor?.cognome} ${autor?.nome}`,
				id: [valutation[i].idUtente, valutation[i].idPcto, valutation[i].valutatore]
		});
		//      id:{	// Object doesn't work so I use an array
		// 			id_utente: ,
		// 			id_pcto: ,
		// 			valutatore: 
		// 		}

	}

	const pctos = await SARP.pcto_Pcto.findMany();

	for(let i = 0; i < pctos.length; i++) {	// foreach don't work with array.push
		companies_raw?.forEach(company => {
			if(company.id == pctos[i].idAzienda){
				companies.push({
					id: pctos[i].id,	// id of PCTO
					nome: company?.nome
				});
			}
		});
	}

	return {
		val: valutations,
		companies: companies
	};
}

export const actions = {
	create: async ({ cookies, request }) => {
		const form_data = await request.formData();
		const voto = form_data.get('voto');	// We need to cast it to a number, so declare as variable and then cast it 
		const id_pcto = form_data.get('id_pcto');

		await SARP.pcto_Valutazione.create({
			data: {
				voto: parseInt(voto),
				valutatore: form_data.get('valutatore'),
				idPcto: parseInt(id_pcto),
				idUtente: 1	// Default user, we need to change this
			}
		});
	},

	update: async ({ cookies, request }) => {
		const form_data = await request.formData();
		const ids_raw = form_data.get('ids').split(',');
		const old_ids_raw = form_data.get('old_ids').split(',');

		const voto = form_data.get('voto');	// We need to cast it to a number, so declare as variable and then cast it 

		await SARP.pcto_Valutazione.update({
			where: { 
				idUtente_idPcto_valutatore: {
					idUtente: parseInt(old_ids_raw[0]),	// This index is a string by default so we need to convert it to a number
					idPcto: parseInt(old_ids_raw[1]),
					valutatore: old_ids_raw[2]
				},
			},
			data: {
				voto: parseInt(voto),
				valutatore: ids_raw[2],
				idPcto: parseInt(ids_raw[1]),
				idUtente: parseInt(ids_raw[0])	
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
