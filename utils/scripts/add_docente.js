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
    if(argv.length != 7){
        console.log("Usage: node add_docente.js <Nome> <Cognome> <Email> <natoIl> <Istituto>");
        return 255;
    }
    console.log("Aggiungo l'utente richiesto al DB");
    await SARP.utente.create({
        data: {
            creatoDa: 1,
            nome: argv[2],
            cognome: argv[3],
            email: argv[4],
            telefono: "",   // Numero pseudocausuale da 11 cifre
            tipo: "DOCENTE",  // Gli utenti di test sono sempre admin
            natoIl: new Date(argv[5]),
            ruoli: {
                connect: [{id: 4}]
            },
            istituto: argv[6],
            bes: false,
            picture: "img/avatar.png",
            can_login: true,
            classeId: 1
        }
    });
}

main(argv);
