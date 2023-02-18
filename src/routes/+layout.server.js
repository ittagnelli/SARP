import { redirect, invalid } from '@sveltejs/kit';
import { readFileSync } from 'fs';

export const load = async ({ locals }) => {
	const json = readFileSync('package.json', 'utf8');
	const pkg = JSON.parse(json);

	return {
		session: locals.session,
		version: pkg.version
	};
};
