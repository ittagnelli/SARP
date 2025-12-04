<script>
	import { page_pre_title, page_title, page_action_title, page_action_modal } from '$js/store';
	import Table from '$lib/components/common/table.svelte';
	import InputText from '$lib/components/modal/input_text.svelte';
	import InputDate from '$lib/components/modal/input_date.svelte';
	import * as helper from '$js/helper';
	import { Logger } from '$js/logger';
	import { griglia_pdp_a } from './griglia_pdp_a.js';

	export let data; //contiene l'oggetto restituito dalla funzione load() eseguita nel back-end
	export let form; // Risposta del form dal server

	let logger = new Logger('client');
	let studenti = helper.data2arr(data.studenti);
	let current_griglia_pdp_a = {};

	//set default griglia_a for students never evaluated
	studenti.forEach((s) => {
		if (s.griglia_pdp_a == null) s.griglia_pdp_a = griglia_pdp_a;
	});

	//configura la pagina pre-titolo, titolo e nome del modale
	$page_pre_title = 'STUDENTE';
	$page_title = 'Sezione A';
	$page_action_title = '';
	$page_action_modal = 'modal-update-griglia';

	let modal_action = 'create';
	let modal_form; // entry point del form nel modale

	// campi del form
	// quest'oggetto deve contenere tutti i valori presenti nel form per
	// le operazione di create e update
	let form_values = {
		student_id: 0,
		completo: 'NO'
	};

	async function start_update(e) {
		modal_action = 'update';
		form_values.student_id = e.detail.id;
		//cerca l'utente da fare update
		let studente = studenti.filter((item) => item.id == form_values.student_id)[0];
		form_values.completo = studente.griglia_pdp_a_done ? 'SI' : 'NO';
		current_griglia_pdp_a = JSON.parse(studente.griglia_pdp_a);
	}

	async function cancel_action() {
		if (modal_action == 'update') {
			await helper.wait_fade_finish(150);
			modal_action = 'create'; // Reset model string
			form_values = {
				// Reset form values
				student_id: 0,
				completo: 'NO'
			};
		}
	}
</script>

<Table
	columns={[
		{ name: 'id', type: 'hidden', display: 'ID' },
		{ name: 'cognome', type: 'string', display: 'Cognome', size: 30, search: true },
		{ name: 'nome', type: 'string', display: 'Nome', size: 30, search: true },
		{ name: 'natoIl', type: 'date', display: 'Nato il' },
		{ name: 'email', type: 'string', display: 'email', size: 30 },
		{ name: 'bes', type: 'boolean', display: 'pdp', search: true },
		{ name: 'griglia_pdp_a_done', type: 'boolean', display: 'competo', search: true }
	]}
	rows={studenti}
	page_size={10}
	modal_name={$page_action_modal}
	on:update_start={start_update}
	footer="Studenti"
	endpoint="pdp/griglia_osservativa"
	actions={true}
	trash={false}
	print={false}
	print_filter={false}
	update={true}
	update_filter={helper.is_admin(data) ? '' : 'griglia_pdp_a_done'}
	update_compare={false}
	update_tip="Compila la seziona A del PDP per lo studente selezionato"
	resource="pdp_mipresento"
/>

<div
	class="modal modal-blur fade"
	id={$page_action_modal}
	tabindex="-1"
	role="dialog"
	aria-hidden="true"
>
	<form method="POST" action="?/{modal_action}" bind:this={modal_form}>
		<div class="modal-dialog modal-lg" role="document">
			<input type="hidden" name="student_id" bind:value={form_values.student_id} />
			<input type="hidden" name="griglia_pdp_a" value={JSON.stringify(current_griglia_pdp_a)} />
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Sezione A</h5>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col-lg-3">
							<InputText
								label="Lingua Madre"
								name="lingua_madre"
								bind:val={current_griglia_pdp_a['lingua_madre']}
							/>
						</div>
						<div class="col-lg-4">
							<label class="form-label">Bilingue</label>
							<div class="form-selectgroup">
								<label class="form-selectgroup-item">
									<input
										type="radio"
										name="bilingue"
										value="SI"
										class="form-selectgroup-input"
										bind:group={current_griglia_pdp_a['bilingue']}
									/>
									<span class="form-selectgroup-label">SI</span>
								</label>
								<label class="form-selectgroup-item">
									<input
										type="radio"
										name="bilingue"
										value="NO"
										class="form-selectgroup-input"
										bind:group={current_griglia_pdp_a['bilingue']}
									/>
									<span class="form-selectgroup-label">NO</span>
								</label>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-lg-4">
							<InputText
								label="Codice SSN ICD10"
								name="relazione_ssn_icd10"
								bind:val={current_griglia_pdp_a['relazione_ssn_icd10']}
							/>
						</div>
						<div class="col-lg-4">
							<InputText
								label="Redattore SSN"
								name="relazione_ssn_redattore"
								bind:val={current_griglia_pdp_a['relazione_ssn_redattore']}
							/>
						</div>
						<div class="col-lg-4">
							<InputDate
								label="Rilasciata il"
								name="relazione_ssn_data"
								bind:val={current_griglia_pdp_a['relazione_ssn_data']}
								errors={{}}
							/>
						</div>
					</div>
					<div class="row">
						<div class="col-lg-12">
							<InputText
								label="SSN Aggiornamenti Diagnostici"
								name="relazione_ssn_aggiornamenti"
								bind:val={current_griglia_pdp_a['relazione_ssn_aggiornamenti']}
							/>
						</div>
					</div>
					<div class="row">
						<div class="col-lg-6">
							<InputText
								label="Altre Relazioni Cliniche"
								name="relazione_ssn_altre"
								bind:val={current_griglia_pdp_a['relazione_ssn_altre']}
							/>
						</div>
						<div class="col-lg-6">
							<InputText
								label="Interventi Riabilitativi"
								name="relazione_ssrelazione_ssn_interventi_altre"
								bind:val={current_griglia_pdp_a['relazione_ssn_interventi']}
							/>
						</div>
					</div>
					<div class="row">
						<div class="col-lg-8">
							<InputText
								label="Altro Redattore"
								name="relazione_altro_redattore"
								bind:val={current_griglia_pdp_a['relazione_altro_redattore1']}
							/>
						</div>
						<div class="col-lg-4">
							<InputDate
								label="Altra Data"
								name="relazione_altro_data"
								bind:val={current_griglia_pdp_a['relazione_altro_data1']}
								errors={{}}
							/>
						</div>
					</div>
					<div class="row">
						<div class="col-lg-8">
							<InputText
								label="Altro Redattore"
								name="relazione_altro_redattore"
								bind:val={current_griglia_pdp_a['relazione_altro_redattore2']}
							/>
						</div>
						<div class="col-lg-4">
							<InputDate
								label="Altra Data"
								name="relazione_altro_data"
								bind:val={current_griglia_pdp_a['relazione_altro_data2']}
								errors={{}}
							/>
						</div>
					</div>
					<div class="row">
						<div class="col-lg-8">
							<InputText
								label="Altro Redattore"
								name="relazione_altro_redattore"
								bind:val={current_griglia_pdp_a['relazione_altro_redattore3']}
							/>
						</div>
						<div class="col-lg-4">
							<InputDate
								label="Altra Data"
								name="relazione_altro_data"
								bind:val={current_griglia_pdp_a['relazione_altro_data3']}
								errors={{}}
							/>
						</div>
					</div>
					<div class="row">
						<div class="col-lg-8">
							<InputText
								label="Altro Redattore"
								name="relazione_altro_redattore"
								bind:val={current_griglia_pdp_a['relazione_altro_redattore4']}
							/>
						</div>
						<div class="col-lg-4">
							<InputDate
								label="Altra Data"
								name="relazione_altro_data"
								bind:val={current_griglia_pdp_a['relazione_altro_data4']}
								errors={{}}
							/>
						</div>
					</div>
					<div class="row">
						<div class="col-lg-8">
							<InputText
								label="Altro Redattore"
								name="relazione_altro_redattore"
								bind:val={current_griglia_pdp_a['relazione_altro_redattore5']}
							/>
						</div>
						<div class="col-lg-4">
							<InputDate
								label="Altra Data"
								name="relazione_altro_data"
								bind:val={current_griglia_pdp_a['relazione_altro_data5']}
								errors={{}}
							/>
						</div>
					</div>
					<div class="row">
						<div class="col-lg-4">
							<br />
							<label class="form-label">Sezione A Completa</label>
							<div class="form-selectgroup">
								<label class="form-selectgroup-item">
									<input
										type="radio"
										name="completo"
										value="SI"
										class="form-selectgroup-input"
										bind:group={form_values.completo}
									/>
									<span class="form-selectgroup-label">SI</span>
								</label>
								<label class="form-selectgroup-item">
									<input
										type="radio"
										name="completo"
										value="NO"
										class="form-selectgroup-input"
										bind:group={form_values.completo}
									/>
									<span class="form-selectgroup-label">NO</span>
								</label>
							</div>
						</div>
					</div>
					<br />
					<div class="modal-footer">
						<a href="#" class="btn btn-danger" data-bs-dismiss="modal">
							<b>Cancel</b>
						</a>
						<button class="btn btn-success ms-auto">
							<i class="ti ti-mail-forward icon" />
							<b>Invia Risposte</b>
						</button>
					</div>
				</div>
			</div>
		</div>
	</form>
</div>

<style>
	.input {
		margin-left: 0.5rem;
		margin-right: 0.5rem;
	}
</style>
