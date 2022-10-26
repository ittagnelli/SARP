<script>
	import { get } from 'svelte/store';

	import { onMount } from 'svelte';
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

	let idConvenzione, nome, idUtente, dataConvenzione, dataProtocollo, istituto;
    let istituto_select = "ITT";
	// function modal_add_azienda() {
	// 	console.log('ADD AZIENDA', n_convenzione);
	// }

	async function bget() {
		console.log('GET');
	}

	async function start_update(e) {
		function convert_date(d) {
			let data = d.toLocaleDateString().split('/');
			return `${data[2]}-${data[1]}-${data[0]}`;
		}

		let id = e.detail.id;
		console.log('STARING UPDATE:', id);
		// idConvenzione = "919"
		//cerca l'azienda da fare update
		let azienda = aziende.filter((item) => item.id == id)[0];
		console.log(azienda.istituto);
		console.log(azienda.dataConvenzione.toLocaleDateString());
		console.log('XXXXXX:', convert_date(azienda.dataConvenzione));
		idConvenzione = azienda.idConvenzione;
		nome = azienda.nome;
		idUtente = azienda.idUtente;
		dataConvenzione = convert_date(azienda.dataConvenzione);
		dataProtocollo = convert_date(azienda.dataProtocollo);
		istituto_select = azienda.istituto;
	}
</script>

<Table
	columns={[
		{ name: 'id', type: 'hidden', display: 'ID' },
		{ name: 'idConvenzione', type: 'string', display: 'NO.' },
		{ name: 'nome', type: 'string', display: 'Azienda/Ente' },
		{ name: 'idUtente', type: 'string', display: 'Creato da' },
		{ name: 'dataConvenzione', type: 'date', display: 'Data Convenzione' },
		{ name: 'dataProtocollo', type: 'date', display: 'Data Protocollo' },
		{ name: 'istituto', type: 'string', display: 'Istituto' }
	]}
	rows={aziende}
	page_size={5}
	modal_name="modal-add-azienda"
	on:update_start={start_update}
/>

<button on:click={bget}>GET</button>

<!-- Modal from Page action -->
<div
	class="modal modal-blur fade"
	id="modal-add-azienda"
	tabindex="-1"
	role="dialog"
	aria-hidden="true"
>
	<form method="POST" action="?/create">
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
									name="no_convenzione"
									placeholder="Numero Convenzione"
									bind:value={idConvenzione}
								/>
							</div>
						</div>
						<div class="col-lg-8">
							<div class="mb-3">
								<label class="form-label">Azienda</label>
								<input
									type="text"
									class="form-control"
									name="azienda"
									placeholder="Nome Azienda o Ente"
									bind:value={nome}
								/>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-lg-4">
							<div class="mb-3">
								<label class="form-label">Data Convenzione</label>
								<input
									type="date"
									name="data_convenzione"
									class="form-control"
									bind:value={dataConvenzione}
								/>
							</div>
						</div>
						<div class="col-lg-4">
							<div class="mb-3">
								<label class="form-label">Data Protocollo</label>
								<input
									type="date"
									name="data_protocollo"
									class="form-control"
									bind:value={dataProtocollo}
								/>
							</div>
						</div>
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
						<b>Crea Azienda</b></button
					>
				</div>
			</div>
		</div>
	</form>
</div>
