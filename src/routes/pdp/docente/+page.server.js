import { PrismaDB } from "$js/prisma_db.js";
import { PrismaClientValidationError } from '@prisma/client/runtime';
import { user_id, multi_user_field_where, access_protect, route_protect, raise_error, get_as } from "$js/helper";
import { Logger } from '$js/logger';

import { misure_dispensative } from '../template/dispensative.js';
import { misure_compensative } from '../template/compensative.js';
import { misure_valutative } from '../template/valutative.js';
import { strategie_classe } from '../template/strategie_classe';
import { strategie_didattiche } from '../template/strategie_didattiche';

// let logger = new Logger("server"); //instanzia il logger
const logger = new Logger("server"); //instanzia il logger
const SARP = new PrismaDB();

const resource = "pdp_docente";


function catch_error(exception, code) {
    if (exception instanceof PrismaClientValidationError)
        logger.error(exception.message);
    else {
        logger.error(JSON.stringify(exception));
        logger.error(exception.message);
        logger.error(exception.stack);
    }
    raise_error(500, code, `Errore irreversibile nella gestione del PDP [${exception.message}]. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`);
}

//trova lo specifico docente in base al suo id
const getDocente = async (idDocente) => {
    const docente = await SARP.Utente.findMany({
        where: {
            tipo: 'DOCENTE',
            can_login: true,
            id: idDocente
        },
        select: {
            id: true,
            nome: true,
            cognome: true,
        }
    });

    if(docente.length == 0) throw new Error(`Docente non trovato: ${idDocente}`);
    return docente[0];
}

//trova tutti gli studenti che sono iscritti in una classe della lista classi
const getStudentiOfClasses = async (classi) => {
    const studenti = await SARP.Utente.findMany({
        where: {
            tipo: 'STUDENTE',
            bes: true,
            can_login: true,
            classeId: {
                in: classi
            }
        },
        select: {
            id: true,
            nome: true,
            cognome: true,
            obiettivi_minimi: true,
            classe: true
        }
    });
    
    // if(studenti.length == 0) throw new Error(`Non ci sono studenti per le classi [${classiIds}]`);
    if(studenti.length == 0) throw new Error(`Non ci sono studenti per le classi [${classi}]`);
    return studenti;
}

//trova tutti gli insegnamenti dell'anno in corso per uno specifico docente in base al suo id
const getInsegnamentiOfDocente = async (idDocente) => {
    const insegnamenti = await SARP.Insegnamenti.findMany({
        where: {
            idDocente: idDocente, 
            anno: get_as(),
            titolare: true
        },
        select: {
            idClasse: true,
            idMateria: true,
            docente: true,
            // materia: true,
            // materia: true
            materia: true
        },
        orderBy: [
            { idClasse: 'asc' }
        ]
    });

    if(insegnamenti.length == 0) throw new Error(`Non ci sono insegnamenti per il docente [${idDocente}]`);
    return insegnamenti;
}

//preleva tutti i PDP esistenti per uno studente associati agli insegnamenti e docente
//potrebbe essere una lista vuota per un uovo studente (NON HA ancora PDP)
//potrebbe non includere tutte le linee della tabella PDP in quanto obsolete
//in quanto il PDP per quella materia non è negli insegnamenti di questo anno
//pensa a studente che dalla 2 passa alla 3
const getRealPdps = async(docente, insegnamenti, studenti) => {
    //determino le materie insegnate dal docente
    const materieIds = Array.from(new Set(insegnamenti.map(item => item.idMateria)))

    //determino gli studenti che necessitano un PDP per questo docente
    const studentiIds = Array.from(new Set(studenti.map(item => item.id)))

    //mappo le materie alle classi relative
    //creano una mappa: classe -> lista materie insegnate in quella classe
    const class2materie = mapMaterieToClassi(insegnamenti);

    let realPdps = await SARP.PDP.findMany({
        where: {
            idDocente: docente.id,
            studente: {
                can_login: true,
                id: {
                    in: studentiIds
                }
            },
            materia: {
                id: {
                    in: materieIds
                }
            }
        },
        include: {
            studente: {
                select: {
                    nome: true,
                    cognome: true,
                    bes: true,
                    obiettivi_minimi: true,
                    classeId: true
                }
            },
            materia: true,
        },
        orderBy: [
            { studente: { cognome: 'asc' } }
        ]
    });

    //add informazioni docente al PDP per renderlo uniforme con virtualPdps
    realPdps.map(pdp => pdp['docente'] = docente);

    //only keep pdp for bes students as PDP table contain entries for students which were bes but not anymore
    realPdps = realPdps.filter(realPdp => realPdp.studente.bes == true);

    //ora il PDP contiene entry non valide. per esempio io insegno tpis in 3 e reti in 4
    //allora la query pesca anche le entry esistenti di reti in 3 e tpsi in 4
    //che erano presenti dagli anni passati
    realPdps = realPdps.filter(realPdp => {
        const idMateria = realPdp.materia.id;
        const idClasse = realPdp.studente.classeId;
        return class2materie.get(idClasse).includes(idMateria);
    });

    //
    //i realPDP possono non esistere. Per esempio per un nuovo studente
    return realPdps;
}

//crea una mappa classe -> materie insegnate in quella classe
const mapMaterieToClassi = (insegnamenti) => {
    const class2materie = new Map();
    insegnamenti.forEach(insegnamento => {
        if(class2materie.has(insegnamento.idClasse)) {
            let listaMaterie = class2materie.get(insegnamento.idClasse);
            listaMaterie.push(insegnamento.idMateria)
            class2materie.set(insegnamento.idClasse, listaMaterie)
        } else {
            class2materie.set(insegnamento.idClasse, [insegnamento.idMateria])
        }
    });
  
    return class2materie;
}

//preleva tutti i templates PDP del docente e 
//i template programmazione per gli obiettivi minimi
const getTemplatesOfDocente = async (docente) => {
    const pdpTemplates = await SARP.pdp_Template.findMany({
        where: {
            creatoDa: docente
        }
    });

    const obiettiviMinTemplates = await SARP.programmazione_Template.findMany({
        where: {
            creatoDa: docente
        }
    });

    return {
        pdpTemplates,
        obiettiviMinTemplates
    }
}

//inizializza i virtualPDP
//struttura uguale ai PDP reali ma virtuali cioè che non 
//hanno ancora una corrispondenza nella tabella PDP
//pensa al caso studente dalla 2 alla 3.
//Per TPSI non ha ancora un PDP reale ma deve averlo virtuale
const initVirtualPdps = async (studenti, insegnamenti) => {
    const virtualPdps = new Map();

    //inizializzo virtual PDPs 
    insegnamenti.forEach(insegnamento => virtualPdps.set(
        {idClasse: insegnamento.idClasse, idMateria:insegnamento.idMateria},
        []
    ));

    //mappa gli studenti trovati ai vari insegnamenti
    studenti.forEach(studente => {
        for(let [k,v] of virtualPdps) {
            if(k.idClasse == studente.classe.id)
                virtualPdps.get(k).push(studente.id)
        }
    });

    return virtualPdps;
}

//virtualPDPs - realPDPs
const removeVirtualPdpFromRealPdp = async (realPdps, virtualPdps) => { 
    for(let realPdp of realPdps) {
        for(let [k,v] of virtualPdps) {
            if(k.idMateria == realPdp.idMateria) {
                let students = virtualPdps.get(k);
                if(students.includes(realPdp.idStudente)) {
                    students.splice(students.indexOf(realPdp.idStudente),1);
                }
            }
        }
    }
}

const createVirtualPdpsEntries = async (docente, studenti, insegnamenti, virtualPdps) => {
    //creo le entry PDP virtualy 
    let virtualPdpEntries = [];
    for(let [k,vstudenti] of virtualPdps) {
        if(vstudenti.length > 0) {
            vstudenti.forEach(vstudente => {
                const studenteFull = studenti.find(s => s.id == vstudente);
                virtualPdpEntries.push({
                    // id: Math.floor(Math.random() * (2**32)), //need an id for proper front-end behavior
                    id: `${vstudente}-${k.idMateria}`, //id deterministico e univoco per front-end behavior
                    createdAt: Date.now(),
                    updatedAt: Date.now(),
                    idDocente: docente.id,
                    idStudente: vstudente,
                    idMateria: k.idMateria,
                    anno: get_as(),
                    dispensative: misure_dispensative, 
                    compensative: misure_compensative,
                    valutative: misure_valutative,
                    strategie_classe: strategie_classe,
                    strategie_didattiche: strategie_didattiche,
                    obiettivi_minimi: null,
                    altro_compensative: '',
                    altro_dispensative: '',
                    altro_valutative: '',
                    note: '',
                    completo: false,
                    sintesi_vocale: false,
                    tempo_esteso: false,
                    // studente: JSON.parse(JSON.stringify(studenti.filter(s => s.id == vstudente)[0], ['nome', 'cognome', 'obiettivi_minimi'])),
                    studente: { nome: studenteFull.nome, cognome: studenteFull.cognome, obiettivi_minimi: studenteFull.obiettivi_minimi },
                    // materia: insegnamenti[insegnamenti.findLastIndex(insegnamento => insegnamento.materia.id == k.idMateria)].materia,
                    materia: insegnamenti[insegnamenti.findLastIndex(insegnamento => insegnamento.materia.id === k.idMateria)].materia,
                    // docente: JSON.parse(JSON.stringify(docente, ['id', 'nome', 'cognome'])),
                    docente: { id: docente.id, nome: docente.nome, cognome: docente.cognome },
                    // vPdp: true //virtualPDP are entries not present in PDP table
                    virtualPdp: true //virtualPDP are entries not present in PDP table
                })
            }) 
        }
    }

    return virtualPdpEntries;
}

// @ts-ignore
export async function load({ locals }) {
    // let action = 'read';
    const action = 'read';

    route_protect(locals);
    access_protect(200, locals, action, resource);
    SARP.set_session(locals);

    try {
        const idDocente = user_id(locals);

        //prelevo l'oggetto docente 
        const docente = await getDocente(idDocente);

        //trova insegnamenti del docente
        const insegnamenti = await getInsegnamentiOfDocente(idDocente);

        //determino le classi in cui il docente insegna
        const classiIds = Array.from(new Set(insegnamenti.map(item => item.idClasse)))

        //trova tutti gli studenti bes attivi iscritti alle classi dove insegna il docente
        const studenti = await getStudentiOfClasses(classiIds);

        //preleva i template PDP e programmazione per lo specifico docente
        const { pdpTemplates, obiettiviMinTemplates } = await getTemplatesOfDocente(idDocente);

        //ottengo lista PDP reali, se presenti
        let realPdps = await getRealPdps(docente, insegnamenti, studenti);

        //devo creare una mappa con chiave insegnamento (classe,materia)
        //e valore una lista di studenti
        //Questi rappresentano tutti i PDP entries dello specifico docente
        //Un sottoinsieme (anche vuoto) di questi sono reali provenineti dalla tabella PDP
        //I restanti sono virtuali in quanto non presenti nella tabella PDP
        const virtualPdps = await initVirtualPdps(studenti, insegnamenti);

        //virtualPDPs al mmento contiene entry reali e virtuali
        //quindi sottraggo da virtual PDPs i realPdps, 
        //cioè  quelli che già esistono nella tabella PDP
        removeVirtualPdpFromRealPdp(realPdps, virtualPdps);

        const virtualPdpEntries = await createVirtualPdpsEntries(docente, studenti, insegnamenti, virtualPdps);

        //merge realPdps and virtualPdpEntries into a single object
        const computedPdps = realPdps.concat(virtualPdpEntries).sort((s1,s2) => s1.studente.cognome > s2.studente.cognome ? 1 : -1)

        return {
            pdp: computedPdps,
            pdpTemplates,
            obiettiviMinTemplates
        };
    } catch (exception) {
        catch_error(exception, 2601);
    }
}

//costruisce l'oggetto data comune a create e update a partire dal form
function buildPdpDataFromForm(form) {
    return {
        dispensative: form.get("dispensative"),
        compensative: form.get("compensative"),
        valutative: form.get("valutative"),
        strategie_classe: form.get("strategie_classe"),
        strategie_didattiche: form.get("strategie_didattiche"),
        obiettivi_minimi: form.get("obiettivi_minimi")?.length > 0 ? form.get("obiettivi_minimi") : null, //issue-620
        altro_compensative: form.get("altro_compensative")?.toString(),
        altro_dispensative: form.get("altro_dispensative")?.toString(),
        altro_valutative: form.get("altro_valutative")?.toString(),
        note: form.get("note")?.toString(),
        completo: form.get("completo") === 'SI',
        sintesi_vocale: form.get("sintesi_vocale") === 'true',
        tempo_esteso: form.get("tempo_esteso") === 'true'
    };
}

export const actions = {
    update: async ({ request, locals }) => {
        // let action = 'update';
        const action = 'update';

        route_protect(locals);
        access_protect(200, locals, action, resource);

        try {
            const form = await request.formData();
            logger.debug(`[${locals.session.idUtente} - ${locals.session.login.cognome}] INIZIO UPDATE PDP DOCENTE[${parseInt(form.get("id"))}]`);

            await SARP.PDP.update({
                data: {
                    // dispensative: form.get("dispensative"),
                    // compensative: form.get("compensative"),
                    // valutative: form.get("valutative"),
                    // strategie_classe: form.get("strategie_classe"),
                    // strategie_didattiche: form.get("strategie_didattiche"),
                    // obiettivi_minimi: form.get("obiettivi_minimi")?.length > 0 ? form.get("obiettivi_minimi") : null, //issue-620
                    // altro_compensative: form.get("altro_compensative")?.toString(),
                    // altro_dispensative: form.get("altro_dispensative")?.toString(),
                    // altro_valutative: form.get("altro_valutative")?.toString(),
                    // note: form.get("note")?.toString(),
                    // completo: form.get("completo") === 'SI',
                    // sintesi_vocale: form.get("sintesi_vocale") === 'true',
                    // tempo_esteso: form.get("tempo_esteso") === 'true'
                    ...buildPdpDataFromForm(form)
                },
                where: {
                    id: parseInt(form.get("id"))
                }
            });

            return { action: action, status: 'ok' };
        } catch (exception) {
            catch_error(exception, 2602);
        }
    },
    create: async ({ request, locals }) => {
        // let action = 'create';
        const action = 'create';

        route_protect(locals);
        access_protect(200, locals, action, resource);
        try {
            const form = await request.formData();
            logger.debug(`[${locals.session.idUtente} - ${locals.session.login.cognome}] INIZIO CREATE PDP DOCENTE[${parseInt(form.get("id"))}]`);

            await SARP.PDP.create({
                data: {
                    idDocente: Number(form.get("idDocente")),
                    idStudente: Number(form.get("idStudente")),
                    idMateria: Number(form.get("idMateria")),
                    anno: get_as(),
                    // dispensative: form.get("dispensative"),
                    // compensative: form.get("compensative"),
                    // valutative: form.get("valutative"),
                    // strategie_classe: form.get("strategie_classe"),
                    // strategie_didattiche: form.get("strategie_didattiche"),
                    // obiettivi_minimi: form.get("obiettivi_minimi")?.length > 0 ? form.get("obiettivi_minimi") : null, //issue-620
                    // altro_compensative: form.get("altro_compensative")?.toString(),
                    // altro_dispensative: form.get("altro_dispensative")?.toString(),
                    // altro_valutative: form.get("altro_valutative")?.toString(),
                    // note: form.get("note")?.toString(),
                    // completo: form.get("completo") === 'SI',
                    // sintesi_vocale: form.get("sintesi_vocale") === 'true',
                    // tempo_esteso: form.get("tempo_esteso") === 'true'
                    ...buildPdpDataFromForm(form)
                }
            });

            return { action: action, status: 'ok' };
        } catch (exception) {
            catch_error(exception, 2603);
        }
    }
}
