// v20251024
// v20250928

import { PrismaClient } from '@prisma/client';
//DEV
import { misure_dispensative } from '../../src/routes/pdp/template/dispensative.js';
import { misure_compensative } from '../../src/routes/pdp/template/compensative.js';
import { misure_valutative } from '../../src/routes/pdp/template/valutative.js';
import { strategie_classe } from '../../src/routes/pdp/template/strategie_classe.js';
import { strategie_didattiche } from '../../src/routes/pdp/template/strategie_didattiche.js';


//PROD
// import { misure_dispensative } from './dispensative.js';
// import { misure_compensative } from './compensative.js';
// import { misure_valutative } from './valutative.js';
// import { strategie_classe } from './strategie_classe.js';
// import { strategie_didattiche } from './strategie_didattiche.js';


// Istanzia il client per il SARP
const SARP = new PrismaClient();
const argv = process.argv;

async function get_insegnamenti(as) {
    let insegnamenti = await SARP.Insegnamenti.findMany({
        include: {
            classe: true
        },
        where: {
            anno: +as,
            materia: {
                has_pdp: true
            }
        }
    });

    return insegnamenti;
}

async function get_studenti_bes(idClasse) {
    return await SARP.utente.findMany({
        where: {
            bes: true,
            classeId: +idClasse,
            can_login: true
        }
    });
}

async function add_pdp(idDocente, idInsegnamento, idStudente, as) {
    try {
        let pdp = await SARP.PDP.findMany( {
            where: {
                idDocente: +idDocente,
                idInsegnamento: +idInsegnamento,
                idStudente: +idStudente,
                anno: +as
            }
        });

        if(pdp.length == 0) {
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
        }
    } catch (e) {
        console.log(e);
    }
}


async function main(argv) {
    if (argv.length != 3) {
        console.log("Usage: node create_pdp_entries.js <as>");
        return 255;
    }

    let as = argv[2];

    //prelevo gli insegmaneti dell'anno as
    let insegnamenti = await get_insegnamenti(+as);
    
    //per ogni insegnamento, determino la lista degli studenti
    //e per ogni studente BES creo un entry PDP
    for(let insegnamento of insegnamenti) {
        let studenti = await get_studenti_bes(insegnamento.idClasse);
        for(let studente of studenti) {
            console.log(`adding PDP for insegnamento [${insegnamento.id}] - studente [${studente.id}]`);
            await add_pdp(insegnamento.idDocente, insegnamento.id, studente.id, insegnamento.anno);
        }
    };
}

main(argv);