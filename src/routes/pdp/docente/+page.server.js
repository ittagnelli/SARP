import { PrismaDB } from "$js/prisma_db.js";
import { PrismaClientValidationError } from '@prisma/client/runtime';
import { user_id, multi_user_field_where, access_protect, route_protect, raise_error } from "$js/helper";
import { Logger } from '$js/logger';

let logger = new Logger("server"); //instanzia il logger
const SARP = new PrismaDB();

const resource = "pdp_docente";


function catch_error(exception, code) {
    if(exception instanceof PrismaClientValidationError)
        logger.error(exception.message);
    else {  
        logger.error(JSON.stringify(exception));
        logger.error(exception.message);
        logger.error(exception.stack);
    }
    raise_error(500, code, `Errore irreversibile nella gestione del PDP. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`);
}

// @ts-ignore
export async function load({ locals }) {
    let action = 'read';

    route_protect(locals);
    access_protect(200, locals, action, resource);
    SARP.set_session(locals);

    let where_search = multi_user_field_where('idDocente', locals);

    try {
        let pdp = await SARP.PDP.findMany({
            where: where_search,
            include: {
                studente: {
                    select: {
                        nome: true,
                        cognome: true,
                        obiettivi_minimi: true
                    }
                },
                insegnamento: {
                    select: {
                        classe: {
                            select: {
                                classe: true,
                                istituto: true,
                                sezione: true
                            }
                        },
                        materia: {
                            select: {
                                nome: true
                            }
                        }
                    }
                }
            },
            orderBy: [
                {insegnamento: {classe: {id: 'asc'}}},
                {studente: {cognome: 'asc'}}
            ]
        });

        let templates = await SARP.pdp_Template.findMany({
            where: {
                creatoDa: user_id(locals)
            }
        });

        let obiettivi_minimi_templates = await SARP.programmazione_Template.findMany({
            where: {
                creatoDa: user_id(locals)
            }
        });

        return {
            pdp,
            templates,
            obiettivi_minimi_templates
        };
    } catch (exception) {
        catch_error(exception, 2601);
    }
}

export const actions = {
    update: async ({ request, locals }) => {
        let action = 'update';

        route_protect(locals);
        access_protect(200, locals, action, resource);

        try {
            const form = await request.formData();	
            
            await SARP.PDP.update({
                data: {
                    dispensative: form.get("dispensative"),
                    compensative: form.get("compensative"),
                    valutative: form.get("valutative"),
                    obiettivi_minimi: form.get("obiettivi_minimi"),
                    altro_compensative: form.get("altro_compensative")?.toString(),
                    altro_dispensative: form.get("altro_dispensative")?.toString(),
                    altro_valutative: form.get("altro_valutative")?.toString(),
                    note: form.get("note")?.toString(),
                    completo: form.get("completo") === 'SI',
                    sintesi_vocale: form.get("sintesi_vocale") === 'true',
                    tempo_esteso: form.get("tempo_esteso") === 'true'
                },
                where: {
                    id: parseInt(form.get("id"))
                }
            });

            return {action: action, status: 'ok'};
        } catch (exception) {
            catch_error(exception, 2602);
        } 
    },
}