import { error } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';
import { Logger } from '../../js/logger';

let logger = new Logger("server");
const SARP = new PrismaClient();

export const actions = {
	default: async ({ cookies, request }) => {
		try {
			let session_id = cookies.get('session');

			// rimuovo eventuali vecchie sessioni
			await SARP.Session.delete({
				where: { session_id: session_id }
			});

			// rimuovo il session cookie
			await cookies.delete('session');
			return { success: true };
		} catch (err) {
			let message = '';
			if (err instanceof Error) message = err.message;
			throw error(401, message);
		}
	}
};
