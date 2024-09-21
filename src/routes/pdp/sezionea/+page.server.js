import { PrismaDB } from '$js/prisma_db';
import { route_protect, raise_error, access_protect, is_admin, is_tutor_bes, user_id } from '$js/helper';
import { Logger } from '$js/logger';
import { fail } from '@sveltejs/kit';
import { PrismaClientValidationError } from '@prisma/client/runtime';

let logger = new Logger("server"); //instanzia il logger
const SARP = new PrismaDB(); //Istanzia il client SARP DB
let resource = "pdp_mipresento"; // definisco il nome della risorsa di questo endpoint

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

    route_protect(locals);
    access_protect(3400, locals, action, resource);

    let clausola_where = {
        tipo: 'STUDENTE',
        can_login: true,
        bes: true
    };

    try {
        const studenti = await SARP.Utente.findMany({
            orderBy: [{ cognome: 'asc' }],
            where: clausola_where,
        });

        // restituisco il risultato della query SQL
        return {
            studenti
        }
    } catch (exception) {
        catch_error(exception, "la ricerca", 3400);
    }
}

export const actions = {
    update: async ({ cookies, request, locals }) => {
        let action = 'update';

        route_protect(locals);
        access_protect(3402, locals, action, resource);

        const form_data = await request.formData();
        let student_id = form_data.get('student_id');
        // let out_griglia = update_griglia(form_data);

        SARP.set_session(locals); // passa la sessione all'audit
        try {
            await SARP.Utente.update({
                where: { id: +student_id },
                data: {
                    griglia_pdp_a1: form_data.get('griglia_pdp_a1'),
                    griglia_pdp_a1_done: form_data.get("completo") === 'SI'
                }
            });
        } catch (exception) {
            // @ts-ignore
            if (exception.code != "P2002")
                catch_error(exception, "l'aggiornamento", 3402);
            else
                return fail(400, { error_mex: "Griglia non univoca" });   // La richiesta fallisce
        }
    }
};
