<style>
    @import url(/css/doc-style.css);
</style>

# INTRODUZIONE

La sezione dedicata alla sicurezza sul lavoro è stata progettata per consentire ai docenti responsabili di gestire corsi e test sulla sicurezza, e per permettere agli studenti di visualizzarli.

## FUNZIONI

La sezione dedicata alla **Sicurezza sul Lavoro** è composta da due funzioni e viste principali:

1. **Corsi Sicurezza**: permette di creare a sistema un nuovo corso sulla sicurezza. Sono richiesti (anche se opzionali) i dati necessari per la creazione di un nuovo corso. I corsi possono essere manipolati solo dagli ADMIN e dai docenti responsabili
2. **Test Sicurezza**: Permette di creare uno o più test per ogni corso presente a sistema. Informazioni fondamentali sono il tutor aziendale e quello scolastico. I test possono essere manipolati solo dagli ADMIN e dai docenti responsabili

## CORSI SICUREZZA - VISTA PRINCIPALE

La schermata principale della sezione *CORSI SICUREZZA* mostra una tabella, con varie colonne, contenente la lista di tutti i corsi presenti sul sistema.
La tabella viene aggiornata automaticamente in caso di aggiunta, modifica o rimozione di uno o più corsi.

![Sicurezza_Corsi_tabella](/img/documentazione/sicurezza_lavoro/sicurezzaLavoro_corsi_01.png#img-doc)

Descriviamo ora le colonne di questa tabella:
- **TITOLO**: titolo del corso
- **TIPO**: tipologia di corso
- **INIZIO**: data inizio corso
- **FINE**: data fine corso
- **TEST**: data di svolgimento del test
- **SOMMINISTRATO**: indica se il test è stato somministrato
- **AZIONI**: azioni che è possibile svolgere su ogni singolo corso
  - **Stampa attestato del corso**: scarica attestato (in formato docx) del corso
  - **Aggiorna corso**: entra nella  modalità aggiornamento delle informazioni di un corso
  - **Somministra test agli studenti**: somministra il test del corso agli studenti
  - **Stampa modulo presenze**: stampa il modulo delle presenze per il corso
  - **Rimuovi corso**: rimuove un corso dal sistema

## CREAZIONE E AGGIORNAMENTO DI UN CORSO

Per aggiungere un nuovo corso è necessario premere il pulsante <span class="button blue">+ Aggiungi corso</span> presente in alto a destra dello schermo. 

Dopo aver premuto il pulsante apparirà un form (o maschera) di inserimento dati. Lo stesso form dati apparirà anche se si preme l'icona di *Aggiorna corso*.
Analizziamo ora il form dati in dettaglio

![Sicurezza_Corsi_tabella](/img/documentazione/sicurezza_lavoro/sicurezzaLavoro_corsi_02.png#img-doc)

In figura tutti i campi presenti nel form. Come si nota sono presenti tutti i campi visibili nella tabella iniziale, ma sono anche presenti altri campi. I campi con il <span class="bold-red">bordo rosso</span> rappresentano i campi **OBBLIGATORI**.

Ove possibile, i campi presentano un esempio di compilazione, rappresentato in grigio chiaro. Quest'informazione serve come linea guida sulla compilazione del singolo campo e specifica anche l'eventuale formato del campo che va rispettato.

Una volta terminato l'inserimento di tutti i campi obbligatori e di altri campi facoltativi premendo il pulsante <span class="button green">+ Crea Corso</span> verrà inviata la richiesta di creazione di un nuovo corso.
Se non ci sono errori, il form dati si chiuderà e la tabella sarà automaticamente aggiornata e includerà il nuovo corso.

Se al contrario l'utente preme il pulsante <span class="button red">Cancel</span>, il form viene chiuso, NON viene inviata la richiesta di creazione o aggiornamento di un nuovo corso e la tabella non viene aggiornata.
