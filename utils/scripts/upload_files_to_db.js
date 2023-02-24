import { PrismaClient } from "@prisma/client";
import fs from 'fs';
import { exit } from "process";

const prisma = new PrismaClient();

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

async function main(folder) {
    if (!folder) {
        console.log("Specificare una cartella valida");
        exit(255);
    }

    console.log("RICORDA: Inserisci il timeout nello schema.prisma quando usi questo script");
    fs.readdir(folder, function (err, filenames) {
        filenames.forEach(async file => {
            const file_splittato = file.split(".")[0].split("_");

            if (file_splittato[0] != "tmp") {
                const user_to_change = await prisma.utente.findFirst({
                    where: {
                        nome: file_splittato[1],
                        cognome: capitalizeFirstLetter(file_splittato[0].toLowerCase())
                    }
                });

                if (user_to_change)
                    await prisma.utente.update({
                        where: {
                            id: user_to_change.id
                        },
                        data: {
                            picture: "img/users/".concat(file)
                        }
                    });
                else
                    console.log("Utente ".concat(capitalizeFirstLetter(file_splittato[0].toLowerCase())).concat(" ").concat(file_splittato[1]).concat(" non trovato"));
            }
        })
    })
}

const argv = process.argv;

main(argv[2]);
