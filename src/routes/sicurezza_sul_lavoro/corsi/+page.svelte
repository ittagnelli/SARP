<script>
	import { page_pre_title, page_title, page_action_title, page_action_modal } from '../../../js/store';
	import Table from '$lib/components/common/table.svelte';
	import InputText from '$lib/components/modal/input_text.svelte';
	import InputDate from '$lib/components/modal/input_date.svelte';
    import InputSelect from '$lib/components/modal/input_select.svelte';
    import InputArea from '$lib/components/modal/input_area.svelte';
    import * as helper from '../../../js/helper';
	import Select from 'svelte-select';
	import * as yup from 'yup';
    import { Logger } from '../../../js/logger';
    import { onMount } from 'svelte';
    import { saveAs } from 'file-saver';
    import MessageBox from '$lib/components/common/message_box.svelte';
    
    let logger = new Logger("client");
	export let data; //contiene l'oggetto restituito dalla funzione load() eseguita nel back-end
    export let form; // Risposta del form dal server
	let corsi = helper.data2arr(data.corsi);

    let tipi_corso = ['GENERICO', 'SPECIFICO'];
    let utenti = helper.data2arr(data.utenti);
	let classi = helper.data2arr(data.classi);
	let classi_iscritte = [];
	let old_studenti = [];

	classi = helper.db_to_select(classi);

	utenti.forEach((utente) => {
		utente['label'] = utente.cognome.concat(' ', utente.nome);
		utente['value'] = utente.id;
	});

	let seguito = [];
	let seguitoDa = [];

	$: {
		if (modal_action == 'create') seguitoDa = [];
	}

    //configura la pagina pre-titolo, titolo e nome del modale
	$page_pre_title = 'Sicurezza sul Lavoro';
	$page_title = 'Corsi';
	$page_action_title = 'Aggiungi corso';
	$page_action_modal = 'modal-add-corso';
	let modal_action = 'create';

	let modal_form; // entry point del form nel modale
	let errors = {}; //traccia gli errori di validazione del form

	// campi del form
	// quest'oggetto deve contenere tutti i valori presenti nel form per
	// le operazione di create e update
	let form_values = {
		corso_id: 0,
		titolo: '',
		tipo: '',
		dataInizio: helper.convert_date(new Date()),
		dataFine: helper.convert_date(new Date()),
        dataTest: helper.convert_date(new Date()),
	};

	// schema di validazione del form
	const form_schema = yup.object().shape({
		titolo: yup
		.string()
		.required('Titolo Corso necessario')
		.matches(/^[a-zA-Z0-9\. -']{3,40}$/, "Titolo Corso non valido"),

        tipo: yup
        .string()
        .required('Tipo Corso necessario')
	});

	async function start_update(e) {
		modal_action = 'update';

		form_values.corso_id = e.detail.id;
		//cerca l'azienda da fare update
		let corso = corsi.filter((item) => item.id == form_values.corso_id)[0];
        if(!corso.somministrato) {
            corso.seguitoDa.forEach((utente) => {
                utente['label'] = utente.cognome.concat(' ', utente.nome);
                utente['value'] = utente.id;
            });
            seguitoDa = corso.seguitoDa;

            form_values.titolo = corso.titolo;
            form_values.tipo = corso.tipo;
            form_values.dataInizio = helper.convert_date(corso.dataInizio);
            form_values.dataFine = helper.convert_date(corso.dataFine);
            form_values.dataTest = helper.convert_date(corso.dataTest);
        } else {
            //very dirty trick, I will change when I will find a better solution
            await helper.wait_fade_finish(500);
            const btn = document.getElementById('btn-cancel');
            btn.click();
            helper.mbox_show(
                'warning',
                'Attenzione',
                'Non puoi modificare un corso con test già somministrati',
                3000
            );
        }
	}

	function handleSelect(event) {
		let user_selected = event.detail;
       	seguito = [];
		let i = 0;
        if(user_selected) {
            user_selected.forEach((item) => {
                seguito = [...seguito, item.value];
            });
			let removed = helper.findDeselectedItem(user_selected, old_studenti);
			if(old_studenti.length != 0){
				let classi_ids = classi_iscritte.map(classe => classe.id);
				if(removed){
					let users_id = user_selected.map(user => user.classeId);
					if(users_id.indexOf(removed.classeId) != -1){
						let index_to_remove = classi_ids.indexOf(removed.classeId);
						classi_iscritte.splice(index_to_remove, 1);
						classi_iscritte = classi_iscritte;
					}
				}
			}
			old_studenti = user_selected;
        }else {
			classi_iscritte = [];
		}
	}

	function handleSelect_classi(event) {
		let classe_selected = event.detail;
		if(classe_selected == null)
			seguitoDa = [];
		if(classe_selected){
			classi_iscritte = classe_selected;
			classe_selected.forEach((item) => {
				let utenti_partecipanti = utenti.filter((utente) => {
					return utente.classeId == item.id;
				});
				seguitoDa = [...seguitoDa, ...utenti_partecipanti];
			});
		}
	}

	async function handleSubmit() {
        try {
			// valida il form prima del submit
			await form_schema.validate(form_values, { abortEarly: false });
			errors = {};
			modal_form.submit();
		} catch (err) {
			errors = err.inner.reduce((acc, err) => {
				return { ...acc, [err.path]: err.message };
			}, {});
			logger.error(`Errori nella validazione del form corso sicurezza. Oggetto: ${JSON.stringify(form_values)} -- Errore: ${JSON.stringify(errors)}`);
		}
	}

	async function cancel_action(){
		if(modal_action == 'update'){
			await helper.wait_fade_finish(150);
			modal_action = 'create';
			form_values = {
				corso_id: 0,
				titolo: '',
				tipo: '',
				dataInizio: helper.convert_date(new Date()),
				dataFine: helper.convert_date(new Date()),
                dataTest: helper.convert_date(new Date()),
			};
		}
	}

    onMount(async () => { // Controlliamo che l'inserimento sia andato a buon fine, usiamo on mount per richiamare le funzioni del DOM
        helper.init_tippy();
        if (form != null) {
            if (form.files != null) { // è stato richiesto la generazione di uno o più file
                for(let doc of form.files) {
                    const buffer = new Uint8Array(JSON.parse(doc.file).data); // Convertiamo la stringa in un oggetto che conterrà il nostro array di bytes che verrà poi convertito in Uint8Array, necessario all'oggetto Blob
                    var blob = new Blob([buffer], { type: 'application/msword' });
                    saveAs(blob, doc.name);
                    await helper.delay(100); //chrome can download max 10 files at the time
                }
            } else { // file è null quindi l'unico caso possibile è la violazione della chiave unique nel DB
                form_values = JSON.parse(localStorage.getItem('form')); // Riempiamo il modale
                helper.show_modal();
            }
        } else {
            // non c'è risposta dal server, tutto è andato a buon fine
            localStorage.removeItem('form'); //PROF: rimuoviamo il form dal localstorage
        }
    });

    async function custom_action_handler(e) {
        switch(e.detail.action) {
            // case 'view':
            //     view_results(e.detail.row_id);
            //     break;
            case 'issue':
                issue_test(e.detail.row_id);
                break;
        }
    }

    // async function view_results(id) {
    //     console.log("VIEW:", id)
    //     const get_response = await fetch(`/sicurezza_sul_lavoro/test?corso=${id}`);
    //     let res = await get_response.json();
    //     console.log("GET RES:", res)

    // }

    async function issue_test(id) {
        let corso = corsi.filter(c => c.id == id)[0];
        let studenti = corso.seguitoDa.map(s => s.id);
        
        if(!corso.somministrato) {
            const res = await fetch(`/sicurezza_sul_lavoro/test`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    corso: id,
                    type: corso.tipo,
                    studenti: studenti
                })
            });

            if (res.ok) {
                helper.mbox_show(
                    'success',
                    'Conferma',
                    'I test per questo corso sono stati somministrati correttamente',
                    3000,
                    () => location.reload()
                );
            } else {
                helper.mbox_show(
                    'danger',
                    `Errore [${res.status} - ${res.statusText}]`,
                    'Non è stato possibile somministrare i test per questo corso.',
                    3000
                );
            }
        } else {
            helper.mbox_show(
                'warning',
                'Attenzione',
                'I test per questo corso sono già stati somministrati',
                3000
            );
        }
    }
</script>

<MessageBox/>

<Table
	columns={[
		{ name: 'id', type: 'hidden', display: 'ID' },
		{ name: 'titolo', type: 'string', display: 'titolo', size: 50, search: true },
        { name: 'tipo', type: 'string', display: 'tipo', size: 20, search: true },
        { name: 'dataInizio', type: 'date', display: 'Inizio' },
		{ name: 'dataFine', type: 'date', display: 'Fine' },
        { name: 'dataTest', type: 'date', display: 'Test' },
        { name: 'somministrato', type: 'boolean', display: 'somministrato', search: true},
		{ name: 'seguitoDa', type: 'array', subtype: 'picture', key: 'picture', display: 'iscritti', size: 5 }
	]}
	rows={corsi}
	page_size={6}
	modal_name={$page_action_modal}
	on:update_start={start_update}
	endpoint="sicurezza_sul_lavoro/corsi"
    footer="Corsi di Sicurezza"
    actions={true}
    print={true}
    print_tip="Stampa attestato del corso"
    update_tip="Aggiorna corso"
    trash_tip="Rimuovi corso"
    resource="sicurezza_corso"
    custom_actions={[{action: 'issue', icon:'checklist', tip: 'Somministra test agli studenti'}]}
    on:custom_action={custom_action_handler}
/>
<!-- custom_actions={[{action: 'view', icon: 'eye'}, {action: 'issue', icon:'checklist'}]} -->


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
		<input type="hidden" name="studenti" bind:value={seguito} />
		{#if modal_action == 'update'}
			<input type="hidden" name="id" bind:value={form_values.corso_id} />
		{/if}
		<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header">
					{#if modal_action == 'create'}
						<h5 class="modal-title">Nuovo Corso</h5>
					{:else}
						<h5 class="modal-title">Aggiorna Corso</h5>
					{/if}
					<button id="btn-cancel" type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" on:click={cancel_action}/>
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col-lg-8">
							<div class="mb-3">
								<InputText
								label="Titolo"
								name="titolo"
								{errors}
								placeholder="Titolo Corso"
								bind:val={form_values.titolo}
							/>
							</div>
						</div>
                        <div class="col-lg-4">
							<div class="mb-3">
								<div class="form-label select_text">Tipo</div>
                                <select class="form-select" class:is-invalid="{errors.tipo}" name="tipo" bind:value={form_values.tipo}>
                                    {#each tipi_corso as tipo_corso}
                                        <option value={tipo_corso}>{tipo_corso}</option>
                                    {/each}
                                </select>
                                {#if errors.tipo}
                                    <span class="invalid-feedback">{errors.tipo}</span>
                                {/if}	
							</div>
						</div>
					</div>
					<div class="row">
                        <div class="col-lg-4">
							<InputDate
								label="Data Inizio"
								name="dataInizio"
								{errors}
								bind:val={form_values.dataInizio}
							/>
						</div>
                        <div class="col-lg-4">
							<InputDate
								label="Data Fine"
								name="dataFine"
								{errors}
								bind:val={form_values.dataFine}
							/>
						</div>
                        <div class="col-lg-4">
							<InputDate
								label="Data Test"
								name="dataTest"
								{errors}
								bind:val={form_values.dataTest}
							/>
						</div>
					</div>
					<div class="row">
						<div class="col-lg-12">
							<div class="mb-3">
								<label class="form-label">Studenti</label>
								<Select
									class="form-select"
									name="utenti"
									items={utenti}
									value={seguitoDa}
									isMulti={true}
									placeholder="Selezione gli studenti..."
									on:select={handleSelect}
								/>
							</div>
						</div>
					</div>
					<div class="row">
						<div class="col-lg-12">
							<div class="mb-3">
								<label class="form-label">Classi Iscritte</label>
								<Select
									class="form-select"
									name="utenti"
									items={classi}
									value={classi_iscritte}
									isMulti={true}
									placeholder="Selezione gli studenti..."
									on:select={handleSelect_classi}
								/>
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
								<b>Crea Corso</b>
							{:else}
								<b>Aggiorna Corso</b>
							{/if}
						</button>
					</div>
				</div>
			</div>
		</div>
	</form>
</div>
