import { PrismaDB } from '../../../js/prisma_db';
import { route_protect, user_id, multi_user_where, raise_error, access_protect  } from '../../../js/helper';
import { Logger } from '../../../js/logger';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path from 'path';
import { redirect, fail, error } from '@sveltejs/kit';
import { PUBLIC_SICUREZZA_TEMPLATES_DIR, PUBLIC_SICUREZZA_CORSO_GENERICO, PUBLIC_SICUREZZA_CORSO_SPECIFICO } from '$env/static/public';


let logger = new Logger("server"); //instanzia il logger
const SARP = new PrismaDB(); //Istanzia il client SARP DB
let resource = "sicurezza_corso"; // definisco il nome della risorsa di questo endpoint

// @ts-ignore
function catch_error(exception, type, code) {
    if(exception instanceof PrismaClientValidationError)
        logger.error(exception.message);
    else {  
        logger.error(JSON.stringify(exception));
        logger.error(exception.message);
        logger.error(exception.stack);
    }
    raise_error(500, code, `Errore irreversibile durante ${type} dello stage. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`); // TIMESTAMP ci serve per capire l'errore all'interno del log
}

function catch_error_pdf(exception, type, code) {
	logger.error(JSON.stringify(exception)); //PROF: error è un oggetto ma serve qualcosa di più complicato. per il momento lascialo così. ho gia risolto in hooks nella versione 9.0
	raise_error(
		500,
		code,
		`${type} TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`
	);
}

export async function load({ locals }) {
    let action = 'read';

    route_protect(locals);
    access_protect(500, locals, action, resource);

    try {
        // query SQL al DB per tutte le entry nella tabella todo
        const corsi = await SARP.sicurezza_Corso.findMany({
            orderBy: [{ id: 'desc' }],
            where: multi_user_where(locals),
            include: {
                seguitoDa: true
            }
        });

        const utenti = await SARP.Utente.findMany({
            orderBy: [{ id: 'desc' }]
        });

        const classi = await SARP.Classe.findMany();

        // restituisco il risultato della query SQL
        return {
            corsi: corsi,
            utenti: utenti,
            classi: classi
        }
    } catch (exception) {
        catch_error(exception, "la ricerca", 800);
    }
}

export const actions = {
	create: async ({ cookies, request, locals }) => {
        let action = 'create';

        route_protect(locals);
        access_protect(501, locals, action, resource);

		const form_data = await request.formData();
        let studenti = form_data.get('studenti').split(',')
        let ids = [];
        
        if(studenti != '') {
            studenti.forEach(element => {
                ids.push({id: +element})
            });
        }

        SARP.set_session(locals); // passa la sessione all'audit
        try {
        await SARP.sicurezza_Corso.create({
			data: {
                creatoDa: user_id(locals),
                titolo: form_data.get('titolo'),
                tipo: form_data.get('tipo'),
                dataInizio: new Date(form_data.get('dataInizio')),
				dataFine: new Date(form_data.get('dataFine')),
                seguitoDa: {
                    connect: ids
                }
        }
    });
        } catch (exception) {
            catch_error(exception, "l'inserimento", 801)
        }

	},

	update: async ({ cookies, request, locals }) => {
        let action = 'update';

        route_protect(locals);
        access_protect(502, locals, action, resource);

		const form_data = await request.formData();
		let id = form_data.get('id');
        let studenti = form_data.get('studenti').split(',');
        let ids = [];

        studenti.forEach(element => {
            if(+element > 0) ids.push({id: +element})
        });
        
        SARP.set_session(locals); // passa la sessione all'audit
        try {
            await SARP.sicurezza_Corso.update({
                where: { id: +id },
                data: {
                    titolo: form_data.get('titolo'),
                    tipo: form_data.get('tipo'),
                    dataInizio: new Date(form_data.get('dataInizio')),
                    dataFine: new Date(form_data.get('dataFine')),
                    seguitoDa: {
                        set: ids
                    }
                }
            });
        } catch (exception) {
            catch_error(exception, "l'aggiornamento", 802);
        }

	},

	delete: async ({ cookies, request, locals }) => {
        let action = 'delete';

        route_protect(locals);
        access_protect(503, locals, action, resource);

		const form_data = await request.formData();
		const id = form_data.get('id');

        SARP.set_session(locals); // passa la sessione all'audit
        try {
            await SARP.sicurezza_Corso.delete({
                where: { id: +id }
            });       
        } catch (exception) {
            catch_error(exception, "l'eliminazione", 803);
        }

	},

    pdf: async ({ cookies, request }) => {
		try {
			const form_data = await request.formData();
			const id = form_data.get('id');
            let return_files = [];

			// preleva il corso dal DB
			let corso = await SARP.sicurezza_Corso.findUnique({
				where: { id: +id },
                include: {
                    seguitoDa: {
                        include: {
                            classe: true
                        }
                    } 
                }
			});

            for(let studente of corso?.seguitoDa) {
                let filler = {};
                filler['nome'] = studente.nome;
                filler['cognome'] = studente.cognome 
                filler['natoA'] = studente.natoA;
                filler['natoIl'] = studente.natoIl.toLocaleDateString("it-IT");
                filler['codiceF'] = studente.codiceF;
                filler['classe'] = studente.classe.classe;
                filler['istituto'] = studente.classe.istituto;
                filler['sezione'] = studente.classe.sezione;
                filler['today'] = new Date().toLocaleDateString("it-IT");

                let TEMPLATE_FILE;
                if(corso.tipo == 'SPECIFICO')
                    TEMPLATE_FILE = PUBLIC_SICUREZZA_CORSO_SPECIFICO;
                else
                    TEMPLATE_FILE = PUBLIC_SICUREZZA_CORSO_GENERICO;

                const template = fs.readFileSync(
                    path.resolve(PUBLIC_SICUREZZA_TEMPLATES_DIR, TEMPLATE_FILE),
                    'binary'
                );

                const zip = new PizZip(template);
			    const doc = new Docxtemplater(zip, {
                    paragraphLoop: true,
                    linebreaks: true
			    });

			    doc.render(filler);
                let buf = doc.getZip().generate({
                    type: 'nodebuffer',
                    compression: 'DEFLATE'
                });

                return_files.push({
                    file: JSON.stringify(buf),
                    name: `attestato_corso_${corso.tipo}_${studente.cognome}_${studente.nome}.docx`
                });
                logger.info(`Generato attestato corso sicurezza per ${studente.cognome}_${studente.nome}`);
            }       

            return {files: return_files};
			// return {
			// 	file: JSON.stringify(buf), // Convertiamo il buffer in stringa sennò sveltekit va in errore
			// 	nome_convenzione: `01-Convenzione-generale-${company.idConvenzione}.docx`
			// };
		} catch (exception) {
			catch_error_pdf(exception, 'la generazione', 804);
		}
	}
};
