<script>
	import { page_pre_title, page_title, page_action_title, page_action_modal } from '$js/store';
	import Table from '$lib/components/common/table.svelte';
    import * as helper from '$js/helper';
    import { Logger } from '$js/logger';
    import { saveAs } from 'file-saver';
	import MessageBox from '$lib/components/common/message_box.svelte';

    let logger = new Logger("client");
    export let data; //contiene l'oggetto restituito dalla funzione load() eseguita nel back-end

	//configura la pagina pre-titolo, titolo e nome del modale
	$page_pre_title = 'PCTO';
	$page_title = 'Verifica Stato';
	$page_action_title = '';
	$page_action_modal = '';

    let nome = '', cognome = '';
    let found_nome = '', found_cognome = '';
    let show_error_mex = false;
    let user_found = false;
    let pctos = [];
    let tipo_utente = helper.user_tipo(data); 

    //se studente faccio la query solo per lui e rimuovo il form di input
    if(tipo_utente == "STUDENTE") {
        nome = data.session.login.nome;
        cognome = data.session.login.cognome;
        verifica_studente();
    }   

    function show_error_message() {
        setTimeout(() => {
                show_error_mex = false;
            }, 
        1500);

        return '';
    }

    async function stampa_report() {
        const res = await fetch(
            `/pcto/verifica_stato`, 
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(
                    {
                        student: `${found_cognome} ${found_nome}`,
                        pctos: pctos.slice(0, -2),
                        total_hrs: pctos.slice(-1)[0].ore_totali
                    }
                )
            }
        );
                
        if (res.ok) {
            let pdf_file = await res.json();
            const buffer = new Uint8Array(JSON.parse(pdf_file.file).data);
            var blob = new Blob([buffer], { type: 'application/msword' });
            saveAs(blob, pdf_file.nome_report);
            helper.mbox_show(
					'success',
					`Success`,
					'Report PCTO generato correttamente.',
					3000
            );
        } else {
            helper.mbox_show(
					'danger',
					`Errore`,
					'Non è stato possibile generare il report PCTO.',
					3000
            );
        }
    }

    async function verifica_studente() {
        cognome = cognome ? cognome[0].toUpperCase().concat(cognome.slice(1).toLowerCase()) : '';
        nome = nome ? nome[0].toUpperCase().concat(nome.slice(1).toLowerCase()) : '';
        
        const get_pcto_status = await fetch(`/pcto/verifica_stato?cognome=${cognome}&nome=${nome}`);
        let stato_pcto = await get_pcto_status.json();

        pctos = [];
        user_found = false;

        if(stato_pcto.length != 1) {
            show_error_mex = true;
            user_found = false;
        } else {
            let result = stato_pcto[0];
            pctos = build_table_row(result);
            found_cognome = result.cognome;
            found_nome = result.nome;
            nome = '';
            cognome = '';
            //questo è un hack necessario per far visualizzare 
            //la tabella correttamente e aggiornata
            setTimeout(() => user_found = true, 100);
        }
    }

    function formatDate(date) {
        let ymd = date.split('T')[0].split('-');
        return `${ymd[2]}/${ymd[1]}/${ymd[0]}`;
    }

    function build_table_row(pcto) {
        let pctos = [];
        let totale_ore_totali = 0;
        let totale_ore_approvate = 0;
        let totale_ore_contabilizzate = 0;
        
        //determina tutti i PCTO a cui lo studente è iscritto
        //e per ciascuno calcolo le ore
        pcto.iscritto.forEach(item => {
            let ore_totali = 0;
            let ore_approvate = 0;
            let ore_contabilizzate = 0;
            let obj = {};
 
            obj['id'] = item.id;
            obj['azienda'] = item.offertoDa.nome;
            obj['pcto'] = item.titolo;
            obj['dataInizio'] = formatDate(item.dataInizio);
            obj['dataFine'] = formatDate(item.dataFine);
           
            pcto
            .presente
            .filter(presenza => presenza.idPcto == item.id)
            .forEach(lavoro => {
                ore_totali += helper.ore_pcto(lavoro.oraInizio, lavoro.oraFine);
                ore_approvate += lavoro.approvato ? helper.ore_pcto(lavoro.oraInizio, lavoro.oraFine) : 0;
            });
            ore_contabilizzate += item.contabilizzato ? ore_approvate : 0; 

            obj['ore_totali'] = Math.round(ore_totali);
            obj['ore_approvate'] = Math.round(ore_approvate);
            obj['ore_contabilizzate'] = Math.round(ore_contabilizzate);
            pctos.push(obj);

            totale_ore_totali += Math.round(ore_totali);
            totale_ore_approvate += Math.round(ore_approvate);
            totale_ore_contabilizzate += Math.round(ore_contabilizzate);
        });

        pctos.push({
            id: -1,
            azienda: '',
            pcto: '',
            ore_totali: '',
            ore_approvate: '',
            ore_contabilizzate: ''
        },
        {
            id: -1,
            azienda: '',
            pcto: 'TOTALE',
            ore_totali: totale_ore_totali,
            ore_approvate: totale_ore_approvate,
            ore_contabilizzate: totale_ore_contabilizzate
        });
        return pctos;
    }
</script>

{#if show_error_mex}
    {show_error_message()}
    <div class="error-mex {show_error_mex ? '' : 'hidden'}">
        Prova ad essere più specifico nella ricerca
    </div>
{/if}

<!-- search bar -->
{#if tipo_utente != "STUDENTE"}
<div class="card">
    <div class="card-body">
        <div class="row">
            <div class="col-lg-2">
                <div class="mb-3">
                    <label class="form-label">Studente da verificare</label>
                    <input
                        type="text"
                        class="form-control"
                        name="cognome"
                        placeholder="Cognome"
                        bind:value={cognome}
                    />
                </div>
            </div>
            <div class="col-lg-2">
                <div class="mb-3">
                    <label class="form-label">&nbsp;</label>
                    <input
                        type="text"
                        class="form-control"
                        name="nome"
                        placeholder="Nome"
                        bind:value={nome}
                    />
                </div>
            </div>
            <div class="col-lg-2">
                <div class="mb-3">
                    <label class="form-label">&nbsp;</label>
                    <button class="btn btn-success ms-auto" on:click={verifica_studente} disabled={cognome.length == 0 && nome.length ==0}>
						<i class="ti ti-zoom-check icon" />
							<b>Verifica</b>
					</button>
                </div>
            </div>
        </div>
    </div>
</div>
{/if}

{#if user_found}
    <div class="info-header">
        <div>Stato PCTO per lo studente {found_cognome} {found_nome}</div>
        <div>
            <button class="btn btn-success" on:click={stampa_report}>
                <i class="ti ti-zoom-check icon" />
                    <b>Stampa Report</b>
            </button>
        </div>
    </div>

    <MessageBox />

    <Table
        columns={[
            { name: 'id', type: 'hidden', display: 'ID' },
            { name: 'azienda', type: 'string', display: 'Azienda', size: 30 },
            { name: 'pcto', type: 'string', display: 'PCTO', size: 30 },
            { name: 'ore_contabilizzate', type: 'number', display: 'ORE REGISTRATE', size: 10 },
            { name: 'ore_totali', type: 'number', display: 'ORE TOTALI', size: 10 }
        ]}
        rows={pctos}
        page_size={10}
        modal_name={$page_action_modal}
        on:update_start={() => {}}
        endpoint="pcto"
        footer="PCTO"
        actions={false}
        resource="pcto_verifica"
    />
{/if}

<style>
    .error-mex {
        text-align: center;
        font-size: 1.5rem;
        font-weight: bolder;
        color: red;
        margin-bottom: 2rem;
    }

    .hidden {
        display: none;
    }

    .info-header {
        margin-top: 2rem;
        margin-bottom: 0.5rem;
        font-size: 1.3rem;
        font-weight: bold;
        display: flex;
        align-items: center;
        gap: 2rem;
    }
</style>