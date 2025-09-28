<style>
    @import url(/css/doc-style.css);
</style>

# INTRODUZIONE

<!-- ![Utenti](/img/documentazione/utenti/utenti__01.png) -->

SARP è un sistema **multi-utente** e **multi-ruolo**. 
Ciò significa che per accedere a SARP è necessario essere preventivamente registrati sul sistema.

La sezione *UTENTI*, indirizzata principalmente agli amministratori di SARP e permette la gestione completa (creazione, aggiornamento e rimozione) degli utenti del sistema.

## VISTA PRINCIPALE

La schermata principale della sezione *UTENTI* mostra una tabella, con varie colonne, contenente la lista di tutti gli utenti presenti sul sistema.
La tabella viene aggiornata automaticamente in caso di aggiunta, modifica o rimozione di uno o più utenti.

![Utenti_tabella](/img/documentazione/utenti/utenti_01.png#img-doc)

Descriviamo ora le colonne di questa tabella:
- **COGNOME**: cognome dell'utente
- **NOME**: nome dell'utente
- **NATO IL**: data di nascita dell'utente
- **TIPO**: tipo di utente utile per classificare gli utenti del sistema ma non ha impatto sulle funzionalità
  - **OSPITE**: utente non appartenenti all'Istituto Agnelli ma comunque presente sul sistema e dotato di un email @istitutoagnelli.it
  - **AMMINISTRATIVO**: personale amministrativo
  - **DOCENTE**: personale docente
  - **STUDENTE**: studenti della scuola
- **CLASSE**: Per gli studenti rappresenta la classe di appartenenza per l'anno scolastico in corso (2023)
- **RUOLO**: Ogni utente deve aver assegnato almeno un ruolo utente. Più ruoli sono possibile per un utente
  - **TUTOR-BES**: Responsabile per le attività BES 
  - **TUTOR-CLASSE**: Docente Tutor o coordinatore di classe
  - **TUTOR-SICUREZZA**: Responsabile per le attività dei corsi di sicurezza sul lavoro
  - **STAGISTA**: studente stagista di un PCTO
  - **TUTOR-SCOLASTICO**: Docente tutor scolastico per uno o più studenti in uno o più attività di PCTO
  - **TUTOR-AZIENDALE**: Personale dell'azienda ospitante il PCTO che è tutor di uno o più studenti
  - **UTENTE**: un generico utente del sistema
  - **DOCENTE**: Docenti della scuola
  - **STUDENTE**: Studente della scuola correntemente iscritto o iscritto nel passato
  - **ADMIN**: Amministratori del sistema
  - **DEVELOPER**: Sviluppatori del sistema
- **EMAIL**: email istituzionale
- **PDP**: flag valido solo per gli studenti ed indica se lo studente ha diritto ad un PDP (flag verde) oppure no (flag rosso)
- **OBIETTIVI MINIMI**: flag valido solo per gli studenti che hanno diritto al PDP ed indica se ha diritto agli obiettivi minimi
- **CAN LOGIN**: indica se l'utente può entrare nel sistema oppure no (gli studenti diplomati NON possono più accedere al sistema)
- **AZIONI**: azioni che è possibile svolgere su ogni singolo utente
  - **Aggiorna anagrafica utente**: entra nella  modalità aggiornamento delle informazioni di un utente
  - **Aggiungi PDP**: imposta lo studente come BES e permette di creare il PDP corrispondente 
  - **Rimuovi anagrafica utente**: rimuove un utente dal sistema (non è sempre possibile, es se un utente fa parte di una classe)

## CREAZIONE E AGGIORNAMENTO ANAGRAFICA UTENTE

Per aggiungere un nuovo utente è necessario premere il pulsante <span class="button blue">+ Aggiungi Utente</span> presente in alto a destro dello schermo. 

Dopo aver premuto il pulsante apparirà un form (o maschera) di inserimento dati.Lo stesso form dati apparirà anche se si preme l'icona di *Aggiorna anagrafica utente*.
Analizziamo ora il form dati in dettaglio

![Utenti_form](/img/documentazione/utenti/utenti_02.png#img-doc)

In figura tutti i campi presenti nel form. Come si nota sono presenti tutti i campi visibili nella tabella iniziale, ma sono anche presenti altri campi. I campi con il <span class="bold-red">bordo rosso</span> rappresentano i campi **OBBLIGATORI**.

Ove possibile, i campi presentano un esempio di compilazione, rappresentato in grigio chiaro. Quest'informazione serve come linea guida sulla compilazione del singolo campo e specifica anche l'eventuale formato del campo che va rispettato.

Una volta terminato l'inserimento di tutti i campi obbligatori e di altri campi facoltativi premendo il pulsante <span class="button green">+ Crea Utente</span> verrà inviata la richiesta di creazione dei un nuovo utente.
Se non ci sono errori, il form dati si chiuderà e la tabella sarà automaticamente aggiornata e includerà il nuovo utente.

Se al contrario l'utente preme il pulsante <span class="button red">Cancel</span>, il form viene chiuso, NON viene inviata la richiesta di creazione o aggiornamento di un nuovo utente e la tabella non viene aggiornata.



