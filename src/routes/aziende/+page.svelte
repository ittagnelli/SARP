<script>
	// import { onMount } from 'svelte';
	import { page_pre_title, page_title, page_action, page_action_modal } from '../../js/store';
	import Table from '/src/components/common/table.svelte';

	export let data; //contiene l'oggetto restituito dalla funzione load() eseguita nel back-end
	let aziende = []; // alias per maggior leggibilità

	// inizializzo la lista delle aziende con il risultato della query SQL
	Object.keys(data).forEach((key) => {
		aziende = [...aziende, data[key]];
	});

	//configura la pagina pre-titolo, titolo e nome del modale
	$page_pre_title = 'PCTO';
	$page_title = 'Aziende';
	$page_action = 'Aggiungi Azienda';
	$page_action_modal = 'modal-add-azienda';

	let n_convenzione;
	function modal_add_azienda() {
		console.log('ADD AZIENDA', n_convenzione);
	}
</script>

<Table
	columns={[
		{ name: 'idConvenzione', type: 'string', display: 'NO.' },
		{ name: 'nome', type: 'string', display: 'Azienda/Ente' },
		{ name: 'idUtente', type: 'string', display: 'Creato da' },
		{ name: 'dataConvenzione', type: 'date', display: 'Data Convenzione' },
		{ name: 'dataProtocollo', type: 'date', display: 'Data Protocollo' },
		{ name: 'istituto', type: 'string', display: 'Istituto' }
	]}
	rows={aziende}
	page_size={4}
/>

<!-- Modal from Page action -->
<div
	class="modal modal-blur fade"
	id="modal-add-azienda"
	tabindex="-1"
	role="dialog"
	aria-hidden="true"
>
	<div class="modal-dialog modal-lg" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">Nuova Azienda</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<div class="row">
					<div class="col-lg-4">
						<div class="mb-3">
							<label class="form-label">NO. Convenzione</label>
							<input
								type="text"
								class="form-control"
								name="example-text-input"
								placeholder="Numero Convenzione"
								bind:value={n_convenzione}
							/>
						</div>
					</div>
					<div class="col-lg-8">
						<div class="mb-3">
							<label class="form-label">Azienda</label>
							<input
								type="text"
								class="form-control"
								name="example-text-input"
								placeholder="Nome Azienda o Ente"
							/>
						</div>
					</div>
				</div>
				<div class="row">
					<div class="col-lg-4">
						<div class="mb-3">
							<label class="form-label">Data Convenzione</label>
							<input type="date" class="form-control" />
						</div>
					</div>
					<div class="col-lg-4">
						<div class="mb-3">
							<label class="form-label">Data Convenzione</label>
							<input type="date" class="form-control" />
						</div>
					</div>
					<div class="col-lg-4">
						<div class="mb-3">
							<label class="form-label">Istituto</label>
							<div class="form-selectgroup">
								<label class="form-selectgroup-item">
									<input
										type="radio"
										name="name"
										value="HTML"
										class="form-selectgroup-input"
										checked
									/>
									<span class="form-selectgroup-label">ITI</span>
								</label>
								<label class="form-selectgroup-item">
									<input type="radio" name="name" value="CSS" class="form-selectgroup-input" />
									<span class="form-selectgroup-label">Liceo</span>
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
				<a
					href="#"
					class="btn btn-success ms-auto"
					data-bs-dismiss="modal"
					on:click={modal_add_azienda}
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="icon"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						stroke-width="2"
						stroke="currentColor"
						fill="none"
						stroke-linecap="round"
						stroke-linejoin="round"
						><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line
							x1="12"
							y1="5"
							x2="12"
							y2="19"
						/><line x1="5" y1="12" x2="19" y2="12" /></svg
					>
					<b>Crea Azienda</b>
				</a>
			</div>
		</div>
	</div>
</div>
