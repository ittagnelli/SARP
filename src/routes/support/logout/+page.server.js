import { error } from '@sveltejs/kit';
import { PrismaDB } from '$js/prisma_db';
import { Logger } from '$js/logger';
import { Auditor, audit_mex } from '$js/audit';

let logger = new Logger("server"); //instanzia il logger
let auditor = new Auditor();
const SARP = new PrismaDB(); //Istanzia il client SARP DB

export const actions = {
	default: async ({ cookies, request, locals }) => {
		try {
			let session_id = cookies.get('session');
            let db_session;

            if(session_id) {
                db_session = await SARP.Session.findUnique({
                    where: { session_id: session_id },
                    include: {
                        login: true
                    }
                });
            }
  
			// rimuovo eventuali vecchie sessioni
			await SARP.Session.delete({
				where: { session_id: session_id }
			});

			// rimuovo il session cookie
			await cookies.delete('session');

            // audit del logout
            let logout_mex = new audit_mex(
                                           db_session.login.id,
                                           `${db_session.login.cognome}-${db_session.login.nome}`,
                                           'session',
                                           'close',
                                           null,
                                           null,
                                           `Logout ${session_id}`
            );
            auditor.audit(logout_mex);

			return { success: true };
		} catch (err) {
			let message = '';
			if (err instanceof Error) message = err.message;
			throw error(401, message);
		}
	}
};
