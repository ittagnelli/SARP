import { PrismaClient } from '@prisma/client';

// Istanzia il client per il SARP
const SARP = new PrismaClient();

async function calculate_n_utenti() {
	try {
		const user_count = await SARP.utente.count({
			select: { _all: true }
		});

		return user_count._all;
	} catch (ex) {
		console.log(ex);
	}
}

async function calculate_pcto_n_convenzioni() {
	try {
		const convenzioni = await SARP.pcto_Azienda.count({
			select: { _all: true }
		});

		return convenzioni._all;
	} catch (ex) {
		console.log(ex);
	}
}

async function calculate_pcto_n_pcto() {
	try {
		const pcto_attivi = await SARP.pcto_Pcto.count({
			where: {
				dataFine: {
					gt: new Date()
				}
			}
		});
		return pcto_attivi;
	} catch (ex) {
		console.log(ex);
	}
}

async function calculate_pcto_n_studenti() {
	try {
		let total_student = 0;
		const pcto_studenti = await SARP.pcto_Pcto.findMany({
			orderBy: [{ id: 'desc' }],
			where: {
				dataFine: {
					gt: new Date()
				}
			},
			include: { svoltoDa: true }
		});

		pcto_studenti.forEach((pcto) => (total_student += pcto.svoltoDa.length));

		return total_student;
	} catch (ex) {
		console.log(ex);
	}
}

async function calculate_pcto_ore_attivi() {
	try {
		let ore_tot = 0;
		const presenze = await SARP.pcto_Presenza.findMany({
			where: {
				approvato: true
			},
			include: {
				lavoraPer: true
			}
		});

		presenze.forEach((presenza) => {
			if (presenza.lavoraPer.dataFine > new Date()) {
				let ore = (presenza.oraFine - presenza.oraInizio) / (1000 * 60 * 60);
				ore_tot += ore;
			}
		});

		return ore_tot;
	} catch (ex) {
		console.log(ex);
	}
}

async function calculate_pcto_ore() {
	try {
		let ore_tot = 0;
		const presenze = await SARP.pcto_Presenza.findMany({
			where: {
				approvato: true
			}
		});

		presenze.forEach((presenza) => {
			let ore = (presenza.oraFine - presenza.oraInizio) / (1000 * 60 * 60);
			ore_tot += ore;
		});

		return ore_tot;
	} catch (ex) {
		console.log(ex);
	}
}

async function update_kpi(
	n_utenti,
	pcto_n_convenzioni,
	pcto_n_pcto_attivi,
	pcto_n_studenti,
	pcto_tot_ore_attivi,
	pcto_tot_ore
) {
	try {
		await SARP.kpi_Stats.update({
			where: { id: 1 },
			data: {
				n_utenti: n_utenti,
				n_pcto_aziende_attive: pcto_n_convenzioni,
				n_pcto_attivi: pcto_n_pcto_attivi,
				n_studenti_pcto_attivi: pcto_n_studenti,
				n_ore_tot_pcto_attivi: pcto_tot_ore_attivi,
				n_ore_tot_pcto: pcto_tot_ore
			}
		});
	} catch (ex) {
		if (ex.code == 'P2002') console.log(`RUOLO[${role}] già esistente...skipping`);
		else console.log(ex);
	}
}

// MAIN
(async function () {
	console.log('Start calculating and updating KPI stats....');
	let n_utenti = await calculate_n_utenti();
	let pcto_n_convenzioni = await calculate_pcto_n_convenzioni();
	let pcto_n_pcto_attivi = await calculate_pcto_n_pcto();
	let pcto_n_studenti = await calculate_pcto_n_studenti();
	let pcto_tot_ore_attivi = await calculate_pcto_ore_attivi();
	let pcto_tot_ore = await calculate_pcto_ore();

	console.log(`N. Utenti SARP = ${n_utenti}`);
	console.log(`N. Convenzioni PCTO = ${pcto_n_convenzioni}`);
	console.log(`N. PCTO Attivi = ${pcto_n_pcto_attivi}`);
	console.log(`N. Studenti PCTO = ${pcto_n_studenti}`);
	console.log(`N. Ore PCTO Attivi = ${pcto_tot_ore_attivi}`);
	console.log(`N. Ore PCTO = ${pcto_tot_ore}`);
	console.log('KPI Stats update end!!!!');

	update_kpi(
		n_utenti,
		pcto_n_convenzioni,
		pcto_n_pcto_attivi,
		pcto_n_studenti,
		pcto_tot_ore_attivi,
		pcto_tot_ore
	);
})();
