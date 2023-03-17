import { PrismaDB } from '../js/prisma_db';
import {
	route_protect,
	raise_error,
} from '../js/helper'; 
import { redirect } from '@sveltejs/kit';
import { Logger } from '../js/logger';
import { PrismaClientValidationError } from '@prisma/client/runtime';

let logger = new Logger('server'); //instanzia il logger
const SARP = new PrismaDB(); //Istanzia il client SARP DB

function catch_error(exception, type, code) {
    if(exception instanceof PrismaClientValidationError)
        logger.error(exception.message);
    else {  
        logger.error(JSON.stringify(exception));
        logger.error(exception.message);
        logger.error(exception.stack);
    }
    raise_error(
		500,
		code,
		`Errore irreversibile durante ${type} dei KPI. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`
	);
}

export async function load({ locals }) {
    const session = locals.session;
	if (!session) {
		throw redirect(302, '/login');
	}
	if(session.mobile) {
		throw redirect(302, "/presenze");
	}


	route_protect(locals);

	try {
		// query SQL al DB per tutte le entry nella tabella todo
		const stats = await SARP.kpi_Stats.findMany({
			orderBy: [{ id: 'desc' }],
		});

		// restituisco il risultato della query SQL
		return { kpi: stats };
	} catch (exception) {
		catch_error(exception, 'la lettura', 200);
	}
}

