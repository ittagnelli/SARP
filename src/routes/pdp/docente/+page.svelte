<script>
	import * as helper from '$js/helper.js';
	import { page_action_title, page_title, page_pre_title, page_action_modal } from '$js/store';
	import Table from '$lib/components/common/table.svelte';
	import MessageBox from '$lib/components/common/message_box.svelte';
	import { onMount } from 'svelte';
	import * as yup from 'yup';
	import { misure_dispensative } from '../template/dispensative.js';
	import { misure_compensative } from '../template/compensative.js';
	import { misure_valutative } from '../template/valutative.js';
	import { strategie_classe } from '../template/strategie_classe';
	import { strategie_didattiche } from '../template/strategie_didattiche';

	export let data;
	export let form;

	// sintesi vocale flag trigger overall PDP sintesi vocale only if for Lettere Italiane is true
	const MATERIA_SINTESI_VOCALE = 'Lettere Italiane';

	let obiettivi_minimi_templates = helper.data2arr(data.obiettivi_minimi_templates);
	let pdp = helper.data2arr(data.pdp);
	//add field for easier table visualization
	pdp.forEach((p) => {
		p['studente_col'] = `${p.studente.cognome} ${p.studente.nome}`;
		p[
			'classe_col'
		] = `${p.insegnamento.classe.classe} ${p.insegnamento.classe.istituto} ${p.insegnamento.classe.sezione}`;
		p['materia_col'] = p.insegnamento.materia.nome;
		p['obiettivi_minimi'] = p.studente.obiettivi_minimi;
		p['docente_col'] = `${p.insegnamento.docente.cognome} ${p.insegnamento.docente.nome}`;
	});

	let current_dispensative = JSON.parse(misure_dispensative);
	let current_compensative = JSON.parse(misure_compensative);
	let current_valutative = JSON.parse(misure_valutative);
	let current_strategie_classe = JSON.parse(strategie_classe);
	let current_strategie_didattiche = JSON.parse(strategie_didattiche);
	let current_pdp = pdp[0];

	/* Page properties */
	$page_action_title = '';
	$page_pre_title = 'PDP annuale';
	$page_title = 'PDP docente';
	$page_action_modal = 'modal-template';

	onMount(() => {
		if (form != null && form.status == 'ok') {
			helper.mbox_show('success', 'Conferma', 'PDP aggiornato correttamente', 3000);
		}
	});

	/* Page form model */
	let modal_form;
	let form_values = {
		template_id: 0,
		id: 0,
		dispensative: '',
		compensative: '',
		valutative: '',
		strategie_classe: '',
		strategie_didattiche: '',
		altro_compensative: '',
		altro_dispensative: '',
		altro_valutative: '',
		note: '',
		completo: 'NO',
		obiettivi_minimi: '',
		obiettivi_minimi_id: 0,
		has_obiettivi_minimi: false,
		sintesi_vocale: false,
		tempo_esteso: false
	};

	// schema di validazione del form
	const form_schema = yup.object().shape({
		//keep it for compatibility and also it might be useful in future
		has_obiettivi_minimi: yup.boolean(),
		obiettivi_minimi: yup.string().when('has_obiettivi_minimi', {
			is: true,
			then: yup.string().required('Obiettivi Minimi necessari')
		})
	});

	let modal_action = 'create';
	let errors = {};

	async function start_update(e) {
		modal_action = 'update';

		form_values.template_id = 0;
		form_values.id = e.detail.id;
		current_pdp = pdp.filter((i) => i.id == e.detail.id)[0];

		current_dispensative = JSON.parse(current_pdp.dispensative);
		current_compensative = JSON.parse(current_pdp.compensative);
		current_valutative = JSON.parse(current_pdp.valutative);
		current_strategie_classe = JSON.parse(current_pdp.strategie_classe);
		current_strategie_didattiche = JSON.parse(current_pdp.strategie_didattiche);
		form_values.altro_compensative = current_pdp.altro_compensative;
		form_values.altro_dispensative = current_pdp.altro_dispensative;
		form_values.altro_valutative = current_pdp.altro_valutative;
		form_values.note = current_pdp.note;
		form_values.completo = current_pdp.completo ? 'SI' : 'NO';
		form_values.has_obiettivi_minimi = current_pdp.obiettivi_minimi;
	}

	function reset_form_value() {
		form_values = {
			template_id: 0,
			id: 0,
			dispensative: '',
			compensative: '',
			valutative: '',
			strategie_classe: '',
			strategie_didattiche: '',
			altro_compensative: '',
			altro_dispensative: '',
			altro_valutative: '',
			note: '',
			completo: 'NO',
			obiettivi_minimi: '',
			obiettivi_minimi_id: 0,
			sintesi_vocale: false,
			tempo_esteso: false
		};
	}

	async function handleSubmit() {
		form_values.altro_compensative = helper.sanitize_text_form(form_values.altro_compensative);
		form_values.altro_dispensative = helper.sanitize_text_form(form_values.altro_dispensative);
		form_values.altro_valutative = helper.sanitize_text_form(form_values.altro_valutative);
		form_values.note = helper.sanitize_text_form(form_values.note);
		form_values.dispensative = JSON.stringify(current_dispensative);
		form_values.compensative = JSON.stringify(current_compensative);
		form_values.valutative = JSON.stringify(current_valutative);
		form_values.strategie_classe = JSON.stringify(current_strategie_classe);
		form_values.strategie_didattiche = JSON.stringify(current_strategie_didattiche);

		//imposta i flag sintesi_vocale e tempo_esteso
		form_values.sintesi_vocale =
			current_pdp.insegnamento.materia.nome == MATERIA_SINTESI_VOCALE &&
			current_compensative[1].selected;
		form_values.tempo_esteso = false;

		try {
			// valida il form prima del submit solo se ci sono obiettivi minimi
			await form_schema.validate(form_values, { abortEarly: false });
			errors = {};
			modal_form.submit();
			reset_form_value();
		} catch (err) {
			errors = err.inner.reduce((acc, err) => {
				return { ...acc, [err.path]: err.message };
			}, {});
		}
	}

	async function cancel_action() {
		if (modal_action == 'update') {
			await helper.wait_fade_finish(150);
			modal_action = 'create'; // Reset string
			reset_form_value();
		}
	}

	function update_template() {
		const template = data.templates?.filter((t) => t.id == form_values.template_id)[0];

		current_dispensative = JSON.parse(template.dispensative);
		current_compensative = JSON.parse(template.compensative);
		current_valutative = JSON.parse(template.valutazione);
		current_strategie_classe = JSON.parse(template?.strategie_classe);
		current_strategie_didattiche = JSON.parse(template?.strategie_didattiche);
		form_values.altro_compensative = template.altro_compensative;
		form_values.altro_dispensative = template.altro_dispensative;
		form_values.altro_valutative = template.altro_valutative;
		form_values.note = template.note;
	}

	function update_obiettivi_minimi() {
		let obiettivo_minimo = obiettivi_minimi_templates.filter(
			(template) => template.id == form_values.obiettivi_minimi_id
		)[0];
		if (obiettivo_minimo) form_values.obiettivi_minimi = obiettivo_minimo.template;
	}

	function prevent_enter(key) {
		if (key.key == 'Enter') key.preventDefault();
	}
</script>

<MessageBox />

<Table
	columns={[
		{ name: 'id', type: 'hidden', display: 'ID' },
		{ name: 'classe_col', type: 'string', display: 'Classe', size: 20, search: true },
		{ name: 'studente_col', type: 'string', display: 'Studente', size: 50, search: true },
		{ name: 'materia_col', type: 'string', display: 'Materia', size: 50, search: true },
		{ name: 'docente_col', type: 'string', display: 'Docente', size: 50, search: true },
		{ name: 'anno', type: 'string', display: 'AS' },
		{ name: 'obiettivi_minimi', type: 'boolean', display: 'Obiettivi Minimi', search: true },
		{ name: 'completo', type: 'boolean', display: 'completo', search: true }
	]}
	page_size={10}
	rows={pdp}
	endpoint="pdp/docente"
	footer="PDP docente"
	actions={true}
	print={false}
	print_filter={false}
	update_tip="Creo o aggiorna PDP per lo studente e la materia selezionati"
	resource="pdp_docente"
	modal_name={$page_action_modal}
	on:update_start={start_update}
	trash={false}
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
		<input type="hidden" name="id" bind:value={form_values.id} />
		<input type="hidden" name="dispensative" bind:value={form_values.dispensative} />
		<input type="hidden" name="compensative" bind:value={form_values.compensative} />
		<input type="hidden" name="valutative" bind:value={form_values.valutative} />
		<input type="hidden" name="strategie_classe" bind:value={form_values.strategie_classe} />
		<input
			type="hidden"
			name="strategie_didattiche"
			bind:value={form_values.strategie_didattiche}
		/>
		<input type="hidden" name="obiettivi_minimi" bind:value={form_values.obiettivi_minimi} />
		<input type="hidden" name="sintesi_vocale" bind:value={form_values.sintesi_vocale} />
		<input type="hidden" name="tempo_esteso" bind:value={form_values.tempo_esteso} />
		<div class="modal-dialog modal-xl" role="document">
			<div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Aggiorna PDP</h5>
					<button
						type="button"
						class="btn-close"
						data-bs-dismiss="modal"
						aria-label="Close"
						on:click={cancel_action}
					/>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class={current_pdp.obiettivi_minimi ? 'col-lg-3' : 'col-lg-4'}>
							<div class="form-label select_text">Template</div>
							<select
								class="form-select"
								name="template"
								bind:value={form_values.template_id}
								on:change={update_template}
							>
								{#each data.templates as template}
									<option value={template.id}>{template.nome}</option>
								{/each}
							</select>
						</div>
						<div class={current_pdp.obiettivi_minimi ? 'col-lg-3' : 'col-lg-4'}>
							<div class="mb-3">
								<div class="form-label select_text">Studente</div>
								<input
									type="text"
									class="form-control"
									value={current_pdp.studente_col}
									name="studente"
									disabled
								/>
							</div>
						</div>
						<div class={current_pdp.obiettivi_minimi ? 'col-lg-3' : 'col-lg-4'}>
							<div class="mb-3">
								<div class="form-label select_text">Materia</div>
								<input
									type="text"
									class="form-control"
									value={current_pdp.materia_col}
									name="materia"
									disabled
								/>
							</div>
						</div>
						{#if current_pdp.obiettivi_minimi}
							<div class="col-lg-3">
								<div class="mb-3">
									<div class="form-label select_text">Obiettivi Minimi</div>
									<select
										class="form-select"
										class:is-invalid={errors.obiettivi_minimi}
										name="obiettivi_minimi_id"
										bind:value={form_values.obiettivi_minimi_id}
										on:change={update_obiettivi_minimi}
									>
										{#each obiettivi_minimi_templates as om_t}
											<option value={om_t.id}>{om_t.nome}</option>
										{/each}
									</select>
									{#if errors.obiettivi_minimi}
										<span class="invalid-feedback">{errors.obiettivi_minimi}</span>
									{/if}
								</div>
							</div>
						{/if}
					</div>
					<div class="row myfieldset">
						<div class="form-label mylabel">Misure Dispensative</div>
						<div class="col-lg-6">
							<div class="mb-3">
								{#each current_dispensative.slice(0, 6) as dispensativa, i}
									<label class="form-check">
										<input
											class="form-check-input"
											type="checkbox"
											bind:checked={current_dispensative[i].selected}
										/>
										<span class="form-check-label">{dispensativa.text}</span>
									</label>
								{/each}
							</div>
						</div>
						<div class="col-lg-6">
							<div class="mb-3">
								{#each current_dispensative.slice(6) as dispensativa, i}
									<label class="form-check">
										<input
											class="form-check-input"
											type="checkbox"
											bind:checked={current_dispensative[i + 6].selected}
										/>
										<span class="form-check-label">{dispensativa.text}</span>
									</label>
								{/each}
							</div>
						</div>
						<div class="form-label select_text mt-3">Altro</div>
						<div class="input-group input-group-flat">
							<textarea
								rows="3"
								class="form-control mt-2"
								id="altro_dispensative"
								name="altro_dispensative"
								bind:value={form_values.altro_dispensative}
								on:keydown={prevent_enter}
							/>
						</div>
					</div>
					<div class="row myfieldset">
						<div class="form-label mylabel">Misure Compensative</div>
						<div class="col-lg-6">
							<div class="mb-3">
								{#each current_compensative.slice(0, 4) as compensativa, i}
									<label class="form-check">
										<input
											class="form-check-input"
											type="checkbox"
											bind:checked={current_compensative[i].selected}
										/>
										<span class="form-check-label">{compensativa.text}</span>
									</label>
								{/each}
							</div>
						</div>
						<div class="col-lg-6">
							<div class="mb-3">
								{#each current_compensative.slice(4) as compensativa, i}
									<label class="form-check">
										<input
											class="form-check-input"
											type="checkbox"
											bind:checked={current_compensative[i + 4].selected}
										/>
										<span class="form-check-label">{compensativa.text}</span>
									</label>
								{/each}
							</div>
						</div>
						<div class="form-label select_text mt-3">Altro</div>
						<div class="input-group input-group-flat">
							<textarea
								rows="3"
								class="form-control mt-2"
								id="altro_compensative"
								name="altro_compensative"
								bind:value={form_values.altro_compensative}
								on:keydown={prevent_enter}
							/>
						</div>
					</div>
					<div class="row myfieldset">
						<div class="form-label mylabel">Misure Valutative</div>
						<div class="col-lg-6">
							<div class="mb-3">
								{#each current_valutative.slice(0, 5) as valutativa, i}
									<label class="form-check">
										<input
											class="form-check-input"
											type="checkbox"
											bind:checked={current_valutative[i].selected}
										/>
										<span class="form-check-label">{valutativa.text}</span>
									</label>
								{/each}
							</div>
						</div>
						<div class="col-lg-6">
							<div class="mb-3">
								{#each current_valutative.slice(5) as valutativa, i}
									<label class="form-check">
										<input
											class="form-check-input"
											type="checkbox"
											bind:checked={current_valutative[i + 5].selected}
										/>
										<span class="form-check-label">{valutativa.text}</span>
									</label>
								{/each}
							</div>
						</div>
						<div class="form-label select_text mt-3">Altro</div>
						<div class="input-group input-group-flat">
							<textarea
								rows="3"
								class="form-control mt-2"
								id="altro_valutative"
								name="altro_valutative"
								bind:value={form_values.altro_valutative}
								on:keydown={prevent_enter}
							/>
						</div>
					</div>
					<div class="row myfieldset">
						<div class="form-label mylabel">Strategie Da Adottare In Classe</div>
						<div class="col-lg-6">
							<div class="mb-3">
								{#each current_strategie_classe.slice(0, 3) as strat_classe, i}
									<label class="form-check">
										<input
											class="form-check-input"
											type="checkbox"
											bind:checked={current_strategie_classe[i].selected}
										/>
										<span class="form-check-label">{strat_classe.text}</span>
									</label>
								{/each}
							</div>
						</div>
						<div class="col-lg-6">
							<div class="mb-3">
								{#each current_strategie_classe.slice(3) as strat_classe, i}
									<label class="form-check">
										<input
											class="form-check-input"
											type="checkbox"
											bind:checked={current_strategie_classe[i + 3].selected}
										/>
										<span class="form-check-label">{strat_classe.text}</span>
									</label>
								{/each}
							</div>
						</div>
					</div>
					<div class="row myfieldset">
						<div class="form-label mylabel">Strategie Didattiche</div>
						<div class="col-lg-6">
							<div class="mb-3">
								{#each current_strategie_didattiche.slice(0, 3) as strat_didattica, i}
									<label class="form-check">
										<input
											class="form-check-input"
											type="checkbox"
											bind:checked={current_strategie_didattiche[i].selected}
										/>
										<span class="form-check-label">{strat_didattica.text}</span>
									</label>
								{/each}
							</div>
						</div>
						<div class="col-lg-6">
							<div class="mb-3">
								{#each current_strategie_didattiche.slice(3) as strat_didattica, i}
									<label class="form-check">
										<input
											class="form-check-input"
											type="checkbox"
											bind:checked={current_strategie_didattiche[i + 3].selected}
										/>
										<span class="form-check-label">{strat_didattica.text}</span>
									</label>
								{/each}
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-lg-10">
							<div class="form-label select_text mt-3">Note Docente (non pubblicato)</div>
							<div class="input-group input-group-flat">
								<textarea
									rows="3"
									class="form-control mt-2"
									id="note"
									name="note"
									bind:value={form_values.note}
									on:keydown={prevent_enter}
								/>
							</div>
						</div>
						<div class="col-lg-2">
							<br />
							<label class="form-label">PDP completo</label>
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
				</div>
				<div class="modal-footer">
					<a href="#" class="btn btn-danger" data-bs-dismiss="modal" on:click={cancel_action}>
						<b>Cancel</b>
					</a>
					<button class="btn btn-success ms-auto">
						<i class="ti ti-plus icon" />
						{#if modal_action == 'create'}
							<b>Crea PDP</b>
						{:else}
							<b>Aggiorna PDP</b>
						{/if}
					</button>
				</div>
			</div>
		</div>
	</form>
</div>

<style>
	.disabled {
		/* We can't use disabled attribute since disable field also for server so create a class that emulate disabled effect */
		pointer-events: none;
		background: grey;
	}

	/* workaround, for some reason 
    style of Libro error box keep display:none */
	.custom-invalid-feedback {
		width: 100%;
		margin-top: 0.25rem;
		font-size: 85.714285%;
		color: #d63939;
	}

	.myfieldset {
		padding: 1rem;
		margin-bottom: 1rem;
		background: #f1f5f9;
		border: 1px solid #e6e7e9;
		border-radius: 4px;
		margin-left: 0.1rem;
		margin-right: 0.1rem;
	}

	.mylabel {
		font-weight: bolder;
		margin-bottom: 1rem;
	}

	.error-border {
		border: 1px solid red;
	}

	.error-text {
		color: #d63939;
		font-size: 85%;
	}
</style>
