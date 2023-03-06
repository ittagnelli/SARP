<script>
    
	import { page_pre_title, page_title, page_action_title, page_action_modal } from '../../js/store';
	import InputText from '$lib/components/modal/input_text.svelte';
    import InputDate from '$lib/components/modal/input_date.svelte';
    import Table from '$lib/components/common/table.svelte';
    import * as helper from '../../js/helper';
    import * as yup from 'yup';
    import { Logger } from '../../js/logger';
	import { onMount } from 'svelte';
    import { saveAs } from 'file-saver';
	import ModalError from '$lib/components/common/modal_error.svelte';

    let logger = new Logger("client");

	export let data; //contiene l'oggetto restituito dalla funzione load() eseguita nel back-end
    export let form; // Risposta del form dal server

    // inizializzo la lista delle aziende con il risultato della query SQL
    let aziende = helper.data2arr(data.aziende); // alias per maggior leggibilità
    
	//configura la pagina pre-titolo, titolo e nome del modale
	$page_pre_title = 'PCTO';
	$page_title = 'Aziende';
	$page_action_title = 'Aggiungi Azienda';
	$page_action_modal = 'modal-add-azienda';

	let idConvenzione, nome, idUtente, indirizzo,piva, telefono;
    let direttore, natoA, natoIl, codiceF;

	let modal_action = 'create';
    let modal_form; // entry point del form nel modale 
    let errors = {}; //traccia gli errori di validazione del form

    // campi del form
    // quest'oggetto deve contenere tutti i valori presenti nel form per
    // le operazione di create e update
    let form_values = {
        company_id: 0,
        nome: "",
        indirizzo: "",      
        piva: "",
        telefono: "",
        direttore_nome: "",
        direttore_natoA: "",
        direttore_natoIl: helper.convert_date(new Date()),
        direttore_codiceF: "",
        idConvenzione: "",
        idUtente: undefined,
        dataConvenzione: helper.convert_date(new Date()),
        dataProtocollo: helper.convert_date(new Date()),
        istituto: "ITT"
    };

    onMount(() => { // Controlliamo che l'inserimento sia andato a buon fine, usiamo on mount per richiamare le funzioni del DOM
        if (form != null) {
                if (form.file != null) { // è stato richiesto la generazione di un file
                    const buffer = new Uint8Array(JSON.parse(form.file).data); // Convertiamo la stringa in un oggetto che conterrà il nostro array di bytes che verrà poi convertito in Uint8Array, necessario all'oggetto Blob
                    var blob = new Blob([buffer], { type: 'application/msword' });
                    saveAs(blob, form.nome_convenzione);
                } else { // file è null quindi l'unico caso possibile è la violazione della chiave unique nel DB
                    form_values = JSON.parse(localStorage.getItem('form')); // Riempiamo il modale
                    helper.show_modal();
                }
            } else {
                // non c'è risposta dal server, tutto è andato a buon fine
                localStorage.removeItem('form'); //PROF: rimuoviamo il form dal localstorage
            }
    });

    // schema di validazione del form
    const form_schema = yup.object().shape({
        nome: yup
        .string()
        .required("Nome Azienda necessario")
        .matches(/^[a-zA-Z0-9.@\- 'à-è-ì-ò-ù]{3,40}$/, "Nome azienda non valida"),
        
        indirizzo: yup
        .string()
        .matches(/^$|^[a-zA-Z0-9 (),/]{3,100}$/, "Indirizzo azienda non valido"),

        piva: yup
        .string()
        .matches(/^$|^[0-9]{11}$/, "Partita Iva non valida"),

        telefono: yup
		.string()
		.matches(/^$|^[0-9]{3}\.[0-9]{3}\.[0-9]{2}\.[0-9]{2}$/, "Numero non valido [333.123.45.67]"),

        direttore_nome: yup
        .string()
        .matches(/^$|^[a-zA-Z ']{3,30}$/, "Nome Direttore non valido [Nome Cognome]"),

        direttore_natoA: yup
        .string()
        .matches(/^$|^[a-zA-Z à-è-ì-ò-ù]{3,30}$/, "Luogo di nascita non valido"),

        direttore_codiceF: yup
        .string()
        .matches(/^$|^[0-9A-Z]{16}$/, "Codice fiscale non valido [LNSTVL69T28L219K]"),

        idConvenzione: yup
        .string()
        .required("Numero Convenzione necessario"),
        
        idUtente: yup
        .number()
        .positive(),
        
        direttore_natoIl: yup
        .date(),
        
        dataConvenzione: yup
        .date()
        .min(new Date(2016, 1, 1), "Data antecedente al 01/01/2016"),
        
        dataProtocollo: yup
        .date()
        .min(new Date(2016, 1, 1), "Data antecedente al 01/01/2016")
    });

    async function start_update(e) {
		modal_action = 'update';
		
        form_values.company_id = e.detail.id;
		//cerca l'azienda da fare update
		let azienda = aziende.filter((item) => item.id == form_values.company_id)[0];

        form_values.nome = azienda.nome;
		form_values.indirizzo = azienda.indirizzo;
        form_values.piva = azienda.piva;
        form_values.telefono = azienda.telefono;
        form_values.direttore_nome = azienda.direttore_nome;
        form_values.direttore_natoA = azienda.direttore_natoA;
        form_values.direttore_natoIl = helper.convert_date(azienda.direttore_natoIl);
        form_values.direttore_codiceF = azienda.direttore_codiceF;
        form_values.idConvenzione = azienda.idConvenzione;
        form_values.idUtente = azienda.idUtente;
		form_values.dataConvenzione = helper.convert_date(azienda.dataConvenzione);
		form_values.dataProtocollo = helper.convert_date(azienda.dataProtocollo);
        form_values.istituto = azienda.istituto;
	}

    async function cancel_action(){
        if(modal_action == "update"){
            await helper.wait_fade_finish();
            modal_action = 'create';    // Reset model string
            form_values = { // Reset form values
                company_id: 0,
                nome: "",
                indirizzo: "",      
                piva: "",
                telefono: "",
                direttore_nome: "",
                direttore_natoA: "",
                direttore_natoIl: helper.convert_date(new Date()),
                direttore_codiceF: "",
                idConvenzione: "",
                idUtente: undefined,
                dataConvenzione: helper.convert_date(new Date()),
                dataProtocollo: helper.convert_date(new Date()),
                istituto: "ITT"
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
            logger.error(`Errori nella validazione del form aziende. Oggetto: ${JSON.stringify(form_values)} -- Errore: ${JSON.stringify(errors)}`);
        }
    }
</script>

<Table
	columns={[
		{ name: 'id', type: 'hidden', display: 'ID' },
		{ name: 'idConvenzione', type: 'string', display: 'NO.', size: 10 },
		{ name: 'nome', type: 'string', display: 'Azienda/Ente', size: 40 },
        { name: 'indirizzo', type: 'string', display: 'indirizzo', size: 30 },
        { name: 'piva', type: 'string', display: 'piva', size: 12 },
        { name: 'telefono', type: 'string', display: 'telefono', size: 14 },
        { name: 'direttore_nome', type: 'string', display: 'direttore', size: 20 },
		{ name: 'dataConvenzione', type: 'date', display: 'Data Convenzione' },
		{ name: 'dataProtocollo', type: 'date', display: 'Data Protocollo' },
		{ name: 'istituto', type: 'string', display: 'Istituto', size: 6 }
	]}
	rows={aziende}
	page_size={10}
	modal_name={$page_action_modal}
	on:update_start={start_update}
	endpoint="aziende"
    footer="Aziende"
    print={true}
    actions={true}
    resource="pcto_aziende"
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
			<input type="hidden" name="id" bind:value={form_values.company_id} />
		{/if}
		<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header">
					{#if modal_action == 'create'}
						<h5 class="modal-title">Nuova Azienda</h5>
					{:else}
						<h5 class="modal-title">Aggiorna Azienda</h5>
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
                            label="NO. Convenzione"
                            name="idConvenzione"
                            {errors}
                            placeholder="2223/01"
                            bind:val={form_values.idConvenzione}
                        />
						</div>
						<div class="col-lg-8">
                            <InputText
                            label="Azienda"
                            name="nome"
                            {errors}
                            placeholder="Nome Azienda o Ente"
                            bind:val={form_values.nome}
                        />
						</div>
					</div>
                    <div class="row">
						<div class="col-lg-12">
                            <InputText
                                label="Indirizzo"
                                name="indirizzo"
                                {errors}
                                placeholder="Corso Unione Sovietica 312, 10135 Torino"
                                bind:val={form_values.indirizzo}
                            />
						</div>
					</div>
                    <div class="row">
						<div class="col-lg-6">
                            <InputText
                                label="P.IVA"
                                name="piva"
                                {errors}
                                placeholder="86334519757"
                                bind:val={form_values.piva}
                            />
						</div>
                        <div class="col-lg-6">
                            <InputText
                                label="Telefono"
                                name="telefono"
                                {errors}
                                placeholder="333.123.45.67"
                                bind:val={form_values.telefono}
                            />
						</div>
					</div>
                    <div class="row">
						<div class="col-lg-3">
                            <InputText
                                label="Direttore"
                                name="direttore_nome"
                                {errors}
                                placeholder="Nome e Cognome"
                                bind:val={form_values.direttore_nome}
                            />

						</div>
                        <div class="col-lg-3">
                            <InputText
                                label="Nato A"
                                name="direttore_natoA"
                                placeholder="Località"
                                {errors}
                                bind:val={form_values.direttore_natoA}
                            />
                        </div>
                        <div class="col-lg-3">
                            <InputDate
                                label="Nato Il"
                                name="direttore_natoIl"
                                {errors}
                                bind:val={form_values.direttore_natoIl}
                            />
						</div>
                        <div class="col-lg-3">
                            <InputText
                                label="Codice Fiscale"
                                name="direttore_codiceF"
                                placeholder="LNSTVL69T28L219K"
                                {errors}
                                bind:val={form_values.direttore_codiceF}
                            />
                        </div>
					</div>
					<div class="row">
						<div class="col-lg-4">
                            <InputDate
                                label="Data Convenzione"
                                name="dataConvenzione"
                                {errors}
                                bind:val={form_values.dataConvenzione}
                            />
						</div>
						<div class="col-lg-4">
                            <InputDate
                            label="Data Protocollo"
                            name="dataProtocollo"
                            {errors}
                            bind:val={form_values.dataProtocollo}
                        />
						</div>
						<div class="col-lg-4">
							<div class="mb-3">
								<label class="form-label">Istituto</label>
								<div class="form-selectgroup">
									<label class="form-selectgroup-item">
										<input
											type="radio"
											name="istituto"
											value="ITT"
											class="form-selectgroup-input"
											bind:group={form_values.istituto}
										/>
										<span class="form-selectgroup-label">ITI</span>
									</label>
									<label class="form-selectgroup-item">
										<input
											type="radio"
											name="istituto"
											value="LICEO"
											class="form-selectgroup-input"
											bind:group={form_values.istituto}
										/>
										<span class="form-selectgroup-label">LICEO</span>
									</label>
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
							<b>Crea Azienda</b>
						{:else}
							<b>Aggiorna Azienda</b>
						{/if}
					</button>
				</div>
			</div>
		</div>
	</form>
</div>
