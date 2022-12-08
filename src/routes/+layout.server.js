import { redirect, invalid } from '@sveltejs/kit';

export const load = async ({ locals }) => {
	return {
		session: locals.session
	};
};
