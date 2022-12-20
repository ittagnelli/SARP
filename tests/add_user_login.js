import { PrismaClient } from '@prisma/client';

// Istanzia il client per il SARP
const SARP = new PrismaClient();
const argv = process.argv;

function random_telefono() {
    let tel = "";

    for(let i = 0; i < 7; i++)
        tel += Math.floor(Math.random() * 10);
    return tel;
}

/**
 * @param {string | any[]} argv
 */
async function main(argv){
    if(argv.length != 5){
        console.log("Usage: node add_user_login.js Email nome cognome ");
        return 255;
    }
    console.log("Aggiungo l'utente richiesto al DB");
    await SARP.utente.create({
        data: {
            nome: argv[3],
            cognome: argv[4],
            email: argv[2],
            telefono: "",   // Numero pseudocausuale da 11 cifre
            tipo: "ADMIN",  // Gli utenti di test sono sempre admin
            ruolo: "PRESIDE",   // Nello sviluppo servono tutti i permessi
            istituto: "ITT",
            bes: false,
            picture: "",
            can_login: true
        }
    });
}

main(argv);