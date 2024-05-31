<script>
	import { page_pre_title, page_title, page_action_title, page_action_modal } from '$js/store';
    import InputText from '$lib/components/modal/input_text.svelte';
    import InputDate from '$lib/components/modal/input_date.svelte';
    import Table from '$lib/components/common/table.svelte';
    import * as helper from '$js/helper';
    import * as yup from 'yup';
    import { Logger } from '$js/logger';
	import ModalError from '$lib/components/common/modal_error.svelte';

    let logger = new Logger("client");

	export let data; //contiene l'oggetto restituito dalla funzione load() eseguita nel back-end
    export let form; // Risposta del form dal server

    // inizializzo la lista dei libri con il risultato della query SQL
    let libri = helper.data2arr(data.libri); // alias per maggior leggibilità
    
	//configura la pagina pre-titolo, titolo e nome del modale
	$page_pre_title = 'BIBLIOTECA';
	$page_title = 'Libri';
	$page_action_title = 'Aggiungi Libro';
	$page_action_modal = 'modal-add-libro';

	let autori, titolo, editore, anno, isbn;
    let direttore, natoA, natoIl, codiceF;

	let modal_action = 'create';
    let modal_form; // entry point del form nel modale 
    let errors = {}; //traccia gli errori di validazione del form

    // campi del form
    // quest'oggetto deve contenere tutti i valori presenti nel form per
    // le operazione di create e update
    let form_values = {
        book_id: 0,
        autori: "",
        titolo: "",      
        editore: "",
        anno: "",
        isbn: "",
        scheda_libro: 'NO'
    };

    // schema di validazione del form
    const form_schema = yup.object().shape({
        autori: yup
        .string()
        .required("Nome Autori necessario")
        .matches(/^[a-zA-Z,à-è-ì-ò-ù]$/, "Nome Autori non valido"),
        
        titolo: yup
        .string()
        .required("Titolo necessario")
        .min(0, "Titolo non valido")
        .max(100, "Titolo non valido"),

        editore: yup
        .string()
        .required("Editore necessario")
        .matches(/^[a-zA-Z,à-è-ì-ò-ù]$/, "Editore non valido"),

        anno: yup
        .date()
        .min(new Date(1900), "Data antecedente al 1900")
        .required("Anno di pubblicazione necessario"),

        ibsn: yup
        .string()
        .required("Codice IBSN necessario"),

        email_privacy: yup
			.string()
            .nullable()
			.matches(
				/^$|^[a-z.-_]+@[a-z.-_]+\.[a-z]+$/,
				'Email non valida'
			),

        idUtente: yup
        .number()
        .positive(),
        
        dataProtocollo: yup
        .date()
        .min(new Date(2016, 1, 1), "Data antecedente al 01/01/2016")
    });

    async function start_update(e) {
		modal_action = 'update';
		
        form_values.book_id = e.detail.id;
		//cerca l'azienda da fare update
		let libro = libri.filter((item) => item.id == form_values.book_id)[0];

        form_values.autori = libro.autori;
		form_values.titolo = libro.titolo;
        form_values.editore = libro.editore;
        form_values.anno = libro.anno;
        form_values.isbn = libro.isbn;
        form_values.scheda_libro = libro.scheda_libro ? 'SI' : 'NO';
	}

    async function cancel_action(){
        if(modal_action == "update"){
            await helper.wait_fade_finish(150);
            modal_action = 'create';    // Reset model string
            form_values = { // Reset form values
                book_id: 0,
                autori: "",
                titolo: "",      
                editore: "",
                anno: "",
                scheda_libro: 'NO'
            };
        }
    }

    async function handleSubmit() {
        try {
            // valida il form prima del submit
            await form_schema.validate(form_values, { abortEarly: false });
            errors = {};
            localStorage.setItem("form", JSON.stringify(form_values));
            modal_form.submit();
        } catch (err) {
            errors = err.inner.reduce((acc, err) => {
                return { ...acc, [err.path]: err.message };
            }, {});
            logger.error(`Errori nella validazione del form libri. Oggetto: ${JSON.stringify(form_values)} -- Errore: ${JSON.stringify(errors)}`);
        }
    }
</script>

<Table
	columns={[
		{ name: 'id', type: 'hidden', display: 'ID' },
		{ name: 'autori', type: 'string', display: 'Autori', size: 10, search: true },
		{ name: 'titolo', type: 'string', display: 'Titolo', size: 40, search: true },
        { name: 'editore', type: 'string', display: 'Editore', size: 30, search: true },
        { name: 'anno', type: 'string', display: 'Anno', size: 12 },
        { name: 'isbn', type: 'string', display: 'ISBN', size: 14 },
        { name: 'scheda_libro', type: 'boolean', display: 'Scheda Libro'}
	]}
	rows={libri}
	page_size={10}
	modal_name={$page_action_modal}
	on:update_start={start_update}
	endpoint="biblioteca/libri"
    footer="Libri"
    actions={true}
    update_tip="Aggiorna libro"
    trash_tip="Rimuovi libro"
    resource="biblioteca_libri"
/>

<!-- Modal from Page action -->
<div
	class="modal modal-blur fade"
	id={$page_action_modal}
	tabindex="-1"
	role="dialog"
	aria-hidden="true"
>
	<form method="POST" action="?/{modal_action}" on:submit|preventDefault={handleSubmit} bind:this={modal_form}>
		{#if modal_action == 'update'}
			<input type="hidden" name="id" bind:value={form_values.book_id} />
		{/if}
		<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header">
					{#if modal_action == 'create'}
						<h5 class="modal-title">Nuovo Libro</h5>
					{:else}
						<h5 class="modal-title">Aggiorna Libro</h5>
					{/if}
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" on:click={cancel_action}/>
				</div>
				<div class="modal-body">
                    {#if form}
                        <ModalError msg={form.error_mex}></ModalError>
                    {/if}
					<div class="row">
						<div class="col-lg-4">
                            <InputText
                            label="Nome Autori"
                            name="autori"
                            {errors}
                            placeholder="Nome autori"
                            bind:val={form_values.autori}
                        />
						</div>
						<div class="col-lg-8">
                            <InputText
                            label="Titolo"
                            name="titolo"
                            {errors}
                            placeholder="Titolo"
                            bind:val={form_values.titolo}
                        />
						</div>
					</div>
                    <div class="row">
						<div class="col-lg-5">
                            <InputText
                                label="Casa Editrice"
                                name="editore"
                                {errors}
                                placeholder="Zanichelli"
                                bind:val={form_values.editore}
                            />
						</div>
						<div class="col-lg-4">
                            <InputText
                                label="Anno di pubblicazione"
                                name="anno"
                                {errors}
                                placeholder="2000"
                                bind:val={form_values.anno}
                            />
						</div>
                    </div>
                        <div class="col-lg-4">
                            <InputText
                                label="Codice ISBN"
                                name="isbn"
                                {errors}
                                placeholder="ISBN"
                                bind:val={form_values.isbn}
                            />
                    {#if helper.is_admin(data) == true}
                        <div class="col-lg-10">
                            <div class="mb-3">
                                <label class="form-label">Scheda Libro ?</label>
                                <div class="form-selectgroup">
                                    <label class="form-selectgroup-item">
                                        <input
                                            type="radio"
                                            name="scheda_libro"
                                            value="SI"
                                            class="form-selectgroup-input"
                                            bind:group={form_values.scheda_libro}
                                        />
                                        <span class="form-selectgroup-label">SI</span>
                                    </label>
                                    <label class="form-selectgroup-item">
                                        <input
                                            type="radio"
                                            name="scheda_libro"
                                            value="NO"
                                            class="form-selectgroup-input"
                                            bind:group={form_values.scheda_libro}
                                        />
                                        <span class="form-selectgroup-label">NO</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    {/if}
				</div>
				<div class="modal-footer">
					<a href="#" class="btn btn-danger" data-bs-dismiss="modal" on:click={cancel_action}>
						<b>Cancel</b>
					</a>
					<button class="btn btn-success ms-auto">
						<i class="ti ti-plus icon" />
						{#if modal_action == 'create'}
							<b>Crea Libro</b>
						{:else}
							<b>Aggiorna Libro</b>
						{/if}
					</button>
				</div>
			</div>
		</div>
	</form>
</div>
