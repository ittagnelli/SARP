## v1.1.0 – 14 Marzo 2023
- `fix#52`: ralazioni tra docenti materie e classi 
- aggiunta tabella Insegnamenti
- aggiunte relazioni docente, classe e materia
- `fix#96`: Aggiungere conferma per i delete di elementi

## v1.0.0 – 13 Marzo 2023
- da domano 14/03/2023 SARP entra ufficialmente in PRODUZIONE
- `fix#234`: nuova presenza PCTO ordinati 
- `fix#235`: aziende ordinate in nuovo stage
- `fix#236`: PCTO filtrati in nuova presenza
-  se utente è studente non deve scegliere l'utente

## v0.32.0 – 12 Marzo 2023
- apportate modifiche come richiesto dalla segreteria
- `fix#231`: Fix typo in modal
- `fix#227`: Fix select during update and delete of students
- `fix#226`: sessione troppo breve
- aggiornato copyright footer
- `fix#218`: stage ordinati per anno scolastico
- `fix#207`: ridimensionamento view PCTO aziende e presenze
- `fix#212`: rename ore contabilizzate in ore registrate
- `fix#228`: azienda PIVA e CF
- `fix#229`: azienda ITT e LICEO
- `fix#213`: PCTO verifica stato ricerca più flessibile
- `fix#203`: data documento convenzione errata

## v0.31.0 – 09 Marzo 2023
- `fix#220`: Aggiungere data del corso di sicurezza
- aggiunto campo dataTest al corso di sicurezza
- aggiornata tabella
- aggiornato modale insert e update
- aggiornato backend
- `fix#214`: Rimuovere possibilità di inserire docenti in stage 
- aggiunto filtro per docenti, pertanto solo gli studenti possono essere aggiunti ad uno stage
- `fix#178`: filtri tabella 
- aggiunta la possibilità di filtare una tabella per uno specifico campo
- aggiunta l'opzione searchable alle righe della table
- si possono fare ricerche per campi string, boolean e number
- aggiunto placeholder al campo filtro
- aggiunto  test automatico per view presenze

## v0.30.0 – 07 Marzo 2023
- `fix#205`: ordine aziende PCTO
- PCTO Aziende ordinate per numero convenzione
- `fix#215`: anno scolastico in stage
- modificato DB aggiunto anno_scolastico a PCTO
- modificato front_end per supportare a.s.
- modificando back_end per supportare a.s.
- modificato presenze per visualizzare a.s. nel titolo dello stage in caso di stage con nome uguale

## v0.29.0 – 07 Marzo 2023
- `fix#200`: PCTO report   
- aggiunta sezione verifica_stato in PCTO in layout
- aggiornato rbac peer visualizzare menu a ADMIN e TUTOR_
- aggiunto front_end per ricerca studente
- aggiunto backend API per prelievo informazioni PCTO relative allo studente ricercato
- aggiunta tabella stato PCTO con dettaglio ore
- aggiunto campo di tipo number al componente Table
- `fix#206`: caratteri validi nome azienda pcto
- aggiunto & nel regex del nome azienda
- `fix#204`: update tabella view PCTO aziende 
-  Rimozione della colonna 'CREATO DA' nella visuale
-  Update +page.svelte
- aggiunto script per aggiunta docenti
- `fix#199`: report ore PCTO studente 
- aggiunto calcolo ore complessive PCTO per utente di tipo STUDENTE
- le ore complessive sono quelle approvate appartenenti a stage contabilizzati
- `fix#197`: Stage contabilizzato
- fix bug in autenticazione dev per cypress
- ora è possibile autenticarsi con google o con credenziali email se in DEV
- modificato tabella pcto aggiunto flad contabilizzato
- modificato view stage per gestire flag contabilizzato
- ora è possibile contrassegnare uno stage come contabilizzato se tutte le sue ore sono state riportate in SIDI
- `fix#108`: Aggiunta test automatici per la vista utenti 
- aggiunto cypress per test automatici e visuali
- aggiunto login per developer senza google
- aggiunto suite iniziale di test

## v0.28.0 – 02 Marzo 2023
- `fix#182`: Report per inserimenti SIDI PCTO
- aggiunto endpoint per recuperare le ore approvate di tutti gli studenti di un PCTO
- aggiunto un modale per visualizzare il summary del PCTO e una tabella per tutti gli studenti contenente nome, cognome e numero di ore svolte
- aggiunta capacità di gestire i modali via js
- aggiunta custom action alla tabella di visualizzazione risorse
- aggiunto DB backup script
  
## v0.27.0 – 01 Marzo 2023
- `fix#190`: corso sicurezza genera max 10 attestati
-  aggiunto delay di 100ms nella generazione di ogni attestato del corso di sicurezza
- ciò è dovuto per aggirare la limitazione di chrome a max 10 download contemporaneai
- `fix#189`: Ridurre lista iscritti stage pcto 
- ridotta lista studenti visualizzatio per stage e corso sicurezza
- aggiunto parametro size per decidere il numero di immagini da visualizzare in tabella
- `fix#186`: Aggiungi modale apre l'aggiornamento in alcuni casi
-  Se l'utente chiude il modale update, i dati non vengono puliti così quando premerà crea $action rimarrà l'update.
- Aggiunta una funzione che pulisce il form dopo un cancel o close
- `fix#184`: Rimuovere immagine utente proveniente dal profilo google
- `fix#181`: Assegnazione classe a Corso Sicurezza
- `fix#180`: Assegnazione classe a PCTO stage 
- Ora è possibile creare stage e corsi sicurezza assegnando un'intera classe di studenti

## v0.26.0 – 24 Febbraio 2023
- fix piccolo bug in script upload immagini
- piccoli cambiamenti estetici suggeriti dagli studenti
- rimossa immagine dal profilo google
- aggiunta data nel template corso sicurezza
- stampa data in formato italiano
- Introduce pdf_to_images   
- rename student pictures to proper name
- script to add student picture in DB

## v0.25.0 – 22 Febbraio 2023
- `fix#176`
- aggiunto dashbopard in home page
- creato componente per KPI number
- creata tabella per KPI summary
- creato script per aggiornamento KPI

## v0.24.0 – 17 Febbraio 2023
- aggiunta di FAQ per il funzionamento di SARP e delle applicazioni
- aggiunto tutor scolastico alla sezione stage del PCTO

## v0.23.0 – 17 Febbraio 2023
- fix problema in tabella che non visualizzava il delete per i propri campi
- aggiunto impossibilità di cancellare una presenza PCTO se già approvata
- rilassato vincoli date protocollo azienda PCTO
- rilassato vincoli campi obbligatori azienda PCTO
- fix tipo in aziende server side
- update regex per indirizo azienda pcto

## v0.22.0 – 16 Febbraio 2023
- `fix#173`: Page bar in tabella con troppe pagine 
- `fix#172`: Nome Utenti occupa troppo spazio in tabella 
- Aggiunto parametro size alla tabella per definire la dimesnione di un campo stringa
- Modificata la page bar della tabella in modo da visualizzare sempre al massimo 20 pagine
- Aggiunti spazi in nome e cognome utente
- Aggiunto classe alla tabella utenti
- Aggiunto excelt to prisma
- Script permette di caricare un file Excel generato dal registro elettronico nel nostro DB
-  prisma connection limits DEV and PRODUCTION

## v0.21.0 – 14 Febbraio 2023
- `fix#170`: Utenti Codice Fiscale opzionale
- Utenti NatoA opzionale
- update logo a rosso Agnelli
- aggiunto supporto per PCTO Stellantis
- `fix#166`: PCTO creazione presenze di gruppo
- aggiunto possibilità di creare pcto presenze per tutti gli studenti di uno stage
- modificato icona per i boolen nella tabella
- `fix#164`: PCTO presenze validazione    
- aggiunto possibilità da parte degli studenti di creare le presenze PCTO
- aggiunto flag approvato per le presenze PCTO

## v0.20.0 – 04 Febbraio 2023
- aggiunte classi istituto ITT e LICEO
- aggiornata policy per supportare TUTOR-SICUREZZA
- aggiunto ruolo TUTOR-SICUREZZA
- completato associazione classi utenti
- completato sviluppo stampa attestati coraso di sicurezza generico e specifico
- caricati template per attestati corso sicurezza
- aggiunti campi natoA, natoIl e codiceF per Utente
- aggiunta tabella Classe
- aggiunta relazione tra Utente e Classe
- aggiuinta stampa attestati corso sicurezza
- aggiunta Applicazioni Corso di Sicurezza
- aggiunta tabella corsi
- aggiunta relazione tra Utente e Corsi di Sicurezza
- `fix#159`: Limitare num file e size per convert to print 

## v0.16.0 – 28 Gennaio 2023
- `fix#157`: Refactor front-end convert-to-print 
- `fix#129`: aggiunta nuova applicazione convert-to-print
- `fix#155`: Refactor del log eccezioni - refactor di catcherror per stampare correttamente le eccezioni di Prisma 
- `fix#152`: Footer tabelle errato - modificato footer per visualizzare n/M <nome entità>
- `fix#146`: container for badges
- `fix#148`: fix studente non visualizza le proprie presenze in PCTO
- `fix#147`: fix problem of picture-margin e add grid for pictures

## v0.15.0 – 24 Gennaio 2023
- `fix#140`: View PCTO
- `fix#139`: PCTO presenze nome studente errato
- fix student relation in Presenza
- modificato la migration siccome resettava il DB
- modificata il front-end di presenze la tabell in modo che stampa nome e cognome

## v0.14.0 – 20 Gennaio 2023
- fix piccoli problemi
- fix issue con pulsante delete
- fix errore nella query multi user
- aggiunto cognome a presenze, forzatura lettera maiuscola per nome e cognome
- `fix#138`: PCTO Presenze nome studente incompleto
- `fix#137`: Stage manca tutor in update 
- `fix#45`: Aggiungere upload foto utente 
- Aggiunto sistema immagine profilo
- Immagine di default
- Update dell'immagine al login se necessario o se è il primo accesso
- Aggiunta policy per immagini da google

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