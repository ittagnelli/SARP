<script>
	import Modal from '$lib/components/common/modal.svelte';
	import { page_pre_title, page_title, page_action, page_action_modal } from '../../js/store';
	import Table from '$lib/components/common/table.svelte';

	export let data; //contiene l'oggetto restituito dalla funzione load() eseguita nel back-end
	let aziende = []; // alias per maggior leggibilità

	// inizializzo la lista delle aziende con il risultato della query SQL, data.val si riferisce alle valutazioni
	Object.keys(data.val).forEach((key) => {
		aziende = [...aziende, data.val[key]];
	});

	//configura la pagina pre-titolo, titolo e nome del modale
	$page_pre_title = 'PCTO';
	$page_title = 'Valutazioni';
	$page_action = 'Aggiungi valutazione';
	$page_action_modal = 'modal-add-azienda';

	let istituto_select = 'ITT';

	let modal_action = 'create';
	let company_id = 0;
	let utente = 0;
	let valutatore = "";
	let ids_update = [];	// index 0 = id_utente, 1 = id_pcto, 2 = valutatore, needed for update
	let old_ids = [];

	async function start_update(e) {
		modal_action = 'update';
		const data = e.detail.id; // index 0 = id_utente, 1 = id_pcto, 2 = valutatore
		utente = data[0];
		company_id = data[1];	
		valutatore = data[2];
		ids_update = data;
		old_ids = data;
	}

	function update_ids_id(){
		if(modal_action == 'update')
			ids_update[1] = company_id;	// Update company_id in ids if update data
	}

	function update_ids_val(){
		if(modal_action == 'update')
			ids_update[2] = valutatore;	// Update company_id in ids if update data
	}
	
</script>

<Table
	columns={[
		{ name: 'nome', type: 'string', display: 'Azienda/Ente' },
		{ name: 'valutatore', type: 'number', display: 'Valutatore' },
		{ name: 'valutation', type: 'string', display: 'Valutazione' },
		{ name: 'autore', type: 'number', display: 'Autore' },
		{ name: 'id', type: 'hidden', display: 'id'}
	]}
	rows={aziende}
	type="valutazioni"
	page_size={5}
	modal_name="modal-add-azienda"
	on:update_start={start_update}
/>

<Modal
	{modal_action}
	{company_id}
	{istituto_select}
	new_title="Nuova valutazione"
	update_title="Aggiorna valutazione"
>
	<div class="row">
		<div class="row">
			<div class="col-lg-4">
				<p class="text">Voto:</p>
				<div class="rate">
					<input type="radio" id="star5" name="voto" value="5" />
					<label for="star5" title="text">5 stars</label>
					<input type="radio" id="star4" name="voto" value="4" />
					<label for="star4" title="text">4 stars</label>
					<input type="radio" id="star3" name="voto" value="3" />
					<label for="star3" title="text">3 stars</label>
					<input type="radio" id="star2" name="voto" value="2" />
					<label for="star2" title="text">2 stars</label>
					<input type="radio" id="star1" name="voto" value="1" />
					<label for="star1" title="text">1 star</label>
				</div>
			</div>
			<div class="col-lg-4">
				<label for="valutatore" title="text" class="select_text">Valutatore</label>
				<input type="text" id="valutatore" name="valutatore" bind:value={valutatore} on:change={update_ids_val}/>
			</div>
		</div>
		{#if modal_action == "update"}
			<input type="hidden" id="valutatore" name="ids" bind:value={ids_update}/>
			<input type="hidden" id="valutatore" name="old_ids" bind:value={old_ids}/>
		{/if}
		<div class="row">
			<div class="col-lg-6">
				<div class="select_companies">
					<div class="form-label select_text">Azienda che fornisce PCTO</div>
					<select class="form-select" name="id_pcto" bind:value={company_id} on:change={update_ids_id}>
						{#each data.companies as company}
							<option value={company.id}>{company.nome}</option>
						{/each}
					</select>		
				</div>
			</div>
		</div>
	</div>
</Modal>

<style>
	.select_text{
		margin-bottom: 7px;
	}
	.select_companies{
		padding: 0 14px;
	}
	.text {
		padding: 0 14px;
	}
	* {
		margin: 0;
		padding: 0;
	}
	.rate {
		float: left;
		height: 46px;
		padding: 0 10px;
	}
	.rate:not(:checked) > input {
		position: absolute;
		top: -9999px;
	}
	.rate:not(:checked) > label {
		float: right;
		width: 1em;
		overflow: hidden;
		white-space: nowrap;
		cursor: pointer;
		font-size: 30px;
		color: #ccc;
	}
	.rate:not(:checked) > label:before {
		content: '★ ';
	}
	.rate > input:checked ~ label {
		color: #ffc700;
	}
	.rate:not(:checked) > label:hover,
	.rate:not(:checked) > label:hover ~ label {
		color: #deb217;
	}
	.rate > input:checked + label:hover,
	.rate > input:checked + label:hover ~ label,
	.rate > input:checked ~ label:hover,
	.rate > input:checked ~ label:hover ~ label,
	.rate > label:hover ~ input:checked ~ label {
		color: #c59b08;
	}
</style>
