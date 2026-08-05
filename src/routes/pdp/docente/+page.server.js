import { PrismaDB } from "$js/prisma_db.js";
import { PrismaClientValidationError } from '@prisma/client/runtime';
import { user_id, multi_user_field_where, access_protect, route_protect, raise_error, get_as } from "$js/helper";
import { Logger } from '$js/logger';

import { misure_dispensative } from '../template/dispensative.js';
import { misure_compensative } from '../template/compensative.js';
import { misure_valutative } from '../template/valutative.js';
import { strategie_classe } from '../template/strategie_classe';
import { strategie_didattiche } from '../template/strategie_didattiche';

let logger = new Logger("server"); //instanzia il logger
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
    raise_error(500, code, `Errore irreversibile nella gestione del PDP. TIMESTAMP: ${new Date().toISOString()} Riportare questo messaggio agli sviluppatori`);
}

// @ts-ignore
export async function load({ locals }) {
    let action = 'read';

    route_protect(locals);
    access_protect(200, locals, action, resource);
    SARP.set_session(locals);

    let where_search = multi_user_field_where('idDocente', locals);
    // where_search['anno'] = get_as(); //visualizza solo i PDP dell'anno in corso
    const idDocente = user_id(locals);
    console.log(locals)
    
    try {
        //prelevo informazioni docente 
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

        console.log("NUM DOCENTI:",1) 

        //devo creare una mappa con chiave insegnamento (classe,materia)
        //e valore una lista di studenti
        //Questi rappresentano tutti i PDP entries dello specifico docente
        //Un sottoinsieme (anche vuoto) di questi sono reali provenineti dalla tabella PDP
        //I restanti sono virtuali in quanto non presenti nella tabella PDP
       
        const virtualPdps = new Map();

        //trova insegnamenti del docente
        const insegnamenti = await SARP.Insegnamenti.findMany({
            where: {
              idDocente: idDocente, 
              anno: get_as(),
              titolare: true
            },
            select: {
                idClasse: true,
                idMateria: true,
                materia: true,
                docente: true,
                materia: true
            },
            orderBy: [
                { idClasse: 'asc' }
            ]
        });

      console.log("NUM INSEGNAMENTI:", insegnamenti.length)

      //inizializzo virtual PDPs 
      insegnamenti.forEach(insegnamento => virtualPdps.set(
        {idClasse: insegnamento.idClasse, idMateria:insegnamento.idMateria},
        []
      ));

      //determino le classi in cui il docente insegna
      const classi = Array.from(new Set(insegnamenti.map(item => item.idClasse)))
      console.log("NUM CLASSI:", classi.length)

        //trova tutti gli studenti bes attivi iscritti alle classi dove il docente insegna
        let studenti = await SARP.Utente.findMany({
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

      console.log("NUM STUDENTI:", studenti.length)  
      //mappa gli studenti trovati ai vari insegnamenti
      studenti.forEach(studente => {
        for(let [k,v] of virtualPdps) {
          if(k.idClasse == studente.classe.id)
            virtualPdps.get(k).push(studente.id)
        }
      })
      console.log("VIRTUAL PDP:", virtualPdps)


      //ora sottraggo da virtual PDPs i realPdps, cioè  quelli che già esistono nella tabella PDP
        //mantengo la tabella PDP con le seguente modifiche:
        // - rimuovo insegnamento
        // - aggiungo idMateria
        let realPdps = await SARP.PDP.findMany({
            where: {
              idDocente: idDocente
            },
            include: {
                studente: {
                    select: {
                        nome: true,
                        cognome: true,
                        bes: true,
                        obiettivi_minimi: true,
                    }
                },
                materia: true,
            },
            orderBy: [
                { studente: { cognome: 'asc' } }
            ]
        });
        //add informazioni docente al PDP
        realPdps.map(pdp => pdp['docente'] = docente[0]);
        //only keep pdp for bes students as PDP table contain entries for students which were bes but not anymore
        realPdps = realPdps.filter(realPdp => realPdp.studente.bes == true);
      console.log("NUM PDP:", realPdps.length)
console.log("X")
        for(let realPdp of realPdps) {
          console.log("PROCESSO:", realPdp.idMateria, realPdp.idStudente)
          for(let [k,v] of virtualPdps) {
            if(k.idMateria == realPdp.idMateria) {
              let students = virtualPdps.get(k);
              if(students.includes(realPdp.idStudente)) {
                console.log("STUDENTS K:", students)
                students.splice(students.indexOf(realPdp.idStudente),1);
              }
            }
          }
          console.log(virtualPdps)
        }

      console.log("Y")
        console.log("VIRTUAL PDPDS FINAL:", virtualPdps)
    console.log("QUI1") 
      //creo le entry PDP virtualy 
      let virtualPdpEntries = [];
        for(let [k,vstudenti] of virtualPdps) {
          if(vstudenti.length > 0) {
            vstudenti.forEach(vstudente => {
              virtualPdpEntries.push({
              id: Math.floor(Math.random() * (2**32)), //need an id for proper front-end behavior
              createdAt: Date.now(),
              updatedAt: Date.now(),
              idDocente: idDocente,
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
              studente: JSON.parse(JSON.stringify(studenti.filter(s => s.id == vstudente)[0], ['nome', 'cognome', 'obiettivi_minimi'])),
               // materia: realPdps[realPdps.findLastIndex(realPdp => realPdp.materia.id == k.idMateria).materia],
              materia: insegnamenti[insegnamenti.findLastIndex(insegnamento => insegnamento.materia.id == k.idMateria)].materia,
              docente: JSON.parse(JSON.stringify(docente[0], ['id', 'nome', 'cognome'])),
              vPdp: true //virtualPDP are entries not present in PDP table
              })
            }) 
          }
        }

      console.log("QUI2")
        console.log("NUM VIRTUAL PDP ENTRIES:", virtualPdpEntries)
      // console.log(JSON.parse(JSON.stringify(insegnamenti)))

        let pdpTemplates = await SARP.pdp_Template.findMany({
            where: {
                creatoDa: idDocente
            }
        });

        let obiettivi_minimi_templates = await SARP.programmazione_Template.findMany({
            where: {
                creatoDa: idDocente
            }
        });

        //merge realPdps and virtualPdpEntries into a single object
        realPdps = realPdps.concat(virtualPdpEntries).sort((s1,s2) => s1.studente.cognome > s2.studente.cognome ? 1 : -1)
        

        return {
            pdp: realPdps,
            pdpTemplates,
            obiettivi_minimi_templates
        };
    } catch (exception) {
        catch_error(exception, 2601);
    }
}

export const actions = {
    update: async ({ request, locals }) => {
        let action = 'update';

        route_protect(locals);
        access_protect(200, locals, action, resource);

        try {
            const form = await request.formData();
            console.log("FORM:",form)
            logger.debug(`[${locals.session.idUtente} - ${locals.session.login.cognome}] INIZIO UPDATE PDP DOCENTE[${parseInt(form.get("id"))}]`);

            await SARP.PDP.update({
                data: {
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
        let action = 'create';

        route_protect(locals);
        access_protect(200, locals, action, resource);
        console.log("BACKEND CREATE")
        try {
            const form = await request.formData();
            // console.log("FORM:",form)
            console.log("=========================")
            logger.debug(`[${locals.session.idUtente} - ${locals.session.login.cognome}] INIZIO CREATE PDP DOCENTE[${parseInt(form.get("id"))}]`);

            await SARP.PDP.create({
                data: {
                    idDocente: Number(form.get("idDocente")),
                    idStudente: Number(form.get("idStudente")),
                    idMateria: Number(form.get("idMateria")),
                    anno: get_as(),
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
                }
            });

            return { action: action, status: 'ok' };
        } catch (exception) {
            catch_error(exception, 2603);
        }
    }
}
