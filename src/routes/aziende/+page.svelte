<script>
	import { page_pre_title, page_title, page_action_title, page_action_modal } from '../../js/store';
	import Table from '$lib/components/common/table.svelte';
    import * as helper from '../../js/helper';
    import * as yup from 'yup';

    import InputText from '$lib/components/modal/input_text.svelte';
    import InputDate from '$lib/components/modal/input_date.svelte';
	
	export let data; //contiene l'oggetto restituito dalla funzione load() eseguita nel back-end
    // inizializzo la lista delle aziende con il risultato della query SQL
    let aziende = helper.data2arr(data); // alias per maggior leggibilità

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

    // schema di validazione del form
    const form_schema = yup.object().shape({
        nome: yup.string().required("Nome Azienda necessario"),
        idConvenzione: yup.string().required("Numero Convenzione necessario"),
        idUtente: yup.number().positive(),
        direttore_natoIl: yup.date().max(new Date(2004,1,1), "Data Invalida"),
        dataConvenzione: yup.date().min(new Date(2022, 1, 1), "Data antecedente al 01/01/2022"),
        dataProtocollo: yup.date().min(new Date(2022, 1, 1), "Data antecedente al 01/01/2022"),
    });

    async function start_update(e) {
		modal_action = 'update';
		
        form_values.company_id = e.detail.id;
		//cerca l'azienda da fare update
		let azienda = aziende.filter((item) => item.id == form_values.company_id)[0];

        console.log("UPDATE AZIENDA:", azienda);
		
        form_values.nome = azienda.nome;
		form_values.indirizzo = azienda.indirizzo;
        form_values.piva = azienda.piva;
        form_values.telefono = azienda.telefono;
        form_values.direttore_nome = azienda.direttore_nome;
        form_values.direttore_natoA = azienda.direttore_natoA;
        form_values.direttore_natoIl = convert_date(azienda.direttore_natoIl);
        form_values.direttore_codiceF = azienda.direttore_codiceF;
        form_values.idConvenzione = azienda.idConvenzione;
        form_values.idUtente = azienda.idUtente;
		form_values.dataConvenzione = convert_date(azienda.dataConvenzione);
		form_values.dataProtocollo = convert_date(azienda.dataProtocollo);
        form_values.istituto = azienda.istituto;
	}

    async function handleSubmit() {
        console.log("VALIDAZIONE FORM")
        try {
            // valida il form prima del submit
            await form_schema.validate(form_values, { abortEarly: false });
            errors = {};
            modal_form.submit();
        } catch (err) {
            errors = err.inner.reduce((acc, err) => {
                return { ...acc, [err.path]: err.message };
            }, {});
            console.log("CI SONO ERORRI:", errors)
        }
    }
</script>

<Table
	columns={[
		{ name: 'id', type: 'hidden', display: 'ID' },
		{ name: 'idConvenzione', type: 'string', display: 'NO.' },
		{ name: 'nome', type: 'string', display: 'Azienda/Ente' },
        { name: 'indirizzo', type: 'string', display: 'indirizzo' },
        { name: 'piva', type: 'string', display: 'piva' },
        { name: 'telefono', type: 'string', display: 'telefono' },
        { name: 'direttore_nome', type: 'string', display: 'direttore' },
		{ name: 'idUtente', type: 'string', display: 'Creato da' },
		{ name: 'dataConvenzione', type: 'date', display: 'Data Convenzione' },
		{ name: 'dataProtocollo', type: 'date', display: 'Data Protocollo' },
		{ name: 'istituto', type: 'string', display: 'Istituto' }
	]}
	rows={aziende}
	page_size={5}
	modal_name={$page_action_modal}
	on:update_start={start_update}
	type="aziende"
    type_genre="f"
    print={true}
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
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
				</div>
				<div class="modal-body">
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
                                placeholder="3331234567"
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
                                placeholder="RSSMRA85T10A562S"
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
					<a href="#" class="btn btn-danger" data-bs-dismiss="modal">
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
