## **S**cuola **A**gnelli **R**esource **P**lanning

**SARP** è un sistema gestionale interamente sviluppato internamente che hai pochi e semplici obiettivi:
1. Creare un sistema di amministrazione e gestione dei principali processi della scuola
2. Ridurre l'uso di documenti cartacei per snellire i processi e muoversi verso il concetto di ***papereless office***
3. Agevolare le attività amministrative per i vari responsabili (docenti, preside, amministrazione, ...)
4. Fornire una *"palestra"* per gli studenti per cimentarsi con un'attività non didattica di sviluppo software utilizzando moderne tecnologie web

- **SARP** è un'applicativo Web fruibile da un comune PC (per scelta non ha un'interfaccia mobile).
- Il sistema è pubblico pertanto accessibile ovunque da Internet.
- Per effettuare è necessario utilizzare il proprio account istituzionale, pertanto beneficiando degli alti livelli di sicurezza offerti da Google.

## Accesso al sistema

- Al momento per decisione progettuale, per poter accedere a SARP è necessario utilizzare il proprio account istituzionale.
- E' anche necessario essere abilitati all'accesso dagli amministratori di SARP
- Se dovesse permanere la necessità assoluta di usare un account email privato, contattare il team di sviluppo di SARP e riportare la richiesta tramite la pagina delle segnalazioni
  
## Interfaccia Web

- L'interfaccia è suddivisa in due sezioni principali:
  1. **Barra delle applicazioni**: Una barra laterale sulla sinistra dello schermo che permette di accedere a tutte le applicazioni e funzionalità disponibili
  2. **Area principale**: La restante parte dello schermo è l'area principale di utilizzo delle varie applicazioni

## Barra delle applicazioni

- Contiene una serie di menu e sotto-menu
- I menu rappresentano le applicazioni o specifiche funzionalità
- I sotto-menu rappresentano le aree e funzioni di una specifica applicazione

## Ruoli

- Ogni utente del sistema ha assegnato almeno un ruolo (STUDENTE, DOCENTE, STAGISTA, TUTOR-AZIENDALE, ....)
- I ruoli di un utente definiscono le autorizzazioni per le varie applicazioni e funzionalità
- Pertanto non tutti gli utenti vedranno esattamente la stessa interfaccia ed avranno un accesso regolato alle varie applicazioni
  
Facciamo alcuni esempi per meglio spiegare le ragioni di tale meccanismo:

1. Un utente con ruolo STUDENTE non può accedere alla sezione Utenti e pertanto non può aggiungere o rimuovere altri utenti. Al contrario un utente con ruolo ADMIN può creare nuovi utenti,  modificare quelli esistenti e rimuovere utenti non più necessari
2. Un utente con ruolo ADMIN e TUTOR-SCOLASTICO può creare una nuova convenzione PCTO con un azienda, mentre uno STUDENTE non può creare convenzioni
3. Uno STUDENTE può creare una presenza ad un PCTO (ore lavorate), ma non può approvarle per la contabilizzazione, mentre un TUTOR-SCOLASTICO ha pieni poteri sulle presenze di uno studente ad un PCTO

## Operazioni

Il funzionamento generale è il seguente:
- Per ogni entità (utente, azienda, stage, ...) è possibile effettuare 4 operazioni principali
  1. **VISUALIZZAZIONE**: mostra in formato tabellare le entità presenti a sistema
  2. **CREAZIONE**: l'utente può creare una nuova entità premendo il pulsante **Aggiungi** posizionato in alto a destra dello schermo
  3. **AGGIORNAMENTO**: ogni entità, visualizzata in tabella, presenta un'icona (una penna ed un foglio) che indica la possibilità di editare e quindi modificare un'entità già esistente
  4. **RIMOZIONE**: premendo l'icona del cestino è possibile rimuovere un'entita dal sistema. Tuttavia ciò non è sempre possibile, sopratutto nei casi in cui ci sono delle relazioni tra entità (es: non posso cancellare un utente, se ha dei PCTO associati, ...)

- Alcune applicazioni (es: convert to print) presentano un funzionamento ad hoc che si discosta dallo schema generale appena descritto
- SARP implementa un sistema di controllo degli accessi basato sul ruolo dell'utente.
- In altre parole ogni utente del sistema ha un ruolo specifico e può accedere solo una serie di pagine predeterminate
- Pertanto in alcuni casi è possibile che l'accesso ad una pagina sia rifiutato. 

**Ciò non necessariamente costituisce un errore.**
Se si ritiene di dover aver accesso alla pagina in questione, contattare gli amministratori in modo che possano fornire i permessi adeguati.


## Segnalazioni problemi

Il team di sviluppo ha predisposto un'apposita pagina per la segnalazione di:

- errori di funzionamento di SARP
- errori di funzionamento delle varie applicazioni (es: PCTO)
- generici suggerimenti sull'applicazione o un'aspetto specifico
- richiesta di modifiche delle funzionalità presenti
- richiesta di nuove funzionalità
- altre segnalazioni


Per riportare, al team di sviluppo, una segnalazione basta andare nella pagina **ticket** facendo click in basso a destra sulla scritta *Segnala un problema*

Basta compilare il semplice form predisposto indicando:
- L'ambito della segnalazione
  - SARP: segnalazione relativa all'intero ambiente SARP e non specifica per un'applicazione
  - PCTO: segnalazione relativa all'applicazione PCTO
- Il titolo della segnalazione
- La descrizione dettagliata della segnalazione
                                
