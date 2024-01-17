<script>
	import { page_pre_title, page_title, page_action_title, page_action_modal } from '$js/store';
	import Table from '$lib/components/common/table.svelte';
	import * as helper from '$js/helper';
	import InputText from '$lib/components/modal/input_text.svelte';
	import ModalError from '$lib/components/common/modal_error.svelte';
	import { Logger } from '$js/logger';

	export let data; //contiene l'oggetto restituito dalla funzione load() eseguita nel back-end
	export let form; // Risposta del form dal server

	let logger = new Logger('client');
    let classi = helper.data2arr(data.classi);
    let docenti = helper.data2arr(data.docenti);

	//configura la pagina pre-titolo, titolo e nome del modale
	$page_pre_title = 'ADMIN';
	$page_title = 'Classi';
	$page_action_title = '';
	$page_action_modal = 'modal-add-classe';

	let modal_action = 'create';
	let modal_form; // entry point del form nel modale

	// campi del form
	// quest'oggetto deve contenere tutti i valori presenti nel form per
	// le operazione di create e update
	let form_values = {
		class_id: 0,
        classe: 0,
        istituto: '',
        sezione: '',
        tutor: 0
	};

	async function start_update(e) {
		modal_action = 'update';
		form_values.class_id = e.detail.id;
		//cerca l'utente da fare update
		let classe = classi.filter((item) => item.id == form_values.class_id)[0];

        console.log(classe)
		form_values.classe = classe.classe;
        form_values.istituto = classe.istituto;
        form_values.sezione = classe.sezione;
        form_values.tutor = classe.coordinatoreId;
	}

	async function cancel_action(){
		if(modal_action == 'update'){
			await helper.wait_fade_finish(150);
			modal_action = 'create';	// Reset model string
			form_values = {	// Reset form values
                class_id: 0,
                classe: 0,
                istituto: '',
                sezione: '',
                tutor: 0
			};
		}
	}
	async function handleSubmit() {
		try {
            modal_form.submit();
		} catch (err) {
			logger.error(
				`Errori nella validazione del form utenti. Oggetto: ${JSON.stringify(
					form_values
				)}`
			);
		}
	}
</script>

<Table
	columns={[
		{ name: 'id', type: 'hidden', display: 'ID' },
		{ name: 'classe', type: 'string', display: 'Classe', size: 4 },
        { name: 'istituto', type: 'string', display: 'Istituto', size: 6 },
        { name: 'sezione', type: 'string', display: 'Sezione', size: 5 },
        { name: 'coordinatore', type: 'object', key: 'cognome', display: 'Tutor', size: 20 },
        
	]}
	rows={classi}
	page_size={10}
	modal_name={$page_action_modal}
	on:update_start={start_update}
	footer="Classi"
    endpoint="support/classi"
	actions={true}
    trash={false}
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
			<input type="hidden" name="id" bind:value={form_values.class_id} />
		{/if}
		<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header">
					{#if modal_action == 'create'}
						<h5 class="modal-title">Nuova Classe</h5>
					{:else}
						<h5 class="modal-title">Aggiorna Classe</h5>
					{/if}
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" on:click={cancel_action}/>
				</div>
				<div class="modal-body">
					{#if form}
						<ModalError msg={form.error_mex} />
					{/if}
					<div class="row">
						<div class="col-lg-2">
							<InputText label="Classe" name="classe" placeholder="Classe" readonly bind:val={form_values.classe} />
						</div>
						<div class="col-lg-2">
							<InputText label="Istituto" name="istituto" placeholder="Istituto" readonly bind:val={form_values.istituto} />
						</div>
                        <div class="col-lg-2">
							<InputText label="Sezione" name="sezione" placeholder="Sezione" readonly bind:val={form_values.sezione} />
						</div>
                        <div class="col-lg-6">
                            <div class="form-label select_text">Tutor</div>
								<select
									class="form-select"
									name="tutor"
									bind:value={form_values.tutor}
								>
									{#each docenti as docente}
										<option value={docente.id}>{docente.cognome} {docente.nome}</option>
									{/each}
								</select>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<a href="#" class="btn btn-danger" data-bs-dismiss="modal" on:click={cancel_action}>
						<b>Cancel</b>
					</a>
					<button class="btn btn-success ms-auto">
						<i class="ti ti-plus icon" />
						{#if modal_action == 'create'}
							<b>Crea Classe</b>
						{:else}
							<b>Aggiorna Classe</b>
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
