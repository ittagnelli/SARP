### Intro 

- SARP è un'applicativo Web fruibile da un comune PC (per scelta non ha un'interfaccia mobile).
- Il sistema è pubblico pertanto accessibile ovunque da Internet.
- Per effettuare è necessario utilizzare il proprio account istituzionale, pertanto beneficiando degli alti livelli di sicurezza offerti da Google.

### Interfaccia Web

- L'interfaccia è suddivisa in due sezioni principali:
  1. **Barra delle applicazioni**: Una barra laterale sulla sinistra dello schermo che permette di accedere a tutte le applicazioni e funzionalità disponibili
  2. **Area principale**: La restante parte dello schermo è l'area principale di utilizzo delle varie applicazioni

### Barra delle applicazioni

- Contiene una serie di menu e sotto-menu
- I menu rappresentano le applicazioni o specifiche funzionalità
- I sotto-menu rappresentano le aree e funzioni di una specifica applicazione

### Ruoli

- Ogni utente del sistema ha assegnato almeno un ruolo (STUDENTE, DOCENTE, STAGISTA, TUTOR-AZIENDALE, ....)
- I ruoli di un utente definiscono le autorizzazioni per le varie applicazioni e funzionalità
- Pertanto non tutti gli utenti vedranno esattamente la stessa interfaccia ed avranno un accesso regolato alle varie applicazioni
  
Facciamo alcuni esempi per meglio spiegare le ragioni di tale meccanismo:

1. Un utente con ruolo STRUDENTE non può accedere alla sezione Utenti e pertanto non può aggiungere o rimuovere altri utenti. Al contrario un utente con ruolo ADMIN può creare nuovi utenti,  modificare quelli esistenti e rimuovere utenti non più necessari
2. Un utente con ruolo ADMIN e TUTOR-SCOLASTICO può creare una nuova convenzione PCTO con un azienda, mentre uno STUDENTE non può creare convenzioni
3. Uno STUDENTE può creare una presenza ad un PCTO (ore lavorate), ma non può approvarle per la contabilizzazione, mentre un TUTOR-SCOLASTICO ha pieni poteri sulle presenze di uno studente ad un PCTO

### Operazioni

Il funzionamento generale è il seguente:
- Per ogni entità (utente, azienda, stage, ...) è possibile effettuare 4 operazioni principali
  1. **VISUALIZZAZIONE**: mostra in formato tabellare le entità presenti a sistema
  2. **CREAZIONE**: l'utente può creare una nuova entità premendo il pulsante **Aggiungi** posizionato in alto a destra dello schermo
  3. **AGGIORNAMENTO**: ogni entità, visualizzata in tabella, presentra un'icona (una penna ed un foglio) che indica la possibilità di editare e quindi modificare un'entità già esistente
  4. **RIMOZIONE**: premendo l'icona del cestino è possibile rimuovere un'entita dal sistema. Tuttavia ciò non è sempre possibile, sopratutto nei casi in cui ci sono delle relazioni tra entità (es: non posso cancellare un utente, se ha dei PCTO associati, ...)

Alcune applicazioni (es: convert to print) presentazo un funzionamento ad hoc che si discosta dallo schema generale appena descritto
