import { PUBLIC_PDP_TEMPLATES_DIR, PUBLIC_PDP_TEMPLATE } from "$env/static/public";
import { access_protect, raise_error, route_protect, custom_tags_parser, get_as } from "$js/helper";
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
			select: {
                id: true,
                nome: true,
                cognome: true,
                griglia_valutazione: true,
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
                let materia = {
                    materia: p.insegnamento.materia.nome, 
                    docente: `${p.insegnamento.docente.nome} ${p.insegnamento.docente.cognome}`,
                    prefix: '',
                    has_altro: p.altro.length > 0,
                    altro: p.altro,
                    dispensative: JSON.parse(p.dispensative).filter(d => d.selected == true),
                    compensative: JSON.parse(p.compensative).filter(d => d.selected == true),
                    valutative: JSON.parse(p.valutative).filter(d => d.selected == true),
                };
                let firma = { materia: materia.materia, docente: materia.docente};
                
                materie.push(materia);
                firme.push(firma);
            });

            //prepare the object to render the template
            let renderer = {};
            renderer['nome'] = studente.nome;
            renderer['cognome'] = studente.cognome 
            renderer['classe'] = `${studente.classe.classe} ${studente.classe.istituto} ${studente.classe.sezione}`;
            renderer['tutor'] = `${studente.classe.coordinatore.nome} ${studente.classe.coordinatore.cognome}`;
            renderer['griglia1'] = griglia1;
            renderer['griglia2'] = griglia2;
            renderer['griglia3'] = griglia3;
            renderer['griglia4'] = griglia4;
            renderer['griglia5'] = griglia5;
            renderer['materie'] = materie;
            renderer['firme'] = firme;

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
			catch_error_pdf(exception, 'la generazione', 204);
		}
	}
}
