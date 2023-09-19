import { json } from '@sveltejs/kit';
import { PrismaDB } from '$js/prisma_db';
import { route_protect, raise_error, user_id } from '$js/helper';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import { qna_generico_db_str } from './qna_generico_db.js';
import { qna_specifico_db_str } from './qna_specifico_db.js';
import { Logger } from '$js/logger';

let logger = new Logger("server"); //instanzia il logger
const SARP = new PrismaDB(); //Istanzia il client SARP DB

function catch_error(exception, code) {
    if(exception instanceof PrismaClientValidationError)
        logger.error(exception.message);
    else {  
        logger.error(JSON.stringify(exception));
        logger.error(exception.message);
        logger.error(exception.stack);
    }
    raise_error(500, code, `Errore irreversibile nella creazione dei quiz di sicurezza. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`);
}

export async function GET({ request, url, locals }) {
    route_protect(locals);

    let corso_id = Number(url.searchParams.get("corso"));
    return json(corso_id);
}

async function generate_scrambled_questions(type) {
    let questions;
    
    //deep copy the right qna set and remove the correct answer
    if(type == 'GENERICO') {
        const qna_generico_db = JSON.parse(qna_generico_db_str);
        questions = qna_generico_db.map(qna => { delete qna.answer; return qna});
    } else {
        const qna_specifico_db = JSON.parse(qna_specifico_db_str);
        questions = qna_specifico_db.map(qna => { delete qna.answer; return qna});
    }

    //shuffle the questions array
    questions = questions.sort(() => 0.5 - Math.random());

    return {questions: questions, n_questions: questions.length};
}       

// crea un test di sicurezza per ogni studente di un dato corso
export async function POST({ request, url, locals }) {
    route_protect(locals);
    const json_data = await request.json();

    SARP.set_session(locals); // passa la sessione all'audit
    try {
        json_data.studenti.forEach(async studente => {
            const { questions, n_questions } = await generate_scrambled_questions(json_data.type);
            await SARP.sicurezza_Test.create({
                data: {
                    creatoDa: user_id(locals),
                    tipo: json_data.type,
                    domande: JSON.stringify(questions),
                    punti_max: n_questions,
                    svoltoDa: studente,
                    idCorso: json_data.corso
                }
            });
        });

        await SARP.sicurezza_Corso.update({
            where: { id: +json_data.corso },
            data: {
                somministrato: true
            }
        }); 
    } catch (exception) {
        console.log("EXCEPTION:", exception)
        catch_error(exception, 1001);
    }

    return json('ok');
}
