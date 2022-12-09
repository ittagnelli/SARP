import { OAuth2Client } from 'google-auth-library';
import { SESSION_TIMEOUT } from '$env/static/private';
import { PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';
import { redirect, error } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const SARP = new PrismaClient();

export const load = async ({ locals }) => {
	if (locals.session) throw redirect(302, '/');

	return {
		session: locals.session
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
        let session_id = crypto.randomUUID(); // id sessione
		let utente = undefined; // utente da autenticare nel DB

		const form_data = await request.formData();
		let jwt_token = form_data.get('token'); // google token da autenticare
		let info_utente = await decode_JWT(jwt_token);

        // se utente non è verificato e non appartiene ad istituto agnelli errore
        if (info_utente.hd != 'istitutoagnelli.it' || 
            !info_utente.email_verified)
            throw error(401, "Impossibile autenticare utente");
        
        // verifico se utente è nel DB e può fare il login
		const db_query = await SARP.Utente.findMany({
			where: {
				can_login: true,
				email: info_utente.email
			}
		});

        // se utente non è nel DB errore di autenticazione
        if(db_query)
            utente = db_query[0];
        else
            throw error(401, "Impossibile autenticare utente");

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

		return { success: true };
	}
};