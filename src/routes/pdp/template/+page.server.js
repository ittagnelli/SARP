import { access_protect, filter_array_for_id, route_protect, user_id, raise_error } from "$js/helper";
import { PrismaDB } from "$js/prisma_db.js";
import { PrismaClientValidationError } from '@prisma/client/runtime';
import { multi_user_field_where } from '$js/helper.js'
import { Logger } from '$js/logger';

const resource = "pdp_template";

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
        let pdp_templates = await SARP.pdp_Template.findMany({
            where: multi_user_field_where('creatoDa', locals)
        });
        
        return {
            templates: pdp_templates
        }
    } catch (exception) {
        catch_error(exception, 2501);
    }
}

export const actions = {
    create: async ({ request, locals }) => {
        let action = 'create';

        route_protect(locals);
        access_protect(200, locals, action, resource);

        try {
            const form = await request.formData();

            await SARP.pdp_Template.create({
                data: {
                    creatoDa: user_id(locals),
                    nome: form.get("nome"),
                    dispensative: form.get("dispensative"),
                    compensative: form.get("compensative"),
                    valutazione: form.get("valutative"),
                    altro: form.get("altro")?.toString(),
                    note: form.get("note")?.toString()
                }
            });

            return {action: action, status: 'ok'};
        } catch (exception) {
            catch_error(exception, 2502);
        }
    },
    update: async ({ request, locals }) => {
        let action = 'update';

        route_protect(locals);
        access_protect(200, locals, action, resource);

        try {
            const form = await request.formData();	

            await SARP.pdp_Template.update({
                data: {
                    creatoDa: user_id(locals),
                    nome: form.get("nome"),
                    dispensative: form.get("dispensative"),
                    compensative: form.get("compensative"),
                    valutazione: form.get("valutative"),
                    altro: form.get("altro")?.toString(),
                    note: form.get("note")?.toString()
                },
                where: {
                    id: parseInt(form.get("id"))
                }
            });

            return {action: action, status: 'ok'};
        } catch (exception) {
            catch_error(exception, 2503);
        } 
    },
    delete: async ({ request, locals }) => {
        let action = 'delete';

        route_protect(locals);
        access_protect(403, locals, action, resource);

        try {
            const form_data = await request.formData();
            const id = form_data.get('id');

            await SARP.pdp_Template.delete({
                where: {
                    id: parseInt(id)
                }
            });
        } catch (exception) {
            catch_error(exception, 2504);
        }
    },
}
