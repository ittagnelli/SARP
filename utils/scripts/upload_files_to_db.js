import { PrismaClient } from "@prisma/client";
import fs from 'fs';
import { exit } from "process";

const prisma = new PrismaClient();

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
                        cognome: file_splittato[0]
                    }
                });

                if (user_to_change)
                    await prisma.utente.update({
                        where: {
                            id: user_to_change.id
                        },
                        data: {
                            picture: file
                        }
                    });
                else
                    console.log("Utente ".concat(file_splittato[0]).concat(" ").concat(file_splittato[1]).concat(" non trovato"));
            }
        })
    })
}

const argv = process.argv;

main(argv[argv.length - 1]);