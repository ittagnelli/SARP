// @ts-ignore
// @ts-ignore
import { access_protect, filter_array_for_id, is_primo_quadrimestre, route_protect, user_id } from "$js/helper";
import { PrismaDB } from "$js/prisma_db.js";

const resource = "programmazione_docente";

const SARP = new PrismaDB();

// @ts-ignore
export async function load({ locals }) {
    let action = 'read';

    route_protect(locals);
    access_protect(200, locals, action, resource);
    SARP.set_session(locals);

    let insegnamenti = await SARP.insegnamenti.findMany({
        where: {
            idDocente: user_id(locals)  // Vogliamo solo le materie dell'utente loggato
        },
        include: {
            materia: true,
            classe: true
        }
    });

    // Client side non funziona quindi lo faccio nel server
    insegnamenti.forEach(insegnamento => {
        // @ts-ignore
        insegnamento.classe.id = [insegnamento.idClasse, insegnamento.idMateria, insegnamento.id, insegnamento.idProgramma_primo_quadrimestre, insegnamento.idProgramma_secondo_quadrimestre]    // Since our table component can store only one id, we need to create an array with two id for classe + materia
        // @ts-ignore
        insegnamento.classe["materia"] = insegnamento.materia;
        insegnamento.classe.classe += " " + insegnamento.classe.sezione + " " + insegnamento.classe.istituto;
        // @ts-ignore
        insegnamento.classe["programma_primo_quadrimestre_presente"] = insegnamento.programma_primo_quadrimestre != null;
        // @ts-ignore
        insegnamento.classe["programma_secondo_quadrimestre_presente"] = insegnamento.programma_secondo_quadrimestre != null;
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
    // @ts-ignore
    create: async ({ request, locals }) => {
        let action = 'create';

        route_protect(locals);
        access_protect(200, locals, action, resource);

        const form = await request.formData();

        const primo_quadrimestre = form.get("argomenti_primo_quadrimestre");
        const secondo_quadrimestre = form.get("argomenti_secondo_quadrimestre");
        const quadrimestri = [JSON.parse(primo_quadrimestre), JSON.parse(secondo_quadrimestre)];
        
        if (is_primo_quadrimestre()) {
            await SARP.insegnamenti.update({
                where: {
                    id: parseInt(form.get("id"))
                },
                data: {
                    programma_primo_quadrimestre_completo: form.get("conferma") === "SI",
                    programma_primo_quadrimestre: JSON.stringify(quadrimestri)
                }
            });
        } else {
            await SARP.insegnamenti.update({
                where: {
                    id: parseInt(form.get("id"))
                },
                data: {
                    programma_secondo_quadrimestre_completo: form.get("conferma") === "SI",
                    programma_secondo_quadrimestre: JSON.stringify(quadrimestri)
                }
            });
        }
    },
    // @ts-ignore
    delete: async ({ request, locals }) => {
        let action = 'delete';

        route_protect(locals);
        access_protect(403, locals, action, resource);

        // DELETE shouldn't be implemented here
    },
    // @ts-ignore
    update: async ({ request, locals }) => {
        let action = 'update';

        route_protect(locals);
        access_protect(200, locals, action, resource);

        const form = await request.formData();
        console.log(form);
        const primo_quadrimestre = form.get("argomenti_primo_quadrimestre");
        const secondo_quadrimestre = form.get("argomenti_secondo_quadrimestre");

        const quadrimestri = [JSON.parse(primo_quadrimestre), JSON.parse(secondo_quadrimestre)];

        if (is_primo_quadrimestre()) {
            await SARP.insegnamenti.update({
                where: {
                    id: parseInt(form.get("id"))
                },
                data: {
                    programma_primo_quadrimestre_completo: form.get("conferma") === "SI",
                    programma_primo_quadrimestre: JSON.stringify(quadrimestri)
                }
            });
        } else {
            await SARP.insegnamenti.update({
                where: {
                    id: parseInt(form.get("id"))
                },
                data: {
                    programma_secondo_quadrimestre_completo: form.get("conferma") === "SI",
                    programma_secondo_quadrimestre: JSON.stringify(quadrimestri)
                }
            });
        }
    }

}