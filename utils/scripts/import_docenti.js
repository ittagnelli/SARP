import readXlsxFile from 'read-excel-file/node';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import { execSync } from 'child_process';

const prisma = new PrismaClient();  // Inizializzo il client di SARP

// I nomi delle colonne nel foglio Excel
const cognome_row = "Cognome";
const materia_row = "Materia";
const classe_row = "Classe";
const istituto_row = "Istituto";
const sezione_row = "Sezione";
const titolare_row = "Titolare";



const index_of_type = 0;    // Linea dei dettagli -1, Excel ragiona come una segretaria :)

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

const is_titolare = (sign) => sign == 'X';

async function create_if_not_exists(materia_name) {   // Sfortunamente prisma non supporta la query CREATE ... IF NOT EXISTS
    const materia_from_db = await prisma.materia.findFirst({
        where: {
            nome: materia_name
        }
    })
    if(materia_from_db != null) {
        return materia_from_db
    } else {
        const generated_materia = await prisma.materia.create({
            data: {
                nome: materia_name
            }
        });
        return generated_materia;
    }
}

const not_info_row = (row, cognome_index) => {
    console.log(row[cognome_index])
    return row[cognome_index] != "Cognome";
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

async function main(filename) {
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

        const cognome_index = rows[index_of_type].indexOf(cognome_row);
        const materia_index = rows[index_of_type].indexOf(materia_row);
        const classe_index = rows[index_of_type].indexOf(classe_row);
        const istituto_index = rows[index_of_type].indexOf(istituto_row);
        const sezione_index = rows[index_of_type].indexOf(sezione_row);
        const titolare_index = rows[index_of_type].indexOf(titolare_row);

        rows.forEach(async (row) => {
           // console.log("Creo/Aggiorno l'utente: ".concat(row[cognome_index]));

            if (not_info_row(row, cognome_index)) {
                const docente = await prisma.utente.findFirst({
                    where: {
                        cognome: row[cognome_index]
                    }
                });

                const classe = await prisma.classe.findFirst({
                    where: {
                        classe: decimal_to_roman(row[classe_index]),
                        istituto: row[istituto_index],
                        sezione: row[sezione_index]
                    }
                });
                const materia =  await create_if_not_exists(row[materia_index]);
                if (docente != null && classe != null) {
                    await prisma.insegnamenti.create({
                        data: {
                            // docente: {
                            //     connect: docente.id
                            // },
                            // materia: {
                            //     connect: materia.id
                            // },
                            // classe: {
                            //     connect: classe.id
                            // },
                            titolare: is_titolare(row[titolare_index]),
                            idClasse: classe.id,
                            idDocente: docente.id,
                            idMateria: materia.id,
                            anno: 0
                        }
                    })
                }
            }

        });
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
        console.log("Benvenuto in SARP Excel to Prisma Parser! Uso: node excel_to_prisma.js FILENAME")
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

