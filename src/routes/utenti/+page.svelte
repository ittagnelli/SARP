<script>
	import { page_pre_title, page_title, page_action_title, page_action_modal } from '../../js/store';
	import Table from '$lib/components/common/table.svelte';
    import * as helper from '../../js/helper';
    import * as yup from 'yup';
    import InputText from '$lib/components/modal/input_text.svelte';
	import ModalError from '$lib/components/common/modal_error.svelte';
    import { Logger } from '../../js/logger';
	import { onMount } from 'svelte';

	export let data; //contiene l'oggetto restituito dalla funzione load() eseguita nel back-end
	export let form; // Risposta del form dal server

    let logger = new Logger("client");
	let utenti = helper.data2arr(data.utenti);
    let tipi_utente = helper.data2arr(data.tipi_utente);
	let ruoli_utente = helper.data2arr(data.ruoli_utente);
    
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
        ruolo: '',
        nome: '',
        cognome: '',
        email: '',
        telefono: '',
        bes_select: 'NO',
		can_login_select: 'SI',
        istituto_select: 'ITT'
	};

	// schema di validazione del form
	const form_schema = yup.object().shape({
		tipo: yup
		.string()
		.required('Tipo utente necessatrio'),

		ruolo: yup
		.string()
		.required('Ruolo utente necessario'),

        nome: yup
		.string()
		.required('Nome utente necessario')
		.matches(/^[a-zA-Z]{3,20}$/, "Nome utente non valido"),

        cognome: yup
		.string()
		.required('Cognome utente necessario')
		.matches(/^[a-zA-Z]{3,20}$/, "Cognome utente non valido"),

		email: yup
		.string()
		.required('Email necessaria')
		.matches(/^[a-z]+\.[a-z]+@istitutoagnelli.it$/, "Email non valida [nome.cognome@istitutoagnelli.it]"),

		telefono: yup
		.string()
		.matches(/^[0-9]{3}\.[0-9]{3}\.[0-9]{2}\.[0-9]{2}$/, "Numero non valido [333.123.45.67]")
	});

	onMount(() => { // Controlliamo che l'inserimento sia andato a buon fine, usiamo on mount per richiamare le funzioni del DOM
        if(form != null){
            form_values = JSON.parse(localStorage.getItem("form")); // Riempiamo il modale
            helper.show_modal();
        } else {
            localStorage.removeItem("form"); //PROF: rimuoviamo il form dal localstorage
        }
    });
	
	async function start_update(e) {
		modal_action = 'update';
        form_values.user_id = e.detail.id;
		//cerca l'utente da fare update
		let utente = utenti.filter((item) => item.id == form_values.user_id)[0];

        form_values.nome = utente.nome;
        form_values.cognome = utente.cognome;
        form_values.email = utente.email;
        form_values.telefono = utente.telefono;
        form_values.tipo = utente.tipo;
        form_values.ruolo = utente.ruolo;
        form_values.istituto_select = utente.istituto;
        form_values.bes_select = utente.bes ? "SI" : "NO";
        form_values.can_login_select = utente.can_login ? "SI" : "NO";
	}

    async function handleSubmit() {

		try {
			// valida il form prima del submit
			await form_schema.validate(form_values, { abortEarly: false });
			errors = {};
			localStorage.setItem("form", JSON.stringify(form_values));	// Nel caso l'inserimento fallisse abbiamo il "backup" nel localstorage
			modal_form.submit();
		} catch (err) {
			errors = err.inner.reduce((acc, err) => {
				return { ...acc, [err.path]: err.message };
			}, {});
			logger.error(`Errori nella validazione del form utenti. Oggetto: ${JSON.stringify(form_values)} -- Errore: ${JSON.stringify(errors)}`);
		}
	}
</script>

<Table
	columns={[
		{ name: 'id', type: 'hidden', display: 'ID' },
        { name: 'picture', type: 'image', display: 'Utente' },
        { name: 'cognome', type: 'string', display: 'Cognome' },
		{ name: 'nome', type: 'string', display: 'Nome' },
        { name: 'tipo', type: 'string', display: 'Tipo' },
        { name: 'ruolo', type: 'string', display: 'Ruolo' },
        { name: 'email', type: 'string', display: 'email' },
        { name: 'telefono', type: 'string', display: 'telefono' },
        { name: 'bes', type: 'boolean', display: 'bes' }, 
        { name: 'istituto', type: 'string', display: 'istituto' },
        { name: 'can_login', type: 'boolean', display: 'can_login' }, 
	]}
	rows={utenti}
	page_size={10}
	modal_name={$page_action_modal}
	on:update_start={start_update}
	type="utenti"
    type_genre="m"
    actions={true}
    current_user={data.session.idUtente}
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
			<input type="hidden" name="id" bind:value={form_values.user_id} />
		{/if}
		<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header">
					{#if modal_action == 'create'}
						<h5 class="modal-title">Nuovo Studente</h5>
					{:else}
						<h5 class="modal-title">Aggiorna Studente</h5>
					{/if}
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
				</div>
				<div class="modal-body">
                    {#if form}
						<ModalError msg={form.error_mex}></ModalError>
					{/if}
					<div class="row">
                        <div class="col-lg-4">
                            <!-- InputSelect component ha dei problemi (two way binding) non ancora risolti
                            che non permettono di usarlo qui -->
							<div class="mb-3">
								<div class="form-label select_text">Tipo</div>
                                <select class="form-select" class:is-invalid="{errors.tipo}" name="tipo" bind:value={form_values.tipo}>
                                    {#each tipi_utente as type}
                                        <option value={type.tipo}>{type.tipo}</option>
                                    {/each}
                                </select>
                                {#if errors.tipo}
                                    <span class="invalid-feedback">{errors.tipo}</span>
                                {/if}	
							</div>
						</div>
						<div class="col-lg-4">
                            <InputText
                                label="Nome"
                                name="nome"
                                placeholder="Nome Utente"
                                bind:val={form_values.nome}
                                {errors}
                            />
						</div>
						<div class="col-lg-4">
                            <InputText
                                label="Cognome"
                                name="cognome"
                                placeholder="Cognome Utente"
                                bind:val={form_values.cognome}
                                {errors}
                            />
						</div>
					</div>
                    <div class="row">
                        <div class="col-lg-4">
                            <InputText
                                label="Email"
                                name="email"
                                placeholder="nome.cognome@istitutoagnelli.it"
                                bind:val={form_values.email}
                                {errors}
                            />
						</div>
                        <div class="col-lg-4">
                            <InputText
                                label="Telefono"
                                name="telefono"
                                placeholder="333.123.45.67"
                                bind:val={form_values.telefono}
                                {errors}
                            />
						</div>
                        <div class="col-lg-4">
							<div class="mb-3">
								<div class="form-label select_text">Ruolo</div>
                                <select class="form-select" class:is-invalid="{errors.ruolo}" name="ruolo" bind:value={form_values.ruolo}>
                                    {#each ruoli_utente as role}
                                        <option value="{role.ruolo}">{role.ruolo}</option>
                                    {/each}
                                </select>	
                                {#if errors.ruolo}
                                    <span class="invalid-feedback">{errors.ruolo}</span>
                                {/if}	
							</div>
						</div>
					</div>
					<div class="row">
                        {#if form_values.tipo == "STUDENTE"}
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
                        {/if}
						<div class="col-lg-4">
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
								</div>
							</div>
						</div>
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
					</div>
				</div>
				<div class="modal-footer">
					<a href="#" class="btn btn-danger" data-bs-dismiss="modal">
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
