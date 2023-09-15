// @ts-ignore
// @ts-ignore
import { access_protect, is_primo_quadrimestre, route_protect, user_id } from "$js/helper";
import { PrismaDB } from "$js/prisma_db.js";
import { multi_user_field_where } from '$js/helper.js';

const resource = "programmazione_docente";

const SARP = new PrismaDB();

// @ts-ignore
export async function load({ locals }) {
    let action = 'read';

    route_protect(locals);
    access_protect(200, locals, action, resource);
    SARP.set_session(locals);

    let insegnamenti = await SARP.insegnamenti.findMany({
        where: multi_user_field_where('idDocente', locals),
        include: {
            materia: true,
            classe: true
        }
    });

    // Client side non funziona quindi lo faccio nel server
    insegnamenti.forEach(insegnamento => {
        insegnamento.classe.classe += " " + insegnamento.classe.sezione + " " + insegnamento.classe.istituto;
        // @ts-ignore
        insegnamento["programma_primo_quadrimestre_presente"] = insegnamento.programma_primo_quadrimestre != null;
        // @ts-ignore
        //bug, come minimo,  di magia nera voodo e tranasologia assieme
        // se la proprietà si chiama programma_secondo_quadrimestre_presente l'icona si sposta a destra di 13 pixel
        insegnamento["programma_secondo_quadrimestre_presente_"] = insegnamento.programma_secondo_quadrimestre != null;
    });

    return {
        templates: await SARP.programmazione_Template.findMany({
            include: {
                materia: true
            }
        }),
        insegnamenti: insegnamenti
    };
}

export const actions = {
    update: async ({ request, locals }) => {
        let action = 'update';

        route_protect(locals);
        access_protect(200, locals, action, resource);

        const form = await request.formData();
        const primo_quadrimestre = form.get("argomenti_primo_quadrimestre");
        const secondo_quadrimestre = form.get("argomenti_secondo_quadrimestre");
        const quadrimestri = [JSON.parse(primo_quadrimestre), JSON.parse(secondo_quadrimestre)];
        quadrimestri.push({ // Aggiungo i libri
            libri: form.get("libri"),
            note: form.get("note")
        })
        if (is_primo_quadrimestre()) {
            await SARP.insegnamenti.update({
                where: {
                    id: parseInt(form.get("id"))
                },
                data: {
                    programma_primo_quadrimestre_completo: form.get("conferma") === "SI",
                    programma_primo_quadrimestre: JSON.stringify(quadrimestri),
                    code_classroom: form.get('code_classroom')
                }
            });
        } else {
            await SARP.insegnamenti.update({
                where: {
                    id: parseInt(form.get("id"))
                },
                data: {
                    programma_secondo_quadrimestre_completo: form.get("conferma") === "SI",
                    programma_secondo_quadrimestre: JSON.stringify(quadrimestri),
                    code_classroom: form.get('code_classroom')
                }
            });
        }
        return {action: action, status: 'ok'};
    }

}