## v0.13.0 – 19 Gennaio 2023
- `fix#135`: Inibire accesso da piattaforma mobile
  
## v0.12.0 – 19 Gennaio 2023
- Aggiunto service worker per caching file
- Script di sicurezza (#131)    
- security:initial exploit
- security: add working xss script and payload
- security: add some endpoints in script

## v0.11.0 – 18 Gennaio 2023 - INIZIO PRODUZIONE
- update homepage
- update RBAC acl per inizio produzione
- update lista iniziali ruoli utente
- nuovo logo (grazie a Nicolo' Scena)
- refactor per aggiungere supporto multi ruolo per utenti
- modificato tabella per supportare una lista di ruoli visualizzati come badge
- rilassato il vincolo sul telefono per la tabella utenti, ora può essere opzionale
- crea ruoli leggendo il db
- `fix#123`: Ruoli multipli per un utente
- risolto problema in error.svelte
- `fix#127`: 404 genera un crash
- `fix#126`: Endpoint logger vulnerabile
- `fix#125`: Pagina manutenzione va nascosta
- `fix #65`: Bottone fantasma   

## v0.10.0 – 31 Dicembre 2022   
- `fix #51`:Aggiungere sistema RBAC 
- implementato sistema RBAC basato su ACL sia lato client che lato server
- protegge la vista dei menu
- protegge gli endpoints
- la granularità è per il singolo ruolo sulla singola risorsa per la singola azione
- aggiunto il target policy in package.json per generare le policy RBAC
- le policy sono definite nel file server_static/rbac/acl.yml
- vengono convertite automaticamente in JSON dutante dev o build
- creato il SEED del DB prisma
- aggiunto comando npx prisma db seed
- aggiunto creazione utenti developers
- `fix #114`: Typo tabella presenze
- `fix #115`: Tabella presenze non controlla gli orari  
- presenze: Fix typo e aggiunto controllo orario
- orario di uscita deve essere successivo a quello di entrata
- `fix #112`: Vulnerabilità sul download dei file
- Refactoring generazione DOCX  
- spostato i file rilevanti da static a server_static
- aggiunto gestione eccezione in caso il file non possa essere generato
- aggiunti diretory e nome template in .env
- generazione del file lato client così da evitare il salvataggio lato server
- `fix #86`: eliminazione del proprio stesso profilo
- rimosso tasto delete per il proprio utente
- `fix #60`: Aggiungere gestione delle eccezioni 
- aggiunto gestione eccezioni per tutte le viste (lato server)
- aggiunti messagig di errore nei form delle viste in caso di fallimento lato server
- aggiunta di pagine 500 con codice e messaggio di errore per l'utente finale

## v0.9.0 – 27 Dicembre 2022
- `fix #50`: multiuser
- aggiunto il supproto multiuser lato server
- gli utenti con ruolo ADMIN (specificato in .env) possono evdere tutto
- gli altri utenti vedono solo i loro dati (multitenancy)
- `fix #109`: vista aziende e segnalazioni non funzionante

## v0.8.0 – 26 Dicembre 2022
- preparato l'ambiente per il deploy in produzione
- create config di NGINX
- modeifiche a SARP per girare in produzione
- aggiornato wiki con la sezione deployment
- fix problema estetico in FAQ

## v0.7.2 – 25 Dicembre 2022
- `fix #104`: Changelog in Markdown 
- aggiunta feature per editing changelog in Markdown

<br>

## v0.7.1 – 25 Dicembre 2022
- `fix #100`: FAQ in markdown
- aggiunta la possibilità di scrivere le FAQ in markdown
- aggiornato Wiki per i dettagli della sezione FAQ
- `fix #99`: Aggiornare sezione FAQ
- aggiornata la sezione FAQ

<br>

## v0.7.0 – 24 Dicembre 2022
- `fix #48`: Aggiungere pagina segnalazioni
- aggiunta pagina segnalazioni per utenti NON developer

<br>


## v0.6.0 – 24 Dicembre 2022
- `fix #31`: refactoring view valutazioni
- Aggiunta vista PCTO valutazioni

<br>


## v0.5.4 – 22 Dicembre 2022
- `fix #68`: aggiungere changelog
- `fix #92`: inserimento logo SARP
- `fix #90`: Validazione form per tutte le viste
- `fix #78`: possibilità di inserire cifre e caratteri speciali nel nome e nel cognome
- `fix #77`: formato incorretto del numero telefonico
- `fix #76`: formato email non corretto
- `fix #84`: rimozione console.log

<br>


## v0.5.0 – 18 Dicembre 2022
- `fix #83`: Auditing

<br>


## v0.4.0 – 18 Dicembre 2022
- `fix #63`: aggiungere server e client logging
- Aggiunto show_users()
- Aggiunto script wiki
- `fix #58`: Typo footer tabelle
- Aggiornato CSP policy
- Aggiunto can_login
- aggiunta pagina FAQ e componenti di sviluppo

<br>


## v0.3.1 – 09 Dicembre 2022
- `fix #55`: Aggiungere una pagina 400/500

<br>


## v0.2.0 – 08 Dicembre 2022
- `fix #49`: Aggiungere login con google account
- `fix #`undefined: Aggiunti header HTTP

<br>


## v0.1.0 – 03 Dicembre 2022
- `fix #35`: Aggiungere validazione client side form
- tests: add fill_role and change logic in fill_user
- assegnati ruoli
- aggiunto tabella team
- `fix #32`: Generazione foglio convenzione in PDF
- Feature/profmancusoa presenze
- Feature/profmancusoa nuove viste
- valutazioni: Rename import from store
- valutazione: fix problem with modal
- risolto problema aziende e aggiunto helper
- Aggiunta view valutazioni
- Profmancusoa/feature/view aziende
- `fix #15`: Navbar non permette più voci di sottomenu e sottosotto menu
- first run di prettier sui sorgenti
- aggiunto husky per fare la formattazione automatica prima di ogni commit
- aggiornato .prettierignore per rimuovere le directory con file statici o non da formattare
- refactor della navbar a componenti
- added updated ER diagram, jpg and source file
- added prisma scheme and .env file
- Implement multiple rows
- Fix layout problem
- `fix #1`: diagramma ER per applicazione PCTO
- routes revert page changes
- Revert some changes
- Remove ts, svelte preprocessor and useless component
- Cleanup project
- Add stabler component and fix a problem with modal
- Risolto bug tremendo in tabler.js - aggiunto store per comunicazione tra componenti - reso parametrico il pre-title, title e il tasto azione - creato lo skeleton per la pagina convenzioni
- aggiunta la directory tabler che contiene tutti i file della dist originale di tabler - aggiunto il layout di SERP
- aggiunto mockup
- obiettivi iniziali
 
<br>


## v0.0.0 – 26 Settembre 2022 – primo commit