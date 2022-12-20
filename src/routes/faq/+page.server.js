import { route_protect, raise_error } from '../../js/helper';
import { Logger } from '../../js/logger';

    let logger = new Logger("server");

export async function load({ locals }) {
    route_protect(locals);
}