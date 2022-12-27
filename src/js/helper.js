const ELLIPSES_LENGTH = 50;

import { redirect } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { PUBLIC_ADMIN_ROLE } from '$env/static/public';

export const convert_date = (d) => {
	let data = d
		.toLocaleDateString('it-IT', { year: 'numeric', month: '2-digit', day: '2-digit' })
		.split('/');
	return `${data[2]}-${data[1]}-${data[0]}`;
};

export const ellipses = (text) => {
	if (text)
		return text.length < ELLIPSES_LENGTH || typeof text != 'string'
			? text
			: text.substring(0, ELLIPSES_LENGTH).concat('...');
	return '';
};

export const data2arr = (data) => {
	let collect = [];

	Object.keys(data).forEach((key) => {
        if(key != 'session')
		    collect = [...collect, data[key]];
	});

	return collect;
};

// redirige un utente non autenticato alla pagina di login
export const route_protect = (locals) => {
	if (!locals.session) {
		throw redirect(302, '/login');
	}
};

// genera un errore per l'utrente
export const raise_error = (http_code, code, mex) => {
	throw error(http_code, {
		code: code,
		message: mex
	});
};

// estrapola l'oggetto login dalla sessione utente
export const user_login = (data) => {
    return data?.session?.login;
};

// restituisce il ruolo dell'utente  
export const user_ruolo = (data) => {
    return data?.session?.login?.ruolo;
}

// restituisce il tipo dell'utente  
export const user_tipo = (data) => {
    return data?.session?.login?.tipo;
}

// restituisce user id  
export const user_id = (data) => {
    return data?.session?.login?.id;
}

// restituisce una clausola di ricerca per utente ADMIN e non
export const multi_user_where = (data) => {
    let clausola_where;

    if(user_ruolo(data) != PUBLIC_ADMIN_ROLE)
        clausola_where = {creatoDa: user_id(data)};
    else
        clausola_where = {id: {gt: 0}};
    
    return clausola_where;
}
