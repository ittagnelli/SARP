import { OAuth2Client } from 'google-auth-library';
import { SESSION_TIMEOUT } from '$env/static/private';
import { PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';
import { redirect, error } from '@sveltejs/kit';
import { PrismaDB } from '../../js/prisma_db';
import { Logger } from '../../js/logger';
import { Auditor, audit_mex } from '../../js/audit';
import { is_mobile } from '../../js/helper';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import { dev } from '$app/environment';


let logger = new Logger('server'); //instanzia il logger
let auditor = new Auditor();
const SARP = new PrismaDB(); //Istanzia il client SARP DB;

export const load = async ({ request, locals }) => {
	if (locals.session) throw redirect(302, '/');

	return {
		session: locals.session,
		mobile: is_mobile(request)
	};
};

async function decode_JWT(token) {
	try {
		const client = new OAuth2Client(PUBLIC_GOOGLE_CLIENT_ID);
		const ticket = await client.verifyIdToken({
			idToken: token,
			audience: PUBLIC_GOOGLE_CLIENT_ID
		});

		const payload = ticket.getPayload();
		if (!payload) throw error(500, 'Errore nella verifica del token Google');
		return payload;
	} catch (err) {
		let message = '';
		if (err instanceof Error) message = err.message;
		throw error(500, `Impossibile autenticare l'utente Google: ${message}`);
	}
}

export const actions = {
	default: async ({ cookies, request }) => {
		try {
			let session_id = crypto.randomUUID(); // id sessione
			let utente = undefined; // utente da autenticare nel DB

			const form_data = await request.formData();
			let jwt_token = form_data.get('token'); // google token da autenticare
			//let info_utente = await decode_JWT(jwt_token);
            let info_utente;

			console.log("DEV:",dev);
            console.log("TOKEN:", jwt_token);
			// se in produzione autentico il token con goole
			// altrimenti salto questo passo
			if (!dev)										// se scommento questo pezzo il login con google smette di funzionare e quello dev continua a non funzionare
				info_utente = await decode_JWT(jwt_token);
			else
				info_utente = {
					hd: 'istitutoagnelli.it',
					email_verified: true,
					email: jwt_token
				}

            console.log("INFO UTENTE:", info_utente)

			// se utente non è verificato e non appartiene ad istituto agnelli errore
			if (info_utente.hd != 'istitutoagnelli.it' || !info_utente.email_verified) {
				let invalid_mex = new audit_mex(
					0,
					info_utente.email,
					'session',
					'create',
					null,
					null,
					`Tentativo di login ABUSIVO`
				);
				auditor.audit(invalid_mex);
				throw error(401, 'Impossibile autenticare utente');
			}

			// verifico se utente è nel DB e può fare il login
			const db_query = await SARP.Utente.findMany({
				where: {
					can_login: true,
					email: info_utente.email
				}
			});

			// se utente non è nel DB errore di autenticazione
			if (db_query.length > 0) utente = db_query[0];
			else {
				let invalid_mex = new audit_mex(
					0,
					info_utente.email,
					'session',
					'create',
					null,
					null,
					`Login ERRORE: utente non presente nel DB o can_login false`
				);
				auditor.audit(invalid_mex);
				throw error(401, 'Impossibile autenticare utente');
			}

			// rimuovo eventuali vecchie sessioni
			await SARP.Session.deleteMany({
				where: { idUtente: utente.id }
			});

			// utente valido quindi crea la sessione con scadenza SESSION_TIMEOUT
			await SARP.Session.create({
				data: {
					idUtente: utente.id,
					session_id: session_id,
					scadenza: new Date(Date.now() + +SESSION_TIMEOUT)
				}
			});

			// rimuovo eventuali vecchi cookie
			await cookies.delete('session');

			// utente valido quindi crea cookie con scadenza SESSION_TIMEOUT
			cookies.set('session', session_id, {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: true,
				maxAge: SESSION_TIMEOUT / 1000
			});

			let valid_mex = new audit_mex(
				utente.id,
				`${utente.cognome}-${utente.nome}`,
				'session',
				'create',
				null,
				null,
				`Login OK ${session_id}`
			);
			auditor.audit(valid_mex);
		} catch (exception) {
			if (exception instanceof PrismaClientValidationError)
				logger.error(exception.message);
			else {
				logger.error(JSON.stringify(exception));
				logger.error(exception.message);
				logger.error(exception.stack);
			}
		}
		return { success: true };
	}
};
