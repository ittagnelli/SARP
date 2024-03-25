import { PrismaDB } from '$js/prisma_db';
import { route_protect, raise_error, multi_user_field_where, access_protect } from '$js/helper';
import { Logger } from '$js/logger';
import { fail } from '@sveltejs/kit';
import { PrismaClientValidationError } from '@prisma/client/runtime';

let logger = new Logger("server"); //instanzia il logger
const SARP = new PrismaDB(); //Istanzia il client SARP DB
let resource = "pdp_autovalutazione"; // definisco il nome della risorsa di questo endpoint

// @ts-ignore
function catch_error(exception, type, code) {
    if(exception instanceof PrismaClientValidationError)
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
    access_protect(4001, locals, action, resource);

    let where_search = multi_user_field_where('id', locals);
	try {
		const studenti = await SARP.Utente.findMany({
			orderBy: [{ tipo: 'desc' }],
            where: where_search            
		});

		// restituisco il risultato della query SQL
		return {
			studenti
		}
	} catch (exception) {
        catch_error(exception, "la ricerca", 4001);
	}

}

const update_griglia = (form) => {
    //update griglia_valutazione with the actual answers from user  
    let out_griglia = JSON.parse(form.get('griglia_pdp_c1'));
    out_griglia.forEach((q) => {
        if(form.has(q.qid)) {
            q.answer = form.get(q.qid);
        }
    })
    
    return JSON.stringify(out_griglia);
}

export const actions = {
	update: async ({ cookies, request, locals }) => {
        let action = 'update';

        route_protect(locals);
        access_protect(4002, locals, action, resource);

		const form_data = await request.formData();
		let student_id = form_data.get('student_id');
        console.log(form_data)
        
        let out_griglia = update_griglia(form_data);
        
        SARP.set_session(locals); // passa la sessione all'audit
		try {
			await SARP.Utente.update({
				where: { id: +student_id },
				data: {
                    griglia_pdp_c1: out_griglia,
                    griglia_pdp_c1_done: form_data.get("completo") === 'SI'
				}
			});		
		} catch (exception) {
            // @ts-ignore
            if(exception.code != "P2002")
                catch_error(exception, "l'aggiornamento", 4002);
            else
                return fail(400, { error_mex: "Griglia non univoca" });   // La richiesta fallisce
		}
	}
};
