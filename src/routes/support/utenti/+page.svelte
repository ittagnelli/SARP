<script>
	import { page_pre_title, page_title, page_action_title, page_action_modal } from '$js/store';
	import Table from '$lib/components/common/table.svelte';
	import * as helper from '$js/helper';
	import * as yup from 'yup';
	import InputText from '$lib/components/modal/input_text.svelte';
    import InputDate from '$lib/components/modal/input_date.svelte';
	import ModalError from '$lib/components/common/modal_error.svelte';
	import { Logger } from '$js/logger';
	import { onMount } from 'svelte';

	export let data; //contiene l'oggetto restituito dalla funzione load() eseguita nel back-end
	export let form; // Risposta del form dal server

	let logger = new Logger('client');
	let utenti = helper.data2arr(data.utenti);
	let tipi_utente = helper.data2arr(data.tipi_utente);
	let ruoli_utente = helper.data2arr(data.ruoli_utente);
    let classi = helper.data2arr(data.classi);

    // aggiungo la classe come stringa agli utenti per poi stamparlo nella tabella
    utenti.forEach((item, idx) => { 
        if(utenti[idx]?.classe?.id == undefined)
            utenti[idx]['classe_str'] = utenti[idx].istituto;
        else
        utenti[idx]['classe_str'] = utenti[idx].istituto.concat(" ", utenti[idx].classe.classe, " ", utenti[idx].classe.sezione);
    });
    
	//configura la pagina pre-titolo, titolo e nome del modale
	$page_pre_title = 'ADMIN';
	$page_title = 'Utenti';
	$page_action_title = 'Aggiungi Utente';
	$page_action_modal = 'modal-add-utente';

	let modal_action = 'create';
	let modal_form; // entry point del form nel modale
	let errors = {}; //traccia gli errori di validazione del form

	// campi del form
	// quest'oggetto deve contenere tutti i valori presenti nel form per
	// le operazione di create e update
	let form_values = {
		user_id: 0,
		tipo: '',
		ruolo: [],
		nome: '',
		cognome: '',
        natoA: '',
		provincia: '',
        natoIl: '',
        residenza: '',
        codiceF: '',
        cartaI: '',
		email: '',
		telefono: '',
		bes_select: 'NO',
        obiettivi_minimi: 'NO',
		can_login_select: 'SI',
		istituto_select: 'ITT',
        classe: 0
	};

	// schema di validazione del form
	const form_schema = yup.object().shape({
		tipo: yup.string().required('Tipo utente necessatrio'),

		ruolo: yup.array(yup.string()).ensure().min(1, 'Ruolo utente necessario'),

		nome: yup
			.string()
			.required('Nome utente necessario')
			.matches(/^[A-Z][a-z A-Z]{2,20}$/, 'Nome utente non valido'),

		cognome: yup
			.string()
			.required('Cognome utente necessario')
			.matches(/^[A-Z][a-z A-Z]{2,20}$/, 'Cognome utente non valido'),

        natoA: yup
            .string()
            .nullable()
            .matches(/^$|^[a-zA-Z à-è-ì-ò-ù]{3,30}$/, "Luogo di nascita non valido"),

		provincia: yup
            .string()
            .nullable()
            .length(2, "Provincia non valida"),

        natoIl: yup
            .date()
            .min(new Date(1950,1,1), "Data Invalida"),

        codiceF: yup
            .string()
            .nullable()
            .matches(/^$|^[0-9A-Z]{16}$/, "Codice fiscale non valido [LNSTVL69T28L219K]"),

		email: yup
			.string()
			.required('Email necessaria')
            .matches(
				/^$|^.*@.*$/,
				'Email non valida'
			),

		telefono: yup
			.string()
            .nullable()
			.matches(/^$|^[0-9]{3}\.[0-9]{3}\.[0-9]{2}\.[0-9]{2}$/, 'Numero non valido [333.123.45.67]'),

        classe: yup
            .number()
            .min(1, 'Selezionare una classe'),
        
        residenza: yup
            .string()
            .nullable()
	});

	onMount(() => {
		// Controlliamo che l'inserimento sia andato a buon fine, usiamo on mount per richiamare le funzioni del DOM
		if (form != null) {
			form_values = JSON.parse(localStorage.getItem('form')); // Riempiamo il modale
			helper.show_modal();
		} else {
			localStorage.removeItem('form'); //PROF: rimuoviamo il form dal localstorage
		}
	});

	async function start_update(e) {
		modal_action = 'update';
		form_values.user_id = e.detail.id;
		//cerca l'utente da fare update
		let utente = utenti.filter((item) => item.id == form_values.user_id)[0];

		form_values.nome = utente.nome;
		form_values.cognome = utente.cognome;
        form_values.natoA = utente.natoA;
		form_values.provincia = utente.provincia;
        form_values.natoIl = helper.convert_date(utente.natoIl);
        form_values.residenza = utente.residenza;
        form_values.codiceF = utente.codiceF;
        form_values.cartaI = utente.cartaI;
		form_values.email = utente.email;
		form_values.telefono = utente.telefono;
		form_values.tipo = utente.tipo;
		form_values.ruolo = utente.ruoli.map((role) => String(role.id));
		form_values.istituto_select = utente.istituto;
		form_values.bes_select = utente.bes ? 'SI' : 'NO';
        form_values.obiettivi_minimi = utente.obiettivi_minimi ? 'SI' : 'NO',
		form_values.can_login_select = utente.can_login ? 'SI' : 'NO';
        form_values.classe = utente.classe.id;
	}

	async function cancel_action(){
		if(modal_action == 'update'){
			await helper.wait_fade_finish(150);
			modal_action = 'create';	// Reset model string
			form_values = {	// Reset form values
				user_id: 0,
				tipo: '',
				ruolo: [],
				nome: '',
				cognome: '',
				natoA: '',
				provincia: '',
				natoIl: '',
                residenza: '',
				codiceF: '',
                cartaI: '',
				email: '',
				telefono: '',
				bes_select: 'NO',
                obiettivi_minimi: 'NO',
				can_login_select: 'SI',
				istituto_select: 'ITT',
				classe: 0
			};
		}
	}
	async function handleSubmit() {
		try {
			// valida il form prima del submit
			await form_schema.validate(form_values, { abortEarly: false });
			errors = {};
			localStorage.setItem('form', JSON.stringify(form_values)); // Nel caso l'inserimento fallisse abbiamo il "backup" nel localstorage
            modal_form.submit();
		} catch (err) {
			errors = err.inner.reduce((acc, err) => {
				return { ...acc, [err.path]: err.message };
			}, {});
			logger.error(
				`Errori nella validazione del form utenti. Oggetto: ${JSON.stringify(
					form_values
				)} -- Errore: ${JSON.stringify(errors)}`
			);
		}
	}
</script>

<Table
	columns={[
		{ name: 'id', type: 'hidden', display: 'ID' },
		{ name: 'picture', type: 'hidden', display: 'Utente' },
		{ name: 'cognome', type: 'string', display: 'Cognome', size: 40, search: true },
		{ name: 'nome', type: 'string', display: 'Nome', size: 40, search: true },
        { name: 'natoIl', type: 'date', display: 'Nato il' },
        { name: 'tipo', type: 'string', display: 'Tipo', size: 10, search: true },
        { name: 'classe_str', type: 'string', display: 'Classe', size: 20, search: true },
        { name: 'ruoli', type: 'array', subtype: 'object', key: 'ruolo', display: 'Ruolo' },
		{ name: 'email', type: 'string', display: 'email', size: 40 },
		{ name: 'bes', type: 'boolean', display: 'pdp', search: true },
        { name: 'obiettivi_minimi', type: 'boolean', display: 'obiettivi minimi', search: true },
		{ name: 'can_login', type: 'boolean', display: 'can_login'}
	]}
	rows={utenti}
	page_size={10}
	modal_name={$page_action_modal}
	on:update_start={start_update}
	footer="Utenti"
    endpoint="support/utenti"
	actions={true}
    update_tip="Aggiorna anagrafica utente"
    trash_tip="Rimuovi anagrafica utente"
    resource="utenti"
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
		{#if modal_action == 'update'}
			<input type="hidden" name="id" bind:value={form_values.user_id} />
		{/if}
		<div class="modal-dialog modal-xl" role="document">
			<div class="modal-content">
				<div class="modal-header">
					{#if modal_action == 'create'}
						<h5 class="modal-title">Nuovo Utente</h5>
					{:else}
						<h5 class="modal-title">Aggiorna Utente</h5>
					{/if}
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" on:click={cancel_action}/>
				</div>
				<div class="modal-body">
					{#if form}
						<ModalError msg={form.error_mex} />
					{/if}
					<div class="row">
						<div class="col-lg-2">
							<InputText label="Nome" name="nome" placeholder="Nome" bind:val={form_values.nome} {errors} />
						</div>
						<div class="col-lg-2">
							<InputText label="Cognome" name="cognome" placeholder="Cognome" bind:val={form_values.cognome} {errors} />
						</div>
                        <div class="col-lg-2">
							<InputText
								label="Nato A"
								name="natoA"
								placeholder="Località"
								bind:val={form_values.natoA}
								{errors}
							/>
						</div>
						<div class="col-lg-1">
							<InputText
								label="Provincia"
								name="provincia"
								placeholder="TO"
								bind:val={form_values.provincia}
								{errors}
							/>
						</div>
                        <div class="col-lg-2">
                            <InputDate
                                label="Nato Il"
                                name="natoIl"
                                {errors}
                                bind:val={form_values.natoIl}
                            />
						</div>
                        <div class="col-lg-3">
                            <InputText
								label="Residente in"
								name="residenza"
								placeholder="via Torino 93 - TORINO"
								bind:val={form_values.residenza}
								{errors}
							/>
						</div>
					</div>
					<div class="row">
                        <div class="col-lg-3">
                            <InputText
                                label="Codice Fiscale"
                                name="codiceF"
                                placeholder="LNSTVL69T28L219K"
                                {errors}
                                bind:val={form_values.codiceF}
                            />
                        </div>
                        <div class="col-lg-3">
                            <InputText
                                label="Carta Identità"
                                name="cartaI"
                                placeholder="DS12345RF"
                                {errors}
                                bind:val={form_values.cartaI}
                            />
                        </div>
						<div class="col-lg-3">
							<InputText
								label="Email"
								name="email"
								placeholder="nome.cognome@istitutoagnelli.it"
								bind:val={form_values.email}
								{errors}
							/>
						</div>
						<div class="col-lg-3">
							<InputText
								label="Telefono"
								name="telefono"
								placeholder="333.123.45.67"
								bind:val={form_values.telefono}
								{errors}
							/>
						</div>
					</div>
					<div class="row">
						<div class="col-lg-2">
							<div class="mb-3">
								<div class="form-label select_text">Tipo</div>
								<select
									class="form-select"
									class:is-invalid={errors.tipo}
									name="tipo"
									bind:value={form_values.tipo}
								>
									{#each tipi_utente as type}
										<option value={type.tipo}>{type.tipo}</option>
									{/each}
								</select>
								{#if errors.tipo}
									<span class="invalid-feedback">{errors.tipo}</span>
								{/if}
							</div>
						</div>
                        <div class="col-lg-2">
							<div class="mb-3">
								<div class="form-label select_text">Classe</div>
								<select
									class="form-select"
									class:is-invalid={errors.classe}
									name="classe"
									bind:value={form_values.classe}
								>
									{#each classi as classe}
										<option value={classe.id}>{classe.istituto} {classe.classe} {classe.sezione}</option>
									{/each}
								</select>
								{#if errors.classe}
									<span class="invalid-feedback">{errors.classe}</span>
								{/if}
							</div>
						</div>
                        <div class="col-lg-3">
							<div class="mb-3">
								<label class="form-label">Istituto</label>
								<div class="form-selectgroup">
									<label class="form-selectgroup-item">
										<input
											type="radio"
											name="istituto"
											value="ITT"
											class="form-selectgroup-input"
											bind:group={form_values.istituto_select}
										/>
										<span class="form-selectgroup-label">ITI</span>
									</label>
									<label class="form-selectgroup-item">
										<input
											type="radio"
											name="istituto"
											value="LICEO"
											class="form-selectgroup-input"
											bind:group={form_values.istituto_select}
										/>
										<span class="form-selectgroup-label">LICEO</span>
									</label>
                                    <label class="form-selectgroup-item">
										<input
											type="radio"
											name="istituto"
											value="MEDIE"
											class="form-selectgroup-input"
											bind:group={form_values.istituto_select}
										/>
										<span class="form-selectgroup-label">MEDIE</span>
									</label>
								</div>
							</div>
						</div>
					</div>
                    <div class="row">
                        <div class="col-lg-12">
							<label class="form-label">Ruolo</label>
							<div class="form-selectgroup">
                                {#each ruoli_utente as ruolo}
                                    <label class="form-selectgroup-item">
                                        <input
                                            type="checkbox"
                                            name="ruolo"
                                            value="{String(ruolo.id)}"
                                            class="form-selectgroup-input"
                                            bind:group={form_values.ruolo}
                                        />
                                        <span class="form-selectgroup-label">{ruolo.ruolo}</span>
                                    </label>
                                {/each}
							</div>
							<br />
							{#if errors.ruolo}
								<span class="feedback-invalid">{errors.ruolo}</span>
							{/if}
						</div>
                    </div>
                    <br>
					<div class="row">
						<div class="col-lg-4">
							<div class="mb-3">
								<label class="form-label">Può Accedere</label>
								<div class="form-selectgroup">
									<label class="form-selectgroup-item">
										<input
											type="radio"
											name="can_login"
											value="SI"
											class="form-selectgroup-input"
											bind:group={form_values.can_login_select}
										/>
										<span class="form-selectgroup-label">SI</span>
									</label>
									<label class="form-selectgroup-item">
										<input
											type="radio"
											name="can_login"
											value="NO"
											class="form-selectgroup-input"
											bind:group={form_values.can_login_select}
										/>
										<span class="form-selectgroup-label">NO</span>
									</label>
								</div>
							</div>
						</div>
						{#if form_values.tipo == 'STUDENTE'}
							<div class="col-lg-4">
								<div class="mb-3">
									<label class="form-label">BES</label>
									<div class="form-selectgroup">
										<label class="form-selectgroup-item">
											<input
												type="radio"
												name="bes"
												value="SI"
												class="form-selectgroup-input"
												bind:group={form_values.bes_select}
											/>
											<span class="form-selectgroup-label">SI</span>
										</label>
										<label class="form-selectgroup-item">
											<input
												type="radio"
												name="bes"
												value="NO"
												class="form-selectgroup-input"
												bind:group={form_values.bes_select}
											/>
											<span class="form-selectgroup-label">NO</span>
										</label>
									</div>
								</div>
							</div>
                            <div class="col-lg-4">
								<div class="mb-3">
									<label class="form-label">Obiettivi Minimi</label>
									<div class="form-selectgroup">
										<label class="form-selectgroup-item">
											<input
												type="radio"
												name="obiettivi_minimi"
												value="SI"
												class="form-selectgroup-input"
												bind:group={form_values.obiettivi_minimi}
											/>
											<span class="form-selectgroup-label">SI</span>
										</label>
										<label class="form-selectgroup-item">
											<input
												type="radio"
												name="obiettivi_minimi"
												value="NO"
												class="form-selectgroup-input"
												bind:group={form_values.obiettivi_minimi}
											/>
											<span class="form-selectgroup-label">NO</span>
										</label>
									</div>
								</div>
							</div>
						{/if}
					</div>
				</div>
				<div class="modal-footer">
					<a href="#" class="btn btn-danger" data-bs-dismiss="modal" on:click={cancel_action}>
						<b>Cancel</b>
					</a>
					<button class="btn btn-success ms-auto">
						<i class="ti ti-plus icon" />
						{#if modal_action == 'create'}
							<b>Crea Utente</b>
						{:else}
							<b>Aggiorna Utente</b>
						{/if}
					</button>
				</div>
			</div>
		</div>
	</form>
</div>

<style>
	/* hack siccome  invalid-feedback non funziona per i radio*/
	.feedback-invalid {
		color: #d63939;
		font-size: 85.714285%;
	}

	.is-invalid-custom {
		border: 1px solid #d63939;
		padding-bottom: -1rem;
	}
</style>
