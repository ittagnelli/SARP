import { raise_error, route_protect, user_login } from '../../js/helper'; //PROF: usa l'helper raise_erorr che ho cretao qualche settimana fa
import { Logger } from '../../js/logger';
import fs from 'fs';
import PDFMerger from 'pdf-merger-js';
import crypto from 'crypto';
import { exec, execSync } from 'child_process';
import { PUBLIC_PDF_TMP_FILE, PUBLIC_PDF_BLANK_FILE } from '$env/static/public';
import pdf_counter from 'pdf-page-counter';

let logger = new Logger('server'); //instanzia il logger

function fextension(filename) {
	return filename.split('.').splice(-1)[0];
}

function swap_extension(filename, ext) {
	let tmp_fname = filename.split('.').reverse().splice(1).reverse().join('.');
	return tmp_fname.concat('.', ext);
}

function cleanup_uploaded(files) {
	files.forEach((file) => {
		fs.unlinkSync(`${PUBLIC_PDF_TMP_FILE}/${file.name}`); // Rimuovo i files caricati in questo form, ormai non servono più
		if (['doc', 'docx'].includes(fextension(file.name)))
			fs.unlinkSync(swap_extension(`${PUBLIC_PDF_TMP_FILE}/${file.name}`, 'pdf'));
	});
}

const random_name = () => crypto.randomBytes(20).toString('hex'); // Genera 20 bytes casuali e li converte in esadecimale

const merger = new PDFMerger();

export const actions = {
	pdf: async ({ request, locals }) => {
		route_protect(locals); // Controlla che l'utente sia autenticato

		const form_data = await request.formData();
		const files = form_data.getAll('file-to-convert');

		try {
			if (!fs.existsSync(PUBLIC_PDF_TMP_FILE)) fs.mkdirSync(PUBLIC_PDF_TMP_FILE); // Se non esiste la cartella temporanea creala

			for (const file of files) {
				let file_name = file.name;
				file_name.replace(' ', '');

				const extension = fextension(file_name); // L'estensione del file test.pdf sarà [test, pdf]
				if (!['doc', 'docx', 'pdf'].includes(extension)) {
					// Il file è invalido
					raise_error(
						500,
						100,
						`Hai caricato un file non consentito. Puoi caricare solo .pdf, .doc e .docx`
					);
				}

				fs.writeFileSync(
					`${PUBLIC_PDF_TMP_FILE}/${file_name}`,
					Buffer.from(await file.arrayBuffer())
				); // Scrivo il file nella cartella temporanea

				if (extension == 'docx' || extension == 'doc') {
					// Se il file è Word dobbiamo convertirlo in PDF
					const cmd = `libreoffice --headless --convert-to pdf --outdir ${PUBLIC_PDF_TMP_FILE} ${PUBLIC_PDF_TMP_FILE}/${file_name}`;
					execSync(cmd);
					file_name = file_name.split('.')[0] + '.pdf';
				}
				const our_pdf = fs.readFileSync(`${PUBLIC_PDF_TMP_FILE}/${file_name}`);
				const pages = await pdf_counter(our_pdf);
				await merger.add(`${PUBLIC_PDF_TMP_FILE}/${file_name}`); // Aggiungo il pd// Usiamo un for classico al posto di forEach per il corretto merge dei filef al nuovo file
				if (pages.numpages % 2 != 0) {
					// Aggingiamo una pagina se la verifica è dispari
					await merger.add(PUBLIC_PDF_BLANK_FILE);
				}
			}
			const file_name_of_merged_pdf = user_login(locals).cognome + '_' + random_name() + '.pdf'; // Generiamo un nome casuale per evitare sovrascritture

			cleanup_uploaded(files); // Rimuovo i files caricati in questo form, ormai non servono più

			return {
				file: JSON.stringify(await merger.saveAsBuffer()), // Convertiamo il buffer in stringa sennò sveltekit va in errore
				nome_file: file_name_of_merged_pdf
			};
		} catch (exception) {
			console.log(exception);
			logger.error(JSON.stringify(exception));
			raise_error(
				500,
				100,
				`Errore irreversibile durante la generazione del PDF. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`
			);
		}
	}
};
