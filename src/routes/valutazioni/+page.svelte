<script>
	
	import Modal from '$lib/components/common/modal.svelte';
	import { page_pre_title, page_title, page_action, page_action_modal } from '../../js/store';
	import Table from '$lib/components/common/table.svelte';

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

	let idConvenzione, nome, idUtente, istituto;
	let dataConvenzione = convert_date(new Date());
	let dataProtocollo = convert_date(new Date());

	let istituto_select = 'ITT';

	let modal_action = 'create';
	let company_id;

	function convert_date(d) {
		let data = d.toLocaleDateString().split('/');
		return `${data[2]}-${data[1]}-${data[0]}`;
	}

	async function start_update(e) {
		modal_action = 'update';
		company_id = e.detail.id;
		//cerca l'azienda da fare update
		let azienda = aziende.filter((item) => item.id == company_id)[0];
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
		{ name: 'nome', type: 'string', display: 'Azienda/Ente' },
		{ name: 'idUtente', type: 'string', display: 'Creato da' },
		{ name: 'valutazione', type: 'string', display: 'Valutazione' }
	]}
	rows={aziende}
	type="convenzioni"
	page_size={5}
	modal_name="modal-add-azienda"
	on:update_start={start_update}
/>

<Modal {modal_action} {company_id} {dataConvenzione}
{dataProtocollo} {istituto_select}
new_title="Nuova valutazione" update_title="Aggiorna valutazione" >
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

</Modal>