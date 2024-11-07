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

async function get_insegnamenti(as, idClasse) {
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
            idClasse: +idClasse,
            NOT: {
                idMateria: {
                    in: [32, 35, 36] //Escludo Scienze Motorie, CLIL e Educazione Civica che non hanno PDP
                }
            }
        }
    });

    // return insegnamenti.filter(ins => ins.classe.classe == 'I' || ins.classe.classe == 'III');
    return insegnamenti;
}


// async function get_studenti_bes(idClasse, idStudente) {
//     return await SARP.utente.findMany({
//         where: {
//             id: +idStudente,
//             bes: true,
//             classeId: +idClasse,
//             can_login: true
//         }
//     });
// }

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
    if (argv.length != 5) {
        console.log("Usage: node create_pdp_entries.js <as> <id studente> <id classe>");
        return 255;
    }

    let as = argv[2];
    let idStudente = argv[3];
    let idClasse = argv[4];

    console.log("AS:", as)
    console.log("STUDENTE:", idStudente);


    //prelevo gli insegmaneti dell'anno as
    let insegnamenti = await get_insegnamenti(+as, idClasse);

    console.log("INSEGNAMENTI:", insegnamenti.length)

    //per ogni insegnamento, determino la lista degli studenti
    //e per ogni studente BES creo un entry PDP
    insegnamenti.forEach(async insegnamento => {
        // console.log(insegnamento)
        // let studenti = await get_studenti_bes(idClasse, idStudente);
        // console.log(studenti)
        // studenti.forEach(async studente => {
        console.log(`adding PDP for insegnamento [${insegnamento.id}] - studente [${idStudente}]`);
        await add_pdp(insegnamento.idDocente, insegnamento.id, +idStudente, insegnamento.anno);
        // })
    });
}

main(argv);
