import readXlsxFile from 'read-excel-file/node';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import { execSync } from 'child_process';
import { exit } from 'process';

const prisma = new PrismaClient(); // Inizializzo il client di SARP

const is_titolare = (sign) => sign == 'X';

const find_docente = (docenti, cognome) => {
    return docenti.filter(docente => docente.cognome.toLowerCase() == cognome.toLowerCase())[0];
}

const find_materia = (meterie, materia) => {
    let tmpMaterie = meterie.filter(mat => mat.nome.toLowerCase() == materia.toLowerCase());
    return tmpMaterie.length > 0 ? tmpMaterie[0] : undefined;
}

const find_classe = (classi, classe, istituto, sezione) => {
    return classi.filter(c => c.classe == classe && c.istituto == istituto && c.sezione == sezione)[0];
}

const find_insegnamento = (insegnamenti, docente, materia, classe, as) => {
    return insegnamenti.filter(ins =>
        ins.idDocente == docente &&
        ins.idMateria == materia &&
        ins.idClasse == classe &&
        ins.anno == as
    )[0];
}

async function main(filename) {
    const classi = await prisma.classe.findMany();
    const materie = await prisma.materia.findMany();
    const insegnamenti = await prisma.insegnamenti.findMany();
    const docenti = await prisma.utente.findMany({
        where: {
            tipo: 'DOCENTE',
            can_login: true
        }
    });

    if (classi.length == 0 ||
        materie.length == 0 ||
        docenti.length == 0) {
        console.log("ERRORE: classi,materie e docenti devono essere presenti nel DB!!!!");
        process.exit(1)
    }

    let rows = await readXlsxFile(filename);
   
    console.log('Elaborazione XLSX...');
    /*
    Cognome	Materia	a.s.	Classe	Istituto	Sezione	Titolare	Compresenza/altro
    */

    let counter = 0;

    for(let row of rows.slice(1)) {
        let [cognome, materia, as, classe, istituto, sezione, titolare, dainserire] = row;
        let Docente = find_docente(docenti, cognome);
        let Classe = find_classe(classi, classe, istituto, sezione);
        let Materia = find_materia(materie, materia);

        if (dainserire == 'X') {
            if (Docente && Classe && Materia) {
                let Insegnamento = find_insegnamento(insegnamenti, Docente.id, Materia.id, Classe.id, as);
                try {
                    if (Insegnamento) {
                        //update
                        console.log("qui1")
                        await prisma.insegnamenti.update({
                            where: {
                                id: Insegnamento.id
                            },
                            data: {
                                idDocente: Docente.id,
                                idMateria: Materia.id,
                                idClasse: Classe.id,
                                titolare: is_titolare(titolare),
                                anno: as
                            }
                        });
                    } else {
                        //create
                        await prisma.insegnamenti.create({
                            data: {
                                idDocente: Docente.id,
                                idMateria: Materia.id,
                                idClasse: Classe.id,
                                titolare: is_titolare(titolare),
                                anno: as
                            }
                        });
                    }
                } catch (e) {
                    console.log(e);
                }
                console.log(`Inserito Insegnamento [${++counter}]: ${Docente?.cognome} - ${Classe?.classe} ${Classe?.istituto} ${Classe?.sezione} - ${Materia?.nome}`);
            } else {
                    console.log("ERROR:", row);
                    // console.log("DOCENTE:", Docente);
                    // console.log("CLASSE:", Classe);
                    // console.log("MATERIA:", Materia);
                    // exit(1);
            }
        } else {
            console.log(`Saltato Insegnamento: ${Docente?.cognome} - ${Classe.classe} ${Classe?.istituto} ${Classe?.sezione} - ${Materia?.nome}`);
        }
    }
}

function xsl_to_xslx(filename) {
    console.log('Libreoffice deve essere installato affinchè il convertitore funzioni.');
    execSync('libreoffice --convert-to xlsx ' + filename + ' --headless');
    filename = filename.split('.');
    filename[filename.length - 1] = 'xlsx';
    return filename.join('.');
}

function handle_filename() {
    if (process.argv[2] == null) {
        console.log('Benvenuto in SARP Excel to Prisma Parser! Uso: node excel_to_prisma.js FILENAME');
        process.exit(255);
    } else {
        const filename = process.argv[2];
        if (fs.existsSync(filename))
            if (filename.split('.').slice(-1) == 'xlsx') return filename;
            else {
                if (filename.split('.').slice(-1) == 'xls') {
                    return xsl_to_xslx(filename);
                } else {
                    console.log('Estensione file non riconosciuta');
                    process.exit(255);
                }
            }
        else {
            console.error('File non esistente');
            process.exit(255);
        }
    }
}

(async function () {
    await main(handle_filename());
})();

