<script>
	import { page_pre_title, page_title, page_action_title, page_action_modal } from '../../js/store';
	import Table from '$lib/components/common/table.svelte';
    import InputDate from '$lib/components/modal/input_date.svelte';
    import InputTime from '$lib/components/modal/input_time.svelte';
    import InputText from '$lib/components/modal/input_text.svelte';
    import * as helper from '../../js/helper';
    import * as yup from 'yup';
    import { Logger } from '../../js/logger';
    import { onMount } from 'svelte';

    let logger = new Logger("client");
	// export let data; //contiene l'oggetto restituito dalla funzione load() eseguita nel back-end
    // export let form;
    // let error_message;
    // let show_error_mex = false;

	// let presenze = helper.data2arr(data.presenze);
    // aggiungo il full name per ogni presenza per poi stamparlo nella tabella
    // presenze.forEach((item, idx) => presenze[idx].presenza['full_name'] = (presenze[idx].presenza['cognome']).concat(" ", presenze[idx].presenza['nome']));
    
    // let pcto = helper.data2arr(data.stages);
    // let pcto_studenti = [];
    // let tipo_utente = helper.user_tipo(data); 
    // let totale_ore_pcto = 0;

    // $: {
    //     let selected_stage = pcto.filter((item) => item.id == form_values.stage);
    //     if(selected_stage[0]) {
    //         if (helper.user_ruolo(data) != 'STUDENTE')
    //             pcto_studenti = selected_stage[0].svoltoDa;
    //         else
    //             pcto_studenti = selected_stage[0].svoltoDa.filter(item => item.id == helper.user_id(data));
    //     }
    // }

	//configura la pagina pre-titolo, titolo e nome del modale
	$page_pre_title = 'PCTO';
	$page_title = 'Verifica Stato';
	$page_action_title = '';
	$page_action_modal = '';
	// let modal_action = 'create';

    // let modal_form; // entry point del form nel modale
	// let errors = {}; //traccia gli errori di validazione del form

    // campi del form
	// quest'oggetto deve contenere tutti i valori presenti nel form per
	// le operazione di create e update
	// let form_values = {
	// 	presenza_id: 0,
	// 	stage: 0,
	// 	studente: -1,
    //     dataPresenza: helper.convert_date(new Date()),
    //     oraInizio: '',
    //     oraFine: '',
    //     approvato_select: 'NO',
	// };

	// schema di validazione del form
	// const form_schema = yup.object().shape({
    //     stage: yup
	// 	.number()
	// 	.min(1, 'PCTO necessario'),

    //     studente: yup
	// 	.number()
	// 	.min(0, 'Studente necessario'),

    //     dataPresenza: yup
	// 	.string()
	// 	.length(10, "Data necessaria"),

    //     oraInizio: yup
	// 	.string()
	// 	.length(5, "Orario necessario")
	// 	.test("minore", "L'orario d'entrata deve essere precedente a quello d'uscita", (value, textContext) => {
	// 		return helper.diff_time(value, textContext.parent.oraFine);
	// 	}),

	// 	oraFine: yup
	// 	.string()
	// 	.length(5, "Orario necessario")
	// 	.test("maggiore", "L'orario d'uscita deve essere successivo a quello d'entrata", (value, textContext) => {
	// 		return helper.diff_time(textContext.parent.oraInizio, value);
	// 	}),
	// });

	// async function start_update(e) {
	// 	modal_action = 'update';

    //     form_values.presenza_id = e.detail.id;
	// 	//cerca l'azienda da fare update
	// 	let presenza = presenze.filter((item) => item.id == form_values.presenza_id)[0];
		
    //     form_values.stage =  presenza.idPcto;
    //     form_values.studente = presenza.svoltoDa;
    //     form_values.dataPresenza = helper.convert_date(presenza.dataPresenza);
    //     form_values.oraInizio = presenza.oraInizio.toTimeString().substring(0,5);
    //     form_values.oraFine = presenza.oraFine ? presenza.oraFine.toTimeString().substring(0,5) : '';
    //     form_values.approvato_select = presenza.approvato ? 'SI' : 'NO';
	// }

    // async function handleSubmit() {
	// 	try {
	// 		// valida il form prima del submit
	// 		await form_schema.validate(form_values, { abortEarly: false });
	// 		errors = {};
    //         if (form_values.studente == 0 && modal_action == 'create') //TUTTI GLI STUDENTI
    //             modal_form.action = "?/bulk_create"; //cambia action per fare insert bulk
	// 		modal_form.submit();
	// 	} catch (err) {
	// 		errors = err.inner.reduce((acc, err) => {
	// 			return { ...acc, [err.path]: err.message };
	// 		}, {});
	// 		logger.error(`Errori nella validazione del form presenze. Oggetto: ${JSON.stringify(form_values)} -- Errore: ${JSON.stringify(errors)}`);
	// 	}
	// }

	// async function cancel_action(){
	// 	if(modal_action == 'update'){
	// 		await helper.wait_fade_finish();
	// 		modal_action = "create";	// Reset string
	// 		form_values = {	// Reset form
	// 			presenza_id: 0,
	// 			stage: 0,
	// 			studente: -1,
	// 			dataPresenza: helper.convert_date(new Date()),
	// 			oraInizio: '',
	// 			oraFine: '',
	// 			approvato_select: 'NO',
	// 		};
	// 	}
	// }

    // function show_error_message() {
    //     error_message = form.message;
    //     show_error_mex = true;
    //     setTimeout(() => show_error_mex = false, 3000);

    //     return '';
    // }

    onMount(async () => {
        // per STUDENTE calcolo le ore complessive di PCTO solo per ore approvate e PCTO contabilizzati
        // if(tipo_utente == "STUDENTE") {
        //     presenze.map(presenza => {
        //         if(presenza.approvato && presenza.lavoraPer.contabilizzato)
        //             totale_ore_pcto += helper.ore_pcto(presenza.oraInizio, presenza.oraFine);    
        //     });
        // }
	});

    let nome = '', cognome = '';
    let show_error_mex = false;
    let user_found = false;

    function show_error_message() {
        setTimeout(() => {
                show_error_mex = false;
                cognome = nome = ''; 
            }, 
        1500);

        return '';
    }

    async function verifica_studente() {
        console.log("VERIFICA STUDENTE CLICK:",cognome, nome);
        const get_pcto_status = await fetch(`/verifica_stato?cognome=${cognome}&nome=${nome}`);
        let stato_pcto = await get_pcto_status.json();

        if(stato_pcto.length == 0) {
            show_error_mex = true;
            user_found = false;
        } else {
            user_found = true;
            cognome = nome = ''; 
        }
            

        console.log("GET RESPONSE:", stato_pcto);
    }
</script>

{#if show_error_mex}
    {show_error_message()}
    <div class="error-mex {show_error_mex ? '' : 'hidden'}">
        L'utente {cognome} {nome} non è presente nel sistema
    </div>
{/if}

<!-- search bar -->
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
                    <button class="btn btn-success ms-auto" on:click={verifica_studente} disabled={cognome.length == 0 || nome.length ==0}>
						<i class="ti ti-zoom-check icon" />
							<b>Verifica</b>
					</button>
                </div>
            </div>
        </div>
    </div>
</div>

{#if user_found}
    <h1>UTENTE TROVATO</h1>
{/if}

<!-- <Table
	columns={[
		{ name: 'id', type: 'hidden', display: 'ID' },
        { name: 'creatoDa', type: 'hidden', display: 'creatoDa' },
        { name: 'lavoraPer', type: 'object', key: 'titolo', display: 'pcto', size: 30 },
        { name: 'presenza', type: 'object', key: 'full_name', display: 'studente', size: 30 },
        { name: 'dataPresenza', type: 'date', display: 'data' },
        { name: 'oraInizio', type: 'time', display: 'entrata' },
        { name: 'oraFine', type: 'time', display: 'uscita' },
        { name: 'approvato', type: 'boolean', display: 'approvato'}
	]}
	rows={presenze}
	page_size={10}
	modal_name={$page_action_modal}
	on:update_start={start_update}
	endpoint="presenze"
    footer="Presenze"
    actions={true}
    resource="pcto_presenze"
/> -->


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
</style>