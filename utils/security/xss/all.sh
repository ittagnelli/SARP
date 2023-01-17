node xss.js http://localhost:5173/logger $1 payloads/logger.json
node xss.js http://localhost:5173/aziende?/create $1 payloads/aziende.json 
node xss.js http://localhost:5173/presenze?/create $1 payloads/presenze.json 
node xss.js http://localhost:5173/utente?/create $1 payloads/utente.json 
