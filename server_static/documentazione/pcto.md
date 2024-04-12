<style>
    @import url(/css/doc-style.css);
</style>

# INTRODUZIONE

SARP dispone di una applicazione dedicata ai PCTO.
La sezione *PCTO*, indirizzata principalmente agli amministratori di SARP e permette la gestione completa dei PCTO.

## FUNZIONI

L'applicazione dedicata ai **PCTO** è composta da quattro funzioni e viste principali:

1. **Aziende**: permette di creare a sistema una nuova azienda (o convenzione). Sono richiesti (anche se opzionali) tutti i principali dati necessari per stipulare la convenzione con una data azienda. Le aziende possono essere manipolate solo dagli ADMIN e dai TUTOR
2. **Stage**: Permette di creare uno o più *stage** (PCTO) per ogni azienda presente a sistema. Informazioni fondamentali sono il tutor aziendale e quello scolastico. Gli stage possono essere manipolate solo dagli ADMIN e dai TUTOR
3. **Presenze**: permette la creazione di una presenza per un dato studente sche sta svolgendo un dato stage per una specifica azienda. Le presenze possiedono uno stato di validazione che può essere confermato solo da ADMIN e TUTOR. La presenza può essere creata anche dallo STUDENTE. Ciò rende il processo di tracciamento delle ore snello e distribuito.
4. **Valutazioni**: Permette di creare una valutazione di un PCTO da parte di uno studente

## AZIENDE - VISTA PRINCIPALE

La schermata principale della sezione *AZIENDE* mostra una tabella, con varie colonne, contenente la lista di tutte le aziende presenti sul sistema.
La tabella viene aggiornata automaticamente in caso di aggiunta, modifica o rimozione di una o più aziende.

![PCTO_Aziende_tabella](/img/documentazione/pcto/pcto_aziende_01.png)

Descriviamo ora le colonne di questa tabella:
- **NO.**: numero dell'azienda
- **AZIENDA/ENTE**: nome dell'azienda
- **INDIRIZZO**: indirizzo dell'azienda
- **PIVA**: partita iva dell'azienda
  - **TELEFONO**: numero di telefono dell'azienda
  - **LEGALE RAPPRESENTANTE**: legale rappresentante dell'azienda
  - **DATA CONVENZIONE**: data della stipula della convenzione con l'azienda
  - **DATA PROTOCOLLO**: data di registrazione dell'azienda nel sistema
- **ISTITUTO**: indica per quale istituto è indirizzato il pcto
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
