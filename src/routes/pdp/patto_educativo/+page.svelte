<script>
	import { page_pre_title, page_title, page_action_title, page_action_modal } from '$js/store';
	import Table from '$lib/components/common/table.svelte';
	import * as helper from '$js/helper';
	import { Logger } from '$js/logger';
	import { griglia_pdp_c2 } from './griglia_pdp_c2.js';
	import InputSelectYn from '$lib/components/modal/input_select_yn.svelte';

	export let data; //contiene l'oggetto restituito dalla funzione load() eseguita nel back-end
	export let form; // Risposta del form dal server

	let logger = new Logger('client');
	let studenti = helper.data2arr(data.studenti);
	//set default griglia_pdp_c2 for students never evaluated
	studenti.forEach((s) => {
		if (s.griglia_pdp_c2 == null) s.griglia_pdp_c2 = griglia_pdp_c2;
	});

	//configura la pagina pre-titolo, titolo e nome del modale
	$page_pre_title = 'TUTOR';
	$page_title = 'Patto Educativo';
	$page_action_title = '';
	$page_action_modal = 'modal-update-griglia';

	let modal_action = 'create';
	let modal_form; // entry point del form nel modale

	// campi del form
	// quest'oggetto deve contenere tutti i valori presenti nel form per
	// le operazione di create e update
	let form_values = {
		student_id: 0,
		griglia_pdp_c2: '[]',
		completo: 'NO'
	};

	async function start_update(e) {
		modal_action = 'update';
		form_values.student_id = e.detail.id;
		//cerca l'utente da fare update
		let studente = studenti.filter((item) => item.id == form_values.student_id)[0];
		form_values.completo = studente.griglia_pdp_c2_done ? 'SI' : 'NO';
		form_values.griglia_pdp_c2 = JSON.parse(studente.griglia_pdp_c2);
	}

	async function cancel_action() {
		if (modal_action == 'update') {
			await helper.wait_fade_finish(150);
			modal_action = 'create'; // Reset model string
			form_values = {
				// Reset form values
				student_id: 0,
				griglia_pdp_c2: [],
				completo: 'NO'
			};
		}
	}
</script>

<Table
	columns={[
		{ name: 'id', type: 'hidden', display: 'ID' },
		{ name: 'cognome', type: 'string', display: 'Cognome', size: 11, search: true },
		{ name: 'nome', type: 'string', display: 'Nome', size: 11, search: true },
		{ name: 'natoIl', type: 'date', display: 'Nato il' },
		{ name: 'email', type: 'string', display: 'email', size: 30 },
		{ name: 'bes', type: 'boolean', display: 'pdp' },
		{ name: 'griglia_pdp_c2_done', type: 'boolean', display: 'completo', search: true }
	]}
	rows={studenti}
	page_size={10}
	modal_name={$page_action_modal}
	on:update_start={start_update}
	footer="Studenti"
	endpoint="pdp/patto_educativo"
	actions={true}
	trash={false}
	print={false}
	print_filter={false}
	update={true}
	update_filter={helper.is_admin(data) ? '' : 'griglia_pdp_c2_done'}
	update_compare={false}
	update_tip="Aggiorna Patto Educativo"
	resource="pdp_patto_educativo"
/>

<!-- Modal from Page action -->
<div
	class="modal modal-blur fade"
	id={$page_action_modal}
	tabindex="-1"
	role="dialog"
	aria-hidden="true"
>
	<form method="POST" action="?/{modal_action}" bind:this={modal_form}>
		<div class="modal-dialog modal-xl" role="document">
			<input type="hidden" name="student_id" bind:value={form_values.student_id} />
			<input
				type="hidden"
				name="griglia_pdp_c2"
				value={JSON.stringify(form_values.griglia_pdp_c2)}
			/>
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Patto Educativo</h5>
				</div>
				<div class="modal-body">
					{#if typeof form_values.griglia_pdp_c2 != 'string'}
						<div class="row">
							<div class="col-lg-12">
								<div class="mb-3">
									<InputSelectYn
										label="1. {form_values.griglia_pdp_c2[0].question}"
										name="answer1"
										bind:val={form_values.griglia_pdp_c2[0].answer}
									/>
									<br /><br />
									<input
										type="text"
										name="disc_1"
										bind:value={form_values.griglia_pdp_c2[0].disc_1}
									/>
									<input
										type="text"
										name="cadenza_1"
										bind:value={form_values.griglia_pdp_c2[0].cadenza_1}
									/><br /><br />
									<input
										type="text"
										name="disc_2"
										bind:value={form_values.griglia_pdp_c2[0].disc_2}
									/>
									<input
										type="text"
										name="cadenza_2"
										bind:value={form_values.griglia_pdp_c2[0].cadenza_2}
									/><br /><br />
									<input
										type="text"
										name="disc_3"
										bind:value={form_values.griglia_pdp_c2[0].disc_3}
									/>
									<input
										type="text"
										name="cadenza_3"
										bind:value={form_values.griglia_pdp_c2[0].cadenza_3}
									/><br /><br />
									<input
										type="text"
										name="disc_4"
										bind:value={form_values.griglia_pdp_c2[0].disc_4}
									/>
									<input
										type="text"
										name="cadenza_4"
										bind:value={form_values.griglia_pdp_c2[0].cadenza_4}
									/>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-lg-4">
								<div class="mb-3">
									<InputSelectYn
										label="2. {form_values.griglia_pdp_c2[1].question}"
										name="answer2"
										bind:val={form_values.griglia_pdp_c2[1].answer}
									/>
								</div>
							</div>
							<div class="col-lg-4">
								<div class="mb-3">
									<InputSelectYn
										label="3. {form_values.griglia_pdp_c2[2].question}"
										name="answer3"
										bind:val={form_values.griglia_pdp_c2[2].answer}
									/>
								</div>
							</div>
							<div class="col-lg-4">
								<div class="mb-3">
									<InputSelectYn
										label="4. {form_values.griglia_pdp_c2[3].question}"
										name="answer4"
										bind:val={form_values.griglia_pdp_c2[3].answer}
									/>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-lg-4">
								<div class="mb-3">
									<InputSelectYn
										label="5. {form_values.griglia_pdp_c2[4].question}"
										name="answer5"
										bind:val={form_values.griglia_pdp_c2[4].answer}
									/>
								</div>
							</div>
							<div class="col-lg-4">
								<div class="mb-3">
									<InputSelectYn
										label="6. {form_values.griglia_pdp_c2[5].question}"
										name="answer6"
										bind:val={form_values.griglia_pdp_c2[5].answer}
									/>
								</div>
							</div>
							<div class="col-lg-4">
								<div class="mb-3">
									<InputSelectYn
										label="7. {form_values.griglia_pdp_c2[6].question}"
										name="answer7"
										bind:val={form_values.griglia_pdp_c2[6].answer}
									/>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-lg-8">
								<div class="mb-3">
									<InputSelectYn
										label="8. {form_values.griglia_pdp_c2[7].question}"
										name="answer8"
										bind:val={form_values.griglia_pdp_c2[7].answer}
									/>
								</div>
							</div>
							<div class="col-lg-4">
								<div class="mb-3">
									<InputSelectYn
										label="9. {form_values.griglia_pdp_c2[8].question}"
										name="answer9"
										bind:val={form_values.griglia_pdp_c2[8].answer}
									/>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-lg-4">
								<div class="mb-3">
									<InputSelectYn
										label="10. {form_values.griglia_pdp_c2[9].question}"
										name="answer10"
										bind:val={form_values.griglia_pdp_c2[9].answer}
									/>
								</div>
							</div>
							<div class="col-lg-4">
								<div class="mb-3">
									<InputSelectYn
										label="11. {form_values.griglia_pdp_c2[10].question}"
										name="answer11"
										bind:val={form_values.griglia_pdp_c2[10].answer}
									/>
								</div>
							</div>
							<div class="col-lg-4">
								<div class="mb-3">
									<InputSelectYn
										label="12. {form_values.griglia_pdp_c2[11].question}"
										name="answer12"
										bind:val={form_values.griglia_pdp_c2[11].answer}
									/>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-lg-4">
								<div class="mb-3">
									<InputSelectYn
										label="13. {form_values.griglia_pdp_c2[12].question}"
										name="answer13"
										bind:val={form_values.griglia_pdp_c2[12].answer}
									/>
								</div>
							</div>
							<div class="col-lg-4">
								<div class="mb-3">
									<InputSelectYn
										label="14. {form_values.griglia_pdp_c2[13].question}"
										name="answer14"
										bind:val={form_values.griglia_pdp_c2[13].answer}
									/>
								</div>
							</div>
							<div class="col-lg-4">
								<div class="mb-3">
									<InputSelectYn
										label="15. {form_values.griglia_pdp_c2[14].question}"
										name="answer15"
										bind:val={form_values.griglia_pdp_c2[14].answer}
									/>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-lg-4">
								<div class="mb-3">
									<InputSelectYn
										label="16. {form_values.griglia_pdp_c2[15].question}"
										name="answer16"
										bind:val={form_values.griglia_pdp_c2[15].answer}
									/>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-lg-12">
								<div class="mb-3">
									<label class="form-label">17. {form_values.griglia_pdp_c2[16].question} </label>
									<input
										type="text"
										name="answer16"
										size="80"
										bind:value={form_values.griglia_pdp_c2[16].answer}
									/>
								</div>
							</div>
						</div>
						<div class="row">
							<div class="col-lg-12">
								<div class="mb-3">
									<label class="form-label">18. {form_values.griglia_pdp_c2[17].question} </label>
									<input
										type="text"
										name="answer17"
										size="80"
										bind:value={form_values.griglia_pdp_c2[17].answer}
									/>
								</div>
							</div>
						</div>
					{/if}
					<div class="row">
						<div class="col-lg-4">
							<br />
							<label class="form-label">Patto Educativo Completo</label>
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
