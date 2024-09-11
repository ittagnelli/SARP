import { PrismaDB } from '$js/prisma_db';
import { route_protect, raise_error, is_admin, user_id, access_protect, is_tutor_classe, is_tutor_bes } from '$js/helper';
import { Logger } from '$js/logger';
import { fail } from '@sveltejs/kit';
import { PrismaClientValidationError } from '@prisma/client/runtime';

let logger = new Logger("server"); //instanzia il logger
const SARP = new PrismaDB(); //Istanzia il client SARP DB
let resource = "pdp_patto_educativo"; // definisco il nome della risorsa di questo endpoint

// @ts-ignore
function catch_error(exception, type, code) {
    if (exception instanceof PrismaClientValidationError)
        logger.error(exception.message);
    else {
        logger.error(JSON.stringify(exception));
        logger.error(exception.message);
        logger.error(exception.stack);
    }
    raise_error(500, code, `Errore irreversibile durante ${type} dello studente. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`);    // TIMESTAMP ci serve per capire l'errore all'interno del log
}

export async function load({ locals }) {
    let action = 'read';
    let clausola_where;

    route_protect(locals);
    access_protect(5000, locals, action, resource);

    try {
        if (is_admin(locals) || is_tutor_bes(locals)) {
            clausola_where = {
                tipo: 'STUDENTE',
                bes: true,
                can_login: true
            };

            // query SQL al DB per tutte le entry nella tabella todo
            const studenti = await SARP.Utente.findMany({
                orderBy: [{ tipo: 'desc' }],
                where: clausola_where
            });

            // restituisco il risultato della query SQL
            return {
                studenti
            }
        }
    } catch (exception) {
        catch_error(exception, "la ricerca", 5000);
    }
}

export const actions = {
    update: async ({ cookies, request, locals }) => {
        let action = 'update';

        route_protect(locals);
        access_protect(5001, locals, action, resource);

        const form_data = await request.formData();
        let student_id = form_data.get('student_id');

        SARP.set_session(locals); // passa la sessione all'audit
        try {
            await SARP.Utente.update({
                where: { id: +student_id },
                data: {
                    griglia_pdp_c2: form_data.get('griglia_pdp_c2'),
                    griglia_pdp_c2_done: form_data.get("completo") === 'SI'
                }
            });
        } catch (exception) {
            // @ts-ignore
            if (exception.code != "P2002")
                catch_error(exception, "l'aggiornamento", 5002);
            else
                return fail(400, { error_mex: "Griglia non univoca" });   // La richiesta fallisce
        }
    }
};
