import { PrismaDB } from '../../js/prisma_db';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path from 'path';
import { redirect, fail, error } from '@sveltejs/kit';
import { route_protect, multi_user_where, user_id, raise_error } from '../../js/helper'; //PROF: usa l'helper raise_erorr che ho cretao qualche settimana fa
import { Logger } from '../../js/logger';

let logger = new Logger("server"); //instanzia il logger PROF: qui deve essere server
const SARP = new PrismaDB(); //Istanzia il client SARP DB

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
    route_protect(locals);

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
                istituto: form_data.get('istituto'),
			}
		});
	},

	// @ts-ignore
	delete: async ({ cookies, request, locals }) => {
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

    // @ts-ignore
    pdf: async ({ cookies, request }) => {
        const form_data = await request.formData();
        const id = form_data.get('id');
        let company;
        try {
            // preleva l'azienda dal DB
            company = await SARP.pcto_Azienda.findUnique({
                where: { id: +id }
            });
            //arricchisce l'oggetto
            // @ts-ignore
            company['today'] =  new Date().toLocaleDateString();
            // @ts-ignore
            company['direttore_natoIl'] = company['direttore_natoIl'].toLocaleDateString(); 
        } catch (error) {
            catch_error_pdf(error, "Azienda non trovata nel database.");
        }

        try {
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
            // @ts-ignore
            fs.writeFileSync(path.resolve("static/pcto_output/", `01-Convenzione-generale-${company.idConvenzione}.docx`), buf);
        } catch (error) {
            console.error(error);
            catch_error_pdf(error, "Errore durante la generazione del PDF");
        }

        // @ts-ignore
        throw redirect(303, `pcto_output/01-Convenzione-generale-${company.idConvenzione}.docx`);   // Se non viene rilevata nessuna eccezione possiamo scaricare il file
    }   
};
