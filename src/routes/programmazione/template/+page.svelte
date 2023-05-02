<script>
	import { delay, wait_fade_finish } from '$js/helper.js';
	import { page_action_title, page_title, page_pre_title, page_action_modal } from '$js/store';
	import Programmazione from '$lib/components/common/programmazione.svelte';
	import Table from '$lib/components/common/table.svelte';
	import * as yup from 'yup';
	export let data;

	/* Page properties */
	$page_action_title = 'Aggiungi template';
	$page_pre_title = 'Programma annuale';
	$page_title = 'Template';
	$page_action_modal = 'modal-template';
	//console.log(data.insegnamenti)
	/* Page form model */
	let modal_form;
	let form_values = {
		nome: '',
		template_id: 0,
		materia: 0,
		libri: [''], // Avoid a warning in handlesubmit
		primo_quadrimestre: [],
		secondo_quadrimestre: []
	};

	// Helper for yup
	const is_valid_quadrimestre = (quadrimestre) =>
		quadrimestre[0].titolo != '' && quadrimestre[0].sotto_argomenti[0] != '';

	// schema di validazione del form
	const form_schema = yup.object().shape({
		nome: yup.string().min(1, 'Nome necessario'),
		materia: yup.number().min(1, 'Materia necessaria'),
		libri: yup.array().length(1, 'Libri necessari'),
		primo_quadrimestre: yup.array().test((quadrimestre) => is_valid_quadrimestre(quadrimestre)),
		secondo_quadrimestre: yup.array().test((quadrimestre) => is_valid_quadrimestre(quadrimestre))
	});

	let modal_action = 'create';
	let errors = {};

	let argomenti_primo_quadrimestre = [
		{
			titolo: '',
			sotto_argomenti: ['']
		}
	];
	let argomenti_secondo_quadrimestre = [
		{
			titolo: '',
			sotto_argomenti: ['']
		}
	];

	//let materie = data.insegnamenti.map((insegnamento) => insegnamento.materia);
	let argomenti_primo_quadrimestre_raw = '';
	let argomenti_secondo_quadrimestre_raw = '';

	function start_update(e) {
		modal_action = 'update';
		form_values.template_id = e.detail.id;
		const template = data.templates.filter((template) => template.id == form_values.template_id)[0];
		form_values.nome = template.nome;
		form_values.materia = template.materia.id;
		form_values.libri = template.libro.split(',');
		form_values.primo_quadrimestre = JSON.parse(template.template)[0];
		form_values.secondo_quadrimestre = JSON.parse(template.template)[1];
		argomenti_primo_quadrimestre = JSON.parse(template.template)[0];
		argomenti_secondo_quadrimestre = JSON.parse(template.template)[1];
	}

	async function handleSubmit() {
		argomenti_primo_quadrimestre_raw = JSON.stringify(argomenti_primo_quadrimestre);
		argomenti_secondo_quadrimestre_raw = JSON.stringify(argomenti_secondo_quadrimestre);
		form_values.primo_quadrimestre = argomenti_primo_quadrimestre;
		form_values.secondo_quadrimestre = argomenti_secondo_quadrimestre;
		form_values.libri = form_values.libri.filter((libro) => libro.length > 0); // Se l'input è vuoto lo sanifichiamo
		try {
			// valida il form prima del submit
			await form_schema.validate(form_values, { abortEarly: false });
			errors = {};
			modal_form.submit();
		} catch (err) {
			errors = err.inner.reduce((acc, err) => {
				return { ...acc, [err.path]: err.message };
			}, {});
			if (form_values.libri.length == 0) form_values.libri = ['']; // Resettiamo il campo libri dopo il filter in caso non ci siano libri per far apparire almeno in input
		}
	}

	async function cancel_action() {
		if (modal_action == 'update') {
			await wait_fade_finish();
			modal_action = 'create'; // Reset string
			form_values = {
				nome: '',
				template_id: 0,
				materia: 0,
				libri: [''], // Avoid a warning in handlesubmit
				primo_quadrimestre: [],
				secondo_quadrimestre: []
			};
			argomenti_primo_quadrimestre = [
				{
					titolo: '',
					sotto_argomenti: ['']
				}
			];
			argomenti_secondo_quadrimestre = [
				{
					titolo: '',
					sotto_argomenti: ['']
				}
			];
		}
	}

	function new_libro() {
		form_values.libri.push('');
		form_values.libri = form_values.libri;
	}
</script>

<Table
	columns={[
		{ name: 'id', type: 'hidden', display: 'ID' },
		{ name: 'materia', type: 'object', display: 'Materia', key: 'nome', size: 30 }
	]}
	page_size={10}
	rows={data.templates}
	endpoint="programmazione/template"
	footer="Presenze"
	actions={true}
	resource="pcto_presenze"
	modal_name={$page_action_modal}
	on:update_start={start_update}
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
			<input type="hidden" name="id" bind:value={form_values.template_id} />
		{/if}
		<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header">
					{#if modal_action == 'create'}
						<h5 class="modal-title">Nuovo Template</h5>
					{:else}
						<h5 class="modal-title">Aggiorna Template</h5>
					{/if}
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
						<div class="col">
							<div class="form-label select_text">Nome template</div>
							<input
								type="text"
								class="form-control"
								bind:value={form_values.nome}
								name="nome"
								class:is-invalid={errors.nome}
							/>
							{#if errors.nome}
								<span class="invalid-feedback">{errors.nome}</span>
							{/if}
						</div>

						<div class="col">
							<div class="form-label select_text">Materia</div>
							<select
								class="form-select"
								class:is-invalid={errors.materia}
								name="materia"
								bind:value={form_values.materia}
							>
								{#each data.materie as materia}
									<option value={materia.id}>{materia.nome}</option>
								{/each}
							</select>
							{#if errors.materia}
								<span class="invalid-feedback">{errors.materia}</span>
							{/if}
						</div>
					</div>
					<div class="row">
						<div class="col">
							<div class="form-label select_text mt-3">Libro di testo</div>
							{#each form_values.libri as libro}
								<input
									type="text"
									class="form-control mt-2"
									bind:value={libro}
									id="libro"
									class:is-invalid={errors.libri}
								/>
							{/each}
							<input type="hidden" name="libri" bind:value={form_values.libri} />
							{#if errors.libri}
								<span class="invalid-feedback">{errors.libri}</span>
							{/if}
							<button class="btn btn-primary mt-2" on:click={new_libro} type="button"
								>Aggiungi un altro libro</button
							>
						</div>
					</div>
					<div class="row">
						<div class="col">
							<div
								class="form-label select_text mt-3 fs-3"
								class:is-invalid={errors.primo_quadrimestre}
							>
								1 Quadrimestre
							</div>
							{#if errors.primo_quadrimestre}
								<span class="invalid-feedback">Creare almeno un argomento e sotto argomento</span>
							{/if}
							<div>
								<Programmazione bind:argomenti={argomenti_primo_quadrimestre} />
								<input
									type="hidden"
									name="argomenti_primo_quadrimestre"
									bind:value={argomenti_primo_quadrimestre_raw}
								/>
							</div>
						</div>
						<div class="col">
							<div
								class="form-label select_text mt-3 fs-3"
								class:is-invalid={errors.secondo_quadrimestre}
							>
								2 Quadrimestre
							</div>
							{#if errors.secondo_quadrimestre}
								<span class="invalid-feedback">Creare almeno un argomento e sotto argomento</span>
							{/if}
							<div>
								<Programmazione bind:argomenti={argomenti_secondo_quadrimestre} />
								<input
									type="hidden"
									name="argomenti_secondo_quadrimestre"
									bind:value={argomenti_secondo_quadrimestre_raw}
								/>
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
							<b>Crea Template</b>
						{:else}
							<b>Aggiorna Template</b>
						{/if}
					</button>
				</div>
			</div>
		</div>
	</form>
</div>
