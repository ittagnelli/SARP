import { route_protect, access_protect } from '$js/helper';
import { Logger } from '$js/logger';
import { compile } from 'mdsvex';
import * as fs from 'fs';
import { PUBLIC_CHANGELOG_FILE } from '$env/static/public';
let resource = "changelog"; // definisco il nome della risorsa di questo endpoint

// dirty trick per usare il modulo compile
import { createRequire } from "module";
const require = createRequire(import.meta.url);
global.require = require;

let logger = new Logger('server');

async function changelog2html() {
	try {
		let md_changelog = fs.readFileSync(PUBLIC_CHANGELOG_FILE, { encoding: 'utf8', flag: 'r' });
		let html_changelog = (await compile(md_changelog)).code;
        
		return html_changelog;
	} catch (error) {
		logger.error(JSON.stringify(error));
	}
}

export async function load({ locals }) {
	let action = 'read';

    route_protect(locals);
    access_protect(200, locals, action, resource);

	return { changelog: changelog2html() };
}
