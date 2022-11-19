<script>
	import { get } from 'svelte/store';

	import { onMount } from 'svelte';
	import { page_pre_title, page_title, page_action_title, page_action_modal } from '../../js/store';
	import Table from '$lib/components/common/table.svelte';
    import { convert_date } from '../../js/helper';
    
	export let data; //contiene l'oggetto restituito dalla funzione load() eseguita nel back-end
	let presenze = []; // alias per maggior leggibilità
    // let aziende = [];

	// inizializzo la lista delle stage con il risultato della query SQL
	Object.keys(data.presenze).forEach((key) => {
		presenze = [...presenze, data.presenze[key]];
	});

    // Object.keys(data.companies).forEach((key) => {
	// 	aziende = [...aziende, data.companies[key]];
	// });

	//configura la pagina pre-titolo, titolo e nome del modale
	$page_pre_title = 'PCTO';
	$page_title = 'Presenze';
	$page_action_title = 'Aggiungi Presenza';
	$page_action_modal = 'modal-add-presenze';
	let modal_action = 'create';

    let presenza_id, pcto, studente;
	let dataPresenza = convert_date(new Date());
	let oraInizio = convert_date(new Date());
    let oraFine = convert_date(new Date());

	async function start_update(e) {
		modal_action = 'update';
		
        pcto_id = e.detail.id;
		//cerca l'azienda da fare update
		let stage = presenze.filter((item) => item.id == pcto_id)[0];
		
        titolo = stage.titolo;
        descrizione = stage.descrizione;
		dataInizio = convert_date(stage.dataInizio);
		dataFine = convert_date(stage.dataFine);
	}
</script>

<Table
	columns={[
		{ name: 'id', type: 'hidden', display: 'ID' },
        { name: 'lavoraPer', type: 'object', key: 'titolo', display: 'pcto' },
        { name: 'presenza', type: 'object', key: 'cognome', display: 'studente' },
        { name: 'dataPresenza', type: 'date', display: 'data' },
        { name: 'oraInizio', type: 'time', display: 'entrata' },
        { name: 'oraFine', type: 'time', display: 'uscita' },
	]}
	rows={presenze}
	page_size={5}
	modal_name={$page_action_modal}
	on:update_start={start_update}
	type="presenze"
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
			<input type="hidden" name="id" bind:value={presenza_id} />
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
							<div class="mb-3">
								<div class="form-label select_text">PCTO</div>
                                <select class="form-select" name="azienda" bind:value={pcto}>
                                    <!-- {#each aziende as azienda}
                                        <option value={azienda.id}>{azienda.nome}</option>
                                    {/each} -->
                                </select>	
							</div>
						</div>
                        <div class="col-lg-6">
							<div class="mb-3">
								<div class="form-label select_text">Studente</div>
                                <select class="form-select" name="azienda" bind:value={studente}>
                                    <!-- {#each aziende as azienda}
                                        <option value={azienda.id}>{azienda.nome}</option>
                                    {/each} -->
                                </select>	
							</div>
						</div>
					</div>
                    <div class="row">
                        <div class="col-lg-4">
							<div class="mb-3">
								<label class="form-label">Data Inizo</label>
								<input
									type="date"
									name="dataPresenza"
									class="form-control"
                                    bind:value={dataPresenza}
								/>
							</div>
						</div>
						<div class="col-lg-4">
							<div class="mb-3">
								<label class="form-label">Ingresso</label>
								<input
									type="time"
									name="oraInizio"
									class="form-control"
									bind:value={oraInizio}
								/>
							</div>
						</div>
                        <div class="col-lg-4">
							<div class="mb-3">
								<label class="form-label">Uscita</label>
								<input
									type="time"
									name="oraFine"
									class="form-control"
									bind:value={oraFine}
								/>
							</div>
						</div>
                    </div>
                    <!-- <div class="row">
                        <div class="col-lg-12">
							<div class="mb-3">
								<label class="form-label">Descrizione</label>
                                <textarea 
                                    class="form-control" 
                                    name="descrizione" 
                                    rows="3" 
                                    placeholder="Descrizione PCTO..."
                                    bind:value={descrizione}
                                />
							</div>
						</div>
					</div> -->
				</div>
				<div class="modal-footer">
					<a href="#" class="btn btn-danger" data-bs-dismiss="modal">
						<b>Cancel</b>
					</a>
					<button class="btn btn-success ms-auto" data-bs-dismiss="modal">
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
