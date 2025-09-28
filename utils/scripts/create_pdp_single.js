// v20250928

import { PrismaClient } from '@prisma/client';
//DEV
// import { misure_dispensative } from '../../src/routes/pdp/template/dispensative.js';
// import { misure_compensative } from '../../src/routes/pdp/template/compensative.js';
// import { misure_valutative } from '../../src/routes/pdp/template/valutative.js';
// import { strategie_classe } from '../../src/routes/pdp/template/strategie_classe.js';
// import { strategie_didattiche } from '../../src/routes/pdp/template/strategie_didattiche.js';


//PROD
import { misure_dispensative } from './dispensative.js';
import { misure_compensative } from './compensative.js';
import { misure_valutative } from './valutative.js';
import { strategie_classe } from './strategie_classe.js';
import { strategie_didattiche } from './strategie_didattiche.js';


// Istanzia il client per il SARP
const SARP = new PrismaClient();
const argv = process.argv;

async function get_idClasse(idStudente) {
    let studente = await SARP.utente.findUnique({
        where: {
            id: idStudente
        }
    })

    return studente ? studente.classeId: 0;
}

async function get_insegnamenti(as, idClasse) {
    let insegnamenti = await SARP.Insegnamenti.findMany({
        include: {
            classe: true
        },
        where: {
            anno: +as,
            idClasse: +idClasse,
            materia: {
                has_pdp: true
            }
        }
    });

    return insegnamenti;
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
                strategie_classe: strategie_classe,
                strategie_didattiche: strategie_didattiche
            }
        });
    } catch (e) {
        console.log(e);
    }
}

async function main(argv) {
    if (argv.length != 4) {
        console.log("Usage: node create_pdp_entries.js <as> <id studente>");
        return 255;
    }

    let as = argv[2];
    let idStudente = argv[3];
    let idClasse = await get_idClasse(+idStudente);

    console.log("AS:", as)
    console.log("STUDENTE:", idStudente);


    //prelevo gli insegmaneti dell'anno as
    let insegnamenti = await get_insegnamenti(+as, idClasse);

    //per ogni insegnamento, determino la lista degli studenti
    //e per ogni studente BES creo un entry PDP
    for(let insegnamento of insegnamenti) {
        console.log(`adding PDP for insegnamento [${insegnamento.id}] - studente [${idStudente}]`);
        await add_pdp(insegnamento.idDocente, insegnamento.id, +idStudente, +as);
    }
}

main(argv);
