import readXlsxFile from 'read-excel-file/node';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import { execSync } from 'child_process';

const prisma = new PrismaClient();  // Inizializzo il client di SARP

// I nomi delle colonne nel foglio Excel
const name_row = "Nome";
const cognome_row = "Cognome";
const nascita_row = "Nato il";
const nato_a = "Nato a";
const residenza_row = "Residenza";
const telefono_row = "Telefono";
const cf_row = "Cod. Fis.";
const email_row = "E-mail docente";
const istituto_row = "Istituto";


const index_of_type = 6;    // Linea dei dettagli -1, Excel ragiona come una segretaria :)


const clean_useless_info = (record) => {
    if (record[0] != null)  // Se il record contiene una di queste parole va saltato perchè non contiene niente di utile
        return record[0].includes("Classe") || record[0].includes("ISTITUTO") || record[0].includes("C.so")
            || record[0].includes("Anno") || record[0].includes("Stampato")
            || record[0].includes("-- TORINO --") || record[0].includes("Cognome");

    return true;    // Nel caso sia null, non deve essere eseguito alcun codice quindi è come se la parola venisse saltata
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

function write_invalid_email(emails) {
    var file = fs.createWriteStream('invalid_docenti.txt');
    file.on('error', function (err) {
        throw new Error("Errore di scrittura sul file")
    });
    emails.forEach(function (v) {
        file.write(v + '\n');
    });
    file.end();
}

function capitalize(phrase) {
    return phrase.charAt(0).toUpperCase() + phrase.slice(1).toLowerCase();
}

async function main(filename) {
    const ruolo_docente = await prisma.ruolo_Utente.findFirst({
        where: {
            ruolo: "DOCENTE"
        }
    });
    readXlsxFile(filename).then(async (rows) => {
        console.log("Elaborazione XLSX...");
        /*
    
            Cognome	    Nome	    Nato il	    Nato a	        Residenza	                Telefono	Cod. Fis.	       Carta Identità	E-mail docente	                        Istituto
            ANGELINI	Beatrice	12/16/1996	TORINO (TO)	    Via Barletta 122, Torino	3338518958	NGLBRC96T56L219K		            beatrice.angelini@istitutoagnelli.it	ITT
            ANTONIELLO	MATTEO	    9/12/1988	MONCALIERI (TO)	Via Paganini 10 Nichelino	3398172765	NTNMTT88P12F335M		            matteo.antoniello@istitutoagnelli.it	MEDIE

            La logica implementata prende l'indice di NOME ad esempio, tutti i record all'indice della prima colonna NOME
            saranno sicuramente il nome della persona.
            Quindi Mario ha indice 0
            Idem Pino
    
            Questo perchè il record studente è un array di colonne contenente NOME, COGNOME...
    
        */

        const nome_index = rows[index_of_type].indexOf(name_row);
        const cognome_index = rows[index_of_type].indexOf(cognome_row);
        const nascita_index = rows[index_of_type].indexOf(nascita_row);
        const nato_a_index = rows[index_of_type].indexOf(nato_a);
        const residenza_index = rows[index_of_type].indexOf(residenza_row);
        const telefono_index = rows[index_of_type].indexOf(telefono_row);
        const cf_index = rows[index_of_type].indexOf(cf_row);
        const email_index = rows[index_of_type].indexOf(email_row);
        const istituto_index = rows[index_of_type].indexOf(istituto_row);

        // let classe_db; // La classe che stiamo scrivendo nel DB
        let docenti_invalid = [];
        let sezione, anno, istituto;
        for(let row of rows) {     
            if (!clean_useless_info(row)) {  // Non facciamo nulla se il record non è uno studente o una classe {
                console.log(email_index, row, row[email_index])
                if (row[email_index].split("@").slice(-1) != "istitutoagnelli.it") {
                    console.log("L'utente non ha una mail valida, non verrà aggiunto su SARP.");
                    docenti_invalid.push("".concat(row[nome_index], " ", row[cognome_index], " ", row[email_index]))
                } else {
                    console.log("Creo il docente: ".concat(row[nome_index], " ", row[cognome_index]));
                    console.log("--------------------------------")
                    
                    const re = /^(?<citta>.+?)\s*\((?<provincia>[A-Z]{2})\)\s*$/u;
                    const nacita_extract = re.exec(row[nato_a_index]);
                    const citta = nacita_extract.groups.citta || "";
                    const provincia = nacita_extract.groups.provincia || "";
                    
                    try {
                        await prisma.utente.create({
                            // Creaiamo un nuovo record secondo la regola di parsing spiegata sopra
                            data: {
                                nome: capitalize(row[nome_index].replace("'", "").toLowerCase()),
                                cognome: capitalize(row[cognome_index].replace("'", "").toLowerCase()),
                                natoIl: row[nascita_index],
                                // natoA: capitalize(row[nato_a_index].replace("'", "").split("(")[0]), // Splittiamo la frase al primo (   TORINO(TO) [TORINO, TO)]
                                natoA: citta,
                                provincia: provincia,
                                residenza: row[residenza_index],
                                codiceF: row[cf_index],
                                email: row[email_index],
                                bes: false,
                                picture: '',
                                can_login: true,
                                tipo: 'DOCENTE',
                                creatoDa: 1,
                                classeId: 1, // il docente non ha classe
                                istituto: row[istituto_index].split('/')[0],
                                ruoli: {
                                    connect: {
                                        id: ruolo_docente.id
                                    }
                                },
                                telefono: String(row[telefono_index])
                            }
                        });
                    } catch(e) {
                        console.log(`Impossibile creare il docente ${row[nome_index]} ${row[cognome_index]}`);
                        docenti_invalid.push("".concat(row[nome_index], " ", row[cognome_index], " ", row[email_index]));
                    }    
                }
            }
        }
        // });

        write_invalid_email(docenti_invalid);
    });
}

function xsl_to_xslx(filename) {
    console.log("Libreoffice deve essere installato affinchè il convertitore funzioni.");
    execSync("libreoffice --convert-to xlsx " + filename + " --headless");
    filename = filename.split(".");
    filename[filename.length - 1] = "xlsx";
    return filename.join(".");
}

function handle_filename() {
    if (process.argv[2] == null) {
        console.log("Benvenuto in SARP Excel to Prisma Parser! Uso: node import_studenti.js FILENAME")
        process.exit(255);
    } else {
        const filename = process.argv[2];
        if (fs.existsSync(filename))
            if (filename.split(".").slice(-1) == "xlsx")
                return filename;
            else {
                if (filename.split(".").slice(-1) == "xls") {
                    return xsl_to_xslx(filename)
                } else {
                    console.log("Estensione file non riconosciuta");
                    process.exit(255);
                }
            }
        else {
            console.error("File non esistente");
            process.exit(255);
        }
    }
}

main(handle_filename())

