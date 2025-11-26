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
    if (exception instanceof PrismaClientValidationError)
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

    route_protect(locals);
    access_protect(200, locals, action, resource);
    SARP.set_session(locals);

    try {
        if (is_admin(locals) || is_tutor_bes(locals)) {
            // get active BES students
            const studenti = await SARP.Utente.findMany({
                select: {
                    id: true,
                    nome: true,
                    cognome: true,
                    griglia_valutazione: true,
                    griglia_valutazione_done: true,
                    griglia_pdp_a: true,
                    griglia_pdp_a_done: true,
                    griglia_pdp_a1: true,
                    griglia_pdp_a1_done: true,
                    griglia_pdp_c1: true,
                    griglia_pdp_c1_done: true,
                    griglia_pdp_c2: true,
                    griglia_pdp_c2_done: true,
                    griglia_pdp_b: true,
                    griglia_pdp_b_done: true,
                    pdp: {
                        select: {
                            completo: true,
                            sintesi_vocale: true,
                            tempo_esteso: true,
                            anno: true
                        }
                    },
                    classe: true
                },
                orderBy: [
                    { classeId: 'asc' },
                    { cognome: 'asc' }
                ],
                where: {
                    tipo: 'STUDENTE',
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
    grid1.map((q, i) => {
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

function sanitize(val) {
    return val ?? '';
}

export const actions = {
    pdf: async ({ cookies, request }) => {
        let buf;
        try {
            const form_data = await request.formData();
            const student_id = form_data.get('id');

            console.log("1")
            //the document to render is made by many parts
            //one evaluation grid coming from the student object
            //and 5 sections (dispenative, compensative,valutative, strategie classe, strategie didattiche)
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

            console.log("2")
            //prepare the valutazione grids
            //Qui è un gran casino in quanto stato fatto in fasi successive
            //In ogni acso prima preparo le varie griglie per con le risposte del tutor di classe
            //poi arricchisco la griglia con le risposte dello studente
            let dgriglia1, dsgriglia2,sgriglia2,dsgriglia3,sgriglia3,dsgriglia4,sgriglia4,dgriglia5;
            let dvalutazione = JSON.parse(studente.griglia_valutazione) || [];
            let svalutazione = JSON.parse(studente.griglia_pdp_c1) || []; 
            
            console.log("3")
            //OLD
            // let dgriglia1 = dvalutazione.slice(0, 20);
            // let dsgriglia2 = dvalutazione.slice(20, 23);
            // let sgriglia2 = svalutazione.slice(0, 3);
            // let dsgriglia3 = dvalutazione.slice(23, 28);
            // let sgriglia3 = svalutazione.slice(3, 8);
            // let dsgriglia4 = dvalutazione.slice(28, 32);
            // let sgriglia4 = svalutazione.slice(8, 12);
            // let dgriglia5 = dvalutazione.slice(32);
            // OLD
            // console.log("1")
            // //set an X to the right answer column
            // dgriglia1 = format_grid1_4d(dgriglia1);
            // console.log("1a")
            // dsgriglia2 = format_grid1_4d(dsgriglia2);
            // console.log("1b")
            // console.log(dsgriglia2)
            // console.log(sgriglia2)
            // dsgriglia2 = format_grid1_4s(dsgriglia2, sgriglia2);
            // console.log("1c")
            // dsgriglia3 = format_grid1_4d(dsgriglia3);
            // dsgriglia3 = format_grid1_4s(dsgriglia3, sgriglia3);
            // console.log("3")
            // dsgriglia4 = format_grid1_4d(dsgriglia4);
            // dsgriglia4 = format_grid1_4s(dsgriglia4, sgriglia4);
            // console.log("4")
            // dgriglia5 = format_grid_5d(dgriglia5);
            // console.log("5")


            //NEW
            //set an X to the right answer column
            if(dvalutazione.length > 0) { //griglia valutazione docenti presente
                dgriglia1 = dvalutazione.slice(0, 20);
                dgriglia1 = format_grid1_4d(dgriglia1);

                dsgriglia2 = dvalutazione.slice(20, 23);
                dsgriglia2 = format_grid1_4d(dsgriglia2);

                dsgriglia3 = dvalutazione.slice(23, 28);
                dsgriglia3 = format_grid1_4d(dsgriglia3);

                dsgriglia4 = dvalutazione.slice(28, 32);
                dsgriglia4 = format_grid1_4d(dsgriglia4);

                dgriglia5 = dvalutazione.slice(32);
                dgriglia5 = format_grid_5d(dgriglia5);
            }

            console.log("4")

            if(svalutazione.length > 0) { //griglia valutazione studente presente
                sgriglia2 = svalutazione.slice(0, 3);
                dsgriglia2 = format_grid1_4s(dsgriglia2, sgriglia2);

                sgriglia3 = svalutazione.slice(3, 8);
                dsgriglia3 = format_grid1_4s(dsgriglia3, sgriglia3);

                sgriglia4 = svalutazione.slice(8, 12);
                dsgriglia4 = format_grid1_4s(dsgriglia4, sgriglia4);
            }
            
            console.log("5")

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

            console.log("6")

            let materie = [];
            let firme = [];
            pdp.forEach(p => {
                let dispensative = JSON.parse(p.dispensative).filter(d => d.selected == true);
                let compensative = JSON.parse(p.compensative).filter(d => d.selected == true);
                let valutative = JSON.parse(p.valutative).filter(d => d.selected == true);
                let strategie_classe = JSON.parse(p.strategie_classe).filter(d => d.selected == true);
                let strategie_didattiche = JSON.parse(p.strategie_didattiche).filter(d => d.selected == true);

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
                    valutative_no: valutative.length == 0,
                    strategie_classe: strategie_classe,
                    strategie_classe_yes: strategie_classe.length > 0,
                    strategie_classe_no: strategie_classe.length == 0,
                    strategie_didattiche: strategie_didattiche,
                    strategie_didattiche_yes: strategie_didattiche.length > 0,
                    strategie_didattiche_no: strategie_didattiche.length == 0,
                    // has_obiettivi_minimi: studente.obiettivi_minimi,
                    has_obiettivi_minimi: p.obiettivi_minimi, //issue-620
                    //argomenti_q1: studente.obiettivi_minimi ? JSON.parse(p.obiettivi_minimi)[0] : [],
                    //argomenti_q2: studente.obiettivi_minimi ? JSON.parse(p.obiettivi_minimi)[1] : []
                    argomenti_q1: p.obiettivi_minimi ? JSON.parse(p.obiettivi_minimi)[0] : [], //issue-620
                    argomenti_q2: p.obiettivi_minimi ? JSON.parse(p.obiettivi_minimi)[1] : []
                };
                let firma = { materia: materia.materia, docente: materia.docente };

                materie.push(materia);
                firme.push(firma);
            });
            
            console.log("7")

            //prepare the object to render the template
            let renderer = {};
            renderer['nome'] = studente.nome;
            renderer['cognome'] = studente.cognome;
            renderer['nato_a'] = studente.natoA;
            renderer['nato_il'] = studente.natoIl.toLocaleDateString("it-IT");
            renderer['classe'] = `${studente.classe.classe} ${studente.classe.istituto} ${studente.classe.sezione}`;
            renderer['tutor'] = `${studente.classe.coordinatore.nome} ${studente.classe.coordinatore.cognome}`;

            console.log("8")
            // OLD
            // renderer['griglia1'] = dgriglia1;
            //     renderer['griglia2'] = dsgriglia2;
            //     renderer['griglia3'] = dsgriglia3;
            //     renderer['griglia4'] = dsgriglia4;
            //     renderer['griglia5'] = dgriglia5;
            if(dvalutazione.length > 0) { //NEW
                renderer['griglia1'] = dgriglia1;
                renderer['griglia2'] = dsgriglia2;
                renderer['griglia3'] = dsgriglia3;
                renderer['griglia4'] = dsgriglia4;
                renderer['griglia5'] = dgriglia5;
            }
            console.log("9")

            renderer['materie'] = materie;
            renderer['firme'] = firme;
            renderer['as'] = `${get_as()}-${get_as() + 1}`;

            // imposto anche il flag condizionale per stampare griglia osservativa docenti o griglia vuota
            renderer['dosservativa_present'] = studente.griglia_valutazione_done;

            console.log("10")

            // per la sezione C ho 4 combinazioni
            // 1- valutazione docente Presente - valutazione alunno Presente
            // 2- valutazione docente Presente - valutazione alunno Assente
            // 3- valutazione docente Assente - valutazione alunno Presente
            // 4- valutazione docente Assente - valutazione alunno Assente
            // Quindi devo renderizzare una di queste 4 varianti
            renderer['autovalutazione_present'] = studente.griglia_pdp_c1_done;
            renderer['c1_option1'] = studente.griglia_valutazione_done && studente.griglia_pdp_c1_done;
            renderer['c1_option2'] = studente.griglia_valutazione_done && !studente.griglia_pdp_c1_done;
            renderer['c1_option3'] = !studente.griglia_valutazione_done && studente.griglia_pdp_c1_done;
            renderer['c1_option4'] = !studente.griglia_valutazione_done && !studente.griglia_pdp_c1_done;

            console.log("11")

            //sezione A
            let sezionea = JSON.parse(studente.griglia_pdp_a);
            console.log(sezionea)
            renderer['a_present'] = studente.griglia_pdp_a_done;
            renderer = Object.assign(renderer, sezionea);
            
            console.log("12")

            //OLD
            //metto apposto le date facendo una porcata per mancanza di tempo
            // console.log("9A:", renderer['relazione_ssn_data']?.length)
            // renderer['relazione_ssn_data'] = renderer['relazione_ssn_data'].length != 10 ? '' : renderer['relazione_ssn_data'];
            // console.log("9A:", renderer['relazione_ssn_data']) 
            // console.log("9b")
            // renderer['relazione_altro_data1'] = renderer['relazione_altro_data1'].length != 10 ? '' : renderer['relazione_altro_data1'];
            // renderer['relazione_altro_data2'] = renderer['relazione_altro_data2'].length != 10 ? '' : renderer['relazione_altro_data2'];
            // console.log("9c")
            // renderer['relazione_altro_data3'] = renderer['relazione_altro_data3'].length != 10 ? '' : renderer['relazione_altro_data3'];
            // renderer['relazione_altro_data4'] = renderer['relazione_altro_data4'].length != 10 ? '' : renderer['relazione_altro_data4'];
            // renderer['relazione_altro_data5'] = renderer['relazione_altro_data5'].length != 10 ? '' : renderer['relazione_altro_data5'];

            //NEW
             if(renderer['a_present']) {
                //metto apposto le date facendo una porcata per mancanza di tempo
                // renderer['relazione_ssn_data'] = renderer['relazione_ssn_data'].length != 10 ? '' : renderer['relazione_ssn_data'];
                // console.log("12a")
                // renderer['relazione_altro_data1'] = renderer['relazione_altro_data1'].length != 10 ? '' : renderer['relazione_altro_data1'];
                // console.log(renderer['relazione_altro_data1'])
                // console.log("12b")
                // renderer['relazione_altro_data2'] = renderer['relazione_altro_data2'].length != 10 ? '' : renderer['relazione_altro_data2'];
                // console.log("12c")
                // renderer['relazione_altro_data3'] = renderer['relazione_altro_data3'].length != 10 ? '' : renderer['relazione_altro_data3'];
                // console.log("12d")
                // renderer['relazione_altro_data4'] = renderer['relazione_altro_data4'].length != 10 ? '' : renderer['relazione_altro_data4'];
                // console.log("12e")
                // renderer['relazione_altro_data5'] = renderer['relazione_altro_data5'].length != 10 ? '' : renderer['relazione_altro_data5'];
                // console.log("12f")

                renderer['relazione_ssn_data'] = sanitize(renderer['relazione_ssn_data']);
                console.log("12a")
                renderer['relazione_altro_data1'] = sanitize(renderer['relazione_altro_data1']);
                console.log("12b")
                renderer['relazione_altro_data2'] = sanitize(renderer['relazione_altro_data2']);
                console.log("12c")
                renderer['relazione_altro_data3'] = sanitize(renderer['relazione_altro_data3']);
                console.log("12d")
                renderer['relazione_altro_data4'] = sanitize(renderer['relazione_altro_data4']);
                console.log("12e")
                renderer['relazione_altro_data5'] = sanitize(renderer['relazione_altro_data5']);
                console.log("12f")

                renderer['relazione_altro_redattore1'] = sanitize(renderer['relazione_altro_redattore1']);
                renderer['relazione_altro_redattore2'] = sanitize(renderer['relazione_altro_redattore2']);
                renderer['relazione_altro_redattore3'] = sanitize(renderer['relazione_altro_redattore3']);
                renderer['relazione_altro_redattore4'] = sanitize(renderer['relazione_altro_redattore4']);
                renderer['relazione_altro_redattore5'] = sanitize(renderer['relazione_altro_redattore5']);
             }

             console.log("13")

            //Preparo per il rendering della sezione Mi Presento al consiglio di classe
            //le chiavi hanno già il nome corretto, basta che le aggiungo alll'oggetto renderer
            let mipresento = JSON.parse(studente.griglia_pdp_a1);

            //decido quale sezione mi presento renderizzare
            renderer['a1_present'] = studente.griglia_pdp_a1_done;
            renderer = Object.assign(renderer, mipresento);

            let educativo = JSON.parse(studente.griglia_pdp_c2) || [];
             // imposto anche il flag condizionale per stampare griglia patto educativo o griglia vuota
            renderer['pattoeducativo_present'] = studente.griglia_pdp_c2_done;
            educativo.forEach(q => {
                renderer[`griglia_c2_${q.qid}`] = q.answer;
                if (q.qid == 1) {
                    renderer['griglia_c2_1_disc'] = q.disc_1;
                    renderer['griglia_c2_1_cad'] = q.cadenza_1;
                    renderer['griglia_c2_2_disc'] = q.disc_2;
                    renderer['griglia_c2_2_cad'] = q.cadenza_2;
                    renderer['griglia_c2_3_disc'] = q.disc_3;
                    renderer['griglia_c2_3_cad'] = q.cadenza_3;
                    renderer['griglia_c2_4_disc'] = q.disc_4;
                    renderer['griglia_c2_4_cad'] = q.cadenza_4;
                }
                if (q.qid == 17 || q.qid == 18)
                    renderer[`griglia_c2_${q.qid}_YN`] = q.answer.length > 0 ? 'SI' : 'NO';
            });

            //griglia abilità B (Griglia Diagnosi)
            // render della griglia condizionale
            // se non è presente render griglia vuota
            let griglia_abilita = JSON.parse(studente.griglia_pdp_b);
            renderer['b_present'] = studente.griglia_pdp_b_done;
            renderer = Object.assign(renderer, griglia_abilita);

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
                nome_documento: `PDP_${studente.cognome}_${studente.nome}.docx`.replace(' ', '_')
            };
        } catch (exception) {
            console.log(exception)
            catch_error_pdf(exception, 'la generazione', 204);
        }
    }
}
