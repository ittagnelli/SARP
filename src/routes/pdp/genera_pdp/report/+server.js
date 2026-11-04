// Report Excel con lo stato dei PDP di tutti gli studenti BES per l'anno scolastico corrente.
// GET /pdp/genera_pdp/report -> download file xlsx
// Fogli: Dettaglio, Riepilogo studenti, Riepilogo docenti, Note.
// I filtri (classi, docenti, stato) li applicano gli utenti direttamente in Excel.
import ExcelJS from 'exceljs';
import { access_protect, raise_error, route_protect, get_as, user_id } from '$js/helper';
import { PrismaDB } from '$js/prisma_db.js';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import { Logger } from '$js/logger';
import { statoPdpStudenti, PDP_COMPLETO, PDP_NON_COMPLETO, PDP_MAI_SALVATO } from '$js/pdp_status';

const resource = 'genera_pdp';
const logger = new Logger('server');
const SARP = new PrismaDB();

const FONT = { name: 'Arial', size: 10 };
const HEADER_FILL = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1F4E78' } };
const STATO_FILL = {
	[PDP_COMPLETO]: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFC6EFCE' } },
	[PDP_NON_COMPLETO]: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFEB9C' } },
	[PDP_MAI_SALVATO]: { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFFFC7CE' } }
};
const BORDER_SIDE = { style: 'thin', color: { argb: 'FFBFBFBF' } };
const BORDER = { top: BORDER_SIDE, left: BORDER_SIDE, bottom: BORDER_SIDE, right: BORDER_SIDE };

function catch_error(exception, code) {
	if (exception instanceof PrismaClientValidationError) logger.error(exception.message);
	else {
		logger.error(JSON.stringify(exception));
		logger.error(exception.message);
		logger.error(exception.stack);
	}
	raise_error(500, code, `Errore irreversibile durante la generazione del report PDP. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`);
}

// stessi criteri della pagina PDP Alunni (vedi ../+page.server.js)
async function get_dati(anno) {
	const studenti = await SARP.Utente.findMany({
		select: {
			id: true,
			nome: true,
			cognome: true,
			classe: true,
			pdp: { select: { idMateria: true, idDocente: true, completo: true } }
		},
		where: { tipo: 'STUDENTE', bes: true, can_login: true }
	});

	const insegnamenti = await SARP.Insegnamenti.findMany({
		where: {
			anno: anno,
			materia: { has_pdp: true } // escludo le materie senza PDP (es. Religione, Scienze Motorie)
		},
		include: {
			materia: true,
			docente: { select: { id: true, nome: true, cognome: true, email: true } }
		}
	});

	return { studenti, insegnamenti };
}

// crea un foglio con intestazione, larghezze, bordi, filtri e riga di intestazione bloccata
function add_sheet(wb, nome, colonne) {
	const ws = wb.addWorksheet(nome, { views: [{ state: 'frozen', ySplit: 1 }] });
	ws.columns = colonne.map(([header, key, width]) => ({ header, key, width }));
	const header = ws.getRow(1);
	header.eachCell((cell) => {
		cell.font = { ...FONT, bold: true, color: { argb: 'FFFFFFFF' } };
		cell.fill = HEADER_FILL;
		cell.border = BORDER;
		cell.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
	});
	return ws;
}

function style_body(ws) {
	ws.eachRow((row, n) => {
		if (n == 1) return;
		row.eachCell({ includeEmpty: true }, (cell) => {
			cell.font = FONT;
			cell.border = BORDER;
			cell.alignment = { vertical: 'top', wrapText: true };
		});
	});
	ws.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: ws.columnCount } };
}

async function build_workbook(righe, anno) {
	const wb = new ExcelJS.Workbook();
	wb.creator = 'SARP';
	wb.created = new Date();
	wb.calcProperties.fullCalcOnLoad = true;

	// --- Dettaglio: una riga per studente x insegnamento ---
	const det = add_sheet(wb, 'Dettaglio', [
		['Istituto', 'istituto', 10], ['Classe', 'classe', 9], ['Cognome', 'cognome', 18], ['Nome', 'nome', 16],
		['Materia', 'materia', 44], ['Docente', 'docente', 26], ['Email docente', 'email_docente', 32], ['Stato PDP', 'stato', 15]
	]);
	righe.forEach((r) => det.addRow(r));
	style_body(det);
	det.getColumn('stato').eachCell((cell, n) => {
		if (n > 1 && STATO_FILL[cell.value]) cell.fill = STATO_FILL[cell.value];
	});
	const last = righe.length + 1;
	const rng = (col) => `Dettaglio!$${col}$2:$${col}$${last}`;

	// --- Riepilogo studenti: conteggi con formule sul Dettaglio ---
	const stu = add_sheet(wb, 'Riepilogo studenti', [
		['Istituto', 'istituto', 10], ['Classe', 'classe', 9], ['Cognome', 'cognome', 18], ['Nome', 'nome', 16],
		['Insegnamenti', 'tot', 13], ['Completi', 'ok', 11], ['Da completare', 'ko', 13], ['Materie da completare', 'elenco', 90]
	]);
	const studenti = new Map();
	righe.forEach((r) => {
		if (!studenti.has(r.idStudente)) studenti.set(r.idStudente, { ...r, righe: [] });
		studenti.get(r.idStudente).righe.push(r);
	});
	let n = 2;
	for (const s of studenti.values()) {
		const tot = s.righe.length;
		const ok = s.righe.filter((r) => r.stato == PDP_COMPLETO).length;
		const crit = `${rng('A')},$A${n},${rng('B')},$B${n},${rng('C')},$C${n},${rng('D')},$D${n}`;
		const mancanti = s.righe.filter((r) => r.stato != PDP_COMPLETO).map((r) => `${r.materia} (${r.docente})`);
		stu.addRow({
			istituto: s.istituto, classe: s.classe, cognome: s.cognome, nome: s.nome,
			tot: { formula: `COUNTIFS(${crit})`, result: tot },
			ok: { formula: `COUNTIFS(${crit},${rng('H')},"${PDP_COMPLETO}")`, result: ok },
			ko: { formula: `E${n}-F${n}`, result: tot - ok },
			elenco: mancanti.length ? mancanti.join('; ') : '—'
		});
		n++;
	}
	style_body(stu);

	// --- Riepilogo docenti: chi deve completare cosa, ordinato per numero di PDP mancanti ---
	const doc = add_sheet(wb, 'Riepilogo docenti', [
		['Docente', 'docente', 26], ['Email', 'email', 32], ['PDP attesi', 'tot', 11], ['Completi', 'ok', 11],
		['Da completare', 'ko', 13], ['Elenco PDP da completare', 'elenco', 90]
	]);
	const docenti = new Map();
	righe.forEach((r) => {
		if (!docenti.has(r.idDocente)) docenti.set(r.idDocente, { docente: r.docente, email: r.email_docente, righe: [] });
		docenti.get(r.idDocente).righe.push(r);
	});
	const lista_docenti = [...docenti.values()]
		.map((d) => ({ ...d, mancanti: d.righe.filter((r) => r.stato != PDP_COMPLETO) }))
		.sort((a, b) => b.mancanti.length - a.mancanti.length || a.docente.localeCompare(b.docente));
	n = 2;
	for (const d of lista_docenti) {
		const tot = d.righe.length;
		const crit = `${rng('F')},$A${n},${rng('G')},$B${n}`;
		doc.addRow({
			docente: d.docente, email: d.email,
			tot: { formula: `COUNTIFS(${crit})`, result: tot },
			ok: { formula: `COUNTIFS(${crit},${rng('H')},"${PDP_COMPLETO}")`, result: tot - d.mancanti.length },
			ko: { formula: `C${n}-D${n}`, result: d.mancanti.length },
			elenco: d.mancanti.length
				? d.mancanti.map((r) => `${r.classe} ${r.istituto} – ${r.cognome} ${r.nome} – ${r.materia}${r.stato == PDP_MAI_SALVATO ? ' [mai salvato]' : ''}`).join('\n')
				: '—'
		});
		n++;
	}
	style_body(doc);

	// --- Note ---
	const note = wb.addWorksheet('Note');
	note.columns = [{ width: 18 }, { width: 100 }];
	note.addRow([`Stato PDP BES – anno scolastico ${anno} – estratto il ${new Date().toLocaleDateString('it-IT')}`]);
	note.addRow([]);
	[
		['Studenti inclusi', 'Studenti BES con accesso attivo (bes = 1, can_login = 1), come nella pagina PDP Alunni'],
		['Regola', `Per ogni insegnamento ${anno} della classe dello studente deve esistere un PDP (stesso studente, materia e docente; il PDP non dipende dall'anno e viene riusato negli anni successivi)`],
		['Materie escluse', 'Materie per cui il PDP non è richiesto (has_pdp = 0, es. Religione, Scienze Motorie)'],
		[PDP_COMPLETO, 'PDP presente e segnato come completo'],
		[PDP_NON_COMPLETO, 'PDP presente ma non segnato come completo'],
		[PDP_MAI_SALVATO, 'Il docente non ha mai salvato il PDP']
	].forEach((r) => note.addRow(r));
	note.getRow(1).font = { ...FONT, bold: true, size: 14 };
	note.eachRow((row, i) => {
		if (i < 3) return;
		row.getCell(1).font = { ...FONT, bold: true };
		row.getCell(2).font = FONT;
		row.getCell(2).alignment = { wrapText: true, vertical: 'top' };
	});

	return wb.xlsx.writeBuffer();
}

export async function GET({ locals }) {
	const action = 'read';

	route_protect(locals);
	access_protect(200, locals, action, resource);
	SARP.set_session(locals);

	try {
		const anno = get_as();
		const { studenti, insegnamenti } = await get_dati(anno);

		const ordine = (a, b) =>
			a.istituto.localeCompare(b.istituto) || a.classe.localeCompare(b.classe) ||
			a.cognome.localeCompare(b.cognome) || a.nome.localeCompare(b.nome) ||
			(a.materia || '').localeCompare(b.materia || '');
		const righe = statoPdpStudenti(studenti.filter((s) => s.classe), insegnamenti).sort(ordine);

		const buffer = await build_workbook(righe, anno);
		const oggi = new Date().toISOString().slice(0, 10).replaceAll('-', '');
		logger.info(`[${user_id(locals)}] report PDP BES generato: ${righe.length} righe`);

		return new Response(buffer, {
			headers: {
				'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
				'Content-Disposition': `attachment; filename="PDP_BES_${anno}_${oggi}.xlsx"`
			}
		});
	} catch (exception) {
		catch_error(exception, 2701);
	}
}
