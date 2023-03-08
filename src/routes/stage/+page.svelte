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
	let classi = helper.data2arr(data.classi);
	let classi_iscritte = [];
	let old_studenti = [];

	classi = helper.db_to_select(classi);

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
        contabilizzato: 'NO',
		tutor_aziendale: '',
        tutor_scolastico: 0,
		dataInizio: helper.convert_date(new Date()),
		dataFine: helper.convert_date(new Date()),
        anno_scolastico: undefined
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
		.min(1, 'Azienda necessaria'),

        anno_scolastico: yup
        .number()
        .min(2019, 'Anno Scolastico necessario')
	});

    let stage_modal_values = {
		pcto_id: 0,
		azienda: 0,
		titolo: '',
		descrizione: '',
        anno_scolastico: 0,
		tutor_aziendale: '',
        tutor_scolastico: 0,
		dataInizio: helper.convert_date(new Date()),
		dataFine: helper.convert_date(new Date()),
        studenti: []
	};

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
        form_values.contabilizzato = stage.contabilizzato ? 'SI' : 'NO';
		form_values.tutor_aziendale = stage.tutor_aziendale;
        form_values.tutor_scolastico = stage.idTutor;
		form_values.dataInizio = helper.convert_date(stage.dataInizio);
		form_values.dataFine = helper.convert_date(stage.dataFine);
        form_values.anno_scolastico = stage.anno_scolastico;
	}

	function findDeselectedItem(CurrentArray, PreviousArray) {

		var CurrentArrSize = CurrentArray.length;
		var PreviousArrSize = PreviousArray.length;

		// loop through previous array
		for(var j = 0; j < PreviousArrSize; j++) {

		// look for same thing in new array
		if (CurrentArray.indexOf(PreviousArray[j]) == -1)
			return PreviousArray[j];
		}

		return null;

	}

	async function cancel_action(){
		if(modal_action == "update"){
			await helper.wait_fade_finish();
			modal_action = 'create';	// Reset modal string
			form_values = {	// Reset modal form
				pcto_id: 0,
				azienda: 0,
				titolo: '',
				descrizione: '',
                contabilizzato: 'NO',
				tutor_aziendale: '',
				tutor_scolastico: 0,
				dataInizio: helper.convert_date(new Date()),
				dataFine: helper.convert_date(new Date()),
			};
		}
	}

	function handleSelect(event) {
		let user_selected = event.detail;
       	svolto = [];
		let i = 0;
        if(user_selected) {
            user_selected.forEach((item) => {
                svolto = [...svolto, item.value];
            });
			let removed = helper.findDeselectedItem(user_selected, old_studenti);
			if(old_studenti.length != 0){
				let classi_ids = classi_iscritte.map(classe => classe.id);
				if(removed){
					let users_id = user_selected.map(user => user.classeId);
					if(users_id.indexOf(removed.classeId) == -1){
						let index_to_remove = classi_ids.indexOf(removed.classeId);
						classi_iscritte.splice(index_to_remove, 1);
						classi_iscritte = classi_iscritte;
					}
				}

			}
			old_studenti = user_selected;
        }else {
			classi_iscritte = [];
		}
	}

	function handleSelect_classi(event) {
		let classe_selected = event.detail;
		svoltoDa = [];
		if(classe_selected){
			classi_iscritte = classe_selected;
			classe_selected.forEach((item) => {
				let utenti_partecipanti = utenti.filter((utente) => {
					return utente.classeId == item.id;
				});
				svoltoDa = [...svoltoDa, ...utenti_partecipanti];
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

    async function query_ore_pcto(pcto_id) {
        // query endpoint per ricavare leggere tutte le ore di questo PCTO
        const get_response = await fetch(`/stage?pcto=${pcto_id}`);
        let presenze = await get_response.json();

        //processo il risultato della query
        let studenti_presenze = new Map();
        presenze.forEach(presenza => {
            if(!studenti_presenze.has(presenza.presenza.codiceF)) {
                studenti_presenze.set(presenza.presenza.codiceF, {
                    picture: presenza.presenza.picture,
                    nome: presenza.presenza.nome,
                    cognome: presenza.presenza.cognome,
                    istituto: presenza.presenza.istituto,
                    ore: helper.ore_pcto(presenza.oraInizio, presenza.oraFine)
                });
            } else {
                let tmp_value = studenti_presenze.get(presenza.presenza.codiceF);
                let ore = helper.ore_pcto(presenza.oraInizio, presenza.oraFine);
                tmp_value.ore += ore;
                studenti_presenze.set(presenza.presenza.codiceF, tmp_value);
            }
        });
        return Array.from(studenti_presenze.values());
    } 

    async function show_stage_modal(e) {
        let stage_detail_modal = helper.get_modal('stage_detail_modal');
        let stage_detail = e.detail.id;
        let stage = stages.filter(stage => stage.id == stage_detail)[0];

        stage_modal_values.pcto_id = stage.id;
		stage_modal_values.azienda = stage.offertoDa.nome;
		stage_modal_values.titolo = stage.titolo;
		stage_modal_values.descrizione = stage.descrizione;
        stage_modal_values.anno_scolastico = stage.anno_scolastico;
		stage_modal_values.tutor_aziendale = stage.tutor_aziendale;
        stage_modal_values.tutor_scolastico = stage.tutor_scolastico.full_name;
		stage_modal_values.dataInizio = helper.convert_date(stage.dataInizio);
		stage_modal_values.dataFine = helper.convert_date(stage.dataFine);
        stage_modal_values.studenti = await query_ore_pcto(stage.id)
        
        stage_detail_modal.show();
    }

</script>

<Table
	columns={[
		{ name: 'id', type: 'hidden', display: 'ID' },
		{ name: 'titolo', type: 'string', display: 'titolo', size: 50 },
		{ name: 'descrizione', type: 'string', display: 'descrizione', size: 50 },
        { name: 'offertoDa', type: 'object', key: 'nome', display: 'azienda', size: 40 },
        { name: 'anno_scolastico', type: 'number', display: 'a.s.'},
        { name: 'contabilizzato', type: 'boolean', display: 'SIDI'},
		{ name: 'tutor_aziendale', type: 'string', display: 'tutor aziendale', size: 20 },
        { name: 'tutor_scolastico', type: 'object', key: 'full_name', display: 'tutor scolastico', size: 20 },
		{ name: 'dataInizio', type: 'date', display: 'Inizio' },
		{ name: 'dataFine', type: 'date', display: 'Fine' },
		{ name: 'svoltoDa', type: 'array', subtype: 'picture', key: 'picture', display: 'iscritti', size: 5 }
	]}
	rows={stages}
	page_size={10}
	modal_name={$page_action_modal}
	on:update_start={start_update}
	endpoint="stage"
    footer="Stage"
    actions={true}
    custom_action_icon="eye"
    on:custom_action={show_stage_modal}
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
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" on:click={cancel_action}/>
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
						<div class="col-lg-4">
							<InputText
								label="Tutor Aziendale"
								name="tutor_aziendale"
								{errors}
								placeholder="Tutor Aziendale"
								bind:val={form_values.tutor_aziendale}
							/>
						</div>
                        <div class="col-lg-4">
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
                        <div class="col-lg-2">
							<InputText
								label="A.S."
								name="anno_scolastico"
								{errors}
								placeholder="2022"
								bind:val={form_values.anno_scolastico}
							/>
						</div>
                        <div class="col-lg-2">
                            <div class="mb-3">
                                <label class="form-label">Regigstrato</label>
                                <div class="form-selectgroup">
                                    <label class="form-selectgroup-item">
                                        <input
                                            type="radio"
                                            name="contabilizzato"
                                            value="SI"
                                            class="form-selectgroup-input"
                                            bind:group={form_values.contabilizzato}
                                        />
                                        <span class="form-selectgroup-label">SI</span>
                                    </label>
                                    <label class="form-selectgroup-item">
                                        <input
                                            type="radio"
                                            name="contabilizzato"
                                            value="NO"
                                            class="form-selectgroup-input"
                                            bind:group={form_values.contabilizzato}
                                        />
                                        <span class="form-selectgroup-label">NO</span>
                                    </label>
                                </div>
                            </div>
                        </div>
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
					{#if svoltoDa.length == 0}
						<div class="row">
							<div class="col-lg-12">
								<div class="mb-3">
									<label class="form-label">Classi Iscritte</label>
									<Select
										class="form-select"
										name="utenti"
										items={classi}
										value={classi_iscritte}
										isMulti={true}
										placeholder="Selezione gli studenti..."
										on:select={handleSelect_classi}
									/>
								</div>
							</div>
						</div>
					{/if}
					<div class="modal-footer">
						<a href="#" class="btn btn-danger" data-bs-dismiss="modal" on:click={cancel_action}>
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


<!-- modale per dettatglio stage -->
<div
	class="modal modal-blur fade"
	id="stage_detail_modal"
	tabindex="-1"
	role="dialog"
	aria-hidden="true"
>
    <div class="modal-dialog modal-lg" role="document">
        <div class="modal-content">
            <div class="modal-header">
                    <h5 class="modal-title">Dettagli PCTO</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
            </div>
            <div class="modal-body">
                <fieldset class="form-fieldset">
                    <div class="row">
                        <div class="col-lg-2">
                            <div class="mb-3">
                                <label class="form-label">A.S.</label>
                                <input
                                    type="text"
                                    class="form-control"
                                    value={stage_modal_values.anno_scolastico}
                                    readonly
                                />
                            </div>
                        </div>
                        <div class="col-lg-4">
                            <div class="mb-3">
                                <label class="form-label">Azienda/Convenzione</label>
                                <input
                                    type="text"
                                    class="form-control"
                                    value={stage_modal_values.azienda}
                                    readonly
                                />
                            </div>
                        </div>
                        <div class="col-lg-3">
                            <div class="mb-3">
                                <label class="form-label">Tutor Aziendale</label>
                                <input
                                    type="text"
                                    class="form-control"
                                    value={stage_modal_values.tutor_aziendale}
                                    readonly
                                />
                            </div>
                        </div>
                        <div class="col-lg-3">
                            <div class="mb-3">
                                <label class="form-label">Tutor Scolastico</label>
                                <input
                                    type="text"
                                    class="form-control"
                                    value={stage_modal_values.tutor_scolastico}
                                    readonly
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label class="form-label">Titolo</label>
                                <input
                                    type="text"
                                    class="form-control"
                                    value={stage_modal_values.titolo}
                                    readonly
                                />
                            </div>
                        </div>
                        <div class="col-lg-3">
                            <div class="mb-3">
                                <label class="form-label">Data Inizio</label>
                                <input
                                    type="text"
                                    class="form-control"
                                    value={stage_modal_values.dataInizio}
                                    readonly
                                />
                            </div>
                        </div>
                        <div class="col-lg-3">
                            <div class="mb-3">
                                <label class="form-label">Data Fine</label>
                                <input
                                    type="text"
                                    class="form-control"
                                    value={stage_modal_values.dataFine}
                                    readonly
                                />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="mb-3">
                                <label class="form-label">Descrizione</label>
                                <textarea
                                    class="form-control"
                                    rows=3
                                    value={stage_modal_values.descrizione}
                                    readonly
                                />
                            </div>
                        </div>
                    </div>
                </fieldset>
                <div class="row">
                    <div class="col-lg-12">
                        <div class="card-table table-responsive">
                            <table class="table table-vcenter">
                              <thead>
                                <tr>
                                  <th>Foto</th>
                                  <th>Studente</th>
                                  <th>Istituto</th>
                                  <th>Ore</th>
                                </tr>
                              </thead>
                              <tbody>
                                {#each stage_modal_values.studenti as studente}
                                    <tr>
                                        <td>
                                            <span class="avatar avatar-sm" style="background-image: url({studente.picture})"></span>
                                        </td>
                                        <td>{studente.cognome} {studente.nome}</td>
                                        <td>{studente.istituto}</td>
                                        <td>{studente.ore}</td>
                                    </tr>
                                {/each}
                              </tbody>
                            </table>
                          </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <a href="#" class="btn btn-success ms-auto" data-bs-dismiss="modal">
                    <b>Chiudi</b>
                </a>
                
            </div>
        </div>
    </div>
</div>
