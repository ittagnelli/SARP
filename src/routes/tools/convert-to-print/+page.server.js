import { raise_error, route_protect, user_login, user_id, access_protect } from '../../../js/helper'; //PROF: usa l'helper raise_erorr che ho cretao qualche settimana fa
import { Logger } from '../../../js/logger';
import fs from 'fs';
import PDFMerger from 'pdf-merger-js';
import crypto from 'crypto';
import { execSync } from 'child_process';
import { PUBLIC_CONVERT_DIR, PUBLIC_PDF_BLANK_FILE } from '$env/static/public';
import pdf_counter from 'pdf-page-counter';
import { Auditor, audit_mex } from '../../../js/audit';

let logger = new Logger('server'); //instanzia il logger
let auditor = new Auditor();

function fextension(filename) {
	return filename.split('.').splice(-1)[0];
}

function swap_extension(filename, ext) {
	let tmp_fname = filename.split('.').reverse().splice(1).reverse().join('.');
	return tmp_fname.concat('.', ext);
}

function cleanup_uploaded(files) {
	files.forEach((file) => {
		fs.unlinkSync(`${PUBLIC_CONVERT_DIR}/${strip_spaces(file)}`); // Rimuovo i files caricati in questo form, ormai non servono più
		if (['doc', 'docx'].includes(fextension(strip_spaces(file))))
			fs.unlinkSync(swap_extension(`${PUBLIC_CONVERT_DIR}/${strip_spaces(file)}`, 'pdf'));
	});
}

function strip_spaces(fname) {
    return fname.replaceAll(' ', '');
}

function autit_conversion(locals, mex) {
    let obj_audit = new audit_mex(
        user_id(locals),
        user_login(locals).cognome + '-' + user_login(locals).nome, 
        'CONVERT-TO-PDF', 
        mex, 
        JSON.stringify(''), 
        JSON.stringify('')
    );
    auditor.audit(obj_audit);
}

const random_name = () => crypto.randomBytes(20).toString('hex'); // Genera 20 bytes casuali e li converte in esadecimale
const action = 'post';
const resource = "convert_to_print"; // definisco il nome della risorsa di questo endpoint


export async function load({ locals }) {
    route_protect(locals);
    access_protect(500, locals, action, resource);
}

export const actions = {
	pdf: async ({ request, locals }) => {
		route_protect(locals); // Controlla che l'utente sia autenticato
		access_protect(500, locals, action, resource);

        const merger = new PDFMerger();
		const form_data = await request.formData();
		const files = form_data.getAll('file-to-convert');
        autit_conversion(locals, `richeista conversione di ${files.length} file`);

        try {
			if (!fs.existsSync(PUBLIC_CONVERT_DIR)) fs.mkdirSync(PUBLIC_CONVERT_DIR); // Se non esiste la cartella temporanea creala
			let new_filesname = [];	// Array con i nuovi filename temporanei
			for (const file of files) {
				let file_name = file.name;
				file_name  = strip_spaces(file_name);
            
				const extension = fextension(file_name); // L'estensione del file test.pdf sarà [test, pdf]
				if (!['doc', 'docx', 'pdf'].includes(extension)) {
					// Il file è invalido
					raise_error(
						500,
						100,
						`Hai caricato un file non consentito. Puoi caricare solo .pdf, .doc e .docx`
					);
				}
				file_name = random_name().concat('.').concat(extension); // Assegna un nuovo filename casuale per evitare filename con sostituzioni bash(Issue #331)
				new_filesname.push(file_name);	// Salvo il nuovo filename per il cleanup
				
				fs.writeFileSync(
					`${PUBLIC_CONVERT_DIR}/${file_name}`,
					Buffer.from(await file.arrayBuffer())
				); // Scrivo il file nella cartella temporanea
    
				if (extension == 'docx' || extension == 'doc') {
					// Se il file è Word dobbiamo convertirlo in PDF
                    const cmd = `libreoffice --headless --convert-to pdf --outdir ${PUBLIC_CONVERT_DIR} ${PUBLIC_CONVERT_DIR}/${file_name}`;
					execSync(cmd);
					file_name = file_name.split('.')[0] + '.pdf';
				}
	
                const our_pdf = fs.readFileSync(`${PUBLIC_CONVERT_DIR}/${file_name}`);
				const pages = await pdf_counter(our_pdf);
				await merger.add(`${PUBLIC_CONVERT_DIR}/${file_name}`); // Aggiungo il pd// Usiamo un for classico al posto di forEach per il corretto merge dei filef al nuovo file
	
                if (pages.numpages % 2 != 0) {
					// Aggingiamo una pagina se la verifica è dispari
    				await merger.add(PUBLIC_PDF_BLANK_FILE);
				}
			}
			const file_name_of_merged_pdf = user_login(locals).cognome + '_' + random_name() + '.pdf'; // Generiamo un nome casuale per evitare sovrascritture

			cleanup_uploaded(new_filesname); // Rimuovo i files caricati in questo form, ormai non servono più
            
            autit_conversion(locals, `generato file ${file_name_of_merged_pdf}`);
			return {
				file: JSON.stringify(await merger.saveAsBuffer()), // Convertiamo il buffer in stringa sennò sveltekit va in errore
				nome_file: file_name_of_merged_pdf
			};
		} catch (exception) {
			console.log(exception);
			logger.error(JSON.stringify(exception));
			raise_error(
				500,
				700,
				`Errore irreversibile durante la generazione del PDF. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`
			);
		}
	}
};
