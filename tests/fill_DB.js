import { PrismaClient } from '@prisma/client';
import { nomi, cognomi, pictures, ruoli_utente, tipi_utente, istituti} from './imports.js';
 
// Istanzia il client per il SARP
const SARP = new PrismaClient();

async function create_ruoli() {
    ruoli_utente.forEach(async role => {
        await SARP.ruolo_Utente.create({
            data: { ruolo: role}
        });
    })
}

async function create_tipi() {
    tipi_utente.forEach(async type => {
        await SARP.tipo_Utente.create({
            data: { tipo: type}
        });
    })
}

async function create_utenti() {
    let nome = capital(random_item(nomi));
    let cognome = capital(random_item(cognomi));

    console.log(`Creazione utente ${nome} ${cognome}`);
    await SARP.Utente.create({
        data: {
            nome: nome,
            cognome: cognome,
            email: nome.concat(".", cognome, ".", Math.floor(Math.random() * 100), "@istitutoagnelli.it"),
            telefono: random_telefono(),
            tipo: random_item(tipi_utente),
            ruolo: random_item(ruoli_utente),
            istituto: random_item(istituti),
            bes: false,
            picture: random_item(pictures)
        }
    });
}

function capital(str) {
    return str[0].toUpperCase() + str.slice(1);
}

function random_telefono() {
    let tel = "";

    for(let i = 0; i < 7; i++)
        tel += Math.floor(Math.random() * 10);
    return tel;
}

function random_item(list) {
    let len = list.length;
    return list[Math.floor(Math.random() * len)];
}

// MAIN
(async function () {
    create_ruoli();
    create_tipi();
    for(let i = 0; i < 20; i++) 
        create_utenti();
})();
