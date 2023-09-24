<script>
	import { delay, remove_at_index, wait_fade_finish } from '$js/helper.js';
	import { page_action_title, page_title, page_pre_title, page_action_modal } from '$js/store';
	import Programmazione from '$lib/components/common/programmazione.svelte';
	import Table from '$lib/components/common/table.svelte';
    import MessageBox from '$lib/components/common/message_box.svelte';
    import { onMount } from 'svelte';
	import * as yup from 'yup';
    import * as helper from '../../../js/helper';
	export let data;
    export let form;

	/* Page properties */
	$page_action_title = 'Aggiungi template';
	$page_pre_title = 'Programma annuale';
	$page_title = 'Template';
	$page_action_modal = 'modal-template';

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
		materia: 0,
		libri: [''], // Avoid a warning in handlesubmit
        note: "",
		libri_raw: "",
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
        libri: yup.array()
            .of(
                yup.string()
                .test({
                    name:'formato-libro',
                    message: 'Formato Libro non valido',
                    test: (value) => {
                        //test against this format: 
                        // Cognome N.,Titolo,Casa Editrice, Anno Edizione (es: Boscaini M.,Imparare a programmare,Apogeo,2023)
                        //return /^([A-Z][A-Za-z ]+ [A-Z]\.,){1,3}[A-Z][0-9A-Za-z -]+,[A-Z][0-9A-Za-z -]+,[1-2][0-9]{3}$/.test(value);
                        // return /^([A-Z][A-Za-z' ]+ [A-Z]\.,){1,3}[A-Z][0-9A-Za-z-+'"&\/()\[\]:. ]+,[A-Z][0-9A-Za-z-+'"&\/()\[\] ]+,[1-2][0-9]{3}$/.test(value);
                        return /^([A-Z].+ [A-Z]\.,){1,3}[A-Z].+,[A-Z].+,[1-2][0-9]{3}$/.test(value);
                    }
                })
            ),
        primo_quadrimestre: yup.array().test((quadrimestre) => is_valid_quadrimestre(quadrimestre)),
		secondo_quadrimestre: yup.array().test((quadrimestre) => is_valid_quadrimestre(quadrimestre))
	});

	let modal_action = 'create';
	let errors = {};

	let argomenti_primo_quadrimestre = [
		{
			titolo: '',
			sotto_argomenti: [{
				sotto_argomento_text: '',
				sotto_sotto_argomenti: ['']
			}]
		}
	];
	let argomenti_secondo_quadrimestre = [
		{
			titolo: '',
			sotto_argomenti: [{
				sotto_argomento_text: '',
				sotto_sotto_argomenti: ['']
			}]
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
		form_values.note = template.note;
		form_values.libri = template.libro.split('~');
		form_values.primo_quadrimestre = JSON.parse(template.template)[0];
		form_values.secondo_quadrimestre = JSON.parse(template.template)[1];
		
		// Se i sotto_sotto_argomenti sono vuoti ne aggiungiamo uno vuoto così l'insegnante può aggiungerne
		form_values.primo_quadrimestre = form_values.primo_quadrimestre.map(programma_quadrimestre => {
			return {
				titolo: programma_quadrimestre.titolo,
				sotto_argomenti: programma_quadrimestre.sotto_argomenti.map(programma => {
				return {
					sotto_argomento_text: programma.sotto_argomento_text,
					sotto_sotto_argomenti: programma.sotto_sotto_argomenti.length >= 1 ? programma.sotto_sotto_argomenti : [""]
				};	
				})
			}
		});
		form_values.secondo_quadrimestre = form_values.secondo_quadrimestre.map(programma_quadrimestre => {
			return {
				titolo: programma_quadrimestre.titolo,
				sotto_argomenti: programma_quadrimestre.sotto_argomenti.map(programma => {
				return {
					sotto_argomento_text: programma.sotto_argomento_text,
					sotto_sotto_argomenti: programma.sotto_sotto_argomenti.length >= 1 ? programma.sotto_sotto_argomenti : [""]
				};	
				})
			}
		});

		argomenti_primo_quadrimestre = form_values.primo_quadrimestre;
		argomenti_secondo_quadrimestre = form_values.secondo_quadrimestre;

	}

	async function handleSubmit() {
		form_values.nome = helper.sanitize_text_form(form_values.nome);
		form_values.note = helper.sanitize_text_form(form_values.note);
		form_values.primo_quadrimestre = argomenti_primo_quadrimestre;
		form_values.secondo_quadrimestre = argomenti_secondo_quadrimestre;
		
		// Se il sotto_sotto_argomento è vuoto salviamo un array vuoto per evitare spazi vuoti nel docx. Lo facciamo client-side per risparmiare qualche risorsa sul server.
		form_values.primo_quadrimestre = form_values.primo_quadrimestre.map(programma_quadrimestre => {
			return {
				titolo: programma_quadrimestre.titolo,
				sotto_argomenti: programma_quadrimestre.sotto_argomenti.map(programma => {
					return {
						sotto_argomento_text: programma.sotto_argomento_text,
						sotto_sotto_argomenti: programma.sotto_sotto_argomenti.length >= 1 && programma.sotto_sotto_argomenti[0] != "" ? programma.sotto_sotto_argomenti : []
					};	
				})
			}
		});
		form_values.secondo_quadrimestre = form_values.secondo_quadrimestre.map(programma_quadrimestre => {
			return {
				titolo: programma_quadrimestre.titolo,
				sotto_argomenti: programma_quadrimestre.sotto_argomenti.map(programma => {
					return {
						sotto_argomento_text: programma.sotto_argomento_text,
						sotto_sotto_argomenti: programma.sotto_sotto_argomenti.length >= 1 && programma.sotto_sotto_argomenti[0] != "" ? programma.sotto_sotto_argomenti : []
					};	
				})
			}
		});
		argomenti_primo_quadrimestre_raw = helper.sanitize_text_form(JSON.stringify(form_values.primo_quadrimestre));
		argomenti_secondo_quadrimestre_raw = helper.sanitize_text_form(JSON.stringify(form_values.secondo_quadrimestre));

		form_values.libri = form_values.libri.filter((libro) => libro.length > 0); // Se l'input è vuoto lo sanifichiamo

		// Cambiamo la virgola in tilde, questo perchè lato server
		// riceviamo una array in stringa e a quel livello non sappiamo distinguere
		// la virgola dell'utente e quella dell'array
		// Inoltre non possiamo farla prima del submit perchè per qualche ragione,
		// la richiesta viene fatta prima che il metodo join abbia finito
		form_values.libri_raw = helper.sanitize_text_form(form_values.libri.join('~'));
		try {
			// valida il form prima del submit
			await form_schema.validate(form_values, { abortEarly: false });
			errors = {};
            		modal_form.submit();
		} catch (err) {
			errors = err.inner.reduce((acc, err) => {
				return { ...acc, [err.path]: err.message };
			}, {});
        	        console.log(errors)
	            	console.log(errors['libri'])
			if (form_values.libri.length == 0) form_values.libri = ['']; // Resettiamo il campo libri dopo il filter in caso non ci siano libri per far apparire almeno in input
		}
	}

	async function cancel_action() {
		if (modal_action == 'update') {
			await wait_fade_finish(150);
			modal_action = 'create'; // Reset string
			form_values = {
				nome: '',
				template_id: 0,
				materia: 0,
				libri: [''], // Avoid a warning in handlesubmit
				note: "",
				libri_raw: "",
				primo_quadrimestre: [],
				secondo_quadrimestre: []
			};
			argomenti_primo_quadrimestre = [
				{
					titolo: '',
					sotto_argomenti: [{
						sotto_argomento_text: '',
						sotto_sotto_argomenti: ['']
					}]
				}
			];
			argomenti_secondo_quadrimestre = [
				{
					titolo: '',
					sotto_argomenti: [{
						sotto_argomento_text: '',
						sotto_sotto_argomenti: ['']
					}]
				}
			];
		}
	}

	function new_libro() {
		form_values.libri.push('');
		form_values.libri = form_values.libri;
	}

	function delete_libro(libro) {
		const index = form_values.libri.indexOf(libro);
		form_values.libri = remove_at_index(form_values.libri, index);
	}

    async function custom_action_handler(e) {
        switch(e.detail.action) {
            case 'duplicate':
                const res = await fetch(`/programmazione/template`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(e.detail.row_id)
                });
                
                if (res.ok) {
                    helper.mbox_show(
                        'success',
                        'Conferma',
                        'Template Programmazione duplicato correttamente',
                        3000,
                        () => location.reload()
                    );
                } else {
                    helper.mbox_show(
                        'danger',
                        `Errore [${res.status} - ${res.statusText}]`,
                        'Non è stato possibile duplicare il template selezionato.',
                        3000
                    );
                }
                break;
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
		{ name: 'materia', type: 'object', display: 'Materia', key: 'nome', size: 30 }
	]}
	page_size={10}
	rows={data.templates}
	endpoint="programmazione/template"
	footer="Presenze"
	actions={true}
    print={false}
    print_filter={false}
    update_tip="Aggiorna template programmazione"
    trash={true}
    trash_tip="Rimuovi template programmazione"
	resource="programmazione_template"
	modal_name={$page_action_modal}
	on:update_start={start_update}
    custom_actions={[{action: 'duplicate', icon:'copy', tip: 'Duplica Template Programmazione'}]}
    on:custom_action={custom_action_handler}
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
									<option value={materia[1]}>{materia[0]}</option>
								{/each}
							</select>
							{#if errors.materia}
								<span class="invalid-feedback">{errors.materia}</span>
							{/if}
						</div>
					</div>
					<div class="row">
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
												><!-- Download SVG icon from http://tabler-icons.io/i/x -->
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
												><!-- Download SVG icon from http://tabler-icons.io/i/x -->
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
					</div>
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
					<div class="row">
						<div class="col">
							<div
								class="form-label select_text mt-3 fs-3"
								class:is-invalid={errors.primo_quadrimestre}
							>
								Trimestre
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
								Pentamestre
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
