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

// async function get_insegnamenti(as) {
//     return await SARP.Insegnamenti.findMany({
//         select: {
//             id: true,
//             idDocente: true,
//             idMateria: true,
//             idClasse: true,
//             titolare: true,
//             anno: true
//         },
//         where: {
//             anno: +as,
//             NOT: {
//                 idMateria: {
//                     in: [32, 35, 36] //Escludo Scienze Motorie, CLIL e Educazione Civica che non hanno PDP
//                 }
//             }
//         }
//     })
// }

async function get_insegnamenti(as) {
    let insegnamenti = await SARP.Insegnamenti.findMany({
        // select: {
        //     id: true,
        //     idDocente: true,
        //     idMateria: true,
        //     idClasse: true,
        //     titolare: true,
        //     anno: true
        // },
        include: {
            classe: true,
        },
        where: {
            anno: +as,
            NOT: {
                idMateria: {
                    in: [9, 32, 35, 36, 48] //Escludo Religione, Scienze Motorie, CLIL e Educazione Civica, Robotica che non hanno PDP
                }
            }
        }
    });

    return insegnamenti.filter(ins => ins.classe.classe == 'I' || ins.classe.classe == 'III');
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
    if (argv.length != 3) {
        console.log("Usage: node create_pdp_entries.js <as>");
        return 255;
    }

    let as = argv[2];

    //prelevo gli insegmaneti dell'anno as
    let insegnamenti = await get_insegnamenti(+as);

    //per ogni insegnamento, determino la lista degli studenti
    //e per ogni studente BES creo un entry PDP
    insegnamenti.forEach(async insegnamento => {
        // console.log(insegnamento)
        let studenti = await get_studenti_bes(insegnamento.idClasse);
        studenti.forEach(async studente => {
            console.log(`adding PDP for insegnamento [${insegnamento.id}] - studente [${studente.id}]`);
            await add_pdp(insegnamento.idDocente, insegnamento.id, studente.id, insegnamento.anno);
        })
    });
}

main(argv);
