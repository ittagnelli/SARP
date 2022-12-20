import { json } from '@sveltejs/kit';
import { Logger } from '../../js/logger';

let logger = new Logger('server');

export async function POST({ request }) {
	const mex = await request.json();

	logger.log(mex.level, mex.mex);
	
    return json('logged');
}
