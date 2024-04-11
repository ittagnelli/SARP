import { route_protect, access_protect } from '$js/helper';
import { Logger } from '$js/logger';
import { compile } from 'mdsvex';
import * as fs from 'fs';
import { PUBLIC_DOC_DIR } from '$env/static/public';
let resource = "documentazione"; // definisco il nome della risorsa di questo endpoint

// dirty trick per usare il modulo compile
import { createRequire } from "module";
const require = createRequire(import.meta.url);
global.require = require;

let logger = new Logger('server');

async function md2html() {
	let dir_item;
	let faqs = {};

	try {
		const faq_dir = fs.opendirSync(PUBLIC_DOC_DIR);
		while ((dir_item = faq_dir.readSync()) !== null) {
			let faq_name = dir_item.name.split('.')[0];
			let md_faq = fs.readFileSync(PUBLIC_DOC_DIR + dir_item.name, { encoding: 'utf8', flag: 'r' });
			let html_faq = (await compile(md_faq)).code;
			faqs[faq_name] = html_faq;
		}
		faq_dir.closeSync();
	} catch (error) {
        logger.error(JSON.stringify(error));
	}

    return faqs;
}

export async function load({ locals }) {
	let action = 'read';

    route_protect(locals);
    access_protect(300, locals, action, resource);

	return { html: md2html() };
}


