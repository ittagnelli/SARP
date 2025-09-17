import readXlsxFile from 'read-excel-file/node';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import { execSync } from 'child_process';
import { exit } from 'process';

const prisma = new PrismaClient(); // Inizializzo il client di SARP

const is_titolare = (sign) => sign == 'X';

// const find_docente = (docenti, cognome) => {
//     return docenti.filter(docente => docente.cognome.toLowerCase() == cognome.toLowerCase())[0];
// }

// const parseNomeCognome = (input) => {
//     // normalizza: trim + spazi multipli -> singolo spazio
//     const s = input.trim().replace(/\s+/g, ' '); // [web:10][web:7][web:16]
  
//     // regex: inizio -> gruppo cognome -> spazio -> gruppo nome (uno o più token)
//     // \p{L} = lettera unicode; permette anche accenti. Consente ' e - dentro alle parole.
//     const re = /^([\p{L}]+(?:['’-][\p{L}]+)*)\s+([\p{L}]+(?:['’-][\p{L}]+)*(?:\s+[\p{L}]+(?:['’-][\p{L}]+)*)*)$/u; // [web:16][web:6]
  
//     const m = s.match(re); // [web:16]
//     if (!m) return null;
  
//     // normalizza in minuscolo come richiesto dall’esempio
//     let cognome = m[1].toLowerCase(); // [web:16]
//     let nome = m[2].toLowerCase();    // [web:16]
  
//     return { cognome, nome }; // [web:16]
// }

  
const find_docente = (docenti, cognome, nome) => {
    // let {cognome, nome} = parseNomeCognome(inCognomeNome);

    return docenti.filter(docente => (
        docente.cognome.toLowerCase() == cognome.toLowerCase() &&
        docente.nome.toLowerCase() == nome.toLowerCase())
        ).length == 1;
}

const find_materia = (meterie, materia) => {
    let tmpMaterie = meterie.filter(mat => mat.nome.toLowerCase() == materia.toLowerCase());
    return tmpMaterie.length > 0 ? tmpMaterie[0] : undefined;
}

const find_classe = (classi, classe, istituto, sezione) => {
    return classi.filter(c => c.classe == classe && c.istituto == istituto && c.sezione.toLowerCase().startsWith(sezione.toLowerCase())).length == 1;
}

const find_insegnamento = (insegnamenti, docente, materia, classe, as) => {
    return insegnamenti.filter(ins =>
        ins.idDocente == docente &&
        ins.idMateria == materia &&
        ins.idClasse == classe &&
        ins.anno == as
    )[0];
}

const verificaDocenti = (docenti, rows) => {
    let status = [];
    for(let row of rows.slice(1)) {
        let docenteFound = find_docente(docenti, row[0], row[1]);
        status.push(docenteFound); 
        if(!docenteFound)
            console.log(`Non posso trovare il docente: ${row[0]} nel DB!!`);
    }
    return status.every(item => item == true);
}

const verificaClassi = (classi, rows) => {
    let status = [];
    for(let row of rows.slice(1)) {
        let classeFound = find_classe(classi, row[4], row[5], row[6]);
        status.push(classeFound); 
        if(!classeFound)
            console.log(`Non posso trovare la classe ${row[4]} ${row[5]} ${row[6]} nel DB!!`);
    }
    return status.every(item => item == true);
}

const verificaMaterie = (materie, rows) => {
    let status = [];
    for(let row of rows.slice(1)) {
        // console.log(row[2])
        let classeFound = find_materia(materie, row[2]);
        status.push(classeFound); 
        if(!classeFound)
            console.log(`Non posso trovare la materia ${row[2]} nel DB!!`);
    }
    return status.every(item => item == true);
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
    
    
    // if(!verificaDocenti(docenti, rows)) {
    //     console.log("Errore alcuni docenti non esistono nel DB!!!");
    //     exit(1);
    // }
    // if(!verificaClassi(classi, rows)) {
    //     console.log("Errore alcune classi non esistono nel DB!!!");
    //     exit(1);
    // }
    if(!verificaMaterie(materie, rows)) {
        console.log("Errore alcune materie non esistono nel DB!!!");
        exit(1);
    }
    /*
    Cognome	Materia	a.s.	Classe	Istituto	Sezione	Titolare	Compresenza/altro
    */

    let counter = 0;

    for(let row of rows.slice(1)) {
        let [cognome, nome, materia, as, classe, istituto, sezione, titolare, dainserire] = row;
        let Docente = find_docente(docenti, cognome,nome);
        let Classe = find_classe(classi, classe, istituto, sezione);
        let Materia = find_materia(materie, materia);

        console.log("DOCENTE:",Docente)
        console.log("CLASSE:",Classe)
        console.log("MATERIA:",materia)

        exit(1);

        if (dainserire == 'X') {
            if (Docente && Classe && Materia) {
                let Insegnamento = find_insegnamento(insegnamenti, Docente.id, Materia.id, Classe.id, as);
                try {
                    if (Insegnamento) {
                        //update
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

