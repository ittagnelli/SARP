<style>
    @import url(/css/doc-style.css);
</style>

# INTRODUZIONE

SARP dispone di una applicazione dedicata ai PCTO.
La sezione *PCTO*, è principalmente dedicata a Tutor Scolastici, tutor aziendali e studenti.

## FUNZIONI

L'applicazione dedicata ai **PCTO** è composta da quattro funzioni e viste principali:

1. **Aziende**: permette di creare a sistema una nuova azienda (o convenzione). Sono richiesti (anche se opzionali) tutti i principali dati necessari per stipulare la convenzione con una data azienda. Le aziende possono essere manipolate solo dagli ADMIN e dai TUTOR SCOLASTICI
2. **Stage**: Permette di creare uno o più **stage** (PCTO) per ogni azienda presente a sistema. Informazioni fondamentali sono il tutor aziendale e quello scolastico. Gli stage possono essere manipolate solo dagli ADMIN e dai TUTOR
3. **Presenze**: permette la creazione di una presenza per un dato studente sche sta svolgendo un dato stage per una specifica azienda. Le presenze possiedono uno stato di validazione che può essere confermato solo da ADMIN e TUTOR. La presenza può essere creata anche dallo STUDENTE. Ciò rende il processo di tracciamento delle ore snello e distribuito.
4. **Valutazioni**: Permette di creare una valutazione di un PCTO da parte di uno studente

## AZIENDE - VISTA PRINCIPALE

La schermata principale della sezione *AZIENDE* mostra una tabella, con varie colonne, contenente la lista di tutte le aziende presenti sul sistema.
La tabella viene aggiornata automaticamente in caso di aggiunta, modifica o rimozione di una o più aziende.

![PCTO_Aziende_tabella](/img/documentazione/pcto/pcto_aziende_01.png)

Descriviamo ora le colonne di questa tabella:
- **NO.**: numero convenzione
- **AZIENDA/ENTE**: nome dell'azienda
- **INDIRIZZO**: indirizzo dell'azienda
- **PIVA**: partita iva dell'azienda
  - **TELEFONO**: numero di telefono dell'azienda
  - **LEGALE RAPPRESENTANTE**: legale rappresentante dell'azienda
  - **DATA CONVENZIONE**: data della stipula della convenzione con l'azienda
  - **DATA PROTOCOLLO**: data di registrazione dell'azienda nel sistema
- **ISTITUTO**: indica per quale istituto è indirizzata la convenzione
- **DOCUMENTAZIONE**: indica se la documentazione è completa e firmata
- **AZIONI**: azioni che è possibile svolgere su ogni singola azienda
  - **Stampa documento convenzione**: scarica documento (in formato docx) della convenzione con l'azienda
  - **Aggiorna convenzione**: entra nella  modalità aggiornamento delle informazioni di una azienda
  - **Rimuovi convenzione**: rimuove una azienda dal sistema

## AGGIUNTA DI UNA AZIENDA E AGGIORNAMENTO CONVENZIONE

Per aggiungere una nuova azienda è necessario premere il pulsante <span class="button blue">+ Aggiungi Azienda</span> presente in alto a destro dello schermo. 

Dopo aver premuto il pulsante apparirà un form (o maschera) di inserimento dati. Lo stesso form dati apparirà anche se si preme l'icona di *Aggiorna convenzione*.
Analizziamo ora il form dati in dettaglio

![Utenti_form](/img/documentazione/pcto/pcto_aziende_02.png)

In figura tutti i campi presenti nel form. Come si nota sono presenti tutti i campi visibili nella tabella iniziale, ma sono anche presenti altri campi. I campi con il <span class="bold-red">bordo rosso</span> rappresentano i campi **OBBLIGATORI**.

Ove possibile, i campi presentano un esempio di compilazione, rappresentato in grigio chiaro. Quest'informazione serve come linea guida sulla compilazione del singolo campo e specifica anche l'eventuale formato del campo che va rispettato.

Una volta terminato l'inserimento di tutti i campi obbligatori e di altri campi facoltativi premendo il pulsante <span class="button green">+ Crea Azienda</span> verrà inviata la richiesta di creazione di una nuova azienda.
Se non ci sono errori, il form dati si chiuderà e la tabella sarà automaticamente aggiornata e includerà la nuova azienda.

Se al contrario l'utente preme il pulsante <span class="button red">Cancel</span>, il form viene chiuso, NON viene inviata la richiesta di creazione o aggiornamento di una nuova azienda e la tabella non viene aggiornata.

## STAGE - VISTA PRINCIPALE

La schermata principale della sezione *STAGE* mostra una tabella, con varie colonne, contenente la lista di tutti gli stage presenti sul sistema.
La tabella viene aggiornata automaticamente in caso di aggiunta, modifica o rimozione di uno o più stage.

![PCTO_Stage_tabella](/img/documentazione/pcto/pcto_stage_01.png)

Descriviamo ora le colonne di questa tabella:
- **TITOLO**: nome dello stage
- **DESCRIZIONE**: descrizione dello stage
- **AZIENDA**: nome dell'azienda
- **CLASSE**: indica per quale classe è indicato lo stage
  - **A.S.**: anno scolastico di inserimento dello stage nel sistema
  - **TUTOR SCOLASTICO**: tutor responsabile dello stage
  - **ORE**: indica la durata dello stage (in ore)
  - **INIZIO**: indica la data di inizio dello stage
- **FINE**: indica la data di fine dello stage
- **SIDI**: indica se lo stage è registrato in SIDI
- **DOC**: indica se la documentazione è completa e firmata
- **AZIONI**: azioni che è possibile svolgere su ogni singola azienda
  - **Stampa convenzione per tutti gli studenti**: scarica documento (in formato docx) della convenzione per lo stage per ogni studente
  - **Aggiorna stage**: entra nella  modalità aggiornamento delle informazioni di uno stage
  - **Visualizza stato studenti**: entra nella modalità visualizzazione dello stato degli studenti impiegati nello stage
  - **Rimuovi stage**: rimuove uno stage dal sistema

## AGGIUNTA E AGGIORNAMENTO DI UNO STAGE

Per aggiungere un nuovo stage è necessario premere il pulsante <span class="button blue">+ Aggiungi stage</span> presente in alto a destro dello schermo. 

Dopo aver premuto il pulsante apparirà un form (o maschera) di inserimento dati. Lo stesso form dati apparirà anche se si preme l'icona di *Aggiorna stage*.
Analizziamo ora il form dati in dettaglio

![Utenti_form](/img/documentazione/pcto/pcto_stage_02.png)

In figura tutti i campi presenti nel form. Come si nota sono presenti tutti i campi visibili nella tabella iniziale, ma sono anche presenti altri campi. I campi con il <span class="bold-red">bordo rosso</span> rappresentano i campi **OBBLIGATORI**.

Ove possibile, i campi presentano un esempio di compilazione, rappresentato in grigio chiaro. Quest'informazione serve come linea guida sulla compilazione del singolo campo e specifica anche l'eventuale formato del campo che va rispettato.

Una volta terminato l'inserimento di tutti i campi obbligatori e di altri campi facoltativi premendo il pulsante <span class="button green">+ Crea Stage</span> verrà inviata la richiesta di creazione di un nuovo stage.
Se non ci sono errori, il form dati si chiuderà e la tabella sarà automaticamente aggiornata e includerà il nuovo stage.

Se al contrario l'utente preme il pulsante <span class="button red">Cancel</span>, il form viene chiuso, NON viene inviata la richiesta di creazione o aggiornamento di un nuovo stage e la tabella non viene aggiornata.

## PRESENZE - VISTA PRINCIPALE

Il tutor aziendale è incaricato di registrare le ore di attività in azienda di ogni studente

Quest'operazione può essere svolta facilmente e velocemente tramite il portale SARP dell'Istituto Agnelli

Dopo aver effettuato il login con le credenziali fornite dalla scuola, per registrare le ore si possono seguire i seguenti passi:

## 1- Accesso alla sezione Presenze

- Dalla Home Page, scegliere il menu `PCTO` sulla sinistra, come indicato in figura

![image info](/img/documentazione/pcto/pcto_presenze_01.png)

- Ora scegliere il sotto menu `Presenze`
  
![image info](/img/documentazione/pcto/pcto_presenze_02.png)

- A questo punto apparirà la propria sezione presenze (che inizialmente è vuota)

![image info](/img/documentazione/pcto/pcto_presenze_03.png)

## 2- Aggiungere una o più presenza

- Premere il pulsante in alto a destra (**Aggiungi Presenza**)

![image info](/img/documentazione/pcto/pcto_presenze_04.png)

- A questo punto verrà visualizzato un form di inserimento dati

![image info](/img/documentazione/pcto/pcto_presenze_05.png)

- Selezionare nella sezione PCTO, il PCTO o stage per cui si vogliono riportare le ore
- Una volta scelto il PCTO, apparirà la lista degli studenti per i quali si ovogliono registrare delle ore

![image info](/img/documentazione/pcto/pcto_presenze_06.png)

- Da questa tendina sarà possibile selezionare un singolo studente oppure TUTTI GLI STUDENTI per i quali reistrare una presenza
- Scegliendo *TUTTI GLI STUDENTI* le ore saranno registrare automaticamente per tutti gli studenti che partecipano al PCTO


- Ora selezionare la data per cui si vuole registrare la presenza (per default la data è impostata sul giorno corrente)

![image info](/img/documentazione/pcto/pcto_presenze_07.png)

- Ora indichiamo l'ora di ingresso e l'ora di uscita come illustrato in figura
- Successivamente premiamo il pulsante **Crea Presenza**

![image info](/img/documentazione/pcto/pcto_presenze_08.png)

- Le presenze saranno correttamente registrate e visualizzate


![image info](/img/documentazione/pcto/pcto_presenze_09.png)

## 3- Aggiornare una presenza

- In caso sia necessario aggiornare una presenza 
- Premere l'icona *edit* alla destra della presenza che si vuole aggionare

![image info](/img/documentazione/pcto/pcto_presenze_10.png)

- Apparirà il form di inserimento pre-compilato
- Ora aggiornare uno o più campi come necessario
- Premre il pulsante **Aggiorna Presenza** come in figura

![image info](/img/documentazione/pcto/pcto_presenze_11.png)

- La presenza sarà ora correttamente modificata

![image info](/img/documentazione/pcto/pcto_presenze_12.png)


## 4- Cancellare una presenza

- In caso sia necessario rimuovere una presenza 
- Premere l'icona *trash* alla destra della presenza che si vuole aggionare

![image info](/img/documentazione/pcto/pcto_presenze_13.png)

- Apparirà una richiesta di conferma

![image info](/img/documentazione/pcto/pcto_presenze_14.png)

- Confermando tramite la pressione del pulsante *Rimuovi*
- La presenza verrà effettivamente rimossa

![image info](/img/documentazione/pcto/pcto_presenze_15.png)
