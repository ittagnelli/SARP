<script>
	import { get } from 'svelte/store';

	import { onMount } from 'svelte';
	import { page_pre_title, page_title, page_action_title, page_action_modal } from '../../js/store';
	import Table from '$lib/components/common/table.svelte';
    import { convert_date } from '../../js/helper';
    
	export let data; //contiene l'oggetto restituito dalla funzione load() eseguita nel back-end
	let utenti = []; // alias per maggior leggibilità
    let tipi_utente = [];
	let ruoli_utente = [];

    // inizializzo la lista delle utenti con il risultato della query SQL
	Object.keys(data.utenti).forEach((key) => {
		utenti = [...utenti, data.utenti[key]];
	});

    Object.keys(data.tipi_utente).forEach((key) => {
		tipi_utente = [...tipi_utente, data.tipi_utente[key]];
	});
    Object.keys(data.ruoli_utente).forEach((key) => {
		ruoli_utente = [...ruoli_utente, data.ruoli_utente[key]];
	});

	//configura la pagina pre-titolo, titolo e nome del modale
	$page_pre_title = 'ADMIN';
	$page_title = 'Utenti';
	$page_action_title = 'Aggiungi Utente';
	$page_action_modal = 'modal-add-utente';

	let user_id, nome, cognome, idUtente, istituto, email, telefono, bes;
	
	let istituto_select = 'ITT';
    let bes_select = 'NO';
    let tipo = "studente";
    let ruolo = "admin";

	let modal_action = 'create';

	async function start_update(e) {
		modal_action = 'update';
        console.log("UPDATE:", e.detail)
		user_id = e.detail.id;
		//cerca l'utente da fare update
		let utente = utenti.filter((item) => item.id == user_id)[0];

        console.log("UTENTE UPDATE:", utente);
        nome = utente.nome;
        cognome = utente.cognome;
        email = utente.email;
        telefono = utente.telefono;
        tipo = utente.tipo;
        ruolo = utente.ruolo;
        istituto_select = utente.istituto;
        bes_select = utente.bes ? "SI" : "NO";
        console.log("BES:", bes_select)
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
	]}
	rows={utenti}
	page_size={10}
	modal_name={$page_action_modal}
	on:update_start={start_update}
	type="utenti"
/>

<!-- Modal from Page action -->
<div
	class="modal modal-blur fade"
	id={$page_action_modal}
	tabindex="-1"
	role="dialog"
	aria-hidden="true"
>
	<form method="POST" action="?/{modal_action}">
		{#if modal_action == 'update'}
			<input type="hidden" name="id" bind:value={user_id} />
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
					<div class="row">
                        <div class="col-lg-4">
							<div class="mb-3">
								<div class="form-label select_text">Tipo</div>
                                <select class="form-select" name="tipo" bind:value={tipo}>
                                    {#each tipi_utente as type}
                                        <option value={type.tipo}>{type.tipo}</option>
                                    {/each}
                                </select>	
							</div>
						</div>
						<div class="col-lg-4">
							<div class="mb-3">
								<label class="form-label">Nome</label>
								<input
									type="text"
									class="form-control"
									name="nome"
									placeholder="Nome Utente"
									bind:value={nome}
								/>
							</div>
						</div>
						<div class="col-lg-4">
							<div class="mb-3">
								<label class="form-label">Cognome</label>
								<input
									type="text"
									class="form-control"
									name="cognome"
									placeholder="Cognome Utente"
									bind:value={cognome}
								/>
							</div>
						</div>
					</div>
                    <div class="row">
                        <div class="col-lg-4">
							<div class="mb-3">
								<label class="form-label">Email</label>
								<input
									type="text"
									class="form-control"
									name="email"
									placeholder="email Utente"
									bind:value={email}
								/>
							</div>
						</div>
                        <div class="col-lg-4">
							<div class="mb-3">
								<label class="form-label">Telefono</label>
								<input
									type="text"
									class="form-control"
									name="telefono"
									placeholder="Telefono Utente"
									bind:value={telefono}
								/>
							</div>
						</div>
                        <div class="col-lg-4">
							<div class="mb-3">
								<div class="form-label select_text">Ruolo</div>
                                <select class="form-select" name="ruolo" bind:value={ruolo}>
                                    {#each ruoli_utente as role}
                                        <option value="{role.ruolo}">{role.ruolo}</option>
                                    {/each}
                                </select>	
							</div>
						</div>
					</div>
					<div class="row">
                        {#if tipo == "STUDENTE"}
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
											bind:group={bes_select}
										/>
										<span class="form-selectgroup-label">SI</span>
									</label>
									<label class="form-selectgroup-item">
										<input
											type="radio"
											name="bes"
											value="NO"
											class="form-selectgroup-input"
											bind:group={bes_select}
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
											bind:group={istituto_select}
										/>
										<span class="form-selectgroup-label">ITI</span>
									</label>
									<label class="form-selectgroup-item">
										<input
											type="radio"
											name="istituto"
											value="LICEO"
											class="form-selectgroup-input"
											bind:group={istituto_select}
										/>
										<span class="form-selectgroup-label">LICEO</span>
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
					<button class="btn btn-success ms-auto" data-bs-dismiss="modal">
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
