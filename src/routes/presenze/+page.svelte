<script>
	import { page_pre_title, page_title, page_action_title, page_action_modal } from '../../js/store';
	import Table from '$lib/components/common/table.svelte';
    import InputDate from '$lib/components/modal/input_date.svelte';
    import InputTime from '$lib/components/modal/input_time.svelte';
    import * as helper from '../../js/helper';
    import * as yup from 'yup';
    import { Logger } from '../../js/logger';

    let logger = new Logger("client");
	export let data; //contiene l'oggetto restituito dalla funzione load() eseguita nel back-end
	let presenze = helper.data2arr(data.presenze);
    // aggiungo il full name per ogni presenza per poi stamparlo nella tabella
    presenze.map(item => {
        item.presenza['full_name'] = (item.presenza['cognome']).concat(" ", item.presenza['nome'])
    });

    let pcto = helper.data2arr(data.stages);
    let pcto_studenti = [];

    $: {
        // pcto_studenti = [];
        let selected_stage = pcto.filter((item) => item.id == form_values.stage);
        if(selected_stage[0])
            pcto_studenti = selected_stage[0].svoltoDa;
    }

	//configura la pagina pre-titolo, titolo e nome del modale
	$page_pre_title = 'PCTO';
	$page_title = 'Presenze';
	$page_action_title = 'Aggiungi Presenza';
	$page_action_modal = 'modal-add-presenze';
	let modal_action = 'create';

    let modal_form; // entry point del form nel modale
	let errors = {}; //traccia gli errori di validazione del form

    // campi del form
	// quest'oggetto deve contenere tutti i valori presenti nel form per
	// le operazione di create e update
	let form_values = {
		presenza_id: 0,
		stage: 0,
		studente: 0,
        dataPresenza: helper.convert_date(new Date()),
        oraInizio: '',
        oraFine: ''
	};

	// schema di validazione del form
	const form_schema = yup.object().shape({
        stage: yup
		.number()
		.min(1, 'PCTO necessario'),

        studente: yup
		.number()
		.min(1, 'Studente necessario'),

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
	}

    async function handleSubmit() {
		try {
			// valida il form prima del submit
			await form_schema.validate(form_values, { abortEarly: false });
			errors = {};
			modal_form.submit();
		} catch (err) {
			errors = err.inner.reduce((acc, err) => {
				return { ...acc, [err.path]: err.message };
			}, {});
			logger.error(`Errori nella validazione del form presenze. Oggetto: ${JSON.stringify(form_values)} -- Errore: ${JSON.stringify(errors)}`);
		}
	}
</script>

<Table
	columns={[
		{ name: 'id', type: 'hidden', display: 'ID' },
        { name: 'lavoraPer', type: 'object', key: 'titolo', display: 'pcto' },
        { name: 'presenza', type: 'object', key: 'full_name', display: 'studente' },
        { name: 'dataPresenza', type: 'date', display: 'data' },
        { name: 'oraInizio', type: 'time', display: 'entrata' },
        { name: 'oraFine', type: 'time', display: 'uscita' },
	]}
	rows={presenze}
	page_size={5}
	modal_name={$page_action_modal}
	on:update_start={start_update}
	type="presenze"
    actions={true}
/>

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
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
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
                                        <option value={stage.id}>{stage.titolo}</option>
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
								<div class="form-label select_text">Studente</div>
                                <select class="form-select" class:is-invalid="{errors.studente}" name="studente" bind:value={form_values.studente}>
                                    {#each pcto_studenti as studente}
                                        <option value={studente.id}>{studente.cognome} {studente.nome}</option>
                                    {/each}
                                </select>
                                {#if errors.studente}
                                    <span class="invalid-feedback">{errors.studente}</span>
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
					<a href="#" class="btn btn-danger" data-bs-dismiss="modal">
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
