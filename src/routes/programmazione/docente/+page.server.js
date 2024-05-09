// @ts-ignore
// @ts-ignore
import { PrismaDB } from "$js/prisma_db.js";
import { PUBLIC_PROGRAMMAZIONE_ANNUALE_TEMPLATE, PUBLIC_PROGRAMMAZIONE_ANNUALE_TEMPLATES_DIR } from "$env/static/public";
import { multi_user_field_where, access_protect, is_primo_quadrimestre, route_protect, upper_first_letter, titlecase, custom_tags_parser } from "$js/helper";
import path from 'path';
import fs from 'fs';
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";


const resource = "programmazione_docente";

const SARP = new PrismaDB();

// @ts-ignore
export async function load({ locals }) {
    let action = 'read';

    route_protect(locals);
    access_protect(200, locals, action, resource);
    SARP.set_session(locals);

    let where_search = multi_user_field_where('idDocente', locals);
    where_search['titolare'] = true;   

    let insegnamenti = await SARP.insegnamenti.findMany({
        where: where_search,
        include: {
            materia: true,
            classe: {
                select: {
                    id: true,
                    classe: true,
                    istituto: true,
                    sezione: true
                },
            },
            docente: {
                select: {
                    cognome: true,
                }
            }
        },
        orderBy: [
            {classe: {istituto: 'asc'}},
            {classe: {sezione: 'asc'}},
            {classe: {classe: 'asc'}},
        ]
    })

    // Client side non funziona quindi lo faccio nel server
    insegnamenti.forEach(insegnamento => {
        insegnamento.classe.classe += " " + insegnamento.classe.sezione + " " + insegnamento.classe.istituto;
        insegnamento["programma_primo_quadrimestre_presente"] = insegnamento.programma_primo_quadrimestre != null;
        //bug, come minimo,  di magia nera voodo e tranasologia assieme
        // se la proprietà si chiama programma_secondo_quadrimestre_presente l'icona si sposta a destra di 13 pixel
        insegnamento["programma_secondo_quadrimestre_presente_"] = insegnamento.programma_secondo_quadrimestre != null;
        insegnamento['can_print'] = false;
        if(is_primo_quadrimestre() && insegnamento.programma_primo_quadrimestre != null)
            insegnamento['can_print'] = true;
        if(!is_primo_quadrimestre() && insegnamento.programma_secondo_quadrimestre != null)
            insegnamento['can_print'] = true;
    });

    return {
        templates: await SARP.programmazione_Template.findMany({
            include: {
                materia: true
            }
        }),
        insegnamenti: insegnamenti
    };
}

export const actions = {
    update: async ({ request, locals }) => {
        let action = 'update';

        route_protect(locals);
        access_protect(200, locals, action, resource);

        const form = await request.formData();
        const primo_quadrimestre = form.get("argomenti_primo_quadrimestre");
        const secondo_quadrimestre = form.get("argomenti_secondo_quadrimestre");
        const quadrimestri = [JSON.parse(primo_quadrimestre), JSON.parse(secondo_quadrimestre)];
        quadrimestri.push({ // Aggiungo i libri
            libri: form.get("libri"),
            note: form.get("note")
        })
        if (is_primo_quadrimestre()) {
            await SARP.insegnamenti.update({
                where: {
                    id: parseInt(form.get("id"))
                },
                data: {
                    programma_primo_quadrimestre_completo: form.get("conferma") === "SI",
                    programma_primo_quadrimestre: JSON.stringify(quadrimestri),
                    code_classroom: form.get('code_classroom')
                }
            });
        } else {
            await SARP.insegnamenti.update({
                where: {
                    id: parseInt(form.get("id"))
                },
                data: {
                    programma_secondo_quadrimestre_completo: form.get("conferma") === "SI",
                    programma_secondo_quadrimestre: JSON.stringify(quadrimestri),
                    code_classroom: form.get('code_classroom')
                }
            });
        }
        return {action: action, status: 'ok'};
    },
    pdf: async ({ cookies, request }) => {
		let buf;
		try {
			const form_data = await request.formData();
			const id = form_data.get('id');
            let materie_programmi = null;

			let insegnamenti = await SARP.insegnamenti.findMany({
				where: { id: +id },
				include: {
					docente: true,
					materia: true
				}
			})

            // preleva la classe dal DB
			let classe = await SARP.classe.findUnique({
				where: { id: +insegnamenti[0].idClasse },
				include: {
					insegnamenti: true,
					iscritti: true
				}
			});

            //Educazione Civica nel primo trimestre non presenta un programma ma solo una frase fissa
            //mentre nel pentamestre è una materia normale
            //aggiunto il flag render per flessibilità futura 
			if(is_primo_quadrimestre()){
				materie_programmi = insegnamenti.map(insegnamento => {
					const programma = JSON.parse(insegnamento.programma_primo_quadrimestre);
					const libri = programma[2].libri.split('~'); // Sappiamo che l'array è composto da:	Q1, Q2, Libri
                    const note = programma[2].note;
					return {
						nome: insegnamento.materia.nome,
                        professore: upper_first_letter(insegnamento.docente.nome).concat(" ").concat(upper_first_letter(insegnamento.docente.cognome)), 
						libri: libri,
                        hasLibri: libri.length > 0 && libri[0]!= '',
						argomenti_q1: programma[0],
						argomenti_q2: programma[1],
                        note: note,
                        hasNote: note.length > 0,
                        render: insegnamento.materia.nome != 'Educazione Civica' 
                    }
				});
			} else {
				materie_programmi = insegnamenti.map(insegnamento => {
					const programma = JSON.parse(insegnamento.programma_secondo_quadrimestre);
					const libri = programma[2].libri.split('~'); // Sappiamo che l'array è composto da:	Q1, Q2, Libri
                    const note = programma[2].note;
                    return {
						nome: insegnamento.materia.nome, 
						professore: upper_first_letter(insegnamento.docente.nome).concat(" ").concat(upper_first_letter(insegnamento.docente.cognome)),
						libri: libri,
                        hasLibri: libri.length > 0 && libri[0]!= '',
						argomenti_q1: programma[0],
						argomenti_q2: programma[1],
                        note: note,
                        hasNote: note.length > 0,
                        render: true
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
            
            const studenti_name = classe?.iscritti?.sort((a,b) => a.cognome <= b.cognome ? -1:1).map((studente, index )=> {
				return {
					id: index + 1,
                    cognome: titlecase(studente.cognome),
                    nome: titlecase(studente.nome)
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
		}
	}
}