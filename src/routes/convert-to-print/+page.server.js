import { raise_error, route_protect } from '../../js/helper'; //PROF: usa l'helper raise_erorr che ho cretao qualche settimana fa
import { Logger } from '../../js/logger';
import fs from 'fs';
import PDFMerger from 'pdf-merger-js';
import crypto from 'crypto';
import { exec } from 'child_process';
import { PUBLIC_PDF_TMP_FILE, PUBLIC_PDF_BLANK_FILE } from '$env/static/public';
import pdf_counter from "pdf-page-counter";

let logger = new Logger('server'); //instanzia il logger

function cleanup(files){
    files.forEach(file => {
        fs.unlinkSync(`tmp/${file.name}`); // Rimuovo i files caricati in questo form, ormai non servono più
    });
}

const random_name = () => crypto.randomBytes(20).toString('hex');   // Genera 20 bytes casuali e li converte in esadecimale

const merger = new PDFMerger();

export const actions = {
    pdf: async ({ request, locals }) => {
        route_protect(locals);  // Controlla che l'utente sia autenticato
        
        const form_data = await request.formData();

        const files = form_data.getAll('file-to-convert');

        try {
            if (!fs.existsSync("tmp/")) fs.mkdirSync("tmp");    // Se non esiste la cartella temporanea creala

            for (const file of files) {

                let file_name = file.name;
                file_name.replace(" ", "");

                const extension = file_name.split(".")[1];  // L'estensione del file test.pdf sarà [test, pdf]

                fs.writeFileSync(`tmp/${file_name}`, Buffer.from(await file.arrayBuffer()));    // Scrivo il file nella cartella temporanea

                if(extension == "docx" || extension == "doc"){  // Se il file è Word dobbiamo convertirlo in PDF
                    const cmd = `libreoffice --headless --convert-to pdf --outdir ${PUBLIC_PDF_TMP_FILE} ${PUBLIC_PDF_TMP_FILE}/${file_name}`;
                    exec(cmd);
                    file_name = file_name.split(".")[0] + ".pdf";
                }

                const our_pdf = fs.readFileSync(`tmp/${file_name}`);
                const pages = await pdf_counter(our_pdf);
                await merger.add(`tmp/${file_name}`);   // Aggiungo il pd// Usiamo un for classico al posto di forEach per il corretto merge dei filef al nuovo file
                if(pages.numpages % 2 != 0){    // Aggingiamo una pagina se la verifica è dispari
                    await merger.add(PUBLIC_PDF_BLANK_FILE);
                }
            }
            const file_name_of_merged_pdf = random_name() + ".pdf"; // Generiamo un nome casuale per evitare sovrascritture
            
            cleanup(files);   // Rimuovo i files caricati in questo form, ormai non servono più

			return {
				file: JSON.stringify(await merger.saveAsBuffer()), // Convertiamo il buffer in stringa sennò sveltekit va in errore
				nome_file: file_name_of_merged_pdf
			};

        } catch (exception) {
            console.log(exception);
            logger.error(JSON.stringify(exception)); 
            raise_error(500, 100, `Errore irreversibile durante la generazione del PDF. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`); 
        }
    }
};
