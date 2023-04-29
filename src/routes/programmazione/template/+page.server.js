import { access_protect, route_protect, user_id } from "$js/helper";
import { PrismaDB } from "$js/prisma_db.js";

const resource = "menu_programmazione_template";

const SARP = new PrismaDB();

export async function load({ locals }) {
    let action = 'read';

    route_protect(locals);
    access_protect(200, locals, action, resource);
    SARP.set_session(locals);

    return {
        templates: await SARP.programmazione_Template.findMany({
            include: {
                materia: true
            }
        }),
        insegnamenti: await SARP.insegnamenti.findMany({
            where: {
                idDocente: user_id(locals)  // Vogliamo solo le materie dell'utente loggato
            },
            include: {
                materia: true,
                classe: true
            }
        })
    };
}


export const actions = {
    create: async ({ request, locals }) => {
        let action = 'create';

        route_protect(locals);
        access_protect(200, locals, action, resource);

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
                nome: form.get("nome")?.toString()
            }
        });
    },
    delete: async ({ request, locals }) => {
        let action = 'delete';

        route_protect(locals);
        access_protect(403, locals, action, resource);

        const form_data = await request.formData();
        const id = form_data.get('id');

        await SARP.programmazione_Template.delete({
            where: {
                id: parseInt(id)
            }
        });
    },
    update: async ({ request, locals }) => {
        let action = 'update';

        route_protect(locals);
        access_protect(200, locals, action, resource);

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
                nome: form.get("nome")?.toString()
            },
            where: {
                id: parseInt(form.get("id"))
            }
        });
    }

}