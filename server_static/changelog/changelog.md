## v4.8.2 - 21 Settembre 2024
- file studenti 2024
- aggiornato documento 03 del PCTO per gestire il caso di residenza o campi vuoti
- aggiornato script import utenti
- creato script disabilita tutti studenti
- aggiornato script per disabilitare studenti vecchie V
- fix#571: PCTO presenze anno passato
- modifica ed aggiornamento agli script di inserimwento studenti, docenti e insegnamenti
- generazione dei template per la segreteria in formato xlsx


## v4.8.0 - 12 Settembre 2024
- Visualizza solo gli studenti BES dell'anno corrente e passato che sono attivi
- PDP mi presento e autovalutazione solo per studenti iscritti
- Visualizza PCTO stage e presenze anche dell'anno precedente
- Programmazione annuale visualizza solo l'as corrente
- Update e Fix layout PDP -> Mi Presento
- Modifica permessi TUTOR-BES: update utenti

## v4.7.3 – 18 Maggio 2024
- `fix#555`: Rimozione spazi documenti PDP PF e CS
- `fix#554`: Footer Errato Programmazione Annuale -> Template 
- `fix#534`: Documentazione sezione Sicurezza Lavoro
- aggiunta documentazione relativa alla funzione Corsi Sicurezza della sezione Sicurezza sul Lavoro
- fix#556: Documentazione PDP update (#557)
- `fix#531`: Documentazione sezione PDP
- documentazione della sezione PDP
- `fix#532`: PCTO Stage aggiungere sede di svolgimento PCTO
- aggiunto campo sede_stage a DB, a front_end e back_end
- aggiornati template per includere sede legale e sede svolgimento del PCTO

## v4.7.2 – 12 Maggio 2024
- `fix#533`: Documentazione sezione Programma Annuale  (#550)
- creata la documentazione per la sezione programmazione annuale

## v4.7.1 – 10 Maggio 2024
- `fix#541`: Cleanup main branch (#551)    
- rimosso tabler
- rimosse immagini utente in quanto non più aggiornate e non sistematico
- aggiunto script per esportazione id tabelle per check vacuum
- eseguito VACUUM del db in produzione
- `fix#547`:Rimozione spazi dal nome documenti PDP (#548)
- `fix#543`: Tabelle documento PDP generato (#546)
- ora l'ordine delle risposte è riportato correttamente nelle tabelle del documento finale
- `fix#544`: PDP errore stampa in mancanza di obiettivi minimi (#545)
- risolto errore durante stampa PDP per studenti senza obiettivi minimi

## v4.7.0 – 05 Maggio 2024
- `fix#532`: Documentazione sezione PCTO
- Aggiunta documentazione relativa alla funzione Aziende dell'applicazione PCTO
- Rimozione sezione FAQ in quanto rimpiazzata dalla sezione documentazione
  
## v4.6.0 – 16 Aprile 2024
- `fix#538`: Fix vari per programmazione annuale
- Aggiornamento della sezione programmazione annuale in preparazione della fine del pentamestre
- `fix#535`:Documentazione sezione Utenti
- Aggiunta la documentazione sulla sezione `Utenti`
- `fix#529``: SARP Documentation infrastructure 
- Creata infrastruttura per la sezione documentazione di SARP

## v4.5.0 – 10 Aprile 2024
- `fix#527`: Logout error da PDP Alunni 
- `fix#525`: PDP presenza voci specifiche    
- modifica alla tabella in modo da poter applicare filtri in AND
- aggiunti flag sintesi_vocale e tempo_esteso a PDP
- aggiunte colonne sintesi_vocale e tempo_esteso in PDP Alunni
- In tal modo la segreteria può verificare quali studenti di V hanno questi flag a true o meno
- `fix#523`: PDP Layout Patto Educativo

## v4.4.0 – 07 Aprile 2024
- `fix#492`: PDP compilazione Sezione B
- Il referente BES può compilare la tabella delle Abilità B
- `fix#519`: PDP obiettivi minimi per materia in template 
- `fix#514`: PDP Obiettivi Minimi    
- Docente può specificare un template di programmazione per gli studenti che hanno gli obiettivi minimi

## v4.3.0 – 03 Aprile 2024
- `fix#516`: PCTO Stage date aggiornate al momento della stampa nei documenti
- `fix#513`: Studente Obiettivi Minimi (#515)
- Ora è possibile specificare per gli studenti se hanno diritto agli obiettivi minimi nel PDP o meno
- `fix:#511`: PDP aggiunta tre sezioni altro in template e docente (#512)    
- Il docente sia nel template che nel PDP studente può specificare altre indicazioni per le misure dispensative, compensative e valutative
- `fix#490`: PDP sostituzione template 
- `fix#495`: PDP aggiornamento voci dispensative, compensative e valutative
- `fix#503`:Aggiunta flag completamento PDP griglia osservativa
- `fix#494`: PDP compilazione griglia C2 
- compilazione griglia C2 (patto educativo)
- aggiunta migrazione per griglia_pdp_c2 in utente
- aggiornata ACL policy
- aggiunto ruolo tutor-bes
- aggiunto menu pdp->patto_educativo
- il patto educativo può essere solo gestito dal tutor-bes
- aggiornato template per includere le risposte della griglia C2 Patto Educativo
- `fix#491`: PDP Sezione A1 per tutti gli studenti 
- `fix#493`: PDP griglia C1 compilazione da parte di TUTTI gli studenti f
- fix#491: PDP Sezione A1 per tutti gli studenti
- Aggiunta sezione Mi Presento in PDP per tutti gli studenti e Admin
- Lo studente può compilare in autonomia la propria presentazione verso il consiglio di classe
- fix#493 PDP griglia C1 compilazione da parte di TUTTI gli studenti
- Lo studente può compilare in autonomia la griglia valutativa C1
- Aggiornato il template del PDP per riportare anche la sezione mi presento e l'autovalutazione C1
- Aggiornami alcuni campi relativi alle generalità dello studente nel template

## v4.2.8 – 22 Marzo 2024
- `fix#501`: Update utenti a TUTOR-SCOLASTICO per PCTO
- Aggiunto campo residenza in Utente
- Aggiunto campo residenza in modulo PCTO convenzione studente

## v4.2.7 – 20 Marzo 2024
- `fix#496`: PCTO Stage as default
- Anno Scolastico in Stage impostato in modo automatico e non modificabile
- `fix#497`: PCTO Stage aggiungere orario ingresso e uscita 
- Aggiunto campo Orario Accesso per lo stage
- Accetta orario come 08:00-13:00
- Accetta orario come 08:00-13:00 14:00-18:00
- Modificato template convenzione studente per riportare orario accesso in azienda

## v4.2.6 – 12 Marzo 2024
- `fix#488`:  PCTO small bugs 
- cambiato algoritmo di generazione dell'ID convenzione per un azienda
- rilassata regex per il telefono e indirizzo Azienda
 
## v4.2.5 – 29 Febbraio 2024
- `fix#486`: Migliorie per Segreteria
- remove can_login flag from disable users
- remove additional user
- aggiunto filtro per classe in utenti
- aggiunto filtro per tipo utente
- aggiunto filtro per PDP in utente
- rimosso foto in utente
- aggiunto ordinamento per classe per report PCTO in stage

## v4.2.4 – 10 Febbraio 2024
- `fix#470`: PCTO Stage visualizzare solo quelli dell'AS in corso
- enable PCTO azienda id auto generation
- `fix#469`: PCTO Stage rimozione lista iscritti dalla tabella principale 

## v4.2.3 – 10 Febbraio 2024
- `fix#482`: PDP Presenze scelta multipla studenti
- `fix#474`: PCTO Presenze visualizzare solo stage dell'a.s. in corso
- `fix#472`: Utenti rimozione dalla visualizzazione degli studenti diplomati
- cambiata policy utenti: accessibili solo da ADMIN

## v4.2.1 – 06 Febbraio 2024
- `fix#471`: PCTO Presenze visualizzazione relative a.s. in corso (#479)
- aggiunto as in DB
- filtro presenze per as corrente
- `fix#476`: PDP misure opzionali (#478)
- se non sono selezionate misure viene visualizzato nel PDP un messaggio standard
- modificato script di creazione PDP per rimuovere Ginnastica, CLIL e Educazione Civica
- adding audit a log dir to simplify dev environment setup for new devs

## v4.2.0 – 03 Febbraio 2024
- `fix#467`:Aggiungere Provincia in attestati corso sicurezza
- polishing pdp template
- `fix#461`: Stampa sezione materie in PDP
- add capability to print the entire PDP document
- fix some issues on the pdp template
- `fix#460`: Compilazione PDP da parte del docente
- aggiunto tool per la generazione delle entries del PDP per un dato anno
- aggiunto PDP al DB
- updated PDP model to include idDocente for easier query
- added note to PDP table
- fix issue in create_pdp_entries
- `fix#459`:Template PDP
- add pdp template to DB
- initial version of PDP template feature
- aggiunta possibilità per docente di creare template per i PDP per le sezioni dispensazioni, compensazioni e valutazioni
- `fix#457`:Stampa griglia valutazione in documento PDP
- Aggiunta sezione Genera PDP per la generazione dei documenti PDP da parte dell'ADMIN
- fix wrong pdp resource for griglia_osservativa
- add rendering capabilities for the 5 evaluation grids
- add pdp_template.docx

## v4.1.0 – 23 Gennaio 2024
- `fix#453`: Provincia di Nascita per Utente
- modificato front-end e back-end con il campo provincia

## v4.0.0 – 20 Gennaio 2024
- `fix#443`: Griglia valutazione per studenti PDP
- aggiunta prima versione dell'applicazione PDP
- aggiunto campo griglia_valutazione a Utente e relativa migrazione prisma
- aggiunta la possibilità di filtrare una custom_icon in base allo stato di una colonna booleana
- add filter to classi view
- fix MODULE_NOT_FOUND when running vite server
- `fix#448`: GUI per gestione classi, coordinatore e insegnamenti
- aggiunto modale per inserimento tutor di classe
- aggiunto ruolo TUTOR-CLASSE
- `fix#451`: aggiunte firme per gli attestati di formazione generica e specifica
- `fix#447`: Aggiunta coordinatore per ogni classe nel DB

## v3.11.0 – 08 Dicembre 2023
- `fix#445`: Assegnazione test sicurezza a docente 
 
## v3.10.0 – 08 Dicembre 2023
- `fix#442`: Assegnazione automatica convenzione azienda 

## v3.9.0 – 02 Novembre 2023
- `fix#437`: Aggiunta Istituto Medie     
- `fix#438`: Caricamento docenti Medie a sistema tramite script automatico


## v3.8.3 – 30 Ottobre 2023
- `fix#436`: Programmazione classe completa non aggiornata 
- quick fix: programmazione classe non stampa
- aggiunto filtro per titolare:true

## v3.8.1 – 29 Ottobre 2023
- `fix#434`: Documento programmazione classe senza programmi
- Ordinate le materie nei documenti di programmazione in ordine alfabetico
 
## v3.8.0 – 12 Ottobre 2023
- `fix#428`: Educazione civica solo nel programma di fine anno (#433)
- `fix#427`: errore di battitura in PCTO presenze
- `fix#249`: Codice Classrom mancata segnalazione errore in caso di campo vuoto (#432)
- `fix#430`: Libro vuoto appare in documento finale (#431)
- prevent inserting and cut and paste invalid chars
- user can only insert valid ASCII chars
- fix issue with filter on PCTO utenti
- tutor was removed as filtered only by STUDENTE
- moved the filter from backend to front-end


## v3.7.0 – 07 Ottobre 2023
- `fix#407`: Possibilità di creare PCTO misti tra studenti di classi diverse (#426)    
- Ora è possibile aver eun PCTO formato da studenti di classi diverse
- Aggiornato visualizzazione stato studenti in stage e aggiunto campo classe
- Rimossi docenti dalla lista di studenti che possono partecipare al PCTO


## v3.6.2 – 06 Ottobre 2023
- `fix#424`:Programmazione docente solo per titolare

## v3.6.1 – 03 Ottobre 2023
- `fix#422`:Tabella programmazione docente visualizzare docente materia 
  
## v3.6.0 – 02 Ottobre 2023
- `fix#420`: Condivisione template impossibile in alcuni scenari (#421)
- il docente ora può condividere un template solo con docenti della stessa materia
- quick fix: cambio nome colonne in programmazione
- update of deploy.sh script to properly cleanup environment

## v3.5.0 – 30 Settembre 2023
- `fix#418`: Aggiornare template programmazione con frase finale su valutazione (#419)
- `fix#416`: Possibilità di duplicare un template per un altro docente (#417)    
- un docente può duplicare un template per se stesso o per un altro docente

## v3.4.5 – 28 Settembre 2023
- `fix#414`: Lista studenti id non ordinati in programmazione

## v3.4.4 – 28 Settembre 2023
- `fix#`: Studenti in programmazione non ordinati enhancement
- aggiunto script per disabilitare utenti SARP
- rimossi studenti non più presenti nelle classi per a.s. 2023

## v3.4.3 – 25 Settembre 2023
- `fix#e410`: Registro presenze sicurezza non in ordine alfabetico
- Ordine alfabetico crescente
- Lettere iniziale di nome e cognome maiuscole
- quick fix to print book for trimestre and not only for pentamestre
- `fix#408`:Formato Libro - rilassare regex al massimo (#409)    
- tutti i caratteri ammessi

## v3.4.0 – 24 Settembre 2023
- `fix#401`: Remove newline in form
- `fix#403`:Libro di testo non obbligatorio in programmazione e (#404)    
- modificato template e regex per rendere il libro opzionale
- `fix#402`: Apostrofo non permesso nel libro di testo in programmazione (#405)
- aggiunto supporto a caratteri speciali ',(),[],/,&
- handle missing Docente
- aggiunge insegnamento selettivamente dainserire=true ('X' in excel)
- improved import_insegnamenti with debug
- `fix#396`: Output libri di testo in template da rivedere (#400)    
- previene inserimento di ENTER in note per evitare formattazioni non controllate
-quick fix on libro regex

## v3.3.4 – 21 Settembre 2023
- `fix#396`: Output libri di testo in template da rivedere
- previene inserimento di ENTER in note per evitare formattazioni non controllate
- quick fix on libro regex

## v3.3.2 – 20 Settembre 2023
- `fix#397`:Rilassare regex libro di testo in programmazione annuale (#399)
- support fino ad un max di 3 autori
- supporto a spazi in casa editrice e titolo
- `fix#395`: Distanziare icone più e cestino in programmazione docente (#398)
- aggiunto colorazione icon
- update tooltip icone

## v3.3.0 – 18 Settembre 2023
- `fix#352`: Errore valutazione test sicurezza
- ora i test di sicurezza sono valutati correttamente
  
## v3.2.0 – 18 Settembre 2023
- `fix#391`: Implementare stampa modulo presenze corsi sicurezza (#393)
- `fix#390`: Aggiornamento template attestato corsi sicurezza  (#392)
- `fix#388`: Import studenti as 2023-2024
- creato script per disabilitare studenti delle 5 dell'anno precedente
- preparato file per import studenti as 2023-2024

## v3.1.0 – 17 Settembre 2023
- `fix#385`: Il docente può generare e visionare la programmazione docente in word 


## v3.0.0 – 16 Settembre 2023
- `fix#379`: Don't render empty sotto_sotto_argomenti (#384)
- `fix#376`: Make remove sotto argomento works in latest changes (#383)
- `fix#380`: Validazione titolo libro errata (#382)
- modificata regex per accettare anni tra 1000 e 29999
- modificata regex per accettare lettere maiuscole ovunque
- `fix#378`: Programmazione docente non deve essere modificabile dopo il completamento (#381)
- Ora ADMIN può resettare lo stato della programmazione docenti
- Utente non può editare programmazione dopo che è completa
- `fix#374`: Programmazione Docente template cleanup (#375)
- `fix#355`:Formato Libro fisso in programmazione docente (#373)    
- Il formato del libro è il seguente:
  - Cognome N.,Titolo,Casa Editrice, Anno Edizione (es: Boscaini M.,Imparare a programmare,Apogeo,2023)
- `fix#363`: Aggiunta argomenti intermedi in Programmazione Docente
- Add create new arg at specified level
- `fix#356`: 3 Livelli di argomenti in Programmazione Docente
- Add sotto-sotto livello in programmazione dell'anno
- Fix esthetic bug in input box
- `fix#357`: Duplicazione Template Programmazione (#370)
- `fix#358`: Sezione Note Programmazione Docente  (#367)
- Add note in programmazione e template
- `fix#361`: Campi più ampi in Programmazione Docente (#369)    
- campo titolo max 128 caratteri no enter
- campo sottoargomento max 512 caratteri no enter
- `fix#353`: Classe non selezionata in programmazione docente (#368)
- `fix#362`: Cambio carattere separatore in Programmazione Docente  (#364)
- programmazione: Use tilde as separator for books
- Track tilde-based array in another variable
- This fix some graphical bugs
-  Add esthetic 
- `fix#359`:Da Quadrimestre a Periodo in Programmazione Docente
- passaggio a trimestre e pentamestre
- `fix#360`: Page Blank dopo ogni materia in Programmazione Docente (#365)
- aggiornato template con nuovo tag pageBreak
- creato nuovo custom tag @pageBreak per aggiungere un pagebreak
- creato custom tag parser per aggiungere pagebreak in un loop tranne che all'ultima iterazione
- risolti vari bug logici in programmazione docente
- risolti vari bug logici e di visualizzazione
- aggiunto codice classroom a programmazione docente
- `fix#342`: Tooltip per programmazione annuale (#351)
- aggiunti tooltip alla sezione programmazione annuale
- aggiunti tooltip a tutte le sezioni di SARP
- `fix#341`:Tooltip per sicurezza lavoro
- aggiunti tool tip alla sezione sicurezza lavoro
- aggiunti tooltip al layout generale
- sostituito componente Tooltip con tippy.js per maggior flessibilità
- `fix#340`: MessageBox per programmazione annuale
- aggiunti MessageBox per la sezione programmazione annuale template e docenti
- rimosso vecchio componente Alert e sostituito con MessageBox per essere omogeneo con le altre pagine
- `fix#348`: Programmazione Docente non può selezionare il template
- `fix#339`: MessageBox per sicurezza lavoro
- MessageBox vengono visualizzati sia per la sezione corsi che per test
- Admin e utente vedono messaggi differenti in funzione dello stato specifico
- aggiunta call back a MessageBox
- Alla rimozione del MessageBox è possibile (opzionale) eseguire una call back
- modificata funzione helper per attendere la completa visualizzazione del modale
- resa la funzione parametrica siccome modali diversi hanno tempi diversi
- `fix#338`: Tooltip informativi (#346)
- Aggiunto componente Tooltip
- `fix#337`: Alert Messages (#345)
- Aggiunto componente MessageBox per visualizzare messaggi di tipo success, warning e danger
- Il messaggio ha un titolo ed un testo
- Il messaggio scompare automaticamente con un delay configurabile
- `fix#304`: Sviluppo applicazione test corsi sicurezza
- aggiunto possibilità di somministrare i test di sicurezza online
- gli studenti possono eseguire il test di sicurezza online
- il test viene automaticamente corretto
- il test viene automaticamente valutato
- il professore può re-assegnare specifici test di sicurezza in caso di fallimento
- il test viene generato con domande in ordine casuale per ogni singolo studente

## v2.0.2 – 15 Luglio 2023
- `fix#333`: multiple custom action in table (#336)
- Now user can set as many custom action as needed
- `fix#330`: filtro tabella limita risultato a 10 (#335)
- rimossa limitazione a 10 entry durante il filtro tabella
- `fix#329`: Pulsante "Valuta Stagista" su /pcto/valutazione_studenti (#334)
- Lo stagista può solo visualizzare la sua valutazione, e non può ne modificarla ne aggiungerne una nuova
- `fix#331`: Vulnerabilità grave in convert-to-print(shell execution)
- In precedenza poteva esser caricato un file con una sostituzione bash per eseguire comandi caricando un semplice file docx
- change dest dir of db_backup
- add deploy_backup which backs up SARP dir and /nginx dir

## v2.0.1 – 30 Giugno 2023
- Gli studenti possono visualizzare la propria valutazione PCTO
- Gli studenti possono visualizzare la propria situazione PCTO
  
## v2.0.0 – 27 Giugno 2023
- `fix#326`: Select template non deve essere mostrato in update
  - Rimosso modale durante update
- `fix#322`: Programmazione classe completa solo con presenza programmazione docente bugSomething isn't working
- `fix#323`: Programmazione annuale formato documento
- `fix#324`: Programmazione Docente formattazione header tabella
- `fix#183`: Creazione applicazione Programmazione Annuale
  - creato  programmazione: template Introduce template support
  - Aggiunto programmazione_docente
    - code review e refactory di template e programmazione docente
    - Aggiunto programmazione_classe feature
    - fix issue #315: Programmazione Docente manca il libro
    - fix issue #317: Programmazione Documento nome insegnante bugSomething isn't working
    - fix#316: Programmazione documento nome materia
    - fix#314: Template Programmazione errore libro
- `fix#320`: PCTO Presenze non ordinate
    - Ora le presenze sono ordinate per data in senso antri cronologico


## v1.7.2 – 13 Giugno 2023
- `fix#319`: PCTO presenze non inseribili per 1 solo studente
- `fix#311`: riduzione tabella PCTO presenze
- `fix#313`: Reduce data dowloaded for presenze
- optimized query by selecting only needed fields to reduce data downloaded


## v1.7.0 – 20 Maggio 2023
- `fix#309`: aggiungere valutazione PCTO studente (#310)    
- il tutor aziendale può valutare gli studenti che hanno partecipato al PCTO di cui lui è tutor
- il tutor scolastico può visionare le valutazioni degli studenti per cui è tutor scolastico
- admin può eseguire tutte le operazioni
- aggiunto sezione FAQ per la valutazione studente

## v1.6.4 – 13 Maggio 2023
- `fix#307`: Corso sicurezza non può aggiungere studenti o classi (#308)
- `fix#305`: formato data documento PCTO convenzione errato (#306)
- `fix#302`: email tutor aziendale e utente non accettata (#303)
- `fix#301`: Aggiungere gestione presenze in FAQ per tutor
- `fix#299`: PCTO presenze bulk create non approvate (#300)


## v1.6.0 – 05 Maggio 2023
- `fix#279`: Generazione documenti PCTO stage  
- aggiunta funzionalità di generazione e stampa documenti convenzione studente e patto formativo
- per ogni studente che partecipa ad un dato PCTO, il sistema genera in automatico tutti i documenti necessari
- `fix#296`: aggiungere il campo #CI in PCTO azienda (#297)


## v1.5.0 – 02 Maggio 2023
- `fix#291`: PCTO Stage tutor
- aggiunto email e numero di telefono del tutor aziendale
- informazioni utili per la generazione dei documenti pcto
- `fix#290`: PCTO Stage attività 
- aggiunte 4 attività per un PCTO
- questi dati utili per la compilazione della documentazione
- `fix#292`: PCTO Azienda email privacy regex troppo restrittiva


## v1.4.0 – 01 Maggio 2023
- `fix#278`: PCTO presenze creazione solo dei tutor (#289)    
- le ore sono automaticamente approvate e non è più possibile modificare da UI
- le presenze possono essere create solo da web da admin, tutor scolastico o tutor aziendale
- lo studente può solo consultare il suo monte ore e le ore svolte via web e mobile
- `fix#280`: PCTO Stage presenze solo se PCTO valido (#288)
- le presenze possono essere create solo per i PCTO con tutti i documenti firmati e approvati dalla segreteria
- `fix#277`: PCTO Stage flag firma feature (#287)
- aggiunto flag documenti PCTO  firmati modificabile solo da ADMIN
- `fix#276`: PCTO Azienda flag firma (#286)
- aggiunto flag convenzione firmata modificabile solo da ADMIN
- `fix#274`: Da direttore a legale rappresentante
- Cambiato nome campo modale e colonna tabella da direttore a Legale Rappresentante
- `fix#275`: Email PCTO Azienda per privacy
- Aggiunto campo email_privacy al DB e CRUD

## v1.3.1 – 28 Aprile 2023
- `fix#283`: Logo Login mancante 
- `fix#273`: logout 404

## v1.3.0 – 23 Aprile 2023
- `fix#265`: Ore previste stage
- `fix#267`: stage per classe
- In fase di creazione dello stage è necessario specificare la classe e il numero di ore previste

## v1.2.2 – 20 Aprile 2023
- `fix#266`: ricerca per cognome in verifica stato pcto (#270)
- ora è possibile fare una verifica stato PCTO cercando solo per nome o solo per cognome
- se il risultato è diverso da un solo utente viene chiesto di essere più specifici nella ricerca
- `fix#264`:     
- Riepilogo stage non funzionante


## v1.2.1 – 15 Aprile 2023
- `fix#262`: refactor di PCTO
- riorganizzazione della struttura delle directory
- ogni applicazione ha la sua directory in src/routes
- tutto il resto va in support
- `fix#259`: PCTO Verifica Stato totale errato 
- azzerato ore totali ad ogni query
- `fix#257`: ridimensionare tabella corsi sicurezza 
- `fix#255`: Login mancato messaggio errore (#256)
- aggiunta generazione errore in caso di login fallito
- `fix#252`:script inserimento e update materie classi 
- utils: add import_docenti
- full refactor of ad di insegnamenti
- modified DB to add a unique constraint on Materia.nome
- add script to fill Materie table

## v1.2.0 – 17 Marzo 2023
- `fix#245`: Vulnerabilità Convert to print     
- Fix vulnerable endpoint
- fix policy
- `fix#243`: Presenze mobili 
- Support presenze on mobile
- fix table layout and ore layout
- layout: Add page_action_btn to layout on mobile view
- `fix#248`: totale ore in verifica stato   
- aggiunta linea in tabella con le ore totale di tutti i pcto di uno studente
- `fix#247`: tutor crea aziende
- fix permessi RBAC per tutor-scolastico
- `fix#242`: TOTALE ORE PCTO
- refactor totale ore pcto visualizzate per uno studente
- vengono visualizzate le ore registrate, approvate e totali

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
- aggiunta la possibilità di filtrare una tabella per uno specifico campo
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
- modificato tabella pcto aggiunto flag contabilizzato
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
- ciò è dovuto per aggirare la limitazione di chrome a max 10 download contemporanei
- `fix#189`: Ridurre lista iscritti stage pcto 
- ridotta lista studenti visualizzato per stage e corso sicurezza
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
- aggiunto dashboard in home page
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
- update regex per indirizzo azienda pcto

## v0.22.0 – 16 Febbraio 2023
- `fix#173`: Page bar in tabella con troppe pagine 
- `fix#172`: Nome Utenti occupa troppo spazio in tabella 
- Aggiunto parametro size alla tabella per definire la dimensione di un campo stringa
- Modificata la page bar della tabella in modo da visualizzare sempre al massimo 20 pagine
- Aggiunti spazi in nome e cognome utente
- Aggiunto classe alla tabella utenti
- Aggiunto excel to prisma
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
- completato sviluppo stampa attestati corso di sicurezza generico e specifico
- caricati template per attestati corso sicurezza
- aggiunti campi natoA, natoIl e codiceF per Utente
- aggiunta tabella Classe
- aggiunta relazione tra Utente e Classe
- aggiunta stampa attestati corso sicurezza
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
- modificata il front-end di presenze la tabella in modo che stampa nome e cognome

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
- vengono convertite automaticamente in JSON durante dev o build
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
- aggiunti directory e nome template in .env
- generazione del file lato client così da evitare il salvataggio lato server
- `fix #86`: eliminazione del proprio stesso profilo
- rimosso tasto delete per il proprio utente
- `fix #60`: Aggiungere gestione delle eccezioni 
- aggiunto gestione eccezioni per tutte le viste (lato server)
- aggiunti messaging di errore nei form delle viste in caso di fallimento lato server
- aggiunta di pagine 500 con codice e messaggio di errore per l'utente finale

## v0.9.0 – 27 Dicembre 2022
- `fix #50`: multiuser
- aggiunto il supporto multiuser lato server
- gli utenti con ruolo ADMIN (specificato in .env) possono vedere tutto
- gli altri utenti vedono solo i loro dati (multitenancy)
- `fix #109`: vista aziende e segnalazioni non funzionante

## v0.8.0 – 26 Dicembre 2022
- preparato l'ambiente per il deploy in produzione
- create config di NGINX
- modifiche a SARP per girare in produzione
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
- aggiunto husky per fare la formattazione automatica prima di ogni 
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
- aggiunta la directory tabler che contiene tutti i file della dist originale di tabler - aggiunto il layout di SARP
- aggiunto mockup
- obiettivi iniziali
 
<br>


## v0.0.0 – 26 Settembre 2022 – primo 
