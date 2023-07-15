<script>
	import { page_pre_title, page_title, page_action_title, page_action_modal } from '$js/store';
	import Table from '$lib/components/common/table.svelte';
	import * as yup from 'yup';
	import { Logger } from '$js/logger';
	import { qna_db } from './qna_db';
	import * as helper from '$js/helper';
	
	let logger = new Logger('client');
	export let data; //contiene l'oggetto restituito dalla funzione load() eseguita nel back-end
	let pcto = []; // alias per maggior leggibilità
    let pcto_studenti = [];
	let valutazioni = [];

	//inizializzo la lista dei PCTO con il risultato della query SQL, data.val si riferisce alle valutazioni
	Object.keys(data.stages).forEach((key) => {
		pcto = [...pcto, data.stages[key]];
	});

	//inizializzo la lista delle valutazioni con il risultato della query SQL, data.val si riferisce alle valutazioni
	Object.keys(data.valutazioni).forEach((key) => {
		valutazioni = [...valutazioni, data.valutazioni[key]];
	});

    //arricchisce oggetto
    valutazioni.forEach(val => {
        val.stagista['full_name'] = `${val.stagista['cognome']} ${val.stagista['nome']}`;
        val['azienda'] = val.pcto.offertoDa.nome;
    });

	//converto le risposte da JSON a Oggetto
	valutazioni.forEach((val) => {
		if (typeof val.valutazione == 'string') val.valutazione = JSON.parse(val.valutazione);
	});

    $: {
        let selected_stage = pcto.filter((item) => item.id == form_values.idPcto);
        if(selected_stage[0]) {
            //filtro gli studenti che hanno già una valutazione per questo PCTO
            pcto_studenti = selected_stage[0].svoltoDa.filter(
                s => valutazioni.findIndex(
                    v => v.idStagista == s.id) == -1);
        }
    }

	//configura la pagina pre-titolo, titolo e nome del modale
	$page_pre_title = 'PCTO';
	$page_title = 'Valutazioni';
	$page_action_title = helper.is_studente(data) ? '': 'Valuta Stagista';
	$page_action_modal = 'modal-add-azienda';

	let modal_action = 'create';
	let modal_form; // entry point del form nel modale
	let errors = {}; //traccia gli errori di validazione del form

	let form_values = {
		id_valutazione: 0,
		idUtente: data.session.idUtente,
		idPcto: undefined,
        idStudente: undefined,
		// current_question: 1,
		valutazione: [...qna_db]
	};

	// schema di validazione del form
	const form_schema = yup.object().shape({
		idPcto: yup.number().min(1, 'PCTO necessario'),
        idStudente: yup.number().min(1, 'Studente necessario'),
	});

	async function start_update(e) {
		modal_action = 'update';

		form_values.id_valutazione = e.detail.id;
		let valutazione = valutazioni.filter((item) => item.id == form_values.id_valutazione)[0];
        form_values.idPcto = valutazione.idPcto;
        form_values.idStudente = valutazione.idStagista;
		form_values.valutazione = valutazione.valutazione;
	}

	async function handleSubmit() {
		try {
			// valida il form prima del submit
			await form_schema.validate(form_values, { abortEarly: false });
			errors = {};

            // converto la valutazione da oggetto a JSON
			modal_form.valutazione.value = JSON.stringify(form_values.valutazione);
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
			await helper.wait_fade_finish();
			modal_action = 'create';
			form_values = {
				id_valutazione: 0,
				idUtente: data.session.idUtente,
				idPcto: undefined,
                idStudente: undefined,
				// current_question: 1,
				valutazione: [...qna_db]
			};
		}
	}

    function select_answer(qname) {
        let question = form_values.valutazione.find(q => q.qname == qname);
        if(question)
            question.answer = +modal_form[qname].value;
    }
</script>

<Table
	columns={[
		{ name: 'id', type: 'hidden', display: 'id' },
        { name: 'creatoDa', type: 'hidden', display: 'creatoDa' },
        { name: 'pcto', type: 'object', display: 'Stage', key: 'titolo', size: 50 },
        { name: 'azienda', type: 'string', display: 'Azienda', size: 50, search: true },
        { name: 'stagista', type: 'object', display: 'Stagista', key: 'full_name', size: 30, search: true },
		{ name: 'createdAt', type: 'date', display: 'data creazione' }
	]}
	rows={valutazioni}
	page_size={10}
	modal_name={$page_action_modal}
	on:update_start={start_update}
	endpoint="pcto/valutazione_studenti"
    footer="Valutazioni"
	print={false}
    actions={true}
    resource="pcto_valutazione_studenti"
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
		<input type="hidden" name="valutazione" value="" />
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
						<div class="col-lg-6">
							<div class="mb-3">
								<div class="form-label select_text">Seleziona il PCTO che vuoi valutare</div>
								<select
									class="form-select"
									class:is-invalid={errors.idPcto}
									name="id_pcto"
									bind:value={form_values.idPcto}
                                    disabled={modal_action == 'update'}
								>
									{#each pcto as stage}
                                        <option value={stage.id}>{stage.titolo} (a.s.{stage.anno_scolastico})</option>
									{/each}
								</select>
								{#if errors.idPcto}
									<span class="invalid-feedback">{errors.idPcto}</span>
								{/if}
							</div>
						</div>
                        <div class="col-lg-6">
							<div class="mb-3">
                                {#if pcto_studenti.length >= 1}
                                    <div class="form-label select_text">Studente</div>
                                    <select 
                                        class="form-select" 
                                        class:is-invalid="{errors.idStudente}" 
                                        name="studente" 
                                        bind:value={form_values.idStudente}
                                        disabled={modal_action == 'update'}
                                    >  
                                        {#each pcto_studenti as studente}
                                            <option value={studente.id}>{studente.cognome} {studente.nome}</option>
                                        {/each}
                                    </select>
                                    {#if errors.idStudente}
                                        <span class="invalid-feedback">{errors.idStudente}</span>
                                    {/if}
                                {/if}
							</div>
						</div>
					</div>
                    <div class="row">
						<div class="col-lg-6">
							<div class="mb-3">
								<div>
                                    <div class="form-label select_text q-title">{form_values.valutazione[0].question}</div>
                                    <fieldset class="form-fieldset">
										<label class="form-check">
											<input
												checked={form_values.valutazione[0].answer == form_values.valutazione[0].answers[0].aid}
												class="form-check-input"
												type="radio"
												name="{form_values.valutazione[0].qname}"
												value={form_values.valutazione[0].answers[0].aid}
                                                on:change={() => select_answer(form_values.valutazione[0].qname)}
											/>
											<span class="form-check-label">{form_values.valutazione[0].answers[0].answer}</span>
										</label>
                                        <label class="form-check">
											<input
                                            checked={form_values.valutazione[0].answer == form_values.valutazione[0].answers[1].aid}
												class="form-check-input"
												type="radio"
												name="{form_values.valutazione[0].qname}"
                                                value={form_values.valutazione[0].answers[1].aid}
                                                on:change={() => select_answer(form_values.valutazione[0].qname)}
											/>
											<span class="form-check-label">{form_values.valutazione[0].answers[1].answer}</span>
										</label>
                                        <label class="form-check">
											<input
                                            checked={form_values.valutazione[0].answer == form_values.valutazione[0].answers[2].aid}
												class="form-check-input"
												type="radio"
												name="{form_values.valutazione[0].qname}"
                                                value={form_values.valutazione[0].answers[2].aid}
                                                on:change={() => select_answer(form_values.valutazione[0].qname)}
											/>
											<span class="form-check-label">{form_values.valutazione[0].answers[2].answer}</span>
										</label>
								</fieldset>
                                </div>
							</div>
						</div>
                        <div class="col-lg-6">
							<div class="mb-3">
								<div>
                                    <div class="form-label select_text q-title">{form_values.valutazione[1].question}</div>
                                    <fieldset class="form-fieldset">
										<label class="form-check">
											<input
                                                checked={form_values.valutazione[1].answer == form_values.valutazione[1].answers[0].aid}
												class="form-check-input"
												type="radio"
												name="{form_values.valutazione[1].qname}"
												value={form_values.valutazione[1].answers[0].aid}
                                                on:change={() => select_answer(form_values.valutazione[1].qname)}
											/>
											<span class="form-check-label">{form_values.valutazione[1].answers[0].answer}</span>
										</label>
                                        <label class="form-check">
											<input
                                                checked={form_values.valutazione[1].answer == form_values.valutazione[1].answers[1].aid}
												class="form-check-input"
												type="radio"
												name="{form_values.valutazione[1].qname}"
                                                value={form_values.valutazione[1].answers[1].aid}
                                                on:change={() => select_answer(form_values.valutazione[1].qname)}
											/>
											<span class="form-check-label">{form_values.valutazione[1].answers[1].answer}</span>
										</label>
                                        <label class="form-check">
											<input
                                                checked={form_values.valutazione[1].answer == form_values.valutazione[1].answers[2].aid}
												class="form-check-input"
												type="radio"
												name="{form_values.valutazione[1].qname}"
                                                value={form_values.valutazione[1].answers[2].aid}
                                                on:change={() => select_answer(form_values.valutazione[1].qname)}
											/>
											<span class="form-check-label">{form_values.valutazione[1].answers[2].answer}</span>
										</label>
								</fieldset>
                                </div>
							</div>
						</div>
					</div>
                    <div class="row">
                        <div class="col-lg-6">
							<div class="mb-3">
								<div>
                                    <div class="form-label select_text q-title">{form_values.valutazione[2].question}</div>
                                    <fieldset class="form-fieldset">
										<label class="form-check">
											<input
                                                checked={form_values.valutazione[2].answer == form_values.valutazione[2].answers[0].aid}
												class="form-check-input"
												type="radio"
												name="{form_values.valutazione[2].qname}"
												value={form_values.valutazione[2].answers[0].aid}
                                                on:change={() => select_answer(form_values.valutazione[2].qname)}
											/>
											<span class="form-check-label">{form_values.valutazione[2].answers[0].answer}</span>
										</label>
                                        <label class="form-check">
											<input
                                                checked={form_values.valutazione[2].answer == form_values.valutazione[2].answers[1].aid}
												class="form-check-input"
												type="radio"
												name="{form_values.valutazione[2].qname}"
                                                value={form_values.valutazione[2].answers[1].aid}
                                                on:change={() => select_answer(form_values.valutazione[2].qname)}
											/>
											<span class="form-check-label">{form_values.valutazione[2].answers[1].answer}</span>
										</label>
                                        <label class="form-check">
											<input
                                                checked={form_values.valutazione[2].answer == form_values.valutazione[2].answers[2].aid}
												class="form-check-input"
												type="radio"
												name="{form_values.valutazione[2].qname}"
                                                value={form_values.valutazione[2].answers[2].aid}
                                                on:change={() => select_answer(form_values.valutazione[2].qname)}
											/>
											<span class="form-check-label">{form_values.valutazione[2].answers[2].answer}</span>
										</label>
								</fieldset>
                                </div>
							</div>
						</div>
                        <div class="col-lg-6">
							<div class="mb-3">
								<div>
                                    <div class="form-label select_text q-title">{form_values.valutazione[3].question}</div>
                                    <fieldset class="form-fieldset">
										<label class="form-check">
											<input
                                                checked={form_values.valutazione[3].answer == form_values.valutazione[3].answers[0].aid}
												class="form-check-input"
												type="radio"
												name="{form_values.valutazione[3].qname}"
												value={form_values.valutazione[3].answers[0].aid}
                                                on:change={() => select_answer(form_values.valutazione[3].qname)}
											/>
											<span class="form-check-label">{form_values.valutazione[3].answers[0].answer}</span>
										</label>
                                        <label class="form-check">
											<input
                                                checked={form_values.valutazione[3].answer == form_values.valutazione[3].answers[1].aid}
												class="form-check-input"
												type="radio"
												name="{form_values.valutazione[3].qname}"
                                                value={form_values.valutazione[3].answers[1].aid}
                                                on:change={() => select_answer(form_values.valutazione[3].qname)}
											/>
											<span class="form-check-label">{form_values.valutazione[3].answers[1].answer}</span>
										</label>
                                        <label class="form-check">
											<input
                                                checked={form_values.valutazione[3].answer == form_values.valutazione[3].answers[2].aid}
												class="form-check-input"
												type="radio"
												name="{form_values.valutazione[3].qname}"
                                                value={form_values.valutazione[3].answers[2].aid}
                                                on:change={() => select_answer(form_values.valutazione[3].qname)}
											/>
											<span class="form-check-label">{form_values.valutazione[3].answers[2].answer}</span>
										</label>
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
					<button class="btn btn-success ms-auto" disabled={helper.is_studente(data)}>
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

<style>
    .q-title {
        height: 4rem;
        display: flex;
        align-items: flex-end;
        text-align: justify;
    }
</style>