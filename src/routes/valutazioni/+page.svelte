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
		{ name: 'valutation', type: 'number', display: 'Valutazione' }
	]}
	rows={aziende}
	type="convenzioni"
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
					<input type="radio" id="star5" name="rate" value="5" />
					<label for="star5" title="text">5 stars</label>
					<input type="radio" id="star4" name="rate" value="4" />
					<label for="star4" title="text">4 stars</label>
					<input type="radio" id="star3" name="rate" value="3" />
					<label for="star3" title="text">3 stars</label>
					<input type="radio" id="star2" name="rate" value="2" />
					<label for="star2" title="text">2 stars</label>
					<input type="radio" id="star1" name="rate" value="1" />
					<label for="star1" title="text">1 star</label>
				</div>
			</div>
		</div>
	</div>
</Modal>

<style>
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
