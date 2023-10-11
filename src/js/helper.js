import { redirect } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';
import { PUBLIC_ADMIN_ROLE } from '$env/static/public';
import { RBAC } from './rbac';
import { Logger } from './logger';
import { browser } from '$app/environment';
import { mb_type, mb_color, mb_title, mb_message, mb_show } from '$js/store';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css'; 
import log from 'framework7-cli/utils/log';

// Istanzia il logger in funzione di dove viene chiamato
let logger = browser ? new Logger('client') : new Logger('server');
let firewall = new RBAC(); // Istanzia il firewall per access control

export const convert_date = (d) => {
	let data = d
		.toLocaleDateString('it-IT', { year: 'numeric', month: '2-digit', day: '2-digit' })
		.split('/');
	return `${data[2]}-${data[1]}-${data[0]}`;
};

export const ellipses = (len, text) => {
	if (text)
		return text.length < len || typeof text != 'string'
			? text
			: text.substring(0, len).concat('...');
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
		throw redirect(302, '/support/login');
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

//restituisce cognome e nome utente
export const user_name = (data) => {
	return data?.session?.login?.cognome.concat(" ", data?.session?.login?.nome);
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
};

export const is_tutor = (data) => {
	return ( user_ruolo(data).includes('TUTOR-SCOLASTICO') || 
            user_ruolo(data).includes('TUTOR-AZIENDALE')
            );
};

export const is_studente = (data) => {
	return user_ruolo(data).includes('STUDENTE');
};

export const is_dev = (data) => {
	return user_ruolo(data).includes('DEVELOPER');
};

// restituisce una clausola di ricerca per utente ADMIN e non
export const multi_user_where = (data) => {
	let clausola_where;

	if (!is_admin(data)) clausola_where = { creatoDa: user_id(data) };
	else clausola_where = { id: { gt: 0 } };

	return clausola_where;
};

export const multi_user_field_where = (field, data) => {
	let clausola_where;

	if (!is_admin(data)) clausola_where = { [`${field}`]: user_id(data) };
	else clausola_where = { [`${field}`]: { gt: 0 } };

	return clausola_where;
};


// restituisce una clausola di ricerca per utente ADMIN e non specifica per i test di sicurezza
export const multi_user_sicurezza_where = (data) => {
	let clausola_where;

	if (!is_admin(data)) clausola_where = { svoltoDa: user_id(data) };
	else clausola_where = { id: { gt: 0 } };

	return clausola_where;
};

export const pcto_valutazione_studenti_where = (data) => {
	let clausola_where;

	if (!is_admin(data)) clausola_where = { 
        OR: [
            { 
                creatoDa: user_id(data)
            },
            {
                idStagista: user_id(data)
            },
            {
                pcto: {
                    is: {
                        idTutor: user_id(data),
                    },
                }
            }
        ]
    };
	else clausola_where = { id: { gt: 0 } };

	return clausola_where;
};

export const pcto_presenze_where = (data) => {
	let clausola_where;

    if (!is_admin(data)) {
        if(is_studente(data))
            clausola_where = { svoltoDa: user_id(data) };
        else if(is_tutor(data))
            clausola_where = { creatoDa: user_id(data) };
    } else {
        clausola_where = { id: { gt: 0 } };
    }
    
	return clausola_where;
};

// auto button click for modal PROF:
export const show_modal = () => {
	const btn = document.getElementById('btn_action_modal');
	if (btn instanceof HTMLAnchorElement)
		// Apriamo il modale
		btn.click();
};

export function get_modal(el_id) {
    return new globalThis.bootstrap.Modal(document.getElementById(el_id));
}

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

/*
	CLASSE SELECT HELPERS
*/

export function findDeselectedItem(now_studenti, old_studenti) {
	// loop through previous array
	for (const studente of old_studenti) {
		// look for same thing in new array
		if (now_studenti.indexOf(studente) == -1) return studente;
	}
	return null;
}

export const db_to_select = (classi) => {
	classi.forEach((classe) => {
		classe['label'] = classe.classe.concat(' ' + classe.istituto).concat(' ' + classe.sezione);
		classe['value'] = classe.id;
	});

	return classi;
};

// delay for msec ms (1 sec by default)
export function delay(msec) {
	return new Promise((resolve, reject) => {
		setTimeout(resolve, msec || 1000);
	});
}

export const wait_fade_finish = async (d) => await delay(d); // Avoid graphic issue, wait for the finish of modal closing animation. 150 ms from Tabler css

export const ore_pcto = (inizio, fine) => {
    return ((new Date(fine) - new Date(inizio))/(60 * 60 * 1000));
}

export const filter_array_for_id = (array, key) => {
	let filtered_set_name = new Map();
	array.forEach(element => {
        if(!filtered_set_name.has(element[key].nome)) {
            filtered_set_name.set(element[key].nome, element[key].id)
        }
    });
    return Array.from(filtered_set_name);																						
};

export const remove_at_index = (array, index) => {
	array.splice(index, 1);
	return array;
}

//determina l'anno scolastico
export const get_as = () => {
    const n = new Date();
    let year = n.getFullYear();
    const month = n.getMonth()  + 1;
    if(month >= 1 && month <= 8)
        year--;
    return year;
}

//genera uno uid univoco
export const get_uid = () => {
    return (new Date().valueOf() + (Math.ceil((Math.random() * 1000000)))).toString(36);
}

// trimestre: agosto-dicembre
// pentamestre: gennaio-luglio
export const is_primo_quadrimestre = () => {
    let month = new Date().getMonth() + 1; 

    return !(month >=1 && month <=7);
}

function replace_char_at(str, index, replacement) {
	return str.substring(0, index) + replacement + str.substring(index + replacement.length);
}

export const upper_first_letter = (str) => {
	return replace_char_at(str, 0, str[0].toUpperCase());
} 

//handle display of a MessageBox
export const mbox_show = (type, title, message, delay, cb) => {
	function type2color() {
		let color;
		switch (type) {
			case 'success':
				color = '#00C949';
				break;
			case 'warning':
				color = '#FF4E00';
				break;
			case 'danger':
				color = '#EF0030';
				break;
		}
		return color;
	}

	mb_type.set(type);
	mb_color.set(type2color());
	mb_title.set(title);
	mb_message.set(message);
	mb_show.set(true);

	setTimeout(() => {
		mb_show.set(false);
        if(cb) cb();
	}, delay);
};

export const init_tippy =  () => {
    tippy('[data-tippy-content]', {
        arrow:true,
        duration: 800,
        hideOnClick: true,
        trigger: 'mouseenter',
        onShow(instance) {
            setTimeout(() => instance.hide(), 1000)
          },
    });
}

//we define a new tag @pageBreak which add a page break in a docx template rendition except last iteration in a loop
export const custom_tags_parser = (tag, meta) => {
    if (tag === "pageBreak") {
        return {
            get(scope, context) {
                const totalLength =
                    context.scopePathLength[
                        context.scopePathLength.length - 1
                    ];
                const index =
                    context.scopePathItem[
                        context.scopePathItem.length - 1
                    ];
                const isLast = index === totalLength - 1;
                if (!isLast) {
                    return '<w:p> <w:r> <w:br w:type="page"/> </w:r> </w:p>';
                } else {
                    return "";
                }
            },
        }
    } else {
        return {
            get: function (scope, context) {
                if (tag === ".") {
                    return scope;
                } else {
                    return scope[tag];
                }
            },
        };
    }
}

export const sanitize_text_form = (text) => {
    return text ? text.replace(/\\\\\\n/g, '').replace(/\\\\n/g, '').replace(/\\n/g, '') : text;
}


export const titlecase = (string) => {
    // https://en.wikipedia.org/wiki/Title_case
    return string.
           split(' ').
           map(str => {
            return str.charAt(0).toUpperCase() + str.slice(1);
           }).
           join(' ');
}