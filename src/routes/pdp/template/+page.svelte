<script>
	import { wait_fade_finish } from '$js/helper.js';
	import { page_action_title, page_title, page_pre_title, page_action_modal } from '$js/store';
	import Table from '$lib/components/common/table.svelte';
    import MessageBox from '$lib/components/common/message_box.svelte';
    import { onMount } from 'svelte';
	import * as yup from 'yup';
    import * as helper from '../../../js/helper';
	import { misure_dispensative } from './dispensative';
    import { misure_compensative } from './compensative';
    import { misure_valutative } from './valutative';
    import { strategie_classe } from './strategie_classe';
    import { strategie_didattiche } from './strategie_didattiche';

    export let data;
    export let form;

	/* Page properties */
	$page_action_title = 'Aggiungi template';
	$page_pre_title = 'PDP annuale';
	$page_title = 'Template';
	$page_action_modal = 'modal-template';

    let templates = helper.data2arr(data.templates);
    let current_dispensative = JSON.parse(misure_dispensative);
    let current_compensative = JSON.parse(misure_compensative);
    let current_valutative = JSON.parse(misure_valutative);
    let current_strategie_classe = JSON.parse(strategie_classe);
    let current_strategie_didattiche = JSON.parse(strategie_didattiche);

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
        valutative: '',
        strategie_classe: '',
        strategie_didattiche: '',
        altro_compensative: '',
        altro_dispensative: '',
        altro_valutative: '',
        note: ''
	};

	// schema di validazione del form
	const form_schema = yup.object().shape({
		nome: yup
            .string()
            .min(1, 'Nome necessario')
	});

	let modal_action = 'create';
	let errors = {};

	function start_update(e) {
		modal_action = 'update';
		form_values.template_id = e.detail.id;
		const template = data.templates.filter((template) => template.id == form_values.template_id)[0];
		form_values.nome = template.nome;
        current_dispensative= JSON.parse(template.dispensative);
        current_compensative = JSON.parse(template.compensative);
        current_valutative = JSON.parse(template.valutazione);
        current_strategie_classe = JSON.parse(template.strategie_classe);
        current_strategie_didattiche = JSON.parse(template.strategie_didattiche);
        form_values.altro_compensative = template.altro_compensative;
        form_values.altro_dispensative = template.altro_dispensative;
        form_values.altro_valutative = template.altro_valutative;
        form_values.note = template.note;
	}

    function reset_form_value() {
        form_values = {
                nome: '',
                template_id: 0,
                dispensative: '',
                compensative: '',
                valutative: '',
                strategia_classe: '',
                strategia_didattiche: '',
                altro_compensative: '',
                altro_dispensative: '',
                altro_valutative: '',
                note: ''
			};		
    }

	async function handleSubmit() {
		form_values.nome = helper.sanitize_text_form(form_values.nome);
		form_values.altro_compensative = helper.sanitize_text_form(form_values.altro_compensative);
        form_values.altro_dispensative = helper.sanitize_text_form(form_values.altro_dispensative);
        form_values.altro_valutative = helper.sanitize_text_form(form_values.altro_valutative);
        form_values.note = helper.sanitize_text_form(form_values.note);
        form_values.dispensative = JSON.stringify(current_dispensative);
        form_values.compensative = JSON.stringify(current_compensative);
        form_values.valutative = JSON.stringify(current_valutative);
        form_values.strategie_classe = JSON.stringify(current_strategie_classe);
        form_values.strategie_didattiche = JSON.stringify(current_strategie_didattiche);

		try {
			// valida il form prima del submit
			await form_schema.validate(form_values, { abortEarly: false });
			errors = {};
            modal_form.submit();
            reset_form_value();
		} catch (err) {
			errors = err.inner.reduce((acc, err) => {
				return { ...acc, [err.path]: err.message };
			}, {});
            console.log(errors)
		}
	}

	async function cancel_action() {
		if (modal_action == 'update') {
			await wait_fade_finish(150);
			modal_action = 'create'; // Reset string
			reset_form_value();	
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
		{ name: 'note', type: 'string', display: 'note', size: 50 },
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
        <input type="hidden" name="dispensative" bind:value={form_values.dispensative} />
        <input type="hidden" name="compensative" bind:value={form_values.compensative} />
        <input type="hidden" name="valutative" bind:value={form_values.valutative} />
        <input type="hidden" name="strategie_classe" bind:value={form_values.strategie_classe} />
        <input type="hidden" name="strategie_didattiche" bind:value={form_values.strategie_didattiche} />
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
					</div>
                    <div class="row myfieldset">    
                        <div class="form-label mylabel">Misure Dispensative</div>
						<div class="col-lg-6">
                            <div class="mb-3">
                                    {#each current_dispensative.slice(0,6) as dispensativa,i}
                                  <label class="form-check">
                                    <input class="form-check-input" type="checkbox" bind:checked={current_dispensative[i].selected} >
                                    <span class="form-check-label">{dispensativa.text}</span>
                                  </label>
                                  {/each}
                              </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                    {#each current_dispensative.slice(6) as dispensativa,i}
                                  <label class="form-check">
                                    <input class="form-check-input" type="checkbox" bind:checked={current_dispensative[i + 6].selected} >
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
                                
                                    {#each current_compensative.slice(0,4) as compensativa,i}
                                  <label class="form-check">
                                    <input class="form-check-input" type="checkbox" bind:checked={current_compensative[i].selected} >
                                    <span class="form-check-label">{compensativa.text}</span>
                                  </label>
                                  {/each}
                              </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                    {#each current_compensative.slice(4) as compensativa,i}
                                  <label class="form-check">
                                    <input class="form-check-input" type="checkbox" bind:checked={current_compensative[i + 4].selected} >
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
                                    {#each current_valutative.slice(0,5) as valutativa,i}
                                  <label class="form-check">
                                    <input class="form-check-input" type="checkbox" bind:checked={current_valutative[i].selected} >
                                    <span class="form-check-label">{valutativa.text}</span>
                                  </label>
                                  {/each}
                              </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                    {#each current_valutative.slice(5) as valutativa,i}
                                  <label class="form-check">
                                    <input class="form-check-input" type="checkbox" bind:checked={current_valutative[i + 5].selected} >
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
                                    {#each current_strategie_classe.slice(0,3) as strat_classe,i}
                                  <label class="form-check">
                                    <input class="form-check-input" type="checkbox" bind:checked={current_strategie_classe[i].selected} >
                                    <span class="form-check-label">{strat_classe.text}</span>
                                  </label>
                                  {/each}
                              </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                    {#each current_strategie_classe.slice(3) as strat_classe,i}
                                  <label class="form-check">
                                    <input class="form-check-input" type="checkbox" bind:checked={current_strategie_classe[i + 3].selected} >
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
                                    {#each current_strategie_didattiche.slice(0,3) as strat_didattica,i}
                                  <label class="form-check">
                                    <input class="form-check-input" type="checkbox" bind:checked={current_strategie_didattiche[i].selected} >
                                    <span class="form-check-label">{strat_didattica.text}</span>
                                  </label>
                                  {/each}
                              </div>
                        </div>
                        <div class="col-lg-6">
                            <div class="mb-3">
                                    {#each current_strategie_didattiche.slice(3) as strat_didattica,i}
                                  <label class="form-check">
                                    <input class="form-check-input" type="checkbox" bind:checked={current_strategie_didattiche[i + 3].selected} >
                                    <span class="form-check-label">{strat_didattica.text}</span>
                                  </label>
                                  {/each}
                              </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
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
