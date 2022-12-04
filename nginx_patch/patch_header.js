import fs from 'fs';
import config from './config.json' assert { type: 'json' };

const argv = process.argv;

function main(argv) {
    if(argv[2] == undefined){
        console.log('Benvenuto nel patcher di SARP, per usare correttamente questo programma usare i seguenti argomenti: node patch_header.js CONFIGNGINX');
        process.exit(1);
    }
    const file = argv[2];   // argv[2] è il file perchè node patch_header.js nginx.conf 0 1 2
    if(!fs.existsSync(file)){
        console.log(`Configurazione ${file} non trovato. Assicurati che il percorso sia corretto`);
        throw new Error('Configurazione non trovata.');
    }
    fs.readFile(file, 'utf8', (err, data) => {   
        if (err) {
            if(err.code == "EISDIR"){
                console.log(`Il percorso indicato è una directory`);
                throw new Error('Il percorso indicato è una directory');
            }else{
                console.error(err);
                throw new Error(err);
            }
        }
        const lines = data.split(/\r?\n/);  // Windows richiede \r dopo lo \n anche se noi useremo questo script su Linux
        lines.forEach(function (line, i) {  // i è la linea
            if (line.includes("server {") && line[0] != "#") {    // Controlliamo che il primo carattere sia diverso da # perchè non vogliamo il server commentato, sarebbe inutile
                config.header.forEach(header => {
                    lines.splice(i + 1, 0, `\t ${header}`);   // i+1 equivale alla linea successiva dell'inizio del server
                    var text = lines.join("\n");    // Ricomponiamo il testo finale, ogni linea finisce con \n
                    fs.writeFile(file, text, function (err) {
                        if (err) return console.log(err);
                    });
                })
            }
        })
    });
}

main(argv);