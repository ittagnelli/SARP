

import { PrismaDB } from '../../js/prisma_db';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path from 'path';
import { redirect, fail, error } from '@sveltejs/kit';
import { route_protect, multi_user_where, user_id, raise_error, access_protect } from '../../js/helper'; //PROF: usa l'helper raise_erorr che ho cretao qualche settimana fa
import { Logger } from '../../js/logger';
import { PUBLIC_PCTO_TEMPLATES_DIR, PUBLIC_PCTO_TEMPLATE_AZIENDE } from '$env/static/public';
import pdftk from 'node-pdftk';

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
        return { aziende: companies };
    } catch (error) {
        logger.error(JSON.stringify(error)); //PROF: error è un oggetto ma serve qualcosa di più complicato. per il momento lascialo così. ho gia risolto in hooks nella versione 9.0
        raise_error(500, 100, `Errore durante la ricerca delle aziende. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`);    // TIMESTAMP ci serve per capire l'errore all'interno del log
    }
}

export const actions = {
    pdf: async ({ request }) => {
        const form_data = await request.formData();

        console.log(form_data);

        const file = form_data.getAll('file-to-convert');

        let filename1, filename2;

        try {

            if (file) {
                filename1 = (file[0].name);
                filename2 = (file[1].name);

                //const ext = file.name.split('.').pop()
                //filename = /* userName +  */'-' + Date.now().toString() + '.' + ext

                //let ab = await file.arrayBuffer()
                //console.log(Array.from(ab));
            }

            console.log(file);
            console.log(filename1);
            console.log(filename2);

            pdftk
                .input({
                    filename1, filename2
                })
                .cat(filename1, filename2)
                .output('./2pagefile.pdf')
                .then(buffer => {
                    // Do stuff with the output buffer
                })
                .catch(err => {

                });

            return { success: true }

        } catch (e) {
            console.log(e);
            return { success: false };

        }




    }
};
