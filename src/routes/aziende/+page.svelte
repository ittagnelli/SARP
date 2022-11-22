<script>
	import { get } from 'svelte/store';

	import { onMount } from 'svelte';
	import { page_pre_title, page_title, page_action_title, page_action_modal } from '../../js/store';
	import Table from '$lib/components/common/table.svelte';
    import { convert_date } from '../../js/helper';
    
	export let data; //contiene l'oggetto restituito dalla funzione load() eseguita nel back-end
	let aziende = []; // alias per maggior leggibilità

	// inizializzo la lista delle aziende con il risultato della query SQL
	Object.keys(data).forEach((key) => {
		aziende = [...aziende, data[key]];
	});
    
	//configura la pagina pre-titolo, titolo e nome del modale
	$page_pre_title = 'PCTO';
	$page_title = 'Aziende';
	$page_action_title = 'Aggiungi Azienda';
	$page_action_modal = 'modal-add-azienda';

	let idConvenzione, nome, idUtente, indirizzo,piva, telefono;
    let direttore, natoA, natoIl, codiceF;


    idConvenzione="2223-1"
    nome="ACME"
    indirizzo="via tale"
    piva="3434232"
    telefono="555555"
    direttore="MARIO"
    natoA="VC"
    codiceF = "erfvkdmklerfcm"


	let dataConvenzione = convert_date(new Date());
	let dataProtocollo = convert_date(new Date());

	let istituto_select = 'ITT';

	let modal_action = 'create';
	let company_id;

	async function start_update(e) {
		modal_action = 'update';
		company_id = e.detail.id;
		//cerca l'azienda da fare update
		let azienda = aziende.filter((item) => item.id == company_id)[0];
		idConvenzione = azienda.idConvenzione;
		nome = azienda.nome;
		idUtente = azienda.idUtente;
		dataConvenzione = convert_date(azienda.dataConvenzione);
		dataProtocollo = convert_date(azienda.dataProtocollo);
		istituto_select = azienda.istituto;
        indirizzo = azienda.indirizzo;
        piva = azienda.piva;
        telefono = azienda.telefono;
        direttore = azienda.direttore;
        natoA = azienda.natoA;
        natoIl = convert_date(azienda.natoIl);
        codiceF = azienda.codiceF;
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
        { name: 'direttore', type: 'string', display: 'direttore' },
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
	<form method="POST" action="?/{modal_action}">
		{#if modal_action == 'update'}
			<input type="hidden" name="id" bind:value={company_id} />
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
							<div class="mb-3">
								<label class="form-label">NO. Convenzione</label>
								<input
									type="text"
									class="form-control"
									name="no_convenzione"
									placeholder="Numero Convenzione"
									bind:value={idConvenzione}
								/>
							</div>
						</div>
						<div class="col-lg-8">
							<div class="mb-3">
								<label class="form-label">Azienda</label>
								<input
									type="text"
									class="form-control"
									name="azienda"
									placeholder="Nome Azienda o Ente"
									bind:value={nome}
								/>
							</div>
						</div>
					</div>
                    <div class="row">
						<div class="col-lg-12">
							<div class="mb-3">
								<label class="form-label">Indirizzo</label>
								<input
									type="text"
									class="form-control"
									name="indirizzo"
									placeholder="Indirizzo"
									bind:value={indirizzo}
								/>
							</div>
						</div>
					</div>
                    <div class="row">
						<div class="col-lg-6">
							<div class="mb-3">
								<label class="form-label">P.IVA</label>
								<input
									type="text"
									class="form-control"
									name="piva"
									placeholder="Partita Iva"
									bind:value={piva}
								/>
							</div>
						</div>
                        <div class="col-lg-6">
							<div class="mb-3">
								<label class="form-label">Telefono</label>
								<input
									type="text"
									class="form-control"
									name="telefono"
									placeholder="Telefono"
									bind:value={telefono}
								/>
							</div>
						</div>
					</div>
                    <div class="row">
						<div class="col-lg-3">
							<div class="mb-3">
								<label class="form-label">Direttore</label>
								<input
									type="text"
									class="form-control"
									name="direttore"
									placeholder="Direttore"
									bind:value={direttore}
								/>
							</div>

						</div>
                        <div class="col-lg-3">
                            <div class="mb-3">
                                <label class="form-label">Nato A</label>
                                <input
                                    type="text"
                                    class="form-control"
                                    name="natoA"
                                    bind:value={natoA}
                                />
                            </div>
                        </div>
                        <div class="col-lg-3">
							<div class="mb-3">
								<label class="form-label">Nato Il</label>
								<input
									type="date"
									name="natoIl"
									class="form-control"
                                    bind:value={natoIl}
								/>
							</div>
						</div>
                        <div class="col-lg-3">
                            <div class="mb-3">
                                <label class="form-label">Codice Fiscale</label>
                                <input
                                    type="text"
                                    class="form-control"
                                    name="codiceF"
                                    bind:value={codiceF}
                                />
                            </div>
                        </div>
					</div>
					<div class="row">
						<div class="col-lg-4">
							<div class="mb-3">
								<label class="form-label">Data Convenzione</label>
								<input
									type="date"
									name="data_convenzione"
									class="form-control"
                                    bind:value={dataConvenzione}
								/>
							</div>
						</div>
						<div class="col-lg-4">
							<div class="mb-3">
								<label class="form-label">Data Protocollo</label>
								<input
									type="date"
									name="data_protocollo"
									class="form-control"
									bind:value={dataProtocollo}
								/>
							</div>
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
											bind:group={istituto_select}
										/>
										<span class="form-selectgroup-label">ITI</span>
									</label>
									<label class="form-selectgroup-item">
										<input
											type="radio"
											name="istituto"
											value="LICEO"
											class="form-selectgroup-input"
											bind:group={istituto_select}
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
					<button class="btn btn-success ms-auto" data-bs-dismiss="modal">
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
