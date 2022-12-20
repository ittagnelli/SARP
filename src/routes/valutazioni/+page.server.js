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

	const companies = await SARP.pcto_Azienda.findMany();

	valutations.forEach(val => {
		const company = companies.filter(company => company.id == val.pcto.idAzienda)[0];
		// @ts-ignore
		val["company"] = company.nome;
	});

	return { vals: valutations, companies: companies };

}

export const actions = {
	create: async ({ cookies, request, locals }) => {
		const form_data = await request.formData();
		const voto = form_data.get('voto');	// We need to cast it to a number, so declare as variable and then cast it 
		const id_pcto = form_data.get('id_pcto');

        SARP.set_session(locals); // passa la sessione all'audit
		await SARP.pcto_Valutazione.create({
			data: {
				voto: parseInt(voto),
				valutatore: form_data.get('valutatore'),
				idPcto: parseInt(id_pcto),
				idUtente: 1	// Default user, we need to change this
			}
		});
	},

	update: async ({ cookies, request, locals }) => {
		const form_data = await request.formData();
		const ids_raw = form_data.get('ids').split(',');
		const old_ids_raw = form_data.get('old_ids').split(',');

		const voto = form_data.get('voto');	// We need to cast it to a number, so declare as variable and then cast it 

        SARP.set_session(locals); // passa la sessione all'audit
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

	delete: async ({ cookies, request, locals }) => {
		const form_data = await request.formData();

        // array from form data is a string without brackets so we parse it
        // index 0 = id_utente, 1 = id_pcto, 2 = valutatore
		const raw_data = form_data.get('id').split(',');	 
												
        SARP.set_session(locals); // passa la sessione all'audit
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
