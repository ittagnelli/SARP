import { route_protect, raise_error } from '../../js/helper';

export async function load({ locals }) {
    route_protect(locals);
}