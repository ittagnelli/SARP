<script>
	import {
		delay,
		get_modal,
		is_primo_quadrimestre,
		remove_at_index,
		wait_fade_finish,
        mbox_show
	} from '$js/helper.js';

	import { page_action_title, page_title, page_pre_title, page_action_modal } from '$js/store';
	import Programmazione from '$lib/components/common/programmazione.svelte';
	import Table from '$lib/components/common/table.svelte';
	import Alert from '$lib/components/common/alert.svelte';
    import InputText from '$lib/components/modal/input_text.svelte';
    import MessageBox from '$lib/components/common/message_box.svelte';
    import { onMount } from 'svelte';

	import * as yup from 'yup';
	export let data;
    export let form;

    let insegnamenti = data.insegnamenti;
    let classi = data.insegnamenti.map((insegnamento) => insegnamento.classe);
	let materie = data.insegnamenti.map((insegnamento) => insegnamento.materia);

    /* Page properties */
	$page_action_title = '';
	$page_pre_title = 'Programma annuale';
	$page_title = 'Programmazione docente';
	$page_action_modal = 'modal-template';

    onMount(() => { 
        if (form != null && form.status == 'ok') {
            mbox_show(
                'success',
                'Conferma',
                'Programmazione aggiornata correttamente',
                3000
            );            
        }
    });

	/* Page form model */
	let modal_form;
	let form_values = {
		nome: '',
		template_id: 0,
		insegnamenti_id: 0,
		materia: 0,
		classe: 0,
        code_classroom: '',
		libri: [''], // Avoid a warning in handlesubmit
		primo_quadrimestre: [],
		secondo_quadrimestre: [],
		conferma: '',
		conferma_tmp: ''
	};

	// Helper for yup
	const is_valid_quadrimestre = (quadrimestre) =>
		quadrimestre[0].titolo != '' && quadrimestre[0].sotto_argomenti[0] != '';

	// schema di validazione del form
	const form_schema = yup.object().shape({
		materia: yup.number().min(1, 'Materia necessaria'),
		libri: yup.array().length(1, 'Libri necessari'),
		primo_quadrimestre: yup.array().test((quadrimestre) => is_valid_quadrimestre(quadrimestre)),
		secondo_quadrimestre: yup.array().test((quadrimestre) => is_valid_quadrimestre(quadrimestre)),
        code_classroom: yup.string().length(7).required('Codice Classroom necessario')
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

	let argomenti_primo_quadrimestre_raw = '';
	let argomenti_secondo_quadrimestre_raw = '';

	async function start_update(e) {
		modal_action = 'update';
        let insegnamento = insegnamenti.filter(i => i.id == e.detail.id)[0];

        if(!insegnamento.programma_secondo_quadrimestre_completo) {
            form_values.classe = insegnamento.idClasse;
            form_values.materia = insegnamento.idMateria;
            form_values.insegnamenti_id = insegnamento.id;
            form_values.code_classroom = insegnamento.code_classroom;
            let template;
            const current_insegnamento = insegnamento;
        
            if (is_primo_quadrimestre()) {
                form_values.conferma = current_insegnamento.programma_primo_quadrimestre_completo
                    ? 'SI'
                    : 'NO';
                template = JSON.parse(current_insegnamento.programma_primo_quadrimestre);
            } else {
                form_values.conferma = current_insegnamento.programma_secondo_quadrimestre_completo
                    ? 'SI'
                    : 'NO';
                template = JSON.parse(current_insegnamento.programma_secondo_quadrimestre);
            }
            if(template) {
                form_values.primo_quadrimestre = template[0];
                form_values.secondo_quadrimestre = template[1];
                argomenti_primo_quadrimestre = template[0];
                argomenti_secondo_quadrimestre = template[1];
                form_values.libri = template[template.length - 1].libri.split(',');
            }
            form_values.conferma_tmp = form_values.conferma;
        } else {
            await wait_fade_finish(500);
            const btn = document.getElementById('btn-cancel');
            btn.click();
            mbox_show(
                'warning',
                'Attenzione',
                'Non puoi modificare una programmazione completata',
                3000
            );
        }
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
			console.log(err);
			errors = err.inner.reduce((acc, err) => {
				return { ...acc, [err.path]: err.message };
			}, {});
			if (form_values.libri.length == 0) form_values.libri = ['']; // Resettiamo il campo libri dopo il filter in caso non ci siano libri per far apparire almeno in input
		}
	}

	async function cancel_action() {
		await wait_fade_finish(150);
		modal_action = 'create'; // Reset string
		form_values = {
			nome: '',
			template_id: 0,
			insegnamenti_id: 0,
			materia: 0,
			classe: 0,
			libri: [''], // Avoid a warning in handlesubmit
			primo_quadrimestre: [],
			secondo_quadrimestre: [],
			conferma: '',
			conferma_tmp: ''
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

	function new_libro() {
		form_values.libri.push('');
		form_values.libri = form_values.libri;
	}

	function delete_libro(libro) {
		const index = form_values.libri.indexOf(libro);
		form_values.libri = remove_at_index(form_values.libri, index);
	}

	function update_template() {
		const template = data.templates.filter(
			(template_from_function) => template_from_function.id == form_values.template_id
		)[0];
		form_values.libri = template.libro.split(',');
        
		if (form_values.libri.length > 1) {
			// ESTHETIC: Remove last book that is empty if more than one are present in array
			form_values.libri.pop();
			form_values.libri = form_values.libri;
		}
		const template_raw = JSON.parse(template.template);
		argomenti_primo_quadrimestre = template_raw[0];
		argomenti_secondo_quadrimestre = template_raw[1];
		argomenti_primo_quadrimestre_raw = JSON.stringify(argomenti_primo_quadrimestre);
		argomenti_secondo_quadrimestre_raw = JSON.stringify(argomenti_secondo_quadrimestre);
	}
</script>

<MessageBox />

<Table
	columns={[
		{ name: 'id', type: 'hidden', display: 'ID' },
		{ name: 'classe', type: 'object', key: 'classe', display: 'classe', size: 20, search: true },
		{ name: 'materia', type: 'object', display: 'materia', key: 'nome', size: 50 },
		{
			name: 'programma_primo_quadrimestre_presente',
			type: 'boolean',
			display: 'Trimestre Presente'
		},
        {
			name: 'programma_primo_quadrimestre_completo',
			type: 'boolean',
			display: 'Trimestre Completo',
            search: true
		},
		{
			name: 'programma_secondo_quadrimestre_presente_',
			type: 'boolean',
			display: 'Pentamestre Presente'
		},
        {
			name: 'programma_secondo_quadrimestre_completo',
			type: 'boolean',
			display: 'Pentamestre Completo',
            search: true
		}
	]}
	page_size={10}
	rows={insegnamenti}
	endpoint="programmazione/docente"
	footer="Programmazione docente"
	actions={true}
    print={false}
    print_filter={false}
    update_tip="Creo o aggiorna programmazione per il quadrimestre in corso"
	resource="programmazione_docente"
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
        <input type="hidden" name="id" bind:value={form_values.insegnamenti_id} />
        <input type="hidden" name="classe" bind:value={form_values.classe} />

        <!-- <input type="hidden" name="id_template" bind:value={form_values.template_id}/> -->
        <div class="modal-dialog modal-lg" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    {#if modal_action == 'create'}
                        <h5 class="modal-title">Nuovo programma</h5>
                    {:else}
                        <h5 class="modal-title">Aggiorna programma</h5>
                    {/if}
                    <button
                        id="btn-cancel"
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        on:click={cancel_action}
                    />
                </div>

                <div class="modal-body">
                    <div class="row">
                        <!-- {#if modal_action == "create"} -->
                            <div class="col">
                                <div class="form-label select_text">Template</div>
                                <select
                                    class="form-select"
                                    class:is-invalid={errors.template}
                                    name="template"
                                    bind:value={form_values.template_id}
                                    on:change={update_template}
                                >
                                    {#each data.templates as template}
                                        {#if template.idMateria == form_values.materia}
                                            <option value={template.id}>{template.nome}</option>
                                        {/if}
                                    {/each}
                                </select>
                                {#if errors.template}
                                    <span class="invalid-feedback">{errors.template}</span>
                                {/if}
                            </div>
                        <!-- {/if} -->
                        <div class="col">
                            <div class="form-label select_text">Materia</div>
                            <select
                                class="form-select disabled"
                                name="materia"
                                bind:value={form_values.materia}
                            >
                                {#each materie as materia}
                                    <option value={materia.id}>{materia.nome}</option>
                                {/each}
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg">
                            <div class="form-label select_text mt-3">Classe</div>
                            <select
                                class="form-select mt-3 disabled"
                                name="classe"
                                bind:value={form_values.classe}
                            >
                                {#each classi as classe}
                                    <option value={classe.id}>{classe.classe}</option>
                                {/each}
                            </select>
                        </div>
                        <div class="col-lg">
                            <div class="form-label select_text mt-3">Codice Classroom</div>
                            <input
                                type="text"
                                class="form-control mt-3"
                                class:is-invalid="{errors['code_classroom']}"
                                name="code_classroom"
                                placeholder="abc123def"
                                bind:value={form_values.code_classroom}
                            />
                            {#if errors['code_classroom']}
                                <span class="invalid-feedback">{errors['code_classroom']}</span>
                            {/if}
                        </div>
                    </div>
                    <div class="row">
                        <div class="col">
                            <div class="form-label select_text mt-3">Libro di testo</div>
                            {#each form_values.libri as libro}
                                {#if libro != 'null'}
                                    <div class="input-group input-group-flat">
                                        <input
                                            type="text"
                                            class="form-control mt-2"
                                            bind:value={libro}
                                            id="libro"
                                            class:is-invalid={errors.libri}
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
                            <input type="hidden" name="libri" bind:value={form_values.libri} />
                            {#if errors.libri}
                                <span class="invalid-feedback">{errors.libri}</span>
                            {/if}
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
                        <br />
                    </div>
                    <div class="col pt-2">
                        <br />
                        <label class="form-label">Programmazione completa</label>
                        <div class="form-selectgroup">
                            <label class="form-selectgroup-item">
                                {#if modal_action != 'update'}
                                    <input
                                        type="radio"
                                        name="conferma"
                                        value="SI"
                                        class="form-selectgroup-input"
                                        bind:group={form_values.conferma}
                                    />
                                {:else}
                                    <input
                                        type="radio"
                                        name="conferma"
                                        value="SI"
                                        class="form-selectgroup-input"
                                        bind:group={form_values.conferma_tmp}
                                    />
                                {/if}
                                <span class="form-selectgroup-label">SI</span>
                            </label>
                            <label class="form-selectgroup-item">
                                {#if modal_action != 'update'}
                                    <input
                                        type="radio"
                                        name="conferma"
                                        value="NO"
                                        class="form-selectgroup-input"
                                        bind:group={form_values.conferma}
                                    />
                                {:else}
                                    <input
                                        type="radio"
                                        name="conferma"
                                        value="NO"
                                        class="form-selectgroup-input"
                                        bind:group={form_values.conferma_tmp}
                                    />
                                {/if}
                                <span class="form-selectgroup-label">NO</span>
                            </label>
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
                            <b>Aggiungi programmazione</b>
                        {:else}
                            <b>Aggiorna programmazione</b>
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
</style>
