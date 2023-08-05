<script>
	import { page_pre_title, page_title, page_action_title, page_action_modal } from '$js/store';
	import Table from '$lib/components/common/table.svelte';
    import InputDate from '$lib/components/modal/input_date.svelte';
    import InputTime from '$lib/components/modal/input_time.svelte';
    import * as helper from '$js/helper';
    import * as yup from 'yup';
    import { Logger } from '$js/logger';
    import { onMount } from 'svelte';

    let logger = new Logger("client");
	export let data; //contiene l'oggetto restituito dalla funzione load() eseguita nel back-end
    export let form;
    let error_message;
    let show_error_mex = false;

	let presenze = helper.data2arr(data.presenze);
    let show_actions = true;
    // aggiungo il full name per ogni presenza per poi stamparlo nella tabella
    // presenze.forEach((item, idx) => presenze[idx].presenza['full_name'] = (presenze[idx].presenza['cognome']).concat(" ", presenze[idx].presenza['nome']));
    presenze.forEach((item, idx) => {
        presenze[idx].presenza['full_name'] = (presenze[idx].presenza['cognome']).concat(" ", presenze[idx].presenza['nome']);
        presenze[idx]['ore'] = helper.ore_pcto(presenze[idx].oraInizio, presenze[idx].oraFine);
        presenze[idx]['azienda'] = presenze[idx]['lavoraPer']['offertoDa']['nome'];
    });
    
    let pcto_studenti = [];
    let tipo_utente = helper.user_tipo(data); 
    let id_utente = helper.user_id(data);
    let totale_ore_pcto = {totali: 0, approvate: 0, registrate: 0};
    let pcto = helper.data2arr(data.stages);

    //se tutor aziendale filtro i PCTO
    //se ADMIN faccio vedere tutti i PCTO 
    if(helper.is_tutor(data) && !helper.is_admin(data))
        pcto = [...pcto.filter(stage => (stage.idTutor == id_utente || stage.tutor_aziendale == helper.user_name(data)) && stage.contabilizzato == false)];
    
    $: {
        let selected_stage = pcto.filter((item) => item.id == form_values.stage);
        if(selected_stage[0]) {
            if (helper.user_ruolo(data) != 'STUDENTE')
                pcto_studenti = selected_stage[0].svoltoDa;
            else
                pcto_studenti = selected_stage[0].svoltoDa.filter(item => item.id == id_utente);
        }
    }

	//configura la pagina pre-titolo, titolo e nome del modale
	$page_pre_title = 'PCTO';
	$page_title = 'Presenze';
	$page_action_title = 'Aggiungi Presenza';
	$page_action_modal = 'modal-add-presenze';
	let modal_action = 'create';

    if(tipo_utente == "STUDENTE") {
        $page_action_title = '';
	    $page_action_modal = '';
        show_actions = false;
    }

    let modal_form; // entry point del form nel modale
	let errors = {}; //traccia gli errori di validazione del form

    // campi del form
	// quest'oggetto deve contenere tutti i valori presenti nel form per
	// le operazione di create e update
	let form_values = {
		presenza_id: 0,
		stage: 0,
		studente: -1,
        dataPresenza: helper.convert_date(new Date()),
        oraInizio: '',
        oraFine: '',
        approvato_select: 'NO',
	};

	// schema di validazione del form
	const form_schema = yup.object().shape({
        stage: yup
		.number()
		.min(1, 'PCTO necessario'),

        studente: yup
		.number()
		.min(0, 'Studente necessario'),

        dataPresenza: yup
		.string()
		.length(10, "Data necessaria"),

        oraInizio: yup
		.string()
		.length(5, "Orario necessario")
		.test("minore", "L'orario d'entrata deve essere precedente a quello d'uscita", (value, textContext) => {
			return helper.diff_time(value, textContext.parent.oraFine);
		}),

		oraFine: yup
		.string()
		.length(5, "Orario necessario")
		.test("maggiore", "L'orario d'uscita deve essere successivo a quello d'entrata", (value, textContext) => {
			return helper.diff_time(textContext.parent.oraInizio, value);
		}),
	});

	async function start_update(e) {
		modal_action = 'update';

        form_values.presenza_id = e.detail.id;
		//cerca l'azienda da fare update
		let presenza = presenze.filter((item) => item.id == form_values.presenza_id)[0];
		
        form_values.stage =  presenza.idPcto;
        form_values.studente = presenza.svoltoDa;
        form_values.dataPresenza = helper.convert_date(presenza.dataPresenza);
        form_values.oraInizio = presenza.oraInizio.toTimeString().substring(0,5);
        form_values.oraFine = presenza.oraFine ? presenza.oraFine.toTimeString().substring(0,5) : '';
        form_values.approvato_select = presenza.approvato ? 'SI' : 'NO';
	}

    async function handleSubmit() {
		try {
			// valida il form prima del submit
			await form_schema.validate(form_values, { abortEarly: false });
			errors = {};
            if (form_values.studente == 0 && modal_action == 'create') //TUTTI GLI STUDENTI
                modal_form.action = "?/bulk_create"; //cambia action per fare insert bulk
			modal_form.submit();
		} catch (err) {
			errors = err.inner.reduce((acc, err) => {
				return { ...acc, [err.path]: err.message };
			}, {});
			logger.error(`Errori nella validazione del form presenze. Oggetto: ${JSON.stringify(form_values)} -- Errore: ${JSON.stringify(errors)}`);
		}
	}

	async function cancel_action(){
		if(modal_action == 'update'){
			await helper.wait_fade_finish(150);
			modal_action = "create";	// Reset string
			form_values = {	// Reset form
				presenza_id: 0,
				stage: 0,
				studente: -1,
				dataPresenza: helper.convert_date(new Date()),
				oraInizio: '',
				oraFine: '',
				approvato_select: 'NO',
			};
		}
	}
    function show_error_message() {
        error_message = form.message;
        show_error_mex = true;
        setTimeout(() => show_error_mex = false, 3000);

        return '';
    }

    onMount(async () => {
        // per STUDENTE calcolo le ore complessive di PCTO solo per ore approvate e PCTO contabilizzati
        if(tipo_utente == "STUDENTE") {
            presenze.map(presenza => {
                let lavorato = helper.ore_pcto(presenza.oraInizio, presenza.oraFine);
                totale_ore_pcto.totali += lavorato;
                if(presenza.approvato) totale_ore_pcto.approvate += lavorato;
                if(presenza.approvato && presenza.lavoraPer.contabilizzato)
                    totale_ore_pcto.registrate += lavorato;    
            });
        }
	});

</script>

{#if form && form.message.length > 0}
    {show_error_message()}
    <div class="error-mex {show_error_mex ? '' : 'hidden'}">
        {error_message}
    </div>
{/if}

{#if tipo_utente == "STUDENTE"}
<p class="ore-pcto">
    {#if !data.session.mobile}
    <button class="btn position-relative">ORE PCTO</button>
    {/if} 
    <button class="btn position-relative">Registrate <span class="badge bg-green ms-2">{totale_ore_pcto.registrate}</span></button>
    <button class="btn position-relative">Totali <span class="badge bg-yellow ms-2">{totale_ore_pcto.totali}</span></button>
</p>
{/if}

{#if !data.session.mobile}
<Table
	columns={[
		{ name: 'id', type: 'hidden', display: 'ID' },
        { name: 'creatoDa', type: 'hidden', display: 'creatoDa' },
        { name: 'lavoraPer', type: 'object', key: 'titolo', display: 'pcto', size: 50, search: true },
        { name: 'azienda', type: 'string', display: 'azineda', size: 30, search: true},
        { name: 'presenza', type: 'object', key: 'full_name', display: 'studente', size: 30, search: true },
        { name: 'dataPresenza', type: 'date', display: 'data' },
        { name: 'oraInizio', type: 'time', display: 'entrata' },
        { name: 'oraFine', type: 'time', display: 'uscita' },
	]}
	rows={presenze}
	page_size={10}
	modal_name={$page_action_modal}
	on:update_start={start_update}
	endpoint="pcto/presenze"
    footer="Presenze"
    actions={show_actions}
    update_tip="Aggiorna presenza studente"
    trash_tip="Rimuovi presenza"
    resource="pcto_presenze"
/>
{:else}
	<Table
		columns={[
			{ name: 'id', type: 'hidden', display: 'ID' },
			{ name: 'creatoDa', type: 'hidden', display: 'creatoDa' },
			{ name: 'lavoraPer', type: 'object', key: 'titolo', display: 'pcto', size: 15},
			{ name: 'dataPresenza', type: 'date', display: 'data' },
            { name: 'ore', type: 'number', display: 'ore'}
		]}
		rows={presenze}
		page_size={10}
		modal_name={$page_action_modal}
		on:update_start={start_update}
		endpoint="pcto/presenze"
		footer="Presenze"
		actions={false}
		resource="pcto_presenze"
	/>
{/if}
<!-- Modal from Page action -->
<div
	class="modal modal-blur fade"
	id={$page_action_modal}
	tabindex="-1"
	role="dialog"
	aria-hidden="true"
>
	<form method="POST" action="?/{modal_action}" on:submit|preventDefault={handleSubmit} bind:this={modal_form}>
		{#if modal_action == 'update'}
			<input type="hidden" name="id" bind:value={form_values.presenza_id} />
		{/if}
		<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header">
					{#if modal_action == 'create'}
						<h5 class="modal-title">Nuova Presenza</h5>
					{:else}
						<h5 class="modal-title">Aggiorna Presenza</h5>
					{/if}
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" on:click={cancel_action}/>
				</div>
				<div class="modal-body">
					<div class="row">
                        <div class="col-lg-6">
                            <!-- InputSelect component ha dei problemi (two way binding) non ancora risolti
                            che non permettono di usarlo qui -->
							<div class="mb-3">
								<div class="form-label select_text">PCTO</div>
                                <select class="form-select" class:is-invalid="{errors.stage}" name="stage" bind:value={form_values.stage}>
                                    {#each pcto as stage}
                                        <option value={stage.id}>{stage.titolo} (a.s.{stage.anno_scolastico})</option>
                                    {/each}
                                </select>
                                {#if errors.stage}
                                    <span class="invalid-feedback">{errors.stage}</span>
                                {/if}	
							</div>
						</div>
                        <div class="col-lg-6">
                            <!-- InputSelect component ha dei problemi (two way binding) non ancora risolti
                            che non permettono di usarlo qui -->
							<div class="mb-3">
                                {#if pcto_studenti.length >= 1}
                                    <div class="form-label select_text">Studente</div>
                                    <select class="form-select" class:is-invalid="{errors.studente}" name="studente" bind:value={form_values.studente}>
                                        {#if modal_action == 'create' && helper.user_ruolo(data) != "STUDENTE"}
                                            <option value=0>TUTTI GLI STUDENTI</option>
                                        {/if} 
                                        {#each pcto_studenti as studente}
                                            <option value={studente.id}>{studente.cognome} {studente.nome}</option>
                                        {/each}
                                    </select>
                                    {#if errors.studente}
                                        <span class="invalid-feedback">{errors.studente}</span>
                                    {/if}
                                {:else}
                                <input type="hidden" name="studente" bind:value={form_values.studente} />
                                {/if}
							</div>
						</div>
					</div>
                    <div class="row">
                        <div class="col-lg-4">
                            <InputDate
								label="Data presenza"
								name="dataPresenza"
								{errors}
								bind:val={form_values.dataPresenza}
							/>
						</div>
						<div class="col-lg-4">
                            <InputTime
								label="Ingresso"
								name="oraInizio"
								{errors}
								bind:val={form_values.oraInizio}
							/>
						</div>
                        <div class="col-lg-4">
                            <InputTime
								label="Uscita"
								name="oraFine"
								{errors}
								bind:val={form_values.oraFine}
							/>
						</div>
                    </div>
				</div>
				<div class="modal-footer">
					<a href="#" class="btn btn-danger" data-bs-dismiss="modal" on:click={cancel_action}>
						<b>Cancel</b>
					</a>
					<button class="btn btn-success ms-auto">
						<i class="ti ti-plus icon" />
						{#if modal_action == 'create'}
							<b>Crea Presenza</b>
						{:else}
							<b>Aggiorna Presenza</b>
						{/if}
					</button>
				</div>
			</div>
		</div>
	</form>
</div>

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

    .ore-pcto {
        font-size: 1.4rem;
    }
</style>