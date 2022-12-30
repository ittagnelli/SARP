import { PrismaClient } from '@prisma/client';
import {
	nomi,
	cognomi,
	pictures,
	ruoli_utente,
	tipi_utente,
	istituti,
	developers
} from './seed_helper.js';

// Istanzia il client per il SARP
const SARP = new PrismaClient();

function capital(str) {
	return str[0].toUpperCase() + str.slice(1);
}

function random_telefono() {
	let tel = '';
	let atel;

	for (let i = 0; i < 10; i++) tel += Math.floor(Math.random() * 10);
	atel = tel.split('');
	atel.splice(3, 0, '.');
	atel.splice(7, 0, '.');
	atel.splice(10, 0, '.');
	return atel.join('');
}

function random_item(list) {
	let len = list.length;
	return list[Math.floor(Math.random() * len)];
}

async function create_ruoli() {
	ruoli_utente.forEach(async (role) => {
		try {
			await SARP.ruolo_Utente.create({
				data: { ruolo: role }
			});
			console.log(`Creazione RUOLO utente -> ${role}`);
		} catch (ex) {
			if (ex.code == 'P2002') console.log(`RUOLO[${role}] già esistente...skipping`);
			else console.log(ex);
		}
	});
}

async function create_tipi() {
	tipi_utente.forEach(async (type) => {
		try {
			await SARP.tipo_Utente.create({
				data: { tipo: type }
			});
			console.log(`Creazione TIPO utente -> ${type}`);
		} catch (ex) {
			if (ex.code == 'P2002') console.log(`TIPO[${type}] già esistente...skipping`);
			else console.log(ex);
		}
	});
}

async function crea_account_dev() {
	developers.forEach(async (u) => {
		try {
			await SARP.utente.create({
				data: {
					creatoDa: 1,
					nome: u.nome,
					cognome: u.cognome,
					email: u.nome.concat('.', u.cognome, '@istitutoagnelli.it'),
					telefono: random_telefono(),
					tipo: u.tipo,
					ruolo: 'ADMIN',
					istituto: 'ITT',
					bes: false
				}
			});
		} catch (ex) {
			if (ex.code == 'P2002') console.log(`UTENTE[${u.nome} ${u.cognome}] già esistente...skipping`);
			else console.log(ex);
		}
        console.log(`Creazione UTENTE -> ${u.nome} ${u.cognome}`);
	});
}

async function create_utenti() {
	let nome = random_item(nomi);
	let cognome = random_item(cognomi);

	console.log(`Creazione UTENTE -> ${nome} ${cognome}`);
	try {
		await SARP.utente.create({
			data: {
				creatoDa: 1,
				nome: capital(nome),
				cognome: capital(cognome),
				email: nome.concat('.', cognome, '@istitutoagnelli.it'),
				telefono: random_telefono(),
				tipo: random_item(tipi_utente),
				ruolo: random_item(ruoli_utente),
				istituto: random_item(istituti),
				bes: false,
				picture: random_item(pictures)
			}
		});
	} catch (ex) {
		if (ex.code == 'P2002') console.log(`UTENTE[${nome} ${cognome}] già esistente...skipping`);
		else console.log(ex);
	}
}

// MAIN
(async function () {
	create_ruoli();
	create_tipi();
	crea_account_dev();
	for (let i = 0; i < 10; i++) create_utenti();
})();
