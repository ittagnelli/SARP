import { json } from '@sveltejs/kit';
import { PrismaDB } from '$js/prisma_db';
import { route_protect, raise_error, access_protect  } from '$js/helper';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import { Logger } from '$js/logger';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path from 'path';
import { Auditor, audit_mex } from '$js/audit';
import { PUBLIC_PCTO_TEMPLATES_DIR, PUBLIC_PCTO_REPORT_STUDENTE } from '$env/static/public';

let logger = new Logger("server"); //instanzia il logger
const SARP = new PrismaDB(); //Istanzia il client SARP DB
let auditor = new Auditor();

function catch_error(exception, code) {
    if(exception instanceof PrismaClientValidationError)
        logger.error(exception.message);
    else {  
        logger.error(JSON.stringify(exception));
        logger.error(exception.message);
        logger.error(exception.stack);
    }
    raise_error(500, code, `Errore irreversibile durante verifica PCTO studente. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`);
}

export async function GET({ request, url, locals }) {
    let action = 'get';
    let resource = "verifica_stato"; // definisco il nome della risorsa di questo endpoint
    route_protect(locals);
    access_protect(500, locals, action, resource);
    
    let cognome = url.searchParams.get("cognome");
    let nome = url.searchParams.get("nome");
    let whereobj = {};

    if(cognome)
        whereobj['cognome'] = cognome;
    if(nome)
        whereobj['nome'] = nome;
    
    try {
        const studente = await SARP.utente.findMany({
            where: whereobj,
            include: {
                iscritto: {
                    include: {
                        offertoDa: true
                    }
                },
                presente: true
            }
        });

        return json(studente);
    } catch (exception) {
        catch_error(exception, 901);
    }
}


export async function POST({ request, url, locals }) {
    route_protect(locals);
    const json_data = await request.json();

    SARP.set_session(locals); // passa la sessione all'audit
   
    try {
        let date = new Date();
        json_data['date'] = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()}`;
        const content = fs.readFileSync(
            path.resolve(PUBLIC_PCTO_TEMPLATES_DIR, PUBLIC_PCTO_REPORT_STUDENTE),
            'binary'
        );

        const zip = new PizZip(content);
        const doc = new Docxtemplater(zip, {
            paragraphLoop: true,
            linebreaks: true
        });
        doc.render(json_data);
        const buf = doc.getZip().generate({
            type: 'nodebuffer',
            compression: 'DEFLATE'
        });

        let valid_mex = new audit_mex(
            0,
            '',
            '',
            '',
            null,
            null,
            `Generato report PCTO per studente: ${json_data.student}`
        );
        auditor.audit(valid_mex);
       
        return json({
            file: JSON.stringify(buf), // Convertiamo il buffer in stringa sennò sveltekit va in errore
            nome_report: `report_stampa_pcto-${json_data.student}.docx`
        });

    } catch (exception) {
        console.log("EXCEPTION:", exception)
        catch_error(exception, 1001);
    }
}
