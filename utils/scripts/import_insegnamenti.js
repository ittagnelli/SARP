import readXlsxFile from 'read-excel-file/node';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import { execSync } from 'child_process';
import { exit } from 'process';

const prisma = new PrismaClient(); // Inizializzo il client di SARP

const is_titolare = (sign) => sign == 'X';

const find_docente = (docenti, cognome) => {
    return docenti.filter(docente => docente.cognome == cognome)[0];
}

const find_materia = (meterie, materia) => {
    return meterie.filter(mat => mat.nome ==  materia)[0];
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
            tipo: 'DOCENTE' 
        }
    });

    if(classi.length == 0 ||
        materie.length == 0 ||
        docenti.length == 0) {
            console.log("ERRORE: classi,materie e docenti devono essere presenti nel DB!!!!");
            process.exit(1)
    }
    
    let rows =  await readXlsxFile(filename);

    console.log('Elaborazione XLSX...');
    /*
    Cognome	Materia	a.s.	Classe	Istituto	Sezione	Titolare	Compresenza/altro
    */    


    rows.slice(1).forEach(async (row) => {
        let [cognome, materia, as, classe, istituto, sezione, titolare, compresenza] = row;
        let Docente = find_docente(docenti, cognome);
        let Classe = find_classe(classi, classe, istituto, sezione);
        let Materia = find_materia(materie, materia);
        
        if(Docente && Classe && Materia) {
            let Insegnamento = find_insegnamento(insegnamenti, Docente.id, Materia.id, Classe.id, as);
            await prisma.insegnamenti.upsert({
                create: {
                    
                        idDocente: Docente.id ,
                        idMateria: Materia.id ,
                        idClasse:  Classe.id,
                        titolare: is_titolare(titolare),
                        anno: as
                    
                },
                update: {
                    idDocente: Docente.id ,
                    idMateria: Materia.id ,
                    idClasse:  Classe.id,
                    titolare: is_titolare(titolare),
                    anno: as
                },
                where: {
                    id: Insegnamento ? Insegnamento.id : 0
                }
            });
        } else {
            console.log("ERROR:", row);
            console.log("DOCENTE:", Docente);
            console.log("CLASSE:", Classe);
            console.log("MATERIA:", Materia);
            exit(1);
        }
    });
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

