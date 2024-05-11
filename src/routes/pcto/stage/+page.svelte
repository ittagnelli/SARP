<script>
	import { page_pre_title, page_title, page_action_title, page_action_modal } from '$js/store';
	import Table from '$lib/components/common/table.svelte';
	import InputText from '$lib/components/modal/input_text.svelte';
	import InputDate from '$lib/components/modal/input_date.svelte';
    import InputSelect from '$lib/components/modal/input_select.svelte';
    import InputArea from '$lib/components/modal/input_area.svelte';
    import * as helper from '$js/helper';
	import Select from 'svelte-select';
	import * as yup from 'yup';
    import { Logger } from '$js/logger';
    import { saveAs } from 'file-saver';
    import { onMount } from 'svelte';

    let logger = new Logger("client");
	export let data; //contiene l'oggetto restituito dalla funzione load() eseguita nel back-end
	export let form; // Risposta del form dal server
    let stages = helper.data2arr(data.stages);
    let aziende = helper.data2arr(data.companies);
    let utenti = helper.data2arr(data.utenti);
	let classi = helper.data2arr(data.classi);
    let classi_iscritte = [];
    let seguitoDa = [];
    
	classi = helper.db_to_select(classi);
	utenti.forEach((utente) => {
		utente['label'] = utente.cognome.concat(' ', utente.nome);
		utente['value'] = utente.id;
        utente['tutor'] =   utente.ruoli.some(item => item.ruolo == 'TUTOR-SCOLASTICO');
	});

    stages.forEach((item, idx) => {
        stages[idx].tutor_scolastico['full_name'] = stages[idx].tutor_scolastico.cognome.concat(" ", stages[idx].tutor_scolastico.nome);
        stages[idx]['classe'] = (classi.filter(item => item.id == stages[idx].idClasse)[0]).label;
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
        sede_stage: '',
		descrizione: '',
        contabilizzato: 'NO',
		tutor_aziendale: '',
        tutor_email: '',
        tutor_telefono: '',
        tutor_scolastico: 0,
		dataInizio: helper.convert_date(new Date()),
		dataFine: helper.convert_date(new Date()),
        durata_ore: 0,
        orario_accesso: '',
        anno_scolastico: helper.get_as(),
        firma_pcto: 'NO',
        task1: '',
        task2: '',
        task3: '',
        task4: '',
        attrezzature: ''
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

        tutor_email: yup
			.string()
			.matches(
				/^$|^.*@.*$/,
				'Email non valida'
			),

		titolo: yup
		.string()
		.required('Titolo PCTO necessatrio')
		.matches(/^[a-zA-Z0-9\. -']{3,40}$/, "Titolo PCTO non valido"),

        sede_stage: yup
		.string()
        .min(0, "Indirizzo azienda non valido")
        .max(100, "Indirizzo azienda non valido"),

		descrizione: yup
		.string()
        .required('Descrizione PCTO necessaria')
		.max(500, "Descrizione troppo lunga. Max 500 caratteri"),

        task1: yup
        .string()
        .nullable()
        .required("Attività necessaria"),

        azienda: yup
		.number()
		.min(1, 'Azienda necessaria'),

        anno_scolastico: yup
        .number()
        .min(2019, 'Anno Scolastico necessario'),

        durata_ore: yup
        .number()
        .min(2, 'Ore previste necessarie'),

        orario_accesso: yup
        .string()
        .required('Orario accesso necessario')
        .matches(/^[01][0-9]:[0-5][0-5]-[01][0-9]:[0-5][0-5]$|^[01][0-9]:[0-5][0-5]-[01][0-9]:[0-5][0-5] [01][0-9]:[0-5][0-5]-[01][0-9]:[0-5][0-5]$/, "Orario accesso non valido"),
	});

    let stage_modal_values = {
		pcto_id: 0,
		azienda: 0,
		titolo: '',
        sede_stage: '',
		descrizione: '',
        anno_scolastico: 0,
		tutor_aziendale: '',
        tutor_scolastico: 0,
		dataInizio: helper.convert_date(new Date()),
		dataFine: helper.convert_date(new Date()),
        durata_ore: 0,
        studenti: []
	};

	async function start_update(e) {
		modal_action = 'update';
        svolto = [];

		form_values.pcto_id = e.detail.id;
		//cerca l'azienda da fare update
		let stage = stages.filter((item) => item.id == form_values.pcto_id)[0];
        
        form_values.azienda = stage.offertoDa.id;
        stage.svoltoDa.forEach((utente) => {
			utente['label'] = utente.cognome.concat(' ', utente.nome);
			utente['value'] = utente.id;
		});
    
		seguitoDa = stage.svoltoDa; 
        svoltoDa = stage.svoltoDa;
        svoltoDa.forEach(item => svolto.push(item.id));

		form_values.titolo = stage.titolo;
		form_values.sede_stage = stage.sede_stage;
		form_values.descrizione = stage.descrizione;
        form_values.contabilizzato = stage.contabilizzato ? 'SI' : 'NO';
		form_values.tutor_aziendale = stage.tutor_aziendale;
        form_values.tutor_email = stage.tutor_email;
        form_values.tutor_telefono = stage.tutor_telefono;
        form_values.tutor_scolastico = stage.idTutor;
		form_values.dataInizio = helper.convert_date(stage.dataInizio);
		form_values.dataFine = helper.convert_date(stage.dataFine);
        form_values.durata_ore = stage.durata_ore;
        form_values.orario_accesso = stage.orario_accesso;
        form_values.anno_scolastico = stage.anno_scolastico;
        form_values.firma_pcto = stage.firma_pcto ? 'SI' : 'NO';
        form_values.task1 = stage.task1;
        form_values.task2 = stage.task2;
        form_values.task3 = stage.task3;
        form_values.task4 = stage.task4;
        form_values.attrezzature = stage.attrezzature;
	}

	async function cancel_action(){
		if(modal_action == "update"){
			await helper.wait_fade_finish(150);
			modal_action = 'create';	// Reset modal string
			form_values = {	// Reset modal form
				pcto_id: 0,
				azienda: 0,
				titolo: '',
                sede_stage: '',
				descrizione: '',
                contabilizzato: 'NO',
				tutor_aziendale: '',
                tutor_email: '',
                tutor_telefono: '',
				tutor_scolastico: 0,
				dataInizio: helper.convert_date(new Date()),
				dataFine: helper.convert_date(new Date()),
                firma_pcto: 'NO',
                task1: '',
                task2: '',
                task3: '',
                task4: '',
                attrezzature: ''
			};
		}
	}

    function handleSelect_studenti(event) {
		let user_selected = event.detail;
        svolto = [];
        if(user_selected) {
            user_selected.forEach((item) => {
                svolto = [...svolto, item.value];
            });
		}
	}

    function handleSelect_classi(event) {
		let classe_selected = event.detail;
		if(classe_selected == null)
			seguitoDa = [];
		if(classe_selected){
			classi_iscritte = classe_selected;
			classe_selected.forEach((item) => {
				let utenti_partecipanti = utenti.filter((utente) => {
					return utente.classeId == item.id;
				});
				seguitoDa = [...seguitoDa, ...utenti_partecipanti];
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
            console.log(errors)
			logger.error(`Errori nella validazione del form stage. Oggetto: ${JSON.stringify(form_values)} -- Errore: ${JSON.stringify(errors)}`);
		}
	}

    async function query_ore_pcto(pcto_id) {
        // query endpoint per ricavare leggere tutte le ore di questo PCTO
        const get_response = await fetch(`/pcto/stage?pcto=${pcto_id}`);
        let presenze = await get_response.json();
        presenze.sort((p1, p2) => p1.presenza.classe.id - p2.presenza.classe.id);

        //processo il risultato della query
        let studenti_presenze = new Map();
        presenze.forEach(presenza => {
            if(!studenti_presenze.has(presenza.presenza.codiceF)) {
                studenti_presenze.set(presenza.presenza.codiceF, {
                    picture: presenza.presenza.picture,
                    nome: presenza.presenza.nome,
                    cognome: presenza.presenza.cognome,
                    classe: `${presenza.presenza.classe.classe} ${presenza.presenza.classe.istituto} ${presenza.presenza.classe.sezione}`,
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
        if(e.detail.action == 'view') {
            let stage_detail_modal = helper.get_modal('stage_detail_modal');
            let stage_detail = e.detail.row_id;
            let stage = stages.filter(stage => stage.id == stage_detail)[0];

            stage_modal_values.pcto_id = stage.id;
            stage_modal_values.azienda = stage.offertoDa.nome;
            stage_modal_values.titolo = stage.titolo;
            stage_modal_values.sede_stage = stage.sede_stage;
            stage_modal_values.descrizione = stage.descrizione;
            stage_modal_values.anno_scolastico = stage.anno_scolastico;
            stage_modal_values.tutor_aziendale = stage.tutor_aziendale;
            stage_modal_values.tutor_scolastico = stage.tutor_scolastico.full_name;
            stage_modal_values.dataInizio = helper.convert_date(stage.dataInizio);
            stage_modal_values.dataFine = helper.convert_date(stage.dataFine);
            stage_modal_values.durata_ore = stage.durata_ore;
            stage_modal_values.studenti = await query_ore_pcto(stage.id)
            
            stage_detail_modal.show();
        }
    }

    onMount(async () => { // Controlliamo che l'inserimento sia andato a buon fine, usiamo on mount per richiamare le funzioni del DOM
        if (form != null) {
            if (form.files != null) { // è stato richiesto la generazione di uno o più file
                for(let doc of form.files) {
                    const buffer = new Uint8Array(JSON.parse(doc.file).data); // Convertiamo la stringa in un oggetto che conterrà il nostro array di bytes che verrà poi convertito in Uint8Array, necessario all'oggetto Blob
                    var blob = new Blob([buffer], { type: 'application/msword' });
                    saveAs(blob, doc.name);
                    await helper.delay(100); //chrome can download max 10 files at the time
                }
            } 
        }
    });
</script>

<Table
	columns={[
		{ name: 'id', type: 'hidden', display: 'ID' },
        { name: 'creatoDa', type: 'hidden', display: 'creatoDa' },
		{ name: 'titolo', type: 'string', display: 'titolo', size: 50, search: true },
		{ name: 'sede_stage', type: 'string', display: 'sede_stage', size: 50, search: true },
		{ name: 'descrizione', type: 'string', display: 'descrizione', size: 50 },
        { name: 'offertoDa', type: 'object', key: 'nome', display: 'azienda', size: 40, search: true },
        { name: 'classe', type: 'string', display: 'classe', size: 20, search: true},
        { name: 'anno_scolastico', type: 'number', display: 'a.s.', search: true },
		{ name: 'tutor_scolastico', type: 'object', key: 'full_name', display: 'tutor scolastico', size: 20, search: true },
        { name: 'durata_ore', type: 'number', display: 'ore'},
		{ name: 'dataInizio', type: 'date', display: 'Inizio' },
		{ name: 'dataFine', type: 'date', display: 'Fine' },
        { name: 'contabilizzato', type: 'boolean', display: 'SIDI', search: true},
        { name: 'firma_pcto', type: 'boolean', display: 'Doc', search: true}
	]}
	rows={stages}
	page_size={10}
	modal_name={$page_action_modal}
	on:update_start={start_update}
	endpoint="pcto/stage"
    footer="Stage"
    print={true}
    actions={true}
    print_tip="Stampa convenzione per tutti gli studenti"
    update_tip="Aggiorna stage"
    trash_tip="Rimuovi stage"
    custom_actions={[{action: 'view', icon:'eye', tip: 'Visualizza stato studenti'}]}
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
						<div class="col-lg-6">
                            <!-- InputSelect component ha dei problemi (two way binding) non ancora risolti
                            che non permettono di usarlo qui -->
							<div class="mb-3">
								<div class="form-label select_text">Azienda</div>
                                <select class="form-select" class:is-invalid="{errors.azienda}" name="azienda" bind:value={form_values.azienda}>
                                    {#each aziende as azienda}
                                        <option value={azienda.id}>{azienda.nome}</option>
                                    {/each}
                                </select>
                                {#if errors.azienda}
                                    <span class="invalid-feedback">{errors.azienda}</span>
                                {/if}	
							</div>
						</div>
						<div class="col-lg-3">
							<InputDate
								label="Data Inizio"
								name="dataInizio"
								{errors}
								bind:val={form_values.dataInizio}
							/>
						</div>
						<div class="col-lg-3">
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
                          	<div class="mb-3">
								<div class="form-label select_text">Tutor Scolastico</div>
                                <select class="form-select" class:is-invalid="{errors.tutor_scolastico}" name="tutor_scolastico" bind:value={form_values.tutor_scolastico}>
                                    {#each utenti as utente}
                                        {#if utente.tutor}
                                            <option value={utente.id}>{utente.label}</option>
                                        {/if}
                                    {/each}
                                </select>
                                {#if errors.tutor_scolastico}
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
                                readonly
							/>
						</div>
                        <div class="col-lg-2">
							<InputText
								label="Ore Previste"
								name="durata_ore"
								{errors}
								placeholder="40"
								bind:val={form_values.durata_ore}
							/>
						</div>
                        <div class="col-lg-4">
							<InputText
								label="Orario Accesso"
								name="orario_accesso"
								{errors}
								placeholder="08:00-13:00 [14:00-17:30]"
								bind:val={form_values.orario_accesso}
							/>
						</div>
					</div>
                    <div class="row">
                        <div class="col-lg-4">
							<InputText
								label="Tutor Aziendale"
								name="tutor_aziendale"
								{errors}
								placeholder="Cognome Nome"
								bind:val={form_values.tutor_aziendale}
							/>
						</div> 
                        <div class="col-lg-4">
							<InputText
								label="Tutor Telefono"
								name="tutor_telefono"
								{errors}
								placeholder="Telefono"
								bind:val={form_values.tutor_telefono}
							/>
						</div> 
                        <div class="col-lg-4">
							<InputText
								label="Tutor Email"
								name="tutor_email"
								{errors}
								placeholder="Email"
								bind:val={form_values.tutor_email}
							/>
						</div> 
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
							<InputText
								label="Indirizzo sede di svolgimento"
								name="sede_stage"
								{errors}
								placeholder="Indirizzo sede di svolgimento"
								bind:val={form_values.sede_stage}
							/>
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
                                rows={3}
                                {errors}
                            />
						</div>                        
					</div>
                    <div class="row">
						<div class="col-lg-6">
							<div class="mb-3">
                                <InputText
								label="Attività"
								name="task1"
								{errors}
								placeholder="Attività PCTO"
								bind:val={form_values.task1}
							/>
                            </div>
						</div>
                        <div class="col-lg-6">
							<div class="mb-3">
                                <InputText
								label="Attività"
								name="task2"
								{errors}
								placeholder="Attività PCTO"
								bind:val={form_values.task2}
							/>
                            </div>
						</div>
					</div>
                    <div class="row">
						<div class="col-lg-6">
							<div class="mb-3">
                                <InputText
								label="Attività"
								name="task3"
								{errors}
								placeholder="Attività PCTO"
								bind:val={form_values.task3}
							/>
                            </div>
						</div>
                        <div class="col-lg-6">
							<div class="mb-3">
                                <InputText
								label="Attività"
								name="task4"
								{errors}
								placeholder="Attività PCTO"
								bind:val={form_values.task4}
							/>
                            </div>
						</div>
					</div>
                    <div class="row">
						<div class="col-lg-12">
							<div class="mb-3">
                                <InputText
								label="Attrezzature"
								name="attrezzature"
								{errors}
								placeholder="PC Portatile, Mouse"
								bind:val={form_values.attrezzature}
							/>
                            </div>
						</div>
                    </div>
                    <div class="row">
						<div class="col-lg-12">
							<div class="mb-3">
								<label class="form-label">Studenti</label>
								<Select
									class="form-select"
									name="utenti"
									items={utenti.filter(u => u.tipo == 'STUDENTE')}
									bind:value={seguitoDa}
									isMulti={true}
									placeholder="Selezione gli studenti..."
									on:select={handleSelect_studenti}
								/>
							</div>
						</div>
					</div>
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
                    <div class="row">
                        {#if helper.is_admin(data) == true}
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label class="form-label">Registrato in SIDI</label>
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
                        <div class="col-lg-6">
                            <div class="mb-3">
                                <label class="form-label">Documenti PCTO  Firmati ?</label>
                                <div class="form-selectgroup">
                                    <label class="form-selectgroup-item">
                                        <input
                                            type="radio"
                                            name="firma_pcto"
                                            value="SI"
                                            class="form-selectgroup-input"
                                            bind:group={form_values.firma_pcto}
                                        />
                                        <span class="form-selectgroup-label">SI</span>
                                    </label>
                                    <label class="form-selectgroup-item">
                                        <input
                                            type="radio"
                                            name="firma_pcto"
                                            value="NO"
                                            class="form-selectgroup-input"
                                            bind:group={form_values.firma_pcto}
                                        />
                                        <span class="form-selectgroup-label">NO</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        {:else}
                            <input type="hidden" name="contabilizzato" bind:value={form_values.contabilizzato} />
                            <input type="hidden" name="firma_pcto" bind:value={form_values.firma_pcto} />
                        {/if}
                    </div>
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
                        <div class="row">
                            <div class="col-lg-6">
                                <div class="mb-3">
                                    <label class="form-label">Indirizzo sede di svolgimento</label>
                                    <input
                                        type="text"
                                        class="form-control"
                                        value={stage_modal_values.sede_stage}
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
                                  <!-- <th>Foto</th> -->
                                  <th>Studente</th>
                                  <th>Classe</th>
                                  <th>Ore</th>
                                </tr>
                              </thead>
                              <tbody>
                                {#each stage_modal_values.studenti as studente}
                                    <tr>
                                        <!-- <td>
                                            <span class="avatar avatar-sm" style="background-image: url({studente.picture})"></span>
                                        </td> -->
                                        <td>{studente.cognome} {studente.nome}</td>
                                        <td>{studente.classe}</td>
                                        <td>{studente.ore}/{stage_modal_values.durata_ore}</td>
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
