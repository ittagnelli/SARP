import { PrismaDB } from '$js/prisma_db';
import { route_protect, user_id, multi_user_where, raise_error, access_protect, get_as } from '$js/helper';
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
    if (exception instanceof PrismaClientValidationError)
        logger.error(exception.message);
    else {
        logger.error(JSON.stringify(exception));
        logger.error(exception.message);
        logger.error(exception.stack);
    }
    raise_error(500, code, `Errore irreversibile durante ${type} dello stage. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`); // TIMESTAMP ci serve per capire l'errore all'interno del log
}

function catch_error_pdf(exception, type, code) {
    logger.error(JSON.stringify(exception));
    raise_error(
        500,
        code,
        `${type} TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`
    );
}

const convert_date = (d) => {
    let data = d
        .toLocaleDateString('it-IT', { year: 'numeric', month: '2-digit', day: '2-digit' })
        .split('/');
    return `${data[0]}-${data[1]}-${data[2]}`;
};

const generate_file = (template_file, data) => {
    const template = fs.readFileSync(
        path.resolve(PUBLIC_PCTO_TEMPLATES_DIR, template_file),
        'binary'
    );

    const doc = new Docxtemplater(new PizZip(template), {
        paragraphLoop: true,
        linebreaks: true
    });

    doc.render(data);

    let buf = doc.getZip().generate({
        type: 'nodebuffer',
        compression: 'DEFLATE'
    });

    return buf;
}

export async function load({ locals }) {
    let action = 'read';

    route_protect(locals);
    access_protect(500, locals, action, resource);

    try {
        let where_clause = multi_user_where(locals);
        //where_clause['anno_scolastico'] = get_as();
        where_clause['anno_scolastico'] = {
            gt: get_as() - 2 // visualizza gli stage anche dell'anno passato
        }

        // query SQL al DB per tutte le entry nella tabella todo
        const stages = await SARP.pcto_Pcto.findMany({
            orderBy: [{ anno_scolastico: 'desc' }],
            where: where_clause,
            include: {
                offertoDa: true,
                svoltoDa: true,
                tutor_scolastico: true
            }
        });

        const companies = await SARP.pcto_Azienda.findMany({
            orderBy: [{ nome: 'asc' }],
            where: {
                protocollata: true
            }
        });

        const utenti = await SARP.Utente.findMany({
            where: { can_login: true },
            orderBy: [{ cognome: 'asc' }],
            include: { ruoli: true }
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

        if (studenti != '') {
            studenti.forEach(element => {
                ids.push({ id: +element })
            });
        }

        SARP.set_session(locals); // passa la sessione all'audit
        try {
            await SARP.pcto_Pcto.create({
                data: {
                    creatoDa: user_id(locals),
                    titolo: form_data.get('titolo'),
                    sede_stage: form_data.get('sede_stage'),
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
                    orario_accesso: form_data.get('orario_accesso'),
                    idAzienda: +form_data.get('azienda'),
                    svoltoDa: {
                        connect: ids
                    },
                    firma_pcto: form_data.get('firma_pcto') == "SI" ? true : false,
                    task1: form_data.get('task1'),
                    task2: form_data.get('task2'),
                    task3: form_data.get('task3'),
                    task4: form_data.get('task4'),
                    attrezzature: form_data.get('attrezzature')
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
            if (+element > 0) ids.push({ id: +element })
        });

        SARP.set_session(locals); // passa la sessione all'audit
        try {
            await SARP.pcto_Pcto.update({
                where: { id: +id },
                data: {
                    titolo: form_data.get('titolo'),
                    sede_stage: form_data.get('sede_stage'),
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
                    orario_accesso: form_data.get('orario_accesso'),
                    svoltoDa: {
                        set: ids
                    },
                    firma_pcto: form_data.get('firma_pcto') == "SI" ? true : false,
                    task1: form_data.get('task1'),
                    task2: form_data.get('task2'),
                    task3: form_data.get('task3'),
                    task4: form_data.get('task4'),
                    attrezzature: form_data.get('attrezzature')
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

            // preleva il PCTO dal DB
            let pcto = await SARP.pcto_Pcto.findUnique({
                where: { id: +id },
                include: {
                    offertoDa: true,
                    tutor_scolastico: true,
                    svoltoDa: {
                        include: {
                            classe: true
                        }
                    }
                }
            });

            //informazioni comuni per compilazione documento #2 convenzione stage
            let ddata = {};
            ddata['P_AS'] = String(helper.get_as());
            ddata['P_CONVENZIONE'] = pcto?.offertoDa.idConvenzione;
            ddata['A_NOME'] = pcto?.offertoDa.nome;
            ddata['A_SEDE_LEGALE'] = pcto?.offertoDa.indirizzo;
            ddata['A_SEDE_SVOLGIMENTO'] = pcto?.sede_stage;
            ddata['P_INIZIO'] = convert_date(pcto?.dataInizio);
            ddata['P_FINE'] = convert_date(pcto?.dataFine);
            ddata['P_ORARIO_ACCESSO'] = pcto?.orario_accesso;
            ddata['A_ATTIVITA_1'] = pcto?.task1 || '';
            ddata['A_ATTIVITA_2'] = pcto?.task2 || '';
            ddata['A_ATTIVITA_3'] = pcto?.task3 || '';
            ddata['A_ATTIVITA_4'] = pcto?.task4 || '';
            ddata['A_ATTREZZATURE'] = pcto?.attrezzature || '';
            ddata['A_TUTOR'] = pcto?.tutor_aziendale;
            ddata['A_TUTOR_CELL'] = pcto?.tutor_telefono;
            ddata['A_TUTOR_EMAIL'] = pcto?.tutor_email;
            ddata['P_TUTOR'] = pcto?.tutor_scolastico?.cognome + ' ' + pcto?.tutor_scolastico?.nome;
            ddata['P_TUTOR_CELL'] = pcto?.tutor_scolastico?.telefono;
            ddata['P_TUTOR_EMAIL'] = pcto?.tutor_scolastico?.email;
            ddata['P_DATA_STIPULA'] = convert_date(new Date());

            //genero il documento #2 per ogni studente con le informazioni specifiche
            for (let studente of pcto?.svoltoDa) {
                let uid = helper.get_uid();
                // con la nuova protocollazione del 2025 questi numero protocolli non servono 
                // si inserisce solo un riferimento al protocollo/convenzione aziendale
                // ddata['N_PROTOCOLLO_CS'] = ddata['P_CONVENZIONE'] + '-CS-' + uid;
                // ddata['N_PROTOCOLLO_PF'] = ddata['P_CONVENZIONE'] + '-PF-' + uid;
                ddata['S_NOME'] = studente.cognome + ' ' + studente.nome;
                ddata['S_NATOA'] = studente.natoA || '';
                ddata['S_NATOIL'] = convert_date(studente.natoIl);
                ddata['S_RESIDENZA'] = studente.residenza || '';
                ddata['S_CF'] = studente.codiceF || '';
                ddata['S_CI'] = studente.cartaI || '';
                ddata['S_TELEFONO'] = studente.telefono || '';
                ddata['S_EMAIL'] = studente.email || '';
                ddata['S_CLASSE'] = studente.classe.classe;
                ddata['S_SEZIONE'] = studente.classe.sezione;

                return_files.push({
                    file: JSON.stringify(generate_file(PUBLIC_PCTO_TEMPLATE_CONVENZIONE_STUDENTE, ddata)),
                    name: `02-Convenzione_studente_${studente.cognome}_${studente.nome}.docx`.replace(' ', '_')
                },
                    {
                        file: JSON.stringify(generate_file(PUBLIC_PCTO_TEMPLATE_PATTO_FORMATIVO, ddata)),
                        name: `03-Patto_formativo_studente_${studente.cognome}_${studente.nome}.docx`.replace(' ', '_')
                    }
                );

                logger.info(`Generato Convezione Studente per ${studente.cognome}_${studente.nome}`);
                logger.info(`Generato Patto Formativo per ${studente.cognome}_${studente.nome}`);
            }
            return { files: return_files };
        } catch (exception) {
            catch_error_pdf(exception, 'la generazione', 304);
        }
    }
};
