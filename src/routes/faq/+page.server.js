import { route_protect, raise_error } from '../../js/helper';
import { Logger } from '../../js/logger';
import { compile } from 'mdsvex';
import * as fs from 'fs';
import { PUBLIC_FAQ_DIR } from '$env/static/public';

let logger = new Logger('server');

async function md2html() {
	let dir_item;
	let faqs = {};

	try {
		const faq_dir = fs.opendirSync(PUBLIC_FAQ_DIR);
		while ((dir_item = faq_dir.readSync()) !== null) {
			let faq_name = dir_item.name.split('.')[0];
			let md_faq = fs.readFileSync(PUBLIC_FAQ_DIR + dir_item.name, { encoding: 'utf8', flag: 'r' });
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
	route_protect(locals);

	return { faq: md2html() };
}
