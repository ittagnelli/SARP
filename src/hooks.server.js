import { PrismaClient } from '@prisma/client';

const SARP = new PrismaClient();

export const handle = async ({ event, resolve }) => {
	console.log('SERVER HOOK FOR REQUEST:', event.routeId);

	const session_id = event.cookies.get('session');
	console.log('SERVER HOOKS COOKIE:', session_id);

    // se facciamo logout oppure il cookie è scaduto chiudiamo la sessione
	if (event.routeId == 'logout' || !session_id) {
        console.log("HOOK LOGOUT OPPURE SCADUTO");
		event.locals.session = undefined;
		return await resolve(event);
	}

    // se il coockie è valido settiamo la sessione
	if(session_id) {
		let db_session = await SARP.Session.findUnique({
			where: { session_id: session_id },
			include: {
				login: true
			}
		});
        event.locals.session = db_session;
	}
	return await resolve(event);
};
