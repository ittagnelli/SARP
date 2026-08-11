// v20260803

import { PrismaClient } from '@prisma/client';

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

async function get_insegnamenti(as) {
    let insegnamenti = await SARP.Insegnamenti.findMany({
        where: {
            anno: +as
        },
        select: {
            id: true,
            idDocente: true,
            idMateria: true
        }
    });

    return insegnamenti;
}

async function get_pdp(as) {
    let pdp =  await SARP.PDP.findMany({
        where: {
          anno: +as
        },
        select: {
            id: true,
            idInsegnamento: true,
            idDocente: true,
            idStudente: true,
            idMateria: true,
        }
    })

    return pdp;
}

async function update_pdp(pdps) {
    try {
        pdps.map(async pdp => {
          await SARP.PDP.update({
            where: {id: pdp.id},
            data: pdp
          })
        })
    } catch(e) {
      console.log(e)
    }
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
        console.log("Usage: node alter_pdp_once <as>");
        return 255;
    }

    let as = argv[2];
    console.log("AS:", as)

    //prelevo gli insegmaneti dell'anno as
    let insegnamenti = await get_insegnamenti(+as);
    let pdps = await get_pdp(+as);

    console.log("INSEGNAMENTI:", insegnamenti)
    console.log("PDP:", pdps)

    pdps.map(pdp => {
        pdp.idMateria = insegnamenti.filter(insegnamento => insegnamento.id == pdp.idInsegnamento)[0].idMateria
    })

    console.log("pdP:", pdps)

    await update_pdp(pdps) 
    
    //per ogni insegnamento, determino la lista degli studenti
    //e per ogni studente BES creo un entry PDP
    // for(let insegnamento of insegnamenti) {
        // console.log(`adding PDP for insegnamento [${insegnamento.id}] - studente [${idStudente}]`);
        // await add_pdp(insegnamento.idDocente, insegnamento.id, +idStudente, +as);
    // }
}

main(argv);
