import { PUBLIC_PROGRAMMAZIONE_ANNUALE_TEMPLATE, PUBLIC_PROGRAMMAZIONE_ANNUALE_TEMPLATES_DIR } from "$env/static/public";
import { access_protect, is_primo_quadrimestre, route_protect, upper_first_letter, user_id, custom_tags_parser } from "$js/helper";
import { PrismaDB } from "$js/prisma_db.js";
import path from 'path';
import fs from 'fs';
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";

const resource = "programmazione_classe";

const SARP = new PrismaDB();

export async function load({ locals }) {
    let action = 'read';

    route_protect(locals);
    access_protect(200, locals, action, resource);
    SARP.set_session(locals);
	const insegnamenti = await SARP.insegnamenti.findMany({});

	let classi = await SARP.classe.findMany({});

	classi = classi.map(classe => {
		const current_insegnamento = insegnamenti.filter(insegnamento => insegnamento.idClasse == classe.id)
		// per default il programma non è completo
        let programma_q1_completo = false;
        let programma_q2_completo = false;

        // se c'e' un insegnamento determiniamo se è completo o no
        if(current_insegnamento.length != 0) {
            programma_q1_completo = current_insegnamento.filter(insegnamento => insegnamento.programma_primo_quadrimestre_completo).length == current_insegnamento.length
		    programma_q2_completo = current_insegnamento.filter(insegnamento => insegnamento.programma_secondo_quadrimestre_completo).length == current_insegnamento.length
        }

		return {
			...classe,
			"programmazione_q1_completa": programma_q1_completo,
			"programmazione_q2_completa": programma_q2_completo,
			"programmazione_completa": programma_q1_completo || programma_q2_completo
		}
	})
    return {
        classi: classi,
    };
}

export const actions = {
    pdf: async ({ cookies, request }) => {
		let buf;
		try {
			const form_data = await request.formData();
			const id = form_data.get('id');

			// preleva la classe dal DB
			let classe = await SARP.classe.findUnique({
				where: { id: +id },
				include: {
					insegnamenti: true,
					iscritti: true
				}
			});
			
			let insegnamenti = await SARP.insegnamenti.findMany({
				where: {
					idClasse: classe?.id
				},
				include: {
					docente: true,
					materia: true
				}
			})

			let materie_programmi = null;

			if(is_primo_quadrimestre()){
				materie_programmi = insegnamenti.map(insegnamento => {
					const programma = JSON.parse(insegnamento.programma_primo_quadrimestre);
					const libri = programma[2].libri.split('~'); // Sappiamo che l'array è composto da:	Q1, Q2, Libri
					const note = programma[2].note;
					return {
						nome: insegnamento.materia.nome,
                        professore: upper_first_letter(insegnamento.docente.nome).concat(" ").concat(upper_first_letter(insegnamento.docente.cognome)), 
						libri: libri,
						argomenti_q1: programma[0],
						argomenti_q2: programma[1],
						note: note,
                        hasNote: note.length > 0 
					}
				});
			} else {
				materie_programmi = insegnamenti.map(insegnamento => {
					const programma = JSON.parse(insegnamento.programma_secondo_quadrimestre);
					const libri = programma[2].libri.split('~'); // Sappiamo che l'array è composto da:	Q1, Q2, Libri
					return {
						nome: insegnamento.materia.nome, 
						professore: upper_first_letter(insegnamento.docente.nome).concat(" ").concat(upper_first_letter(insegnamento.docente.cognome)),
						libri: libri,
                        hasLibri: libri.length > 0,
						argomenti_q1: programma[0],
						argomenti_q2: programma[1],
                        note: note,
                        hasNote: note.length > 0 
					}
				});
			}

			const docenti_name = insegnamenti.map(insegnamento => {
				return {
					materia: insegnamento.materia.nome,
					docente: `${upper_first_letter(insegnamento.docente.nome)} ${upper_first_letter(insegnamento.docente.cognome)}`,
					classroom: insegnamento.code_classroom
				}
			});

			const studenti_name = classe?.iscritti.map((studente, index )=> {
				return {
					id: index + 1,
					cognome: upper_first_letter(studente.cognome),
					nome: upper_first_letter(studente.nome)
				}
			})

			let docx_programmazione_template = {
				classe: `${classe?.classe} ${classe?.istituto} ${classe?.sezione}`,
				docenti: docenti_name,
				studenti: studenti_name,
				materie: materie_programmi,
			}

			const content = fs.readFileSync(
				path.resolve(PUBLIC_PROGRAMMAZIONE_ANNUALE_TEMPLATES_DIR, PUBLIC_PROGRAMMAZIONE_ANNUALE_TEMPLATE),
				'binary'
			);

			const zip = new PizZip(content);

			const doc = new Docxtemplater(zip, {
				paragraphLoop: true,
				linebreaks: true,
                parser: custom_tags_parser
			});
            
            doc.render(docx_programmazione_template);

			buf = doc.getZip().generate({
				type: 'nodebuffer',
				compression: 'DEFLATE'
			});

			return {
				file: JSON.stringify(buf), // Convertiamo il buffer in stringa sennò sveltekit va in errore
				nome_documento: `Programmazione-${docx_programmazione_template.classe.replace(' ', '_')}.docx`
			};
		} catch (exception) {
			console.log(exception)
			//catch_error_pdf(exception, 'la generazione', 204);
		}
	}
}
