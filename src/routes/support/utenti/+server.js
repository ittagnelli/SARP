import { json } from '@sveltejs/kit';
import { PrismaDB } from '$js/prisma_db';
import { route_protect, raise_error, get_as } from '$js/helper';
import { PrismaClientValidationError } from '@prisma/client/runtime';
import { Logger } from '$js/logger';
import { dev } from '$app/environment';

// const { misure_dispensative } = await import(
//     /* @vite-ignore */ 
//     dev
//       ? '../../pdp/template/dispensative.js'
//       : './dispensative.js'
//   );

//   const { misure_compensative } = await import(
//     /* @vite-ignore */ 
//     dev
//       ? '../../pdp/template/compensative.js'
//       : './compensative.js'
//   );

//   const { misure_valutative } = await import(
//     /* @vite-ignore */ 
//     dev
//       ? '../../pdp/template/valutative.js'
//       : './valutative.js'
//   );

//   const { strategie_classe } = await import(
//     /* @vite-ignore */ 
//     dev
//       ? '../../pdp/template/strategie_classe.js'
//       : './strategie_classe.js'
//   );

//   const { strategie_didattiche } = await import(
//     /* @vite-ignore */ 
//     dev
//       ? '../../pdp/template/strategie_didattiche.js'
//       : './strategie_didattiche.js'
//   );

//DEV
// import { misure_dispensative } from '../../pdp/template/dispensative.js';
// import { misure_compensative } from '../../pdp/template/compensative.js';
// import { misure_valutative } from '../../pdp/template/valutative.js';
// import { strategie_classe } from '../../pdp/template/strategie_classe.js';
// import { strategie_didattiche } from '../../pdp/template/strategie_didattiche.js';

//PROD
import { misure_dispensative } from './dispensative.js';
import { misure_compensative } from './compensative.js';
import { misure_valutative } from './valutative.js';
import { strategie_classe } from './strategie_classe.js';
import { strategie_didattiche } from './strategie_didattiche.js';


let logger = new Logger("server"); //instanzia il logger
const SARP = new PrismaDB(); //Istanzia il client SARP DB

function catch_error(exception, code) {
    if (exception instanceof PrismaClientValidationError)
        logger.error(exception.message);
    else {
        logger.error(JSON.stringify(exception));
        logger.error(exception.message);
        logger.error(exception.stack);
    }
    raise_error(500, code, `Errore irreversibile nella creazione del PDP. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`);
}

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


async function create_pdp(idStudente) {
    let as = get_as();

    // cerco la classe di appartenenza dello studente
    let idClasse = await get_idClasse(idStudente);

    //prelevo gli insegmaneti dell'anno as
    let insegnamenti = await get_insegnamenti(as, idClasse);

    //per ogni insegnamento, determino la lista degli studenti
    //e per ogni studente BES creo un entry PDP
    for(let insegnamento of insegnamenti) {
        console.log(`adding PDP for insegnamento [${insegnamento.id}] - studente [${idStudente}]`);
        await add_pdp(insegnamento.idDocente, insegnamento.id, idStudente, as);
    }
}

async function update_bes_studente(idStudente) {
    await SARP.Utente.update({
            where: { id: idStudente },
            data: {
                bes: true
            }
        });    
}

// crea un PDP per un dato studente 
export async function POST({ request, url, locals }) {
    route_protect(locals);
    const json_data = await request.json();

    SARP.set_session(locals); // passa la sessione all'audit
    
    console.log(json_data)
    console.log(get_as())
    try {

        await create_pdp(json_data.idStudente);
        await update_bes_studente(json_data.idStudente);
    } catch (exception) {
        console.log("EXCEPTION:", exception)
        catch_error(exception, 10001);
    }

    return json('ok');
}
