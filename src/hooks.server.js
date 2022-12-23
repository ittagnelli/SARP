import { PrismaClient } from '@prisma/client';
import { Logger } from './js/logger';


let logger = new Logger("server");
const SARP = new PrismaClient();

export const handle = async ({ event, resolve }) => {
	const session_id = event.cookies.get('session');
	
    // se facciamo logout oppure il cookie è scaduto chiudiamo la sessione
	if (event.routeId == 'logout' || !session_id) { 
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


export const handleError = async ({ error, event }) => {
    logger.error(`ERRORE INASPETTATO: ${JSON.stringify(error)}`);
  }
