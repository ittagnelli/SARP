import { access_protect, route_protect } from '$js/helper';

export async function load({ locals }) {
    let action = 'get';
    let resource = "verifica_stato"; // definisco il nome della risorsa di questo endpoint
    route_protect(locals);
    access_protect(500, locals, action, resource);
}