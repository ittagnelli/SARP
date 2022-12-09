import { redirect } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

const ELLIPSES_LENGTH = 50;

export const convert_date = (d) => {
    let data = d.toLocaleDateString('it-IT', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/');
    return `${data[2]}-${data[1]}-${data[0]}`;
}

export const ellipses = (text) => {
    if (text)
        return text.length < ELLIPSES_LENGTH || typeof(text) != "string" 
        ? text 
        : text.substring(0,ELLIPSES_LENGTH).concat('...');
    return '';
}

export const data2arr = (data) => {
    let collect = [];
    
    Object.keys(data).forEach((key) => {
		collect = [...collect, data[key]];
	});

    return collect;
}

// redirige un utente non autenticato alla pagina di login
export const route_protect = (locals) => {
	if (!locals.session) {
		throw redirect(302, '/login');
	}
}

// genera un errore per l'utrente
export const raise_error = (http_code, code, mex) => {
    throw error(http_code, {
        code: code,
        message: mex
      });
}