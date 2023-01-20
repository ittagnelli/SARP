const ELLIPSES_LENGTH = 50;

import { redirect } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { PUBLIC_ADMIN_ROLE } from '$env/static/public';
import { RBAC } from './rbac';
import { Logger } from './logger';
import { browser } from '$app/environment';

// Istanzia il logger in funzione di dove viene chiamato
let logger = browser ? new Logger('client') : new Logger('server');
let firewall = new RBAC(); // Istanzia il firewall per access control

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
		if (key != 'session') collect = [...collect, data[key]];
	});

	return collect;
};

// redirige un utente non autenticato alla pagina di login
export const route_protect = (locals) => {
	if (!locals.session) {
		throw redirect(302, '/login');
	}
};

// verifica role, action e resource sulle ACL
export const has_grant = (role, action, resource) => {
	return role.some((ruolo) => firewall.grant(ruolo, action, resource));
};

// genera un errore per l'utrente
export const raise_error = (http_code, code, mex) => {
	throw error(http_code, {
		code: code,
		message: mex
	});
};

// shorthands for access protection in server endpoints
export const access_protect = (code, user, action, resource) => {
	if (!has_grant(user_ruolo(user), action, resource)) {
		logger.warn(
			`Utente[${user_id(user)}][${user_ruolo(
				user
			)}] - Azione[${action}] - Risorsa[${resource}]: non hai i permessi per accedere a questa risorsa!`
		);
		raise_error(403, code, 'Non hai i permessi per accedere a questa risorsa!');
	}
};

// estrapola l'oggetto login dalla sessione utente
export const user_login = (data) => {
	return data?.session?.login;
};

// restituisce il ruolo dell'utente
export const user_ruolo = (data) => {
	return data?.session?.login?.ruoli.map((ruolo) => ruolo.ruolo);
};

// restituisce il tipo dell'utente
export const user_tipo = (data) => {
	return data?.session?.login?.tipo;
};

// restituisce user id
export const user_id = (data) => {
	return data?.session?.login?.id;
};

export const is_admin = (data) => {
    return user_ruolo(data).includes(PUBLIC_ADMIN_ROLE);
}

// restituisce una clausola di ricerca per utente ADMIN e non
export const multi_user_where = (data) => {
	let clausola_where;

	if (!is_admin(data) clausola_where = { creatoDa: user_id(data) };
	else clausola_where = { id: { gt: 0 } };

	return clausola_where;
};

// auto button click for modal PROF:
export const show_modal = () => {
	const btn = document.getElementById('btn_action_modal');
	if (btn instanceof HTMLAnchorElement)
		// Apriamo il modale
		btn.click();
};

export const diff_time = (h1, h2) => {
	const h1_split = h1.split(':'); // 00:01	[00,01]
	const h2_split = h2.split(':');
	const h1_date = new Date().setHours(h1_split[0], h1_split[1]);
	const h2_date = new Date().setHours(h2_split[0], h2_split[1]);
	return h1_date < h2_date;
};

export const is_mobile = (request) => {
	let ua = request.headers.get('user-agent');

	return ua.includes('Android') || ua.includes('Mobile') || ua.includes('iPhone');
};
