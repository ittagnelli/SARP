<script>
	import { page_pre_title, page_title, page_action_title, page_action_modal } from '../../js/store';
	import Table from '$lib/components/common/table.svelte';
	import InputText from '$lib/components/modal/input_text.svelte';
	import InputDate from '$lib/components/modal/input_date.svelte';
    import InputSelect from '$lib/components/modal/input_select.svelte';
    import InputArea from '$lib/components/modal/input_area.svelte';
    import * as helper from '../../js/helper';
	import Select from 'svelte-select';
	import * as yup from 'yup';
    import { Logger } from '../../js/logger';

    let logger = new Logger("client");
	export let data; //contiene l'oggetto restituito dalla funzione load() eseguita nel back-end
	let stages = helper.data2arr(data.stages);
    let aziende = helper.data2arr(data.companies);
    let utenti = helper.data2arr(data.utenti);

	utenti.forEach((utente) => {
		utente['label'] = utente.cognome.concat(' ', utente.nome);
		utente['value'] = utente.id;
        utente['tutor'] =   utente.ruoli.some(item => item.ruolo == 'TUTOR-SCOLASTICO');
	});

    stages.forEach((item, idx) => {
        stages[idx].tutor_scolastico['full_name'] = stages[idx].tutor_scolastico.cognome.concat(" ", stages[idx].tutor_scolastico.nome);
    });
    
	let svolto = [];
	let svoltoDa = [];

	$: {
		if (modal_action == 'create') svoltoDa = [];
	}

	//configura la pagina pre-titolo, titolo e nome del modale
	$page_pre_title = 'PCTO';
	$page_title = 'Stage';
	$page_action_title = 'Aggiungi stage';
	$page_action_modal = 'modal-add-stage';
	let modal_action = 'create';

	let modal_form; // entry point del form nel modale
	let errors = {}; //traccia gli errori di validazione del form

	// campi del form
	// quest'oggetto deve contenere tutti i valori presenti nel form per
	// le operazione di create e update
	let form_values = {
		pcto_id: 0,
		azienda: 0,
		titolo: '',
		descrizione: '',
		tutor_aziendale: '',
        tutor_scolastico: 0,
		dataInizio: helper.convert_date(new Date()),
		dataFine: helper.convert_date(new Date()),
	};

	// schema di validazione del form
	const form_schema = yup.object().shape({
		tutor_aziendale: yup
		.string()
		.required("Nome e Cognome tutor necessario")
		.matches(/^[a-zA-Z ']{3,40}$/, "Nome e Cognome tutor non valido"),

        tutor_scolastico: yup
		.number()
		.min(1, 'Tutor Scolastico necessario'),
		
		titolo: yup
		.string()
		.required('Titolo PCTO necessatrio')
		.matches(/^[a-zA-Z0-9\. -']{3,40}$/, "Titolo PCTO non valido"),

		descrizione: yup
		.string()
		.max(500, "Descrizione troppo lunga. Max 500 caratteri"),

        azienda: yup
		.number()
		.min(1, 'Azienda necessaria')
	});

	async function start_update(e) {
		modal_action = 'update';

		form_values.pcto_id = e.detail.id;
		//cerca l'azienda da fare update
		let stage = stages.filter((item) => item.id == form_values.pcto_id)[0];
		form_values.azienda = stage.offertoDa.id;
		stage.svoltoDa.forEach((utente) => {
			utente['label'] = utente.cognome.concat(' ', utente.nome);
			utente['value'] = utente.id;
		});
		svoltoDa = stage.svoltoDa;

		form_values.titolo = stage.titolo;
		form_values.descrizione = stage.descrizione;
		form_values.tutor_aziendale = stage.tutor_aziendale;
        form_values.tutor_scolastico = stage.idTutor;
		form_values.dataInizio = helper.convert_date(stage.dataInizio);
		form_values.dataFine = helper.convert_date(stage.dataFine);
	}

	function handleSelect(event) {
		let user_selected = event.detail;

       svolto = [];
        if(user_selected) {
            user_selected.forEach((item) => {
                svolto = [...svolto, item.value];
            });
        }
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
			logger.error(`Errori nella validazione del form stage. Oggetto: ${JSON.stringify(form_values)} -- Errore: ${JSON.stringify(errors)}`);
		}
	}
</script>

<Table
	columns={[
		{ name: 'id', type: 'hidden', display: 'ID' },
		{ name: 'offertoDa', type: 'object', key: 'nome', display: 'azienda', size: 40 },
		{ name: 'tutor_aziendale', type: 'string', display: 'tutor aziendale', size: 20 },
        { name: 'tutor_scolastico', type: 'object', key: 'full_name', display: 'tutor scolastico', size: 20 },
        { name: 'titolo', type: 'string', display: 'titolo', size: 50 },
		{ name: 'descrizione', type: 'string', display: 'descrizione', size: 50 },
		{ name: 'dataInizio', type: 'date', display: 'Inizio' },
		{ name: 'dataFine', type: 'date', display: 'Fine' },
		{ name: 'svoltoDa', type: 'array', subtype: 'picture', key: 'picture', display: 'iscritti' }
	]}
	rows={stages}
	page_size={10}
	modal_name={$page_action_modal}
	on:update_start={start_update}
	endpoint="stage"
    footer="Stage"
    actions={true}
    resource="pcto_stage"
/>

<!-- Modal from Page action -->
<div
	class="modal modal-blur fade"
	id={$page_action_modal}
	tabindex="-1"
	role="dialog"
	aria-hidden="true"
>
	<form
		method="POST"
		action="?/{modal_action}"
		on:submit|preventDefault={handleSubmit}
		bind:this={modal_form}
	>
		<input type="hidden" name="studenti" bind:value={svolto} />
		{#if modal_action == 'update'}
			<input type="hidden" name="id" bind:value={form_values.pcto_id} />
		{/if}
		<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header">
					{#if modal_action == 'create'}
						<h5 class="modal-title">Nuovo Stage</h5>
					{:else}
						<h5 class="modal-title">Aggiorna Stage</h5>
					{/if}
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col-lg-4">
                            <!-- InputSelect component ha dei problemi (two way binding) non ancora risolti
                            che non permettono di usarlo qui -->
							<div class="mb-3">
								<div class="form-label select_text">Azienda</div>
                                <select class="form-select" class:is-invalid="{errors.azienda}" name="azienda" bind:value={form_values.azienda}>
                                    {#each aziende as azienda}
                                        <option value={azienda.id}>{azienda.nome}</option>
                                    {/each}
                                </select>
                                {#if errors.tipo}
                                    <span class="invalid-feedback">{errors.azienda}</span>
                                {/if}	
							</div>
						</div>
						<div class="col-lg-4">
							<InputDate
								label="Data Inizio"
								name="dataInizio"
								{errors}
								bind:val={form_values.dataInizio}
							/>
						</div>
						<div class="col-lg-4">
							<InputDate
								label="Data Fine"
								name="dataFine"
								{errors}
								bind:val={form_values.dataFine}
							/>
						</div>
					</div>
					<div class="row">
						<div class="col-lg-6">
							<InputText
								label="Tutor Aziendale"
								name="tutor_aziendale"
								{errors}
								placeholder="Tutor Aziendale"
								bind:val={form_values.tutor_aziendale}
							/>
						</div>
                        <div class="col-lg-6">
                          	<div class="mb-3">
								<div class="form-label select_text">Tutor Scolastico</div>
                                <select class="form-select" class:is-invalid="{errors.tutor_scolastico}" name="tutor_scolastico" bind:value={form_values.tutor_scolastico}>
                                    {#each utenti as utente}
                                        {#if utente.tutor}
                                            <option value={utente.id}>{utente.label}</option>
                                        {/if}
                                    {/each}
                                </select>
                                {#if errors.tipo}
                                    <span class="invalid-feedback">{errors.tutor_scolastico}</span>
                                {/if}	
							</div>
						</div>
                        <!-- <div class="col-lg-6">
							<InputText
								label="Titolo"
								name="titolo"
								{errors}
								placeholder="Titolo PCTO"
								bind:val={form_values.titolo}
							/>
						</div> -->
					</div>
                    <div class="row">
                        <div class="col-lg-12">
							<InputText
								label="Titolo"
								name="titolo"
								{errors}
								placeholder="Titolo PCTO"
								bind:val={form_values.titolo}
							/>
						</div>
					</div>
					<div class="row">
						<div class="col-lg-12">
                            <InputArea
                                label="Descrizione"
                                bind:val={form_values.descrizione}
                                name="descrizione"
                                placeholder="Descrizione PCTO..."
                                {errors}
                            />
						</div>
					</div>
					<div class="row">
						<div class="col-lg-12">
							<div class="mb-3">
								<label class="form-label">Studenti Iscritti</label>
								<Select
									class="form-select"
									name="utenti"
									items={utenti}
									value={svoltoDa}
									isMulti={true}
									placeholder="Selezione gli studenti..."
									on:select={handleSelect}
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
								<b>Crea Stage</b>
							{:else}
								<b>Aggiorna Stage</b>
							{/if}
						</button>
					</div>
				</div>
			</div>
		</div>
	</form>
</div>
