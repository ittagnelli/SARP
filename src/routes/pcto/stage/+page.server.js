import { PrismaDB } from '$js/prisma_db';
import { route_protect, user_id, multi_user_where, raise_error, access_protect  } from '$js/helper';
import { Logger } from '$js/logger';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import * as helper from '../../../js/helper';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import fs from 'fs';
import path from 'path';
import { PUBLIC_PCTO_TEMPLATES_DIR, PUBLIC_PCTO_TEMPLATE_CONVENZIONE_STUDENTE, PUBLIC_PCTO_TEMPLATE_PATTO_FORMATIVO } from '$env/static/public';

let logger = new Logger("server"); //instanzia il logger
const SARP = new PrismaDB(); //Istanzia il client SARP DB
let resource = "pcto_stage"; // definisco il nome della risorsa di questo endpoint

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

export const convert_date = (d) => {
	let data = d
		.toLocaleDateString('it-IT', { year: 'numeric', month: '2-digit', day: '2-digit' })
		.split('/');
	return `${data[0]}-${data[1]}-${data[2]}`;
};

export async function load({ locals }) {
    let action = 'read';

    route_protect(locals);
    access_protect(500, locals, action, resource);

    try {
        // query SQL al DB per tutte le entry nella tabella todo
        const stages = await SARP.pcto_Pcto.findMany({
            orderBy: [{ anno_scolastico: 'desc' }],
            where: multi_user_where(locals), 
            include: {
                offertoDa: true,
                svoltoDa: true,
                tutor_scolastico: true
            }
        });

        const companies = await SARP.pcto_Azienda.findMany({
            orderBy: [{ nome: 'asc' }]
        });

        const utenti = await SARP.Utente.findMany({
            orderBy: [{ id: 'desc' }],
            include: {ruoli: true}
        });

        const classi = await SARP.classe.findMany();

        // restituisco il risultato della query SQL
        return {
            stages: stages,
            companies: companies,
            utenti: utenti,
            classi: classi
        }
    } catch (exception) {
        catch_error(exception, "la ricerca", 300);
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
            await SARP.pcto_Pcto.create({
                data: {
                    creatoDa: user_id(locals),
                    titolo: form_data.get('titolo'),
                    descrizione: form_data.get('descrizione'),
                    anno_scolastico: +form_data.get('anno_scolastico'),
                    contabilizzato: form_data.get('contabilizzato') == "SI" ? true : false,
                    tutor_aziendale: form_data.get('tutor_aziendale'),
                    tutor_telefono: form_data.get('tutor_telefono'),
                    tutor_email: form_data.get('tutor_email'),
                    idTutor: +form_data.get('tutor_scolastico'),
                    dataInizio: new Date(form_data.get('dataInizio')),
                    dataFine: new Date(form_data.get('dataFine')),
                    durata_ore: +form_data.get('durata_ore'),
                    idAzienda: +form_data.get('azienda'),
                    idClasse: +form_data.get('classe'),
                    svoltoDa: {
                        connect: ids
                    },
                    firma_pcto: form_data.get('firma_pcto') == "SI" ? true : false,
                    task1: form_data.get('task1'),
                    task2: form_data.get('task2'),
                    task3: form_data.get('task3'),
                    task4: form_data.get('task4')
                }
            });
        } catch (exception) {
            catch_error(exception, "l'inserimento", 301)
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
            await SARP.pcto_Pcto.update({
                where: { id: +id },
                data: {
                    titolo: form_data.get('titolo'),
                    descrizione: form_data.get('descrizione'),
                    anno_scolastico: +form_data.get('anno_scolastico'),
                    contabilizzato: form_data.get('contabilizzato') == "SI" ? true : false,
                    tutor_aziendale: form_data.get('tutor_aziendale'),
                    tutor_telefono: form_data.get('tutor_telefono'),
                    tutor_email: form_data.get('tutor_email'),
                    idTutor: +form_data.get('tutor_scolastico'),
                    dataInizio: new Date(form_data.get('dataInizio')),
                    dataFine: new Date(form_data.get('dataFine')),
                    durata_ore: +form_data.get('durata_ore'),
                    idAzienda: +form_data.get('azienda'),
                    idClasse: +form_data.get('classe'),
                    svoltoDa: {
                        set: ids
                    },
                    firma_pcto: form_data.get('firma_pcto') == "SI" ? true : false,
                    task1: form_data.get('task1'),
                    task2: form_data.get('task2'),
                    task3: form_data.get('task3'),
                    task4: form_data.get('task4')
                }
            });
        } catch (exception) {
            catch_error(exception, "l'aggiornamento", 302);
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
            await SARP.pcto_Pcto.delete({
                where: { id: +id }
            });       
        } catch (exception) {
            catch_error(exception, "l'eliminazione", 303);
        }

	},

    pdf: async ({ cookies, request }) => {
		try {
			const form_data = await request.formData();
			const id = form_data.get('id');
            let return_files = [];

            console.log("STAMPO FILE STAGE: ", id)
            
			// preleva il PCTO dal DB
			let pcto = await SARP.pcto_Pcto.findUnique({
				where: { id: +id },
                include: {
                    offertoDa: {
                        // include: {
                        //     classe: true
                        // }
                    } 
                }
			});

            console.log("PCTO:", pcto)

            // PCTO: {
            //     id: 44,
            //     createdAt: 2023-04-30T10:32:08.663Z,
            //     updatedAt: 2023-05-02T20:04:45.071Z,
            //     creatoDa: 1,
            //     titolo: 'mio pcto',
            //     descrizione: 'qui una lunga descrizione:\r\n- punto 1\r\n- punto 2\r\nancora dfescrizione',
            //     tutor_aziendale: 'Bosco Giovanni',
            //     tutor_telefono: '54334',
            //     tutor_email: 'bosco@istituto.it',
            //     idTutor: 627,
            //     dataInizio: 2023-04-30T00:00:00.000Z,
            //     dataFine: 2023-04-30T00:00:00.000Z,
            //     durata_ore: 51,
            //     idAzienda: 10,
            //     contabilizzato: false,
            //     anno_scolastico: 2029,
            //     idClasse: 8,
            //     firma_pcto: true,
            //     task1: 'task1',
            //     task2: 'task2',
            //     task3: 'attività 3',
            //     task4: 'programmazione web 4',
            //     offertoDa: {
            //       id: 10,
            //       createdAt: 2023-03-06T11:49:53.055Z,
            //       updatedAt: 2023-03-06T14:18:30.653Z,
            //       creatoDa: 1,
            //       nome: 'CASA ATC SERVIZI SRL',
            //       indirizzo: 'Corso Stati Uniti, 50, 10128 Torino TO',
            //       piva: '08930260016',
            //       telefono: '011.561.92.37',
            //       email_privacy: null,
            //       direttore_nome: 'Maurizio Pedrini',
            //       direttore_natoA: 'Savona',
            //       direttore_natoIl: 1972-06-04T00:00:00.000Z,
            //       direttore_codiceF: 'PDRMRZ72H04I480A',
            //       idConvenzione: '2122-29',
            //       dataConvenzione: 2022-05-31T00:00:00.000Z,
            //       dataProtocollo: 2022-05-31T00:00:00.000Z,
            //       istituto: 'ITT',
            //       firma_convenzione: false
            //     }
            //   }

            let ddata = {};
            ddata['P_AS'] = String(helper.get_as());
            ddata['P_CONVENZIONE'] = pcto?.offertoDa.idConvenzione;
            ddata['A_NOME'] = pcto?.offertoDa.nome;
            ddata['A_SEDE'] = pcto?.offertoDa.indirizzo;
            ddata['P_INIZIO'] = convert_date (pcto?.dataInizio);
            ddata['P_FINE'] = convert_date (pcto?.dataFine);
            
            

            console.log("DDATA:", ddata);

            // for(let studente of corso?.seguitoDa) {
            //     let filler = {};
            //     filler['nome'] = studente.nome;
            //     filler['cognome'] = studente.cognome 
            //     filler['natoA'] = studente.natoA;
            //     filler['natoIl'] = studente.natoIl.toLocaleDateString("it-IT");
            //     filler['codiceF'] = studente.codiceF;
            //     filler['classe'] = studente.classe.classe;
            //     filler['istituto'] = studente.classe.istituto;
            //     filler['sezione'] = studente.classe.sezione;
            //     filler['today'] = corso.dataTest.toLocaleDateString("it-IT");

            //     let TEMPLATE_FILE;
            //     if(corso.tipo == 'SPECIFICO')
            //         TEMPLATE_FILE = PUBLIC_SICUREZZA_CORSO_SPECIFICO;
            //     else
            //         TEMPLATE_FILE = PUBLIC_SICUREZZA_CORSO_GENERICO;

            //     const template = fs.readFileSync(
            //         path.resolve(PUBLIC_SICUREZZA_TEMPLATES_DIR, TEMPLATE_FILE),
            //         'binary'
            //     );

            //     const zip = new PizZip(template);
			//     const doc = new Docxtemplater(zip, {
            //         paragraphLoop: true,
            //         linebreaks: true
			//     });

			//     doc.render(filler);
            //     let buf = doc.getZip().generate({
            //         type: 'nodebuffer',
            //         compression: 'DEFLATE'
            //     });

            //     return_files.push({
            //         file: JSON.stringify(buf),
            //         name: `attestato_corso_${corso.tipo}_${studente.cognome}_${studente.nome}.docx`
            //     });
            //     logger.info(`Generato attestato corso sicurezza per ${studente.cognome}_${studente.nome}`);
            // }       

            return {files: return_files};
		} catch (exception) {
			catch_error_pdf(exception, 'la generazione', 804);
		}
	}
};
