import { PrismaDB } from '../../../js/prisma_db';
import { route_protect, user_id, multi_user_where, raise_error, access_protect  } from '../../../js/helper';
import { Logger } from '../../../js/logger';
import { PrismaClientValidationError } from '@prisma/client/runtime';

let logger = new Logger("server"); //instanzia il logger
const SARP = new PrismaDB(); //Istanzia il client SARP DB
let resource = "sicurezza_corso"; // definisco il nome della risorsa di questo endpoint

// @ts-ignore
function catch_error(exception, type, code) {
    if(exception instanceof PrismaClientValidationError)
        logger.error(exception.message);
    else {  
        logger.error(JSON.stringify(exception));
        logger.error(exception.message);
        logger.error(exception.stack);
    }
    raise_error(500, code, `Errore irreversibile durante ${type} dello stage. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`); // TIMESTAMP ci serve per capire l'errore all'interno del log
}


export async function load({ locals }) {
    let action = 'read';

    route_protect(locals);
    access_protect(500, locals, action, resource);

    try {
        // query SQL al DB per tutte le entry nella tabella todo
        const corsi = await SARP.sicurezza_Corso.findMany({
            orderBy: [{ id: 'desc' }],
            where: multi_user_where(locals),
            include: {
                seguitoDa: true
            }
        });

        console.log("CORSI SERVER:", corsi)
        // const companies = await SARP.pcto_Azienda.findMany({
        //     orderBy: [{ id: 'desc' }]
        // });

        const utenti = await SARP.Utente.findMany({
            orderBy: [{ id: 'desc' }]
        });

        // restituisco il risultato della query SQL
        return {
            corsi: corsi,
            utenti: utenti
        }
    } catch (exception) {
        catch_error(exception, "la ricerca", 800);
    }
}

export const actions = {
	create: async ({ cookies, request, locals }) => {
        let action = 'create';

        route_protect(locals);
        access_protect(501, locals, action, resource);

		const form_data = await request.formData();

        console.log("FORM DATA:", form_data);

        let studenti = form_data.get('studenti').split(',')
        let ids = [];
        
        if(studenti != '') {
            studenti.forEach(element => {
                ids.push({id: +element})
            });
        }

        SARP.set_session(locals); // passa la sessione all'audit
        try {
        await SARP.sicurezza_Corso.create({
			data: {
                creatoDa: user_id(locals),
                titolo: form_data.get('titolo'),
                tipo: form_data.get('tipo'),
                dataInizio: new Date(form_data.get('dataInizio')),
				dataFine: new Date(form_data.get('dataFine')),
                seguitoDa: {
                    connect: ids
                }
        }
    });
        } catch (exception) {
            catch_error(exception, "l'inserimento", 801)
        }

	},

	update: async ({ cookies, request, locals }) => {
        let action = 'update';

        route_protect(locals);
        access_protect(502, locals, action, resource);

		const form_data = await request.formData();
		let id = form_data.get('id');
        let studenti = form_data.get('studenti').split(',');
        let ids = [];

        studenti.forEach(element => {
            if(+element > 0) ids.push({id: +element})
        });
        
        SARP.set_session(locals); // passa la sessione all'audit
        try {
            await SARP.sicurezza_Corso.update({
                where: { id: +id },
                data: {
                    titolo: form_data.get('titolo'),
                    tipo: form_data.get('tipo'),
                    dataInizio: new Date(form_data.get('dataInizio')),
                    dataFine: new Date(form_data.get('dataFine')),
                    seguitoDa: {
                        set: ids
                    }
                }
            });
        } catch (exception) {
            catch_error(exception, "l'aggiornamento", 802);
        }

	},

	delete: async ({ cookies, request, locals }) => {
        let action = 'delete';

        route_protect(locals);
        access_protect(503, locals, action, resource);

		const form_data = await request.formData();
		const id = form_data.get('id');

        SARP.set_session(locals); // passa la sessione all'audit
        try {
            await SARP.sicurezza_Corso.delete({
                where: { id: +id }
            });       
        } catch (exception) {
            catch_error(exception, "l'eliminazione", 803);
        }

	},

    pdf: async ({ cookies, request }) => {
		let buf, company;
		try {
			const form_data = await request.formData();
			const id = form_data.get('id');

			// preleva l'azienda dal DB
			company = await SARP.pcto_Azienda.findUnique({
				where: { id: +id }
			});
			//arricchisce l'oggetto
			company['today'] = new Date().toLocaleDateString();
			company['direttore_natoIl'] = company['direttore_natoIl'].toLocaleDateString();

			const content = fs.readFileSync(
				path.resolve(PUBLIC_PCTO_TEMPLATES_DIR, PUBLIC_PCTO_TEMPLATE_AZIENDE),
				'binary'
			);

			const zip = new PizZip(content);

			const doc = new Docxtemplater(zip, {
				paragraphLoop: true,
				linebreaks: true
			});

			doc.render(company);

			buf = doc.getZip().generate({
				type: 'nodebuffer',
				compression: 'DEFLATE'
			});
			return {
				file: JSON.stringify(buf), // Convertiamo il buffer in stringa sennò sveltekit va in errore
				nome_convenzione: `01-Convenzione-generale-${company.idConvenzione}.docx`
			};
		} catch (exception) {
			catch_error_pdf(exception, 'la generazione', 204);
		}
	}
};
