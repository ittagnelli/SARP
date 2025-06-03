const mastercom = require("./mastercom");
const cheerio = require('cheerio')
const writeXlsxFile = require('write-excel-file/node')
const fs = require('fs')

// c'e' un problema con il mapping materie (vedi file mapping_materie.xlsx)
// se ssi vuole deviare dalle materie ministeriali, deve essere chiaro ed univoco
// il mapping tra materia ministeriale e materia agnelli
// gia parlato con segreteria il 03/06/2025
// in attesa di una loro conferma sul mapping

let credentials;
let materie = [
    'BIM',
    'Biologia',
    'Biomedica',
    'CLIL',
    'Chimica',
    'DPO',
    'Diritto',
    'Disegno e Arte',
    'Educazione Civica',
    'Elettronica ed Elettrotecnica',
    'Filosofia',
    'Fisica',
    'GPO',
    'Geografia Economica',
    'Geography IGCSE',
    'Geostoria',
    'IDP',
    'Impianti Laboratorio',
    'Informatica',
    'Inglese',
    'Inglese Gruppo A',
    'Inglese Gruppo B',
    'Inglese Gruppo C',
    'LAB sistemi',
    'Laboratorio Automazione',
    'Latino',
    'Lettere Italiane',
    'Madrelingua PET',
    'Matematica',
    'Matematica Cambridge',
    'Matematica e Complementi',
    'Mathematics IGCSE',
    'Maths',
    'Meccanica e Macchine',
    'Religione',
    'Robotica',
    'STA Elettronica',
    'STA Energia',
    'STA Informatica',
    'STA Meccatronica',
    'Scienze',
    'Scienze Motorie',
    'Scienze della Terra',
    'Sistemi Elettronici',
    'Sistemi e Automazione',
    'Sistemi e Reti',
    'Speaking Madrelingua',
    'Storia',
    'TPSEE',
    'TPSI',
    'Tecnologia Laboratorio',
    'Tecnologia Meccanica',
    'Tecnologie e Tecniche di Rappresentazione Grafiche',
    'Telecomunicazioni'
];

//tradzione materie discrepanti tra registro e SARP
let mappa_materie = {
    //materia registro : materia db
    'EDUCAZIONE FISICA': 'Scienze Motorie',
    'MATEMATICA & COMPLEMENTI DI MATEMATICA': 'Matematica e Complementi',
    'TECNOLOGIE DI SISTEMI INFORMATICI': 'TPSI',
    'ELETTROTECNICA & ELETTRONICA': 'Elettronica ed Elettrotecnica'
 };

let materie_escluse = [
    'ANIMAZIONE'
];

const get_lista_classi_raw = async () => {
    const requestData = new URLSearchParams({
        tipo_stampa: 'gestione_classi_indirizzi_display',
        form_stato: 'amministratore',
        stato_principale: 'impostazioni_principale',
        stato_secondario: 'gestione_classi_indirizzi_display',
        stato_recupero: 'seleziona_anno',
        current_user: credentials.admin_id,
        current_key: credentials.admin_key
    });

    return (await mastercom.post(requestData)).data;
}

const generate_lista_classi = async (listaIndirizzi) => {
    const html = await get_lista_classi_raw();
    // const html = fs.readFileSync('classi.html', 'utf-8')
    $ = cheerio.load(html);

    const risultati = [];

    const container = $('#row_grid_classes');
    if (container.length === 0) return risultati;

    const td = container.find('td').first();
    if (td.length === 0) return risultati;

    const table = td.find('table').first();
    if (table.length === 0) return risultati;

    const trs = table.find('tr').toArray();

    for (let i = 0; i < trs.length; i++) {
        const tr = trs[i];
        const tds = $(tr).find('td');
        if (tds.length === 0) continue;

        const firstTd = tds.eq(0);
        const inputBtnIndirizzo = firstTd.find('input[type="button"]');
        if (inputBtnIndirizzo.length === 0) continue;

        const valIndirizzo = inputBtnIndirizzo.attr('value');
        if (!listaIndirizzi.includes(valIndirizzo)) continue;

        const onclickIndirizzo = inputBtnIndirizzo.attr('onclick');
        const matchIndirizzo = onclickIndirizzo && onclickIndirizzo.match(/id_indirizzo\.value='(\d+)'/);
        if (!matchIndirizzo) continue;

        const idIndirizzo = matchIndirizzo[1];

        for (let idx = 1; idx < tds.length; idx++) {
            const tdClass = tds.eq(idx);
            const inputBtnClasse = tdClass.find('input[type="button"]');
            if (inputBtnClasse.length === 0) continue;

            const nomeClasse = inputBtnClasse.attr('value');
            const onclickClasse = inputBtnClasse.attr('onclick');
            const matchClasse = onclickClasse && onclickClasse.match(/id_classe\.value='(\d+)'/);
            if (!matchClasse) continue;

            const idClasse = matchClasse[1];
            risultati.push({ nomeClasse, idIndirizzo, idClasse });
        }
    }

    // --- Codice aggiuntivo per il tr successivo a "Liceo Scientifico scienze applicate" ---

    // Trova indice del tr con value="Liceo Scientifico scienze applicate"
    const indexSpeciale = trs.findIndex(tr => {
        const firstTd = $(tr).find('td').first();
        const inputBtn = firstTd.find('input[type="button"]');
        if (inputBtn.length === 0) return false;
        return inputBtn.attr('value') === "Liceo Scientifico scienze applicate";
    });

    if (indexSpeciale !== -1 && indexSpeciale + 1 < trs.length) {
        const trSuccessivo = trs[indexSpeciale + 1];
        const tdsSuccessivo = $(trSuccessivo).find('td');

        // Per il tr successivo non c'è input button nel primo td con indirizzo, quindi usiamo
        // l'idIndirizzo dal tr speciale (indexSpeciale)
        const firstTdSpeciale = $(trs[indexSpeciale]).find('td').first();
        const inputBtnSpeciale = firstTdSpeciale.find('input[type="button"]');
        const onclickSpeciale = inputBtnSpeciale.attr('onclick');
        const matchIndirizzoSpeciale = onclickSpeciale && onclickSpeciale.match(/id_indirizzo\.value='(\d+)'/);
        const idIndirizzoSpeciale = matchIndirizzoSpeciale ? matchIndirizzoSpeciale[1] : null;

        if (idIndirizzoSpeciale) {
            // Estrai classi dal tr successivo da TUTTI i td (anche il primo)
            for (let idx = 0; idx < tdsSuccessivo.length; idx++) {
                const tdClass = tdsSuccessivo.eq(idx);
                const inputBtnClasse = tdClass.find('input[type="button"]');
                if (inputBtnClasse.length === 0) continue;

                const nomeClasse = inputBtnClasse.attr('value');
                const onclickClasse = inputBtnClasse.attr('onclick');
                const matchClasse = onclickClasse && onclickClasse.match(/id_classe\.value='(\d+)'/);
                if (!matchClasse) continue;

                const idClasse = matchClasse[1];
                risultati.push({ nomeClasse, idIndirizzo: idIndirizzoSpeciale, idClasse });
            }
        }
    }

    return risultati;
}

const get_orario_classe_raw = async (idIndirizzo, idClasse) => {
    const requestData = new URLSearchParams({
        form_stato: 'amministratore',
        stato_principale: 'gestione_orario_principale',
        stato_secondario: 'studenti_avanzato',
        id_indirizzo: idIndirizzo,
        id_classe: idClasse,
        current_user: credentials.admin_id,
        current_key: credentials.admin_key
    });

    return (await mastercom.post(requestData)).data;
}


const generate_orario_classe = async (idIndirizzo, idClasse) => {
    const html = await get_orario_classe_raw(idIndirizzo, idClasse);
    $ = cheerio.load(html);

    // Seleziona i <button> con class esattamente "elementi_singola_lezione"
    const buttons = $('button').filter(function () {
        return $(this).attr('class') === 'elementi_singola_lezione';
    });

    const insegnamenti = {}; // hashmap: { materia: docente }

    $('table.sfondo_orario_lezione').each((i, table) => {
        const buttons = $(table)
            .find('button')
            .filter(function () {
                return $(this).attr('class') === 'elementi_singola_lezione';
            });

        buttons.each((j, el) => {
            const inner = $(el).html().trim();

            if (inner.startsWith('<strong>')) {
                const $$ = cheerio.load(inner);

                const materia = $$('strong').first().text().trim();
                const docente = $$('br').get(0)?.nextSibling?.nodeValue?.trim() || '';

                // Se la materia non è già presente, aggiungila
                if (materia && docente && !insegnamenti[materia]) {
                    insegnamenti[materia] = docente;
                }
            }
        });
    });

    return insegnamenti;
}

const calc_classe = (classe) => {
    let map = {
        1: 'I',
        2: 'II',
        3: 'III',
        4: 'IV',
        5: 'V'
    };

    return map[classe.nomeClasse[0]];
}

const calc_istituto = (classe) => {
    let map = {
        1000029: 'ITT',
        1000044: 'ITT',
        1000043: 'ITT',
        1000027: 'ITT',
        1000046: 'ITT',
        1000047: 'ITT',
        1000045: 'ITT',
        1000028: 'LICEO',
        1000048: 'LICEO'
    };

    return map[classe.idIndirizzo];
}

const calc_sezione = (classe) => {
    let sezione_raw = classe.nomeClasse.slice(1);
    let sezione = sezione_raw == 'INF' ? 'INFO' : sezione_raw;
    sezione = sezione == 'MEC' ? 'MECC' : sezione;

    return sezione;
}

const isValidMateria = (materia) => {
    return !materie_escluse.includes(materia);
}

const genera_file_insegnamenti = async (classi, as) => {
    // console.log(classi)
    const HEADER_ROW = [
        { value: 'Cognome' },
        { value: 'Materia' },
        { value: 'a.s.' },
        { value: 'Classe' },
        { value: 'Istituto' },
        { value: 'Sezione' },
        { value: 'Titolare' },
        { value: 'Dainserire' }
    ];

    for (let classe of classi.filter((_, i) => i == 12)) {
    // for (let classe of classi) {
        let nClasse = calc_classe(classe);
        let istituto = calc_istituto(classe);
        let sezione = calc_sezione(classe);
        // console.log(nClasse, istituto, sezione)

        console.log(`Genera orario per classe ${nClasse}-${istituto}-${sezione}`);
        let insegnamenti = await generate_orario_classe(classe.idIndirizzo, classe.idClasse);
        // let insegnamenti = {
        //     'SISTEMI E RETI': 'MANCUSO ESPEDITO',
        //     ANIMAZIONE: 'BUSSOLINO UGO GIUSEPPE',
        //     STORIA: 'GIANNATTASIO MAURA',
        //     RELIGIONE: 'BUSSOLINO UGO GIUSEPPE',
        //     INFORMATICA: 'ARRUZZA EMANUELA',
        //     'EDUCAZIONE FISICA': 'PINTORE ROBERTO',
        //     INGLESE: 'FINESSI ALDO',
        //     TELECOMUNICAZIONI: 'BAUDUCCO Andrea',
        //     'MATEMATICA & COMPLEMENTI DI MATEMATICA': 'MORETTI STEFANO',
        //     'LETTERE ITALIANE': 'GIANNATTASIO MAURA',
        //     'TECNOLOGIE DI SISTEMI INFORMATICI': 'MANCUSO ESPEDITO'
        // };

        let data = [HEADER_ROW];

        for (let materia in insegnamenti) {
            let prof = insegnamenti[materia].split(" ")[0];
            materia = materia in mappa_materie ? mappa_materie[materia] : materia;
            // console.log(prof, materia, '2024', nClasse, istituto, sezione)
            if(isValidMateria(materia)) {
                let row = [
                    {
                        type: String,
                        value: prof
                    },
                    {
                        type: String,
                        value: materia
                    },
                    {
                        type: Number,
                        value: as
                    },
                    {
                        type: String,
                        value: nClasse
                    },
                    {
                        type: String,
                        value: istituto
                    },
                    {
                        type: String,
                        value: sezione
                    },
                    {
                        type: String,
                        value: 'X'
                    },
                    {
                        type: String,
                        value: 'X'
                    }
                ];

                data.push(row);
            }
        }

        console.log(`Genera file insegnamenti_${nClasse}-${istituto}-${sezione}.xlsx`);
        await writeXlsxFile(data, {
            filePath: `insegnamenti_${nClasse}-${istituto}-${sezione}.xlsx`
        })
    }
}


(async () => {
    try {
        credentials = await mastercom.login_as_admin();
        console.log("Sucessfully login");


        const listaIndirizzi = [
            "ITI BIENNIO ELN",
            "ITI BIENNIO INF",
            "ITI BIENNIO MEC",
            "ITI TRIENNIO ELN",
            "ITI TRIENNIO INF",
            "ITI TRIENNIO MEC",
            "ITI TRIENNIO ENE",
            "Liceo Scientifico",
            "Liceo Scientifico scienze applicate"
            // altri valori che ti interessano
        ];

        console.log("Generazione lista classi....");
        let classi = await generate_lista_classi(listaIndirizzi);
        console.log(classi)

        // let classi = [
        //     { nomeClasse: '1A', idIndirizzo: '1000029', idClasse: '1000132' },
        //     { nomeClasse: '2A', idIndirizzo: '1000029', idClasse: '1000131' },
        //     { nomeClasse: '1C', idIndirizzo: '1000044', idClasse: '1000133' },
        //     { nomeClasse: '2C', idIndirizzo: '1000044', idClasse: '1000130' },
        //     { nomeClasse: '1B', idIndirizzo: '1000043', idClasse: '1000148' },
        //     { nomeClasse: '2B', idIndirizzo: '1000043', idClasse: '1000129' },
        //     { nomeClasse: '3ELN', idIndirizzo: '1000027', idClasse: '1000115' },
        //     { nomeClasse: '4ELN', idIndirizzo: '1000027', idClasse: '1000114' },
        //     { nomeClasse: '5ELN', idIndirizzo: '1000027', idClasse: '1000111' },
        //     { nomeClasse: '3ENE', idIndirizzo: '1000046', idClasse: '1000117' },
        //     { nomeClasse: '4ENE', idIndirizzo: '1000046', idClasse: '1000277' },
        //     { nomeClasse: '5ENE', idIndirizzo: '1000046', idClasse: '1000452' },
        //     { nomeClasse: '3INF', idIndirizzo: '1000047', idClasse: '1000118' },
        //     { nomeClasse: '4INF', idIndirizzo: '1000047', idClasse: '1000112' },
        //     { nomeClasse: '5INF', idIndirizzo: '1000047', idClasse: '1000278' },
        //     { nomeClasse: '3MEC', idIndirizzo: '1000045', idClasse: '1000116' },
        //     { nomeClasse: '4MEC', idIndirizzo: '1000045', idClasse: '1000113' },
        //     { nomeClasse: '5MEC', idIndirizzo: '1000045', idClasse: '1000110' },
        //     { nomeClasse: '1A', idIndirizzo: '1000028', idClasse: '1000128' },
        //     { nomeClasse: '2A', idIndirizzo: '1000028', idClasse: '1000279' },
        //     { nomeClasse: '3A', idIndirizzo: '1000028', idClasse: '1000123' },
        //     { nomeClasse: '4A', idIndirizzo: '1000028', idClasse: '1000121' },
        //     { nomeClasse: '5A', idIndirizzo: '1000028', idClasse: '1000119' },
        //     { nomeClasse: '1B', idIndirizzo: '1000048', idClasse: '1000127' },
        //     { nomeClasse: '2B', idIndirizzo: '1000048', idClasse: '1000125' },
        //     { nomeClasse: '3B', idIndirizzo: '1000048', idClasse: '1000124' },
        //     { nomeClasse: '4B', idIndirizzo: '1000048', idClasse: '1000122' },
        //     { nomeClasse: '5B', idIndirizzo: '1000048', idClasse: '1000120' },
        //     { nomeClasse: '1C', idIndirizzo: '1000048', idClasse: '1000460' },
        //     { nomeClasse: '2C', idIndirizzo: '1000048', idClasse: '1000944' }
        // ];

        await genera_file_insegnamenti(classi, 2025);

        await mastercom.logout_as_admin();
        console.log("Succesfully logout");
    } catch (err) {
        console.error('Errore durante il login:', err.message);
    }
})();



