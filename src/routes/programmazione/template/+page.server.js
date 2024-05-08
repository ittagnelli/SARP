import { access_protect, filter_array_for_id, route_protect, user_id, raise_error } from "$js/helper";
import { PrismaDB } from "$js/prisma_db.js";
import { PrismaClientValidationError } from '@prisma/client/runtime';
import { multi_user_field_where } from '$js/helper.js'
import { Logger } from '$js/logger';

const resource = "programmazione_template";

let logger = new Logger("server"); //instanzia il logger
const SARP = new PrismaDB();

function catch_error(exception, code) {
    if(exception instanceof PrismaClientValidationError)
        logger.error(exception.message);
    else {  
        logger.error(JSON.stringify(exception));
        logger.error(exception.message);
        logger.error(exception.stack);
    }
    raise_error(500, code, `Errore irreversibile nella gestione del template. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`);
}

export async function load({ locals }) {
    let action = 'read';

    route_protect(locals);
    access_protect(200, locals, action, resource);
    SARP.set_session(locals);
   
    try {
        let insegnamenti = await SARP.insegnamenti.findMany({
            where: multi_user_field_where('idDocente', locals), 
            include: {
                materia: true,
                classe: true
            }
        });
        
        return {
            templates: await SARP.programmazione_Template.findMany({
                where: multi_user_field_where('creatoDa', locals),
                include: {
                    materia: true,
                    docente: {
                        select: {
                            cognome: true
                        }
                    }
                }
            }),
            materie: filter_array_for_id(insegnamenti, "materia")
        };
    } catch (exception) {
        catch_error(exception, 2101);
    }
}

export const actions = {
    create: async ({ request, locals }) => {
        let action = 'create';

        route_protect(locals);
        access_protect(200, locals, action, resource);

        try {
            const form = await request.formData();
            const primo_quadrimestre = form.get("argomenti_primo_quadrimestre");
            const secondo_quadrimestre = form.get("argomenti_secondo_quadrimestre");
            const quadrimestri = [JSON.parse(primo_quadrimestre), JSON.parse(secondo_quadrimestre)];

            await SARP.programmazione_Template.create({
                data: {
                    creatoDa: user_id(locals),
                    idMateria: parseInt(form.get("materia")),
                    template: JSON.stringify(quadrimestri),
                    libro: form.get("libri"),
                    nome: form.get("nome")?.toString(),
                    note: form.get("note")?.toString()
                }
            });

            return {action: action, status: 'ok'};
        } catch (exception) {
            catch_error(exception, 2102);
        }
    },
    delete: async ({ request, locals }) => {
        let action = 'delete';

        route_protect(locals);
        access_protect(403, locals, action, resource);

        try {
            const form_data = await request.formData();
            const id = form_data.get('id');

            await SARP.programmazione_Template.delete({
                where: {
                    id: parseInt(id)
                }
            });
        } catch (exception) {
            catch_error(exception, 2103);
        }
    },
    update: async ({ request, locals }) => {
        let action = 'update';

        route_protect(locals);
        access_protect(200, locals, action, resource);

        try {
            const form = await request.formData();	
            const primo_quadrimestre = form.get("argomenti_primo_quadrimestre");
            const secondo_quadrimestre = form.get("argomenti_secondo_quadrimestre");
            const quadrimestri = [JSON.parse(primo_quadrimestre), JSON.parse(secondo_quadrimestre)];

            await SARP.programmazione_Template.update({
                data: {
                    idMateria: parseInt(form.get("materia")),
                    template: JSON.stringify(quadrimestri),
                    libro: form.get("libri"),
                    updatedAt: new Date(),
                    nome: form.get("nome")?.toString(),
                    note: form.get("note")?.toString()
                },
                where: {
                    id: parseInt(form.get("id"))
                }
            });

            return {action: action, status: 'ok'};
        } catch (exception) {
            catch_error(exception, 2104);
        } 
    },
    share: async ({ request, locals }) => {
        let action = 'share';

        route_protect(locals);
        access_protect(200, locals, action, resource);
        SARP.set_session(locals); // passa la sessione all'audit

        const form = await request.formData();	
        const template_id = form.get('template');
        const docente_id = form.get('docente');

        try {
            const template = await SARP.programmazione_Template.findUnique({
                where: { id: +template_id },
            });
            
            await SARP.programmazione_Template.create({
                data: {
                    creatoDa: +docente_id,
                    idMateria: template.idMateria,
                    template: template.template,
                    libro: template.libro,
                    nome: `${template.nome}-DUP`,
                    note: template.note
                }
            });
            return {action: action, status: 'ok'};
        } catch (exception) {
            catch_error(exception, 2105);
        }
    }
}
