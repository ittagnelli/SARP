import { PrismaDB } from '../../js/prisma_db';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path from 'path';
import { redirect, fail, error } from '@sveltejs/kit';
import { route_protect, multi_user_where, user_id, raise_error, access_protect } from '../../js/helper'; //PROF: usa l'helper raise_erorr che ho cretao qualche settimana fa
import { Logger } from '../../js/logger';
import { PUBLIC_PCTO_TEMPLATES_DIR, PUBLIC_PCTO_TEMPLATE_AZIENDE } from '$env/static/public';

let logger = new Logger('seerver'); //instanzia il logger
const SARP = new PrismaDB(); //Istanzia il client SARP DB
let resource = "pcto_aziende"; // definisco il nome della risorsa di questo endpoint

// @ts-ignore
function catch_error(exception, type) {
    logger.error(JSON.stringify(exception)); //PROF: error è un oggetto ma serve qualcosa di più complicato. per il momento lascialo così. ho gia risolto in hooks nella versione 9.0
    raise_error(500, 100, `Errore irreversibile durante ${type} dell'azienda. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`);    // TIMESTAMP ci serve per capire l'errore all'interno del log
}

// @ts-ignore
function catch_error_pdf(exception, type) {
    logger.error(JSON.stringify(exception)); //PROF: error è un oggetto ma serve qualcosa di più complicato. per il momento lascialo così. ho gia risolto in hooks nella versione 9.0
    raise_error(500, 100, `${type} TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`);
}

// @ts-ignore
export async function load({ locals }) {
	let action = 'read';

    route_protect(locals);
    access_protect(100, locals, action, resource);

    try {
        // query SQL al DB per tutte le entry nella tabella todo
        const companies = await SARP.pcto_Azienda.findMany({
            orderBy: [{ id: 'desc' }],
        where: multi_user_where(locals) 
        });

        // restituisco il risultato della query SQL
        return {aziende: companies};        
    } catch (error) {
        logger.error(JSON.stringify(error)); //PROF: error è un oggetto ma serve qualcosa di più complicato. per il momento lascialo così. ho gia risolto in hooks nella versione 9.0
		raise_error(500, 100, `Errore durante la ricerca delle aziende. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`);    // TIMESTAMP ci serve per capire l'errore all'interno del log
    }
}

export const actions = {
	// @ts-ignore
	create: async ({ cookies, request, locals }) => {
        let action = 'create';

        route_protect(locals);
        access_protect(101, locals, action, resource);

		const form_data = await request.formData();

        SARP.set_session(locals); // passa la sessione all'audit
        try {
            await SARP.pcto_Azienda.create({
                data: {
                    creatoDa: user_id(locals),
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
            // @ts-ignore
            if(exception.code != "P2002")
                catch_error(exception, "l'inserimento");
            else
                return fail(400, { error_mex: "Numero convenzione non univoco" });   // La richiesta fallisce
        }
	},

	// @ts-ignore
	update: async ({ cookies, request, locals }) => {
        let action = 'update';

        route_protect(locals);
        access_protect(102, locals, action, resource);

		const form_data = await request.formData();
		let id = form_data.get('id');

		SARP.set_session(locals); // passa la sessione all'audit
		await SARP.pcto_Azienda.update({
			where: { id: +id },
			data: {
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
	},

	// @ts-ignore
	delete: async ({ cookies, request, locals }) => {
        let action = 'delete';

        route_protect(locals);
        access_protect(103, locals, action, resource);

		const form_data = await request.formData();
		const id = form_data.get('id');

		SARP.set_session(locals); // passa la sessione all'audit
		try {
            await SARP.pcto_Azienda.delete({
                where: { id: +id }
            });   
        } catch (error) {
            catch_error(error, "l'aggiornamento");
        }
	},

	pdf: async ({ cookies, request }) => {
		let buf, company;
		try {
			const form_data = await request.formData();
			const id = form_data.get('id');

			// preleva l'azienda dal DB
			company = await SARP.pcto_Azienda.findUnique({
				where: { id: +id }
			});
			//arricchisce l'oggetto
			company['today'] = new Date().toLocaleDateString();
			company['direttore_natoIl'] = company['direttore_natoIl'].toLocaleDateString();

			const content = fs.readFileSync(
				path.resolve(PUBLIC_PCTO_TEMPLATES_DIR, PUBLIC_PCTO_TEMPLATE_AZIENDE),
				'binary'
			);

			const zip = new PizZip(content);

			const doc = new Docxtemplater(zip, {
				paragraphLoop: true,
				linebreaks: true
			});

			doc.render(company);

			buf = doc.getZip().generate({
				type: 'nodebuffer',
				compression: 'DEFLATE'
			});
			return{
				file: JSON.stringify(buf),	// Convertiamo il buffer in stringa sennò sveltekit va in errore
				nome_convenzione: `01-Convenzione-generale-${company.idConvenzione}.docx`
			}
		} catch (exception) {
			raise_error(500, 101, 'Impossibile generare il file a partire dal template');
		}
	}       
};
