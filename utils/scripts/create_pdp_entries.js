import { PrismaClient } from '@prisma/client';
import { misure_dispensative } from '../../src/routes/pdp/template/dispensative.js';
import { misure_compensative } from '../../src/routes/pdp/template/compensative.js';
import { misure_valutative } from '../../src/routes/pdp/template/valutative.js';


// Istanzia il client per il SARP
const SARP = new PrismaClient();
const argv = process.argv;

async function get_insegnamenti(as) {
    return await SARP.Insegnamenti.findMany({
        select: {
            id: true,
            idDocente: true,
            idMateria: true,
            idClasse: true,
            titolare: true,
            anno: true
        },
        where: {
            anno: +as,
            NOT: {
                idMateria: {
                    in: [32, 35, 36] //Scienze Motorie, CLIL e Educazione Civica
                }
            }
        }
    })
}

async function get_studenti_bes(idClasse) {
    return await SARP.utente.findMany({
        where: {
            bes: true,
            classeId: +idClasse
        }
    });
}

async function add_pdp(idDocente, idInsegnamento, idStudente, as) {
    try {
        await SARP.PDP.create({
            data: {
                idDocente: idDocente,
                idInsegnamento: idInsegnamento,
                idStudente: idStudente,
                anno: as,
                dispensative: misure_dispensative,
                compensative: misure_compensative,
                valutative: misure_valutative,
                altro: ''
            }       
        });
    } catch(e) {
        console.log(e);
    }
}


async function main(argv){
    if(argv.length != 3){
        console.log("Usage: node create_pdp_entries.js <as>");
        return 255;
    }
    
    //prelevo gli insegmaneti dell'anno as
    let insegnamenti = await get_insegnamenti(2023);

    //per ogni insegnamento, determino la lista degli studenti
    //e per ogni studente BES creo un entry PDP
    insegnamenti.forEach(async insegnamento => {
        let studenti = await get_studenti_bes(insegnamento.idClasse);
        studenti.forEach(async studente => {
            console.log(`adding PDP for insegnamento [${insegnamento.id}] - studente [${studente.id}]`);
            await add_pdp(insegnamento.idDocente, insegnamento.id, studente.id, insegnamento.anno);
        })
    });
}

main(argv);
