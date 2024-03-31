import { PUBLIC_PDP_TEMPLATES_DIR, PUBLIC_PDP_TEMPLATE } from "$env/static/public";
import { access_protect, raise_error, route_protect, custom_tags_parser, get_as, is_admin, is_tutor_bes } from "$js/helper";
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

        if(is_admin(locals) || is_tutor_bes(locals)) {
            // get active BES students
            const studenti = await SARP.Utente.findMany({
                select: {
                    id: true,
                    nome: true,
                    cognome: true,
                    griglia_valutazione: true,
                    griglia_valutazione_done: true,
                    griglia_pdp_a1: true,
                    griglia_pdp_a1_done: true,
                    griglia_pdp_c1: true,
                    griglia_pdp_c1_done: true,
                    griglia_pdp_c2: true,
                    griglia_pdp_c2_done: true,
                    pdp: {
                        select: {
                            completo: true
                        }
                    },
                    classe: true
                },
                orderBy: [
                    { classeId: 'asc'},
                    { cognome: 'asc' }
                ],
                where: {
                    bes: true,
                    can_login: true    
                }            
            });

            return {
                studenti
            }
        }
    } catch (exception) {
        catch_error(exception, "la ricerca", 100);
    }
}

//format the answer for 4 columns grid
function format_grid1_4d(grid) {
    grid.map((q) => {
        q.answers.forEach((a) => {
            q[`dans_${a.aid}`] = a.aid == q.answer ? 'X' : ''; 
        })
    });

    return grid;
}

function format_grid1_4s(grid1, grid2) {
     grid1.map((q,i) => {
        grid2[i].answers.forEach((a) => {
            q[`sans_${a.aid}`] = a.aid == grid2[i].answer ? 'X' : ''; 
        })
    });

    return grid1;
}

//format the answer for SI/NO questions
function format_grid_5d(grid) {
    grid.map((q) => {
        q['dans'] = q.answer == 'a' ? 'SI' : 'NO'; 
    });

    return grid;
}

export const actions = {
    pdf: async ({ cookies, request }) => {
		let buf;
		try {
			const form_data = await request.formData();
			const student_id = form_data.get('id');

            //the document to render is made by many parts
            //one evaluation grid coming from the student object
            //and 3 section (dispenative, compensative and valutative)
            //for each materia belonging to the class the student is subscribed

			// get griglia osservativa for student
            const studente = await SARP.Utente.findUnique({
                where: { id: +student_id },
                include: {
                    classe: {
                        select: {
                            coordinatore: true,
                            classe: true,
                            istituto: true,
                            sezione: true
                        }
                    }
                }
            });
                
            //prepare the valutazione grids
            //Qui è un gran casino in quanto stato fatto in fasi successive
            //In ogni acso prima preparo le varie griglie per con le risposte del tutor di classe
            //poi arricchisco la griglia con le risposte dello studente
            let dvalutazione = JSON.parse(studente.griglia_valutazione);
            let svalutazione = JSON.parse(studente.griglia_pdp_c1);
            let dgriglia1 = dvalutazione.slice(0, 20);
            let dsgriglia2 = dvalutazione.slice(20, 23);
            let sgriglia2 = svalutazione.slice(0, 3);
            let dsgriglia3 = dvalutazione.slice(23, 28);
            let sgriglia3 = svalutazione.slice(3, 8);
            let dsgriglia4 = dvalutazione.slice(28, 32);
            let sgriglia4 = svalutazione.slice(8, 12);
            let dgriglia5 = dvalutazione.slice(32);
            
            //set an X to the right answer column
            dgriglia1 = format_grid1_4d(dgriglia1);
            dsgriglia2 = format_grid1_4d(dsgriglia2);
            dsgriglia2 = format_grid1_4s(dsgriglia2, sgriglia2);
            dsgriglia3 = format_grid1_4d(dsgriglia3);
            dsgriglia3 = format_grid1_4s(dsgriglia3, sgriglia3);
            dsgriglia4 = format_grid1_4d(dsgriglia4);
            dsgriglia4 = format_grid1_4s(dsgriglia4, sgriglia4);
            dgriglia5 = format_grid_5d(dgriglia5);

            //now get the section for the different materie
            const pdp = await SARP.PDP.findMany({
                where: { 
                    idStudente: +student_id,
                    anno: get_as()
                },
                include: {
                    insegnamento: {
                        select: {
                            id: true,
                            materia: true,
                            docente: true
                        }
                    }
                }          
            });
                  
            let materie = [];
            let firme = [];
            pdp.forEach(p => {
                let dispensative = JSON.parse(p.dispensative).filter(d => d.selected == true);
                let compensative = JSON.parse(p.compensative).filter(d => d.selected == true);
                let valutative = JSON.parse(p.valutative).filter(d => d.selected == true);

                let materia = {
                    materia: p.insegnamento.materia.nome, 
                    docente: `${p.insegnamento.docente.nome} ${p.insegnamento.docente.cognome}`,
                    prefix: '',
                    altro_compensative: p.altro_compensative,
                    altro_dispensative: p.altro_dispensative,
                    altro_valutative: p.altro_valutative,
                    dispensative: dispensative,
                    dispensative_yes: dispensative.length > 0,
                    dispensative_no: dispensative.length == 0,
                    compensative: compensative,
                    compensative_yes: compensative.length > 0,
                    compensative_no: compensative.length == 0,
                    valutative: valutative,
                    valutative_yes: valutative.length > 0,
                    valutative_no: valutative.length == 0
                };
                let firma = { materia: materia.materia, docente: materia.docente};
                
                materie.push(materia);
                firme.push(firma);
            });
            
            //prepare the object to render the template
            let renderer = {};
            renderer['nome'] = studente.nome;
            renderer['cognome'] = studente.cognome;
            renderer['nato_a'] = studente.natoA;
            renderer['nato_il'] = studente.natoIl.toLocaleDateString("it-IT");
            renderer['classe'] = `${studente.classe.classe} ${studente.classe.istituto} ${studente.classe.sezione}`;
            renderer['tutor'] = `${studente.classe.coordinatore.nome} ${studente.classe.coordinatore.cognome}`;
            renderer['griglia1'] = dgriglia1;
            renderer['griglia2'] = dsgriglia2;
            renderer['griglia3'] = dsgriglia3;
            renderer['griglia4'] = dsgriglia4;
            renderer['griglia5'] = dgriglia5;
            renderer['materie'] = materie;
            renderer['firme'] = firme; 
            
            //Preparo per il rendering della sezione Mi Presento al consiglio di classe
            //le chiavi hanno già il nome corretto, basta che le aggiungo alll'oggetto renderer
            let mipresento = JSON.parse(studente.griglia_pdp_a1);
            renderer = Object.assign(renderer, mipresento);

            let educativo = JSON.parse(studente.griglia_pdp_c2);
            educativo.forEach(q => {
                renderer[`griglia_c2_${q.qid}`] = q.answer;
                if(q.qid == 1) {
                    renderer['griglia_c2_1_disc'] = q.disc_1;
                    renderer['griglia_c2_1_cad'] = q.cadenza_1;
                    renderer['griglia_c2_2_disc'] = q.disc_2;
                    renderer['griglia_c2_2_cad'] = q.cadenza_2;
                    renderer['griglia_c2_3_disc'] = q.disc_3;
                    renderer['griglia_c2_3_cad'] = q.cadenza_3;
                    renderer['griglia_c2_4_disc'] = q.disc_4;
                    renderer['griglia_c2_4_cad'] = q.cadenza_4;
                }
                if(q.qid == 17 || q.qid == 18) 
                    renderer[`griglia_c2_${q.qid}_YN`] = q.answer.length > 0 ? 'SI' : 'NO'; 
            });

			const content = fs.readFileSync(
				path.resolve(PUBLIC_PDP_TEMPLATES_DIR, PUBLIC_PDP_TEMPLATE),
				'binary'
			);

			const zip = new PizZip(content);

			const doc = new Docxtemplater(zip, {
				paragraphLoop: true,
				linebreaks: true,
                parser: custom_tags_parser
			});
            
            doc.render(renderer);
    
			buf = doc.getZip().generate({
				type: 'nodebuffer',
				compression: 'DEFLATE'
			});

			return {
				file: JSON.stringify(buf), // Convertiamo il buffer in stringa sennò sveltekit va in errore
				// nome_documento: `PDP-${docx_programmazione_template.classe.replace(' ', '_')}.docx`
                nome_documento: `PDP_${studente.cognome}_${studente.nome}.docx`
			};
		} catch (exception) {
            console.log(exception)
			catch_error_pdf(exception, 'la generazione', 204);
		}
	}
}
