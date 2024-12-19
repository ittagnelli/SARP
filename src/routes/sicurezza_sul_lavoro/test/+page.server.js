import { PrismaDB } from '../../../js/prisma_db';
import { route_protect, multi_user_sicurezza_where, raise_error, access_protect } from '../../../js/helper';
import { Logger } from '../../../js/logger';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import { qna_generico_db_str } from './qna_generico_db';
import { qna_specifico_db_str } from './qna_specifico_db';
import { qna_alto_rischio_db_str } from './qna_alto_rischio_db';
import { PUBLIC_POINT_MIN_GENERICO } from '$env/static/public';
import { PUBLIC_POINT_MIN_SPECIFICO } from '$env/static/public';
import { PUBLIC_POINT_MIN_ALTO_RISCHIO } from '$env/static/public';


let logger = new Logger("server"); //instanzia il logger
const SARP = new PrismaDB(); //Istanzia il client SARP DB
let resource = "sicurezza_test"; // definisco il nome della risorsa di questo endpoint

// @ts-ignore
function catch_error(exception, type, code) {
    if (exception instanceof PrismaClientValidationError)
        logger.error(exception.message);
    else {
        logger.error(JSON.stringify(exception));
        logger.error(exception.message);
        logger.error(exception.stack);
    }
    raise_error(500, code, `Errore irreversibile durante ${type} dello test di sicurezza. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`); // TIMESTAMP ci serve per capire l'errore all'interno del log
}

export async function load({ locals }) {
    let action = 'read';

    route_protect(locals);
    access_protect(500, locals, action, resource);

    try {
        // query SQL al DB per tutte le entry nella tabella todo
        const test = await SARP.sicurezza_Test.findMany({
            orderBy: [{ id: 'desc' }],
            where: multi_user_sicurezza_where(locals),
            include: {
                studente: true,
                corso: true
            }
        });

        // restituisco il risultato della query SQL
        return {
            test: test
        }
    } catch (exception) {
        catch_error(exception, "la ricerca", 1000);
    }
}

function quiz_n_questions(type) {
    if (type == 'GENERICO') {
        const qna_generico_db = JSON.parse(qna_generico_db_str);
        return { q_end: qna_generico_db.length, qna_db: qna_generico_db };
    } else if (type == 'SPECIFICO'){
        const qna_specifico_db = JSON.parse(qna_specifico_db_str);
        return { q_end: qna_specifico_db.length, qna_db: qna_specifico_db };
    } else {
        const qna_alto_rischio_db = JSON.parse(qna_alto_rischio_db_str);
        return { q_end: qna_alto_rischio_db.length, qna_db: qna_alto_rischio_db };
    }
}

function correct_answers(q_end, form_data, qna_db) {
    let tot_punti = 0;
    let answers = [];

    //let's correct answer and calculate score
    for (let q = 1; q <= q_end; q++) {
        if (form_data.has(q)) {
            let u_answer = form_data.get(q);
            let q_answer = qna_db.filter(quiz => quiz.qid == q)[0];

            if (u_answer == q_answer.answer) tot_punti++;

            answers.push({
                qid: q,
                answer: u_answer
            });
        }
    }
    return { tot_punti, answers };
}

function test_passed(type, points) {
    if (type == 'GENERICO')
        return points >= PUBLIC_POINT_MIN_GENERICO;
    else if (type == 'SPECIFICO')
        return points >= PUBLIC_POINT_MIN_SPECIFICO;
    else if (type == 'ALTO RISCHIO')
        return points >= PUBLIC_POINT_MIN_ALTO_RISCHIO;
}

export const actions = {
    run: async ({ cookies, request, locals }) => {
        let action = 'create';

        route_protect(locals);
        access_protect(501, locals, action, resource);

        const form_data = await request.formData();
        let id_test = form_data.get('id_test');
        let type_test = form_data.get('type_test');
        let { q_end, qna_db } = quiz_n_questions(type_test);

        let { tot_punti, answers } = correct_answers(q_end, form_data, qna_db);
        let passed = test_passed(type_test, tot_punti);

        //update the test with missing data
        SARP.set_session(locals); // passa la sessione all'audit
        try {
            await SARP.sicurezza_Test.update({
                where: { id: +id_test },
                data: {
                    svolto: true,
                    superato: passed,
                    risposte: JSON.stringify(answers),
                    punti: tot_punti
                }
            });
        } catch (exception) {
            catch_error(exception, "l'aggiornamento", 1002);
        }
    }
};
