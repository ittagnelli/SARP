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
const indirizzo_row = "Indirizzo residenza";
const telefono_row = "Cell. madre";
const cf_row = "Cod. Fis.";
const email_row = "E-mail studente";
const pdp_row = "PDP";
const obiettivi_row = "Obiettivi Minimi";
const class_row = "Classe:";


const index_of_type = 6;    // Linea dei dettagli -1, Excel ragiona come una segretaria :)

const is_a_class = (record) => {
    if (record != null)
        return record.includes(class_row);  // Se il record contiene la parola classe siamo sicuri identifichi una classe

    return false;
}

function filter_class(record) {
    return record.splice(0, 1)[0].slice(class_row.length + 1);  // +1 perchè voglio rimuovere anche lo spazio iniziale tra classe e sezione
}

function decimal_to_roman(decimal) {    // Convertitore decimale to numero romano
    let roman_number = "";
    switch (decimal) {
        case 0:
            roman_number = null;
            break;
        case 1:
            roman_number = "I";
            break;
        case 2:
            roman_number = "II";
            break;
        case 3:
            roman_number = "III";
            break;
        case 4:
            roman_number = "IV";
            break;
        case 5:
            roman_number = "V";
            break;
        default:
            roman_number = null;
            break;
    }
    return roman_number;
}

const get_section = (classe_raw) => {
    if (classe_raw[1] == "Liceo") {
        return classe_raw[0].slice(1);  // Una classe del liceo contiene una sola lettere ad esempio 4A
    } else {
        return classe_raw[0].slice(1, 4);   // Una classe del ITT contiene l'abbreviazione dell'indirizzo, ad esempio 4INFO
    }
}

const get_istituto = (classe_raw) => {
    if (classe_raw[1] == "Liceo") { // Nel nostro DB Liceo va in uppercase
        return "LICEO";
    } else {
        return "ITT";
    }
}

const excel_to_db = (sezione) => {  // Convertiamo l'excel per adattarlo ad alcune incongruenze del nostro DB
    if (sezione == "INF") {
        return "INFO";
    } else if (sezione == "MEC") {
        return "MECC";
    }
    return sezione;
}
const clean_useless_info = (record) => {
    if (record[0] != null)  // Se il record contiene una di queste parole va saltato perchè non contiene niente di utile
        return record[0].includes("ISTITUTO") || record[0].includes("C.so")
            || record[0].includes("Anno") || record[0].includes("Stampato")
            || record[0].includes("-- TORINO --") || record[0].includes("Cognome");

    return true;    // Nel caso sia null, non deve essere eseguito alcun codice quindi è come se la parola venisse saltata
}

const mastercom_bool_to_real_bool = (fake_bool) => {    // Mastercom non conosce i booleani, convertiamo quindi in un formato accettabile per un sistema informatico :)
    if (fake_bool == "SI")
        return true;
    else
        return false;
}

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

function write_invalid_email(emails) {
    var file = fs.createWriteStream('invalid_email.txt');
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
    const ruolo_studente = await prisma.ruolo_Utente.findFirst({
        where: {
            ruolo: "STUDENTE"
        }
    });
    readXlsxFile(filename).then(async (rows) => {
        console.log("Elaborazione XLSX...");
        /*
    
            NOME    COGNOME     NASCITA     NATO A      CF      EMAIL                           BES 
            Mario   Rossi       19/02/2005  Torino      xxx     mario.rossi@istitutoagnelli.it  NO
            Pino   Rossi       19/02/2005  Torino      xxx     pino.rossi@istitutoagnelli.it  NO
    
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
        const indirizzo_index = rows[index_of_type].indexOf(indirizzo_row);
        const telefono_index = rows[index_of_type].indexOf(telefono_row);
        const cf_index = rows[index_of_type].indexOf(cf_row);
        const email_index = rows[index_of_type].indexOf(email_row);
        const pdp_index = rows[index_of_type].indexOf(pdp_row);
        const obiettivi_index = rows[index_of_type].indexOf(obiettivi_row);

        // let classe_db; // La classe che stiamo scrivendo nel DB
        let studenti_invalid = [];
        let sezione, anno, istituto;
        rows.forEach(async (row) => {

            sleep(100);
            if (clean_useless_info(row)) {  // Non facciamo nulla se il record non è uno studente o una classe
                return;
            } else {
                if (is_a_class(row[0])) {
                    const classe = filter_class(row).split(" ");    // Prendiamo la classe
                    sezione = get_section(classe);    // Prendiamo la sezione in accordo all'istituto(Liceo o ITT)
                    anno = classe[0].slice(0, 1); // Prendiamo l'anno(terza, quarta...)
                    istituto = get_istituto(classe);  //  Prendiamo l'istituto

                    // Qui l'await non aspetta il risultato e la classe risulta vuota, per il momento facciamo tutte la query dopo

                    //classe_db = await prisma.classe.findFirstOrThrow({ // Con le informazioni ricavate prendiamo la classe dal DB
                    //     where: {
                    //         classe: decimal_to_roman(+anno),
                    //         istituto: istituto,
                    //         sezione: excel_to_db(sezione)
                    //     }
                    // });
                } else {
                    if (row[email_index].split("@").slice(-1) != "istitutoagnelli.it") {
                        console.log("L'utente non ha una mail valida, non verrà aggiunto su SARP.");
                        studenti_invalid.push("".concat(row[nome_index], " ", row[cognome_index], " ", row[email_index]))
                    } else {
                        console.log("Creo/Aggiorno l'utente: ".concat(row[nome_index], " ", row[cognome_index]));
                        const classe = await prisma.classe.findFirst({ // Con le informazioni ricavate prendiamo la classe dal DB
                            where: {
                                classe: decimal_to_roman(+anno),
                                istituto: istituto,
                                sezione: excel_to_db(sezione)
                            }
                        });

                        await prisma.utente.upsert({
                            create: {   // Creaiamo un nuovo record secondo la regola di parsing spiegata sopra
                                nome: capitalize(row[nome_index].replace("'", "").toLowerCase()),
                                cognome: capitalize(row[cognome_index].replace("'", "")),
                                natoIl: row[nascita_index],
                                natoA: capitalize(row[nato_a_index].replace("'", "").split("(")[0]), // Splittiamo la frase al primo (   TORINO(TO) [TORINO, TO)]
                                provincia: row[nato_a_index].replace("'", "").split("(")[1].split(')')[0],
                                residenza: row[indirizzo_index].concat(' ', row[residenza_index]),
                                telefono: String(row[telefono_index]),
                                codiceF: row[cf_index],
                                email: row[email_index],
                                bes: mastercom_bool_to_real_bool(row[pdp_index]),
                                obiettivi_minimi: mastercom_bool_to_real_bool(row[obiettivi_index]),
                                can_login: true,
                                creatoDa: 1,
                                classeId: classe.id,
                                istituto: classe.istituto,
                                ruoli: {
                                    connect: {
                                        id: ruolo_studente.id
                                    }
                                }
                            },
                            update: {   // Aggiorniamo il record se esiste, modificando solo i campi necessari
                                classeId: classe.id,
                                residenza: row[indirizzo_index].concat(' ', row[residenza_index]),
                                natoA: capitalize(row[nato_a_index].replace("'", "").split("(")[0]), // Splittiamo la frase al primo (   TORINO(TO) [TORINO, TO)]
                                provincia: row[nato_a_index].replace("'", "").split("(")[1].split(')')[0],
                                telefono: String(row[telefono_index]),
                                email: row[email_index],
                                bes: mastercom_bool_to_real_bool(row[pdp_index]),
                                obiettivi_minimi: mastercom_bool_to_real_bool(row[obiettivi_index]),
                                istituto: classe.istituto,
                                can_login: true,
                            },
                            where: {
                                email: row[email_index]
                            }
                        });
                    }
                }
            }
        });

        write_invalid_email(studenti_invalid);
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

