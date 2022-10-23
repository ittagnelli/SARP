import { PrismaClient } from '@prisma/client';

// Istanzia il client per il SARP
const SARP = new PrismaClient();

export async function load({ params }) {
	// query SQL al DB per tutte le entry nella tabella todo
	const companies = await SARP.pCTO_Azienda.findMany();

	console.log('Query Aziende dal SARP: ', companies);

	// restituisco il risultato della query SQL
	return companies;
}
