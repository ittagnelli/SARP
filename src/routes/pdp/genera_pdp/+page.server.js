import { PUBLIC_PDP_TEMPLATES_DIR, PUBLIC_PDP_TEMPLATE } from "$env/static/public";
import { access_protect, raise_error, is_primo_quadrimestre, route_protect, upper_first_letter, titlecase, custom_tags_parser, sort_strings, get_as } from "$js/helper";
import { PrismaDB } from "$js/prisma_db.js";
import path from 'path';
import fs from 'fs';
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { PrismaClientValidationError } from '@prisma/client/runtime';
import { Logger } from '$js/logger';

const resource = "genera_pdp";
let logger = new Logger("server"); //instanzia il logger
const SARP = new PrismaDB();

function catch_error(exception, type, code) {
    if(exception instanceof PrismaClientValidationError)
        logger.error(exception.message);
    else {  
        logger.error(JSON.stringify(exception));
        logger.error(exception.message);
        logger.error(exception.stack);
    }
    raise_error(500, code, `Errore irreversibile durante ${type} del PDP. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`);    // TIMESTAMP ci serve per capire l'errore all'interno del log
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

    try {
        route_protect(locals);
        access_protect(200, locals, action, resource);
        SARP.set_session(locals);

        // get active BES students
        const studenti = await SARP.Utente.findMany({
			orderBy: [{ tipo: 'desc' }],
            where: {
                bes: true,
                can_login: true    
            }            
		});

        return {
            studenti
        }
        
        // const insegnamenti = await SARP.insegnamenti.findMany({
        //     where: {
        //         titolare: true,
        //         anno: get_as()
        //     }
        // });

        // let classi = await SARP.classe.findMany({});

        // classi = classi.map(classe => {
        //     const current_insegnamento = insegnamenti.filter(insegnamento => insegnamento.idClasse == classe.id)
        //     // per default il programma non è completo
        //     let programma_q1_completo = false;
        //     let programma_q2_completo = false;

        //     // se c'e' un insegnamento determiniamo se è completo o no
        //     if(current_insegnamento.length != 0) {
        //         programma_q1_completo = current_insegnamento.filter(insegnamento => insegnamento.programma_primo_quadrimestre_completo).length == current_insegnamento.length
        //         programma_q2_completo = current_insegnamento.filter(insegnamento => insegnamento.programma_secondo_quadrimestre_completo).length == current_insegnamento.length
        //     }

        //     return {
        //         ...classe,
        //         "programmazione_q1_completa": programma_q1_completo,
        //         "programmazione_q2_completa": programma_q2_completo,
        //         "programmazione_completa": programma_q1_completo || programma_q2_completo
        //     }
        // })

        // return {
        //     insegnamenti,
        //     classi,
        // };
    } catch (exception) {
        catch_error(exception, "la ricerca", 100);
    }
}

//format the answer for 4 columns grid
function format_grid1_4(grid) {
    grid.map((q) => {
        q.answers.forEach((a) => {
            q[`ans_${a.aid}`] = a.aid == q.answer ? 'X' : ''; 
        })
    });

    return grid;
}

//format the answer for SI/NO questions
function format_grid5(grid) {
    grid.map((q) => {
        q['ans'] = q.answer == 'a' ? 'SI' : 'NO'; 
    });

    return grid;
}

export const actions = {
    pdf: async ({ cookies, request }) => {
		let buf;
		try {
			const form_data = await request.formData();
			const student_id = form_data.get('id');
            
			// preleva la griglia osservativa per lo studente
            const studente = await SARP.Utente.findUnique({
                where: { id: +student_id }          
            });

            // let _griglia_valutazione = [
            //     {
            //         qid: 1,
            //         question: 'Manifesta difficoltà di lettura/scrittura',
            //         answers: [
            //             { aid: 'a', answer: 'Mai' },
            //             { aid: 'b', answer: 'Talvolta' },
            //             { aid: 'c', answer: 'Spesso' },
            //             { aid: 'd', answer: 'Sempre' },
            //         ],
            //         answer: 'a'
            //     },
            //     {
            //         qid: 2,
            //         question: 'Manifesta difficoltà di comprensione del testo',
            //         answers: [
            //             { aid: 'a', answer: 'Mai' },
            //             { aid: 'b', answer: 'Talvolta' },
            //             { aid: 'c', answer: 'Spesso' },
            //             { aid: 'd', answer: 'Sempre' },
            //         ],
            //         answer: 'a'
            //     },

            //prpeare the valutazione grids
            let valutazione = JSON.parse(studente.griglia_valutazione);
            let griglia1 = valutazione.slice(0, 20);
            let griglia2 = valutazione.slice(20, 23);
            let griglia3 = valutazione.slice(23, 28);
            let griglia4 = valutazione.slice(28, 32);
            let griglia5 = valutazione.slice(32);
            
            //set an X to the right answer column
            griglia1 = format_grid1_4(griglia1);
            griglia2 = format_grid1_4(griglia2);
            griglia3 = format_grid1_4(griglia3);
            griglia4 = format_grid1_4(griglia4);
            griglia5 = format_grid5(griglia5);
            
        

            console.log(valutazione)

            //prepare the object to render the template
            let renderer = {};
            renderer['nome'] = studente.nome;
            renderer['cognome'] = studente.cognome 
            renderer['griglia1'] = griglia1;
            renderer['griglia2'] = griglia2;
            renderer['griglia3'] = griglia3;
            renderer['griglia4'] = griglia4;
            renderer['griglia5'] = griglia5;


            console.log(renderer)

			const content = fs.readFileSync(
				path.resolve(PUBLIC_PDP_TEMPLATES_DIR, PUBLIC_PDP_TEMPLATE),
				'binary'
			);

			const zip = new PizZip(content);

			const doc = new Docxtemplater(zip, {
				paragraphLoop: true,
				linebreaks: true
			});
            
            doc.render(renderer);
    
			buf = doc.getZip().generate({
				type: 'nodebuffer',
				compression: 'DEFLATE'
			});

			return {
				file: JSON.stringify(buf), // Convertiamo il buffer in stringa sennò sveltekit va in errore
				// nome_documento: `PDP-${docx_programmazione_template.classe.replace(' ', '_')}.docx`
                nome_documento: 'PDP.docx'
			};
		} catch (exception) {
			catch_error_pdf(exception, 'la generazione', 204);
		}
	}
}
