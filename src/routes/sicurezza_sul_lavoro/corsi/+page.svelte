<script>
	import { page_pre_title, page_title, page_action_title, page_action_modal } from '../../../js/store';
	import Table from '$lib/components/common/table.svelte';
	import InputText from '$lib/components/modal/input_text.svelte';
	import InputDate from '$lib/components/modal/input_date.svelte';
    import InputSelect from '$lib/components/modal/input_select.svelte';
    import InputArea from '$lib/components/modal/input_area.svelte';
    import * as helper from '../../../js/helper';
	import Select from 'svelte-select';
	import * as yup from 'yup';
    import { Logger } from '../../../js/logger';

    let logger = new Logger("client");
	export let data; //contiene l'oggetto restituito dalla funzione load() eseguita nel back-end
	let corsi = helper.data2arr(data.corsi);

    // let aziende = helper.data2arr(data.companies);
    let tipi_corso = ['GENERICO', 'SPECIFICO'];
    let utenti = helper.data2arr(data.utenti);

	utenti.forEach((utente) => {
		utente['label'] = utente.cognome.concat(' ', utente.nome);
		utente['value'] = utente.id;
	});

	let seguito = [];
	let seguitoDa = [];

	$: {
		if (modal_action == 'create') seguitoDa = [];
	}

	//configura la pagina pre-titolo, titolo e nome del modale
	$page_pre_title = 'Sicurezza sul Lavoro';
	$page_title = 'Corsi';
	$page_action_title = 'Aggiungi corso';
	$page_action_modal = 'modal-add-corso';
	let modal_action = 'create';

	let modal_form; // entry point del form nel modale
	let errors = {}; //traccia gli errori di validazione del form

	// campi del form
	// quest'oggetto deve contenere tutti i valori presenti nel form per
	// le operazione di create e update
	let form_values = {
		corso_id: 0,
		titolo: '',
		tipo: '',
		dataInizio: helper.convert_date(new Date()),
		dataFine: helper.convert_date(new Date()),
	};

	// schema di validazione del form
	const form_schema = yup.object().shape({
		titolo: yup
		.string()
		.required('Titolo Corso necessario')
		.matches(/^[a-zA-Z0-9\. -']{3,40}$/, "Titolo Corso non valido"),

        tipo: yup
        .string()
        .required('Tipo Corso necessario')
	});

	async function start_update(e) {
		modal_action = 'update';

		form_values.corso_id = e.detail.id;
		//cerca l'azienda da fare update
		let corso = corsi.filter((item) => item.id == form_values.corso_id)[0];
		corso.seguitoDa.forEach((utente) => {
			utente['label'] = utente.cognome.concat(' ', utente.nome);
			utente['value'] = utente.id;
		});
		seguitoDa = corso.seguitoDa;

		form_values.titolo = corso.titolo;
		form_values.tipo = corso.tipo;
		form_values.dataInizio = helper.convert_date(corso.dataInizio);
		form_values.dataFine = helper.convert_date(corso.dataFine);
	}

	function handleSelect(event) {
		let user_selected = event.detail;

       seguito = [];
        if(user_selected) {
            user_selected.forEach((item) => {
                seguito = [...seguito, item.value];
            });
        }
	}

	async function handleSubmit() {
        console.log("FORM VALUES:", form_values)
        try {
			// valida il form prima del submit
			await form_schema.validate(form_values, { abortEarly: false });
			errors = {};
			modal_form.submit();
		} catch (err) {
			errors = err.inner.reduce((acc, err) => {
				return { ...acc, [err.path]: err.message };
			}, {});
			logger.error(`Errori nella validazione del form corso sicurezza. Oggetto: ${JSON.stringify(form_values)} -- Errore: ${JSON.stringify(errors)}`);
		}
	}
</script>

<Table
	columns={[
		{ name: 'id', type: 'hidden', display: 'ID' },
		{ name: 'titolo', type: 'string', display: 'titolo' },
        { name: 'tipo', type: 'string', display: 'tipo' },
        { name: 'dataInizio', type: 'date', display: 'Inizio' },
		{ name: 'dataFine', type: 'date', display: 'Fine' },	
		{ name: 'seguitoDa', type: 'array', subtype: 'picture', key: 'picture', display: 'iscritti' }
	]}
	rows={corsi}
	page_size={10}
	modal_name={$page_action_modal}
	on:update_start={start_update}
	endpoint="sicurezza_sul_lavoro/corsi"
    footer="Corsi di Sicurezza"
    actions={true}
    print={true}
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
		<input type="hidden" name="studenti" bind:value={seguito} />
		{#if modal_action == 'update'}
			<input type="hidden" name="id" bind:value={form_values.corso_id} />
		{/if}
		<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header">
					{#if modal_action == 'create'}
						<h5 class="modal-title">Nuovo Corso</h5>
					{:else}
						<h5 class="modal-title">Aggiorna Corso</h5>
					{/if}
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col-lg-6">
							<div class="mb-3">
								<InputText
								label="Titolo"
								name="titolo"
								{errors}
								placeholder="Titolo Corso"
								bind:val={form_values.titolo}
							/>
							</div>
						</div>
                        <div class="col-lg-6">
							<InputDate
								label="Data Inizio"
								name="dataInizio"
								{errors}
								bind:val={form_values.dataInizio}
							/>
						</div>
					</div>
					<div class="row">
                        <div class="col-lg-6">
							<div class="mb-3">
								<div class="form-label select_text">Tipo</div>
                                <select class="form-select" class:is-invalid="{errors.tipo}" name="tipo" bind:value={form_values.tipo}>
                                    {#each tipi_corso as tipo_corso}
                                        <option value={tipo_corso}>{tipo_corso}</option>
                                    {/each}
                                </select>
                                {#if errors.tipo}
                                    <span class="invalid-feedback">{errors.tipo}</span>
                                {/if}	
							</div>
						</div>
                        <div class="col-lg-6">
							<InputDate
								label="Data Fine"
								name="dataFine"
								{errors}
								bind:val={form_values.dataFine}
							/>
						</div>
					</div>
					<div class="row">
						<div class="col-lg-12">
							<div class="mb-3">
								<label class="form-label">Studenti</label>
								<Select
									class="form-select"
									name="utenti"
									items={utenti}
									value={seguitoDa}
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
								<b>Crea Corso</b>
							{:else}
								<b>Aggiorna Corso</b>
							{/if}
						</button>
					</div>
				</div>
			</div>
		</div>
	</form>
</div>
