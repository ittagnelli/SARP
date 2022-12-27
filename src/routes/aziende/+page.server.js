import { PrismaDB } from '../../js/prisma_db';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path from 'path';
import { redirect, fail, error } from '@sveltejs/kit';
import { route_protect, raise_error } from '../../js/helper'; //PROF: usa l'helper raise_erorr che ho cretao qualche settimana fa
import { Logger } from '../../js/logger';

let logger = new Logger("server"); //instanzia il logger PROF: qui deve essere server
const SARP = new PrismaDB(); //Istanzia il client SARP DB


export async function load({ locals }) {
    route_protect(locals);

    // query SQL al DB per tutte le entry nella tabella todo
	const companies = await SARP.pcto_Azienda.findMany({
		orderBy: [{ id: 'desc' }]
	});

	// restituisco il risultato della query SQL
    return {aziende: companies};
}

export const actions = {
	create: async ({ cookies, request, locals }) => {
		const form_data = await request.formData();

        SARP.set_session(locals); // passa la sessione all'audit
        try {
            await SARP.pcto_Azienda.create({
                data: {
                    idUtente: 3,
                    idConvenzione: form_data.get('idConvenzione'),
                    nome: form_data.get('nome'),
                    indirizzo: form_data.get('indirizzo'),
                    piva: form_data.get('piva'),
                    telefono: form_data.get('telefono'),
                    direttore_nome: form_data.get('direttore_nome'),
                    direttore_natoA: form_data.get('direttore_natoA'),
                    direttore_natoIl: new Date(form_data.get('direttore_natoIl')),
                    direttore_codiceF: form_data.get('direttore_codiceF'),
                    dataConvenzione: new Date(form_data.get('dataConvenzione')),
                    dataProtocollo: new Date(form_data.get('dataProtocollo')),
                    istituto: form_data.get('istituto')
                }
            });  
        } catch (exception) {
            if(exception.code != "P2002"){  // Errore diverso dalla violazione dell'unique
                logger.error(JSON.stringify(exception)); //PROF: error è un oggetto ma serve qualcosa di più complicato. per il momento lascialo così. ho gia risolto in hooks nella versione 9.0
                raise_error(500, 100, 'tuo codice e tuo mex'); //PROF: 500 errore http, 100 codice SARP univoco, messaggio: un messaggio chiaro. in questo modo nella pagina 500 gli utenti vedono codice e messaggio. ce lo dicono e noi becchiamo il punto esatoo dell'errore
                // return error(500);  // Redirect alla pagina 500 //PROF: da rimuovere
            }else
                //PROF: restituiamo anche messaggio di errore che viene aggiunto all'oggetto form
                return fail(400, { unique_violation: true, error_mex: "Numero convenzione non univoco" });   // La richiesta fallisce
        }

	},

	update: async ({ cookies, request, locals }) => {
		const form_data = await request.formData();
		let id = form_data.get('id');

        SARP.set_session(locals); // passa la sessione all'audit
		await SARP.pcto_Azienda.update({
			where: { id: +id },
			data: {
				idUtente: 3,
                idConvenzione: form_data.get('idConvenzione'),
                nome: form_data.get('nome'),
                indirizzo: form_data.get('indirizzo'),
                piva: form_data.get('piva'),
                telefono: form_data.get('telefono'),
                direttore_nome: form_data.get('direttore_nome'),
                direttore_natoA: form_data.get('direttore_natoA'),
                direttore_natoIl: new Date(form_data.get('direttore_natoIl')),
                direttore_codiceF: form_data.get('direttore_codiceF'),
                dataConvenzione: new Date(form_data.get('dataConvenzione')),
				dataProtocollo: new Date(form_data.get('dataProtocollo')),
                istituto: form_data.get('istituto'),
			}
		});
	},

	delete: async ({ cookies, request, locals }) => {
		const form_data = await request.formData();
		const id = form_data.get('id');

        SARP.set_session(locals); // passa la sessione all'audit
		await SARP.pcto_Azienda.delete({
			where: { id: +id }
		});
	},

    pdf: async ({ cookies, request }) => {
        const form_data = await request.formData();
        const id = form_data.get('id');
        
        // preleva l'azienda dal DB
        const company = await SARP.pcto_Azienda.findUnique({
            where: { id: +id }
        });
        //arricchisce l'oggetto
        company['today'] =  new Date().toLocaleDateString();
        company['direttore_natoIl'] = company['direttore_natoIl'].toLocaleDateString();

        const content = fs.readFileSync(
            path.resolve("static/pcto_templates/", "01-Convenzione-generale.docx"), "binary");
        
        const zip = new PizZip(content);
        
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true,
        });
        
        doc.render(company);
        
        const buf = doc.getZip().generate({
            type: "nodebuffer",
            compression: "DEFLATE",
        });
        fs.writeFileSync(path.resolve("static/pcto_output/", `01-Convenzione-generale-${company.idConvenzione}.docx`), buf);
        throw redirect(303, `pcto_output/01-Convenzione-generale-${company.idConvenzione}.docx`);   
    }   
};
