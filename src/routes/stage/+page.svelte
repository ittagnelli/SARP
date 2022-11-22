<script>
	import { get } from 'svelte/store';

	import { onMount } from 'svelte';
	import { page_pre_title, page_title, page_action_title, page_action_modal } from '../../js/store';
	import Table from '$lib/components/common/table.svelte';
    import { convert_date } from '../../js/helper';
    import Select from 'svelte-select';
    
	export let data; //contiene l'oggetto restituito dalla funzione load() eseguita nel back-end
	let stages = []; // alias per maggior leggibilità
    let aziende = [];
    let utenti = [];

	// inizializzo la lista delle stage con il risultato della query SQL
	Object.keys(data.stages).forEach((key) => {
		stages = [...stages, data.stages[key]];
	});

    console.log("STAGES:", stages)

    Object.keys(data.companies).forEach((key) => {
		aziende = [...aziende, data.companies[key]];
	});

    Object.keys(data.utenti).forEach((key) => {
		utenti = [...utenti, data.utenti[key]];
	});

    utenti.forEach((utente) => {
        utente['label'] = utente.cognome.concat(' ', utente.nome);
        utente['value'] = utente.id;
    })

    let svolto = [];
    let svoltoDa = [];

    $: {
        if(modal_action == 'create') {
            svoltoDa = [];
            console.log("CRERATE................")
        }
    }

	//configura la pagina pre-titolo, titolo e nome del modale
	$page_pre_title = 'PCTO';
	$page_title = 'Stage';
	$page_action_title = 'Aggiungi stage';
	$page_action_modal = 'modal-add-stage';
	let modal_action = 'create';

    let azienda, titolo, descrizione, pcto_id;
	let dataInizio = convert_date(new Date());
	let dataFine = convert_date(new Date());

	async function start_update(e) {
		modal_action = 'update';
		
        pcto_id = e.detail.id;
		//cerca l'azienda da fare update
		let stage = stages.filter((item) => item.id == pcto_id)[0];
        console.log("UPDATE STAGE:", stage)
        console.log("STAGE SVOLTO DA:", stage.svoltoDa);
        azienda =  stage.offertoDa.id;
        stage.svoltoDa.forEach((utente) => {
            utente['label'] = utente.cognome.concat(' ', utente.nome);
            utente['value'] = utente.id;
        });
        svoltoDa = stage.svoltoDa;
		
        titolo = stage.titolo;
        descrizione = stage.descrizione;
		dataInizio = convert_date(stage.dataInizio);
		dataFine = convert_date(stage.dataFine);
	}

    function handleSelect(event) {
		let user_selected = event.detail;
        svolto = [];
        user_selected.forEach((item) => {
            svolto = [...svolto, item.value];
        })
        
        console.log(svolto)
	}

console.log("UTEnTI:", utenti.slice(0,5))

// let items = [
//     {value: 'chocolate', label: 'Chocolate'},
//     {value: 'pizza', label: 'Pizza'},
//     {value: 'cake', label: 'Cake'},
//     {value: 'chips', label: 'Chips'},
//     {value: 'ice-cream', label: 'Ice Cream'},
//   ];

//   let value = [ {value: 'pizza', label: 'Pizza'}, {value: 'ice-cream', label: 'Ice Cream'}];
</script>
<!-- 
<Select {items} value={value} isMulti={true} ></Select> -->





<Table
	columns={[
		{ name: 'id', type: 'hidden', display: 'ID' },
		{ name: 'titolo', type: 'string', display: 'titolo' },
        { name: 'offertoDa', type: 'object', key: 'nome' , display: 'azienda' },
        { name: 'dataInizio', type: 'date', display: 'Inizio' },
        { name: 'dataFine', type: 'date', display: 'Fine' },
        { name: 'descrizione', type: 'string', display: 'descrizione' },
        { name: 'svoltoDa', type: 'array', subtype: 'picture', key: 'picture', display: 'iscritti' },
	]}
	rows={stages}
	page_size={5}
	modal_name={$page_action_modal}
	on:update_start={start_update}
	type="stage"
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
        <input type="hidden" name="studenti" bind:value={svolto} />
		{#if modal_action == 'update'}
			<input type="hidden" name="id" bind:value={pcto_id} />
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
							<div class="mb-3">
								<div class="form-label select_text">Azienda</div>
                                <select class="form-select" name="azienda" bind:value={azienda}>
                                    {#each aziende as azienda}
                                        <option value={azienda.id}>{azienda.nome}</option>
                                    {/each}
                                </select>	
							</div>
						</div>
						<div class="col-lg-4">
							<div class="mb-3">
								<label class="form-label">Data Inizo</label>
								<input
									type="date"
									name="data_inizo"
									class="form-control"
                                    bind:value={dataInizio}
								/>
							</div>
						</div>
						<div class="col-lg-4">
							<div class="mb-3">
								<label class="form-label">Data Fine</label>
								<input
									type="date"
									name="data_fine"
									class="form-control"
									bind:value={dataFine}
								/>
							</div>
						</div>
					</div>
                    <div class="row">
                        <div class="col-lg-12">
							<div class="mb-3">
								<label class="form-label">Titolo</label>
								<input
									type="text"
									class="form-control"
									name="titolo"
									placeholder="Titolo PCTO"
									bind:value={titolo}
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
                                    name="descrizione" 
                                    rows="3" 
                                    placeholder="Descrizione PCTO..."
                                    bind:value={descrizione}
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
                            items={utenti} 
                            value={svoltoDa}
                            isMulti={true}
                            placeholder="Selezione gli studenti..."
                            on:select={handleSelect}
                            ></Select>
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
							<b>Crea Stage</b>
						{:else}
							<b>Aggiorna Stage</b>
						{/if}
					</button>
				</div>
			</div>
		</div>
	</form>
</div>