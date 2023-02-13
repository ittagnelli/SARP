import { json } from '@sveltejs/kit';
import { Logger } from '../../js/logger';
import { route_protect  } from '../../js/helper';

let logger = new Logger('server');

export async function POST({ request, locals }) {
    route_protect(locals);
    
    const mex = await request.json();
	logger.log(mex.level, mex.mex);
	
    return json('logged');
}
