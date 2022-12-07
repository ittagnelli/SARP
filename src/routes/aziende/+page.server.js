import { PrismaClient } from '@prisma/client';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path from 'path';
import { error, redirect } from '@sveltejs/kit';
import { is_an_html_element } from '$lib/validator/sanitizer';


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

/**
 * @param {string} [message]
 */
function invalid_input(message) {
    console.log("INPUT INVALIDO, id Utente: 3");    // Dobbiamo cambiarlo
    // Potremmo creare una tabella nel db che logga tutte queste eccezzioni oppure su un file di log
    return { success: false, message: message };
}

export const actions = {
    create: async ({ cookies, request }) => {

        const form_data = await request.formData();
        const data_convenzione = form_data.get('dataConvenzione');
        const data_protocollo = form_data.get('dataProtocollo');
        const telefono = form_data.get('telefono');
        const nome = form_data.get('nome');
        const id_convenzione = form_data.get('idConvenzione');
        const indirizzo = form_data.get('indirizzo');
        const piva = form_data.get('piva');
        const direttore_name = form_data.get('direttore_nome');
        const direttore_cf = form_data.get('direttore_codiceF');
        const direttore_luogo = form_data.get('direttore_natoA');
        const data_direttore = form_data.get('direttore_natoIl');
        const istituto = form_data.get('istituto');

        if (process.env.NODE_ENV != 'production')
            console.log("CREATE AZIENDA:", form_data);

        if (is_an_html_element(id_convenzione) || is_an_html_element(indirizzo)     // Anti XSS attack
            || is_an_html_element(piva) || is_an_html_element(direttore_name) 
            || is_an_html_element(direttore_luogo) || is_an_html_element(istituto)
            || is_an_html_element(telefono) || is_an_html_element(data_direttore)
            || is_an_html_element(direttore_cf) || is_an_html_element(data_convenzione)
            || is_an_html_element(data_protocollo) || is_an_html_element(nome)){

            throw error(400, "Attacco XSS rilevato, sei stato registrato in un log :-) ");   // Non possiamo visualizzare solo l'alert, dobbiamo mandare in errore il server
            // Potremmo aggiungere nel db o in un file di log l'utente che ha fatto questo attacco.
        }

        try{
            await SARP.pcto_Azienda.create({
                data: {
                    idUtente: 3,
                    idConvenzione: id_convenzione,
                    nome: nome,
                    indirizzo: indirizzo,
                    piva: piva,
                    telefono: telefono,
                    direttore_nome: direttore_name,
                    direttore_natoA: direttore_luogo,
                    direttore_natoIl: new Date(data_direttore),
                    direttore_codiceF: direttore_cf,
                    dataConvenzione: new Date(data_convenzione),
                    dataProtocollo: new Date(data_protocollo),
                    istituto: istituto
                }
            });
            return { success: true, message: "" };  // Message avoid an error
        }catch(err){
            console.error(err);
            return { success: false, message: "C'è stato un errore durante l'inserimento dei dati, contattare il team ATS per risolvere" };
        }

    },

    update: async ({ cookies, request }) => {
        const form_data = await request.formData();
        let id = form_data.get('id');

        console.log("UPDATE AZIENDA:", form_data);

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

    delete: async ({ cookies, request }) => {
        const form_data = await request.formData();
        const id = form_data.get('id');

        await SARP.pcto_Azienda.delete({
            where: { id: +id }
        });
    },

    pdf: async ({ cookies, request }) => {
        console.log("GENERA PDF")

        const form_data = await request.formData();
        const id = form_data.get('id');

        // preleva l'azienda dal DB
        const company = await SARP.pcto_Azienda.findUnique({
            where: { id: +id }
        });
        //arricchisce l'oggetto
        company['today'] = new Date().toLocaleDateString();
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
