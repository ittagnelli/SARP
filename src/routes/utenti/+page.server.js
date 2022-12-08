import { PrismaClient } from '@prisma/client';
import { route_protect } from '../../js/helper';

// Istanzia il client per il SARP
const SARP = new PrismaClient();


export async function load({ locals }) {
    route_protect(locals);
   
	// query SQL al DB per tutte le entry nella tabella todo
	const utenti = await SARP.Utente.findMany({
		orderBy: [{ id: 'desc' }]
	});

    const tipi_utente = await SARP.tipo_Utente.findMany({
        orderBy: [{ id: 'desc' }]
    });
    
    const ruoli_utente = await SARP.ruolo_Utente.findMany({
        orderBy: [{ id: 'desc' }]
    });

    console.log("LOAD UTENTI SERVER")
	// restituisco il risultato della query SQL
	return {
        utenti: utenti,
        tipi_utente: tipi_utente,
        ruoli_utente: ruoli_utente
    }
}

export const actions = {
	create: async ({ cookies, request }) => {
		const form_data = await request.formData();

		await SARP.Utente.create({
			data: {
				nome: form_data.get('nome'),
                cognome: form_data.get('cognome'),
                email: form_data.get('email'),
                telefono: form_data.get('telefono'),
                tipo: form_data.get('tipo'),
                ruolo: form_data.get('ruolo'),
                istituto: form_data.get('istituto'),
                bes: form_data.get('bes') == "SI" ? true : false
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
                telefono: form_data.get('telefono'),
                tipo: form_data.get('tipo'),
                ruolo: form_data.get('ruolo'),
                istituto: form_data.get('istituto'),
                bes: form_data.get('bes') == "SI" ? true : false
			}
		});
	},

	delete: async ({ cookies, request }) => {
		const form_data = await request.formData();
		const id = form_data.get('id');

		await SARP.Utente.delete({
			where: { id: +id }
		});
	}
};
