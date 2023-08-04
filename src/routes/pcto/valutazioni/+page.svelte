<script>
	import { page_pre_title, page_title, page_action_title, page_action_modal } from '$js/store';
	import Table from '$lib/components/common/table.svelte';
	import * as yup from 'yup';
	import { Logger } from '$js/logger';
	import { qna_db } from './qna_db';
	import { wait_fade_finish } from '$js/helper';

	let logger = new Logger('client');
	export let data; //contiene l'oggetto restituito dalla funzione load() eseguita nel back-end
	let pcto = []; // alias per maggior leggibilità
	let valutazioni = [];

	//inizializzo la lista dei PCTO con il risultato della query SQL, data.val si riferisce alle valutazioni
	Object.keys(data.stages).forEach((key) => {
		pcto = [...pcto, data.stages[key]];
	});

	//inizializzo la lista delle valutazioni con il risultato della query SQL, data.val si riferisce alle valutazioni
	Object.keys(data.valutazioni).forEach((key) => {
		valutazioni = [...valutazioni, data.valutazioni[key]];
	});

	//converto le risposte da JSON a Oggetto
	valutazioni.forEach((val) => {
		if (typeof val.qna == 'string') val.qna = JSON.parse(val.qna);
	});

	//configura la pagina pre-titolo, titolo e nome del modale
	$page_pre_title = 'PCTO';
	$page_title = 'Valutazioni';
	$page_action_title = 'Aggiungi valutazione';
	$page_action_modal = 'modal-add-azienda';

	let modal_action = 'create';
	let modal_form; // entry point del form nel modale
	let errors = {}; //traccia gli errori di validazione del form

	let form_values = {
		id_valutazione: 0,
		idUtente: data.session.idUtente,
		idPcto: undefined,
		current_question: 1,
		qna: [...qna_db]
	};

	// schema di validazione del form
	const form_schema = yup.object().shape({
		idPcto: yup.number().min(1, 'PCTO necessario')
	});

	async function start_update(e) {
		modal_action = 'update';

		form_values.id_valutazione = e.detail.id;
		let valutazione = valutazioni.filter((item) => item.id == form_values.id_valutazione)[0];
		form_values.idPcto = valutazione.idPcto;
		form_values.qna = valutazione.qna;
	}

	async function handleSubmit() {
		try {
			// valida il form prima del submit
			await form_schema.validate(form_values, { abortEarly: false });
			errors = {};
			// converto il qna da oggetto a JSON
			modal_form.qna.value = JSON.stringify(form_values.qna);
			modal_form.submit();
		} catch (err) {
			errors = err.inner.reduce((acc, err) => {
				return { ...acc, [err.path]: err.message };
			}, {});
			logger.error(
				`Errori nella validazione del form stage. Oggetto: ${JSON.stringify(
					form_values
				)} -- Errore: ${JSON.stringify(errors)}`
			);
		}
	}

	async function cancel_action(){
		if(modal_action == 'update'){
			await wait_fade_finish(150);
			modal_action = 'create';
			form_values = {
				id_valutazione: 0,
				idUtente: data.session.idUtente,
				idPcto: undefined,
				current_question: 1,
				qna: [...qna_db]
			};
		}
	}
	function select_answer(answer) {
		let current_question = form_values.qna[form_values.current_question - 1].answers;
		current_question.map((risposta) => {
			risposta.selected = false;
			risposta.selected = risposta.aid == answer.aid;
		});
		current_question = [...current_question];
	}
</script>

<Table
	columns={[
		{ name: 'utente', type: 'object', display: 'Autore', key: 'nome' },
		{ name: 'pcto', type: 'object', display: 'Stage', key: 'titolo' },
		{ name: 'createdAt', type: 'date', display: 'data creazione' },
		{ name: 'id', type: 'hidden', display: 'id' }
	]}
	rows={valutazioni}
	page_size={10}
	modal_name={$page_action_modal}
	on:update_start={start_update}
	endpoint="pcto/valutazioni"
    footer="Valutazioni"
	print={false}
    actions={true}
/>

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
			<input type="hidden" name="id" bind:value={form_values.id_valutazione} />
		{/if}
		<input type="hidden" name="qna" value="" />
		<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header">
					{#if modal_action == 'create'}
						<h5 class="modal-title">Nuova Valutazione</h5>
					{:else}
						<h5 class="modal-title">Aggiorna Valutazione</h5>
					{/if}
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" on:click={cancel_action}/>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col-lg-12">
							<div class="mb-3">
								<div class="form-label select_text">Seleziona il PCTO che vuoi valutare</div>
								<select
									class="form-select"
									class:is-invalid={errors.idPcto}
									name="id_pcto"
									bind:value={form_values.idPcto}
								>
									{#each pcto as stage}
										<option value={stage.id}>{stage.titolo}</option>
									{/each}
								</select>
								{#if errors.idPcto}
									<span class="invalid-feedback">{errors.idPcto}</span>
								{/if}
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-lg-12">
							<div class="mb-3">
								<div class="form-label select_text">Seleziona tutte le domande e risposndi:</div>
								<select
									class="form-select"
									name="domanda"
									bind:value={form_values.current_question}
								>
									{#each form_values.qna as quiz}
										<option value={quiz.qid}>{quiz.question}</option>
									{/each}
								</select>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-md-12 col-xl-12">
							<div class="mb-3">
								<div>
                                    <fieldset class="form-fieldset">
									{#each form_values.qna[form_values.current_question - 1].answers as answer}
										<label class="form-check">
											<input
												checked={answer.selected}
												class="form-check-input"
												type="radio"
												name="radio_answers"
												id={answer.aid}
												on:change={() => select_answer(answer)}
											/>
											<span class="form-check-label">{answer.answer}</span>
										</label>
									{/each}
								</fieldset>
                                </div>
							</div>
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
							<b>Crea Valutazione</b>
						{:else}
							<b>Aggiorna Valutazione</b>
						{/if}
					</button>
				</div>
			</div>
		</div>
	</form>
</div>
