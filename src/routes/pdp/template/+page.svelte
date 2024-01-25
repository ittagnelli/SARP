<script>
	import { delay, remove_at_index, wait_fade_finish } from '$js/helper.js';
	import { page_action_title, page_title, page_pre_title, page_action_modal } from '$js/store';
	import Programmazione from '$lib/components/common/programmazione.svelte';
	import Table from '$lib/components/common/table.svelte';
    import MessageBox from '$lib/components/common/message_box.svelte';
    import { onMount } from 'svelte';
	import * as yup from 'yup';
    import * as helper from '../../../js/helper';
	import { misure_dispensative } from './dispensative';
    
    export let data;
    export let form;

	/* Page properties */
	$page_action_title = 'Aggiungi template';
	$page_pre_title = 'PDP annuale';
	$page_title = 'Template';
	$page_action_modal = 'modal-template';

    let templates = helper.data2arr(data.templates);

    console.log("DATA:", templates)
    onMount(() => { 
        if (form != null && form.status == 'ok') {
            switch(form.action) {
                case 'create':
                    helper.mbox_show(
                        'success',
                        'Conferma',
                        'Template creato correttamente',
                        3000
                    );
                    break;
                case 'update':
                    helper.mbox_show(
                        'success',
                        'Conferma',
                       'Template aggiornato correttamente',
                        3000
                    );
                    break;
            }
        }
    });

	/* Page form model */
	let modal_form;
	let form_values = {
		nome: '',
		template_id: 0,
		dispensative: '',
        compensative: '',
        valutazione: '',
        altro: '',
        note: ''
	};


	// schema di validazione del form
	const form_schema = yup.object().shape({
		nome: yup
              .string()
              .min(1, 'Nome necessario'),

		dispensative: yup
                      .string()
                      .min(1, 'Misure dispensative necessarie'),

        compensative: yup
                      .string()
                      .min(1, 'Misure compensative necessarie'),
        valutazione: yup
                      .string()
                      .min(1, 'Valutazione necessaria'),
	});

	let modal_action = 'create';
	let errors = {};

	function start_update(e) {
		modal_action = 'update';
		form_values.template_id = e.detail.id;
		const template = data.templates.filter((template) => template.id == form_values.template_id)[0];
		form_values.nome = template.nome;
        form_values.dispensative = template.dispensative;
        form_values.compensative = template.compensative;
        form_values.valutazione = template.valutazione;
        form_values.altro = template.altro;
        form_values.note = template.note;
	}

	async function handleSubmit() {
		form_values.nome = helper.sanitize_text_form(form_values.nome);
		form_values.altro = helper.sanitize_text_form(form_values.altro);
        form_values.note = helper.sanitize_text_form(form_values.note);		
		try {
			// valida il form prima del submit
			await form_schema.validate(form_values, { abortEarly: false });
			errors = {};
            		modal_form.submit();
		} catch (err) {
			errors = err.inner.reduce((acc, err) => {
				return { ...acc, [err.path]: err.message };
			}, {});
		}
	}

	async function cancel_action() {
		if (modal_action == 'update') {
			await wait_fade_finish(150);
			modal_action = 'create'; // Reset string
			form_values = {
                nome: '',
                template_id: 0,
                dispensative: '',
                compensative: '',
                valutazione: '',
                altro: '',
                note: ''
			};			
		}
	}

    function prevent_enter(key) {
        if(key.key == 'Enter') key.preventDefault();
    }
</script>

<MessageBox />

<Table
	columns={[
		{ name: 'id', type: 'hidden', display: 'ID' },
        { name: 'creatoDa', type: 'hidden', display: 'creatoDa' },
		{ name: 'nome', type: 'string', display: 'nome', size: 50 },
	]}
	page_size={10}
	rows={templates}
	endpoint="pdp/template"
	footer="Template"
	actions={true}
    print={false}
    print_filter={false}
    update_tip="Aggiorna template pdp"
    trash={true}
    trash_tip="Rimuovi template pdp"
	resource="pdp_template"
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
		<input type="hidden" name="id" bind:value={form_values.template_id} />
		<div class="modal-dialog modal-xl" role="document">
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
						<div class="col-lg-6">
                            <div class="mb-3">
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
						</div>

						<!-- <div class="col">
							<div class="form-label select_text">Materia</div>
							<select
								class="form-select"
								class:is-invalid={errors.materia}
								name="materia"
								bind:value={form_values.materia}
							>
								{#each data.materie as materia}
									<option value={materia[1]}>{materia[0]}</option>
								{/each}
							</select>
							{#if errors.materia}
								<span class="invalid-feedback">{errors.materia}</span>
							{/if}
						</div> -->
					</div>

                    <div class="row">
						<div class="col-lg-6">
                            <div class="mb-3">
                                <div class="form-label">Checkboxes</div>
                                  <label class="form-check">
                                    <input class="form-check-input" type="checkbox" >
                                    <span class="form-check-label">Checkbox input</span>
                                  </label>
                                  <label class="form-check">
                                    <input class="form-check-input" type="checkbox">
                                    <span class="form-check-label">Disabled checkbox input</span>
                                  </label>
                                  <label class="form-check">
                                    <input class="form-check-input" type="checkbox"  checked>
                                    <span class="form-check-label">Checked checkbox input</span>
                                  </label>
                              </div>
                        </div>
                    </div>

                    <!-- very ugly but svelte is not php and tag must be closed in each loop
                    so this solution is not nice but overcome the problem -->
                    <!-- {@const dispensative = JSON.parse(form_values.dispensative)}
                    {@const max_dispensative = dispensative.length}
                    {#each dispensative as dispensativa,idx}
                        {#if idx % 2 == 0} -->
                        <!-- <div class="row">
                            <div class="col-lg-6">
                                <div class="mb-3">
                                    <label class="form-label">{idx + 1}. {questions[idx].question} </label>
                                    <fieldset class="form-fieldset">
                                        <div>
                                            <div>
                                                {#each questions[idx].answers as answer}
                                                    <label class="form-check">
                                                        <input 
                                                            class="form-check-input" 
                                                            type="radio"  
                                                            name="{questions[idx].qid}" 
                                                            value="{answer.aid}"
                                                            checked={answer.aid == questions[idx].answer}
                                                        >
                                                        <span class="form-check-label">{answer.answer}</span>
                                                    </label>
                                                {/each}
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                            </div> -->
                            <!-- {#if questions[idx + 1]} needed to handle odd number of questions -->
                            <!-- <div class="col-lg-6">
                                <div class="mb-3">
                                    <label class="form-label">{idx + 2}. {questions[idx + 1].question} </label>
                                    <fieldset class="form-fieldset">
                                        <div>
                                            <div>
                                                {#each questions[idx + 1].answers as answer}
                                                    <label class="form-check">
                                                        <input 
                                                            class="form-check-input" 
                                                            type="radio"  
                                                            name="{questions[idx + 1].qid}" 
                                                            value="{answer.aid}"
                                                            checked={answer.aid == questions[idx + 1].answer}
                                                        >
                                                        <span class="form-check-label">{answer.answer}</span>
                                                    </label>
                                                {/each}
                                            </div>
                                        </div>
                                    </fieldset>
                                </div>
                            </div>
                            {/if}
                        </div>
                        {/if}
                    {/each} -->
            
					<!-- <div class="row">
						<div class="col">
							<div class="form-label select_text mt-3">Libro di testo [Cognome N.,(max 3 autori)Titolo,Casa Editrice, Anno Edizione (es: De Giovanni M.,Imparare a programmare - progettare,De Agostini Editore,2023)]</div>
							{#each form_values.libri as libro,i}
                                {#if libro != 'null'}
									<div class="input-group input-group-flat">
										<input
											type="text"
											class="form-control mt-2"
											bind:value={libro}
											id="libro"
											class:is-invalid={Object.keys(errors)[0] && Object.keys(errors)[0].startsWith('libri')}
										/>
										<span class="input-group-text">
											<a
												href="#0"
												on:click={new_libro}
												class="link-secondary"
												title="Clear search"
												data-bs-toggle="tooltip"
												>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="icon icon-tabler icon-tabler-plus"
													width="24"
													height="24"
													viewBox="0 0 24 24"
													stroke-width="2"
													stroke="currentColor"
													fill="none"
													stroke-linecap="round"
													stroke-linejoin="round"
												>
													<path stroke="none" d="M0 0h24v24H0z" fill="none" />
													<path d="M12 5l0 14" />
													<path d="M5 12l14 0" />
												</svg>
											</a>
											<a
												href="#0"
												class="link-secondary"
												title="Clear search"
												data-bs-toggle="tooltip"
												on:click={() => delete_libro(libro)}
												>
												<svg
													xmlns="http://www.w3.org/2000/svg"
													class="icon icon-tabler icon-tabler-trash-filled"
													width="24"
													height="24"
													viewBox="0 0 24 24"
													stroke-width="2"
													stroke="currentColor"
													fill="none"
													stroke-linecap="round"
													stroke-linejoin="round"
												>
													<path stroke="none" d="M0 0h24v24H0z" fill="none" />
													<path
														d="M20 6a1 1 0 0 1 .117 1.993l-.117 .007h-.081l-.919 11a3 3 0 0 1 -2.824 2.995l-.176 .005h-8c-1.598 0 -2.904 -1.249 -2.992 -2.75l-.005 -.167l-.923 -11.083h-.08a1 1 0 0 1 -.117 -1.993l.117 -.007h16z"
														stroke-width="0"
														fill="currentColor"
													/>
													<path
														d="M14 2a2 2 0 0 1 2 2a1 1 0 0 1 -1.993 .117l-.007 -.117h-4l-.007 .117a1 1 0 0 1 -1.993 -.117a2 2 0 0 1 1.85 -1.995l.15 -.005h4z"
														stroke-width="0"
														fill="currentColor"
													/>
												</svg>
											</a>
										</span>
									</div>
								{/if}
							{/each}
							<input type="hidden" name="libri" bind:value={form_values.libri_raw} />
                            {#if Object.keys(errors)[0] && Object.keys(errors)[0].startsWith('libri')}
                                <span class="custom-invalid-feedback">{errors[Object.keys(errors)[0]]}</span>
                            {/if}
						</div>
					</div> -->
					<div class="row">
						<div class="col">
							<div class="form-label select_text mt-3">Note</div>
							<div class="input-group input-group-flat">
								<!-- Il bind non è necessario però potrebbe servirci in futuro -->
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

<style>
    /* workaround, for some reason 
    style of Libro error box keep display:none */
    .custom-invalid-feedback {
        width: 100%;
        margin-top: 0.25rem;
        font-size: 85.714285%;
        color: #d63939;
    }
</style>
