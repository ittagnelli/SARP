<script>
	import { page_pre_title, page_title, page_action_title, page_action_modal } from '$js/store';
	import Table from '$lib/components/common/table.svelte';
	import InputText from '$lib/components/modal/input_text.svelte';
	import InputArea from '$lib/components/modal/input_area.svelte';
	import * as helper from '$js/helper';
	import * as yup from 'yup';
	import { Logger } from '$js/logger';
    import { onMount } from 'svelte';

	let logger = new Logger('client');
	export let data; //contiene l'oggetto restituito dalla funzione load() eseguita nel back-end
    // inizializzo la lista dei ticketcon il risultato della query SQL
    let tickets = helper.data2arr(data.tickets); // alias per maggior leggibilità

	//configura la pagina pre-titolo, titolo e nome del modale
	$page_pre_title = 'SARP';
	$page_title = 'Segnalazioni';
	$page_action_title = '';
	$page_action_modal = '';

	let modal_action = 'create';
	let modal_form; // entry point del form nel modale
	let errors = {}; //traccia gli errori di validazione del form

    onMount(() => {
        helper.init_tippy();
    });

	// campi del form
	// quest'oggetto deve contenere tutti i valori presenti nel form per
	// le operazione di create e update
	let form_values = {
		ticket_id: 0,
		idUtente: helper.user_id(data),
		applicazione_select: undefined,
		titolo: '',
		descrizione: ''
	};

	// schema di validazione del form
	const form_schema = yup.object().shape({
		titolo: yup
			.string()
			.required('Titolo segnalazione necessario')
			.min(5, 'Il titolo deve essere tra i 5 e i 30 caratteri')
			.max(30, 'Il titolo deve essere tra i 5 e i 30 caratteri'),

		descrizione: yup
			.string()
			.required('Descrizione segnalazione necessaria')
			.min(20, 'Il titolo deve essere tra i 20 e i 128 caratteri')
			.max(1024, 'Il titolo deve essere tra i 20 e i 1024 caratteri'),

        applicazione_select: yup
            .string()
			.required("Necessario scegliere un'applicazione")
	});

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
			logger.error(
				`Errori nella validazione del form aziende. Oggetto: ${JSON.stringify(
					form_values
				)} -- Errore: ${JSON.stringify(errors)}`
			);
		}
	}
</script>

{#if helper.is_dev(data)}
    <Table
		columns={[
			{ name: 'id', type: 'string', display: 'Ticket' },
			{ name: 'createdAt', type: 'date', display: 'Data Segnalazione' },
            { name: 'idUtente', type: 'string', display: 'Segnalato da' },
            { name: 'segnalatore', type: 'object', display: 'Cognome', key: 'cognome', size: 20 },
            { name: 'applicazione', type: 'string', display: 'Applicazione', size: 10 },
            { name: 'titolo', type: 'string', display: 'Titolo', size: 30 },
            { name: 'descrizione', type: 'string', display: 'Descrizione', size: 40 },
            { name: 'risolto', type: 'boolean', display: 'Risolto' }
		]}
		rows={tickets}
		page_size={10}
		modal_name={$page_action_modal}
		on:update_start={null}
		endpoint="support/ticket"
        footer="Ticket"
		print={false}
        actions={false}
        resource="ticket"
	/>
{:else}
	<div class="page-wrapper">
		<div class="page-body">
			<div class="container-xl">
				<div class="row row-cards">
					<div class="col-3" />
					<div class="col-6">
						<form
							class="card"
							method="POST"
							action="?/{modal_action}"
							on:submit|preventDefault={handleSubmit}
							bind:this={modal_form}
						>
							{#if modal_action == 'update'}
								<input type="hidden" name="id" bind:value={form_values.ticket_id} />
							{/if}
							<div class="card-body">
								<div class="mb-4">
									<h3 class="card-title">
										Se hai riscontrato un problema o vuoi fare una segnalazione, per cortesia
										compila il form seguente:
									</h3>
								</div>
								<div class="row row-cards">
									<div class="col-md-4">
										<div class="mb-4">
											<label class="form-label">Scegli l'ambito della segnalazione</label>
											<div class="form-selectgroup">
												<label class="form-selectgroup-item">
													<input
														type="radio"
														name="applicazione"
														value="SARP"
														class="form-selectgroup-input"
                                                        class:is-invalid="{errors.applicazione_select}"
                                                        bind:group={form_values.applicazione_select}
													/>
													<span class="form-selectgroup-label" data-tippy-content="Riporta un problema o un'idea relativa ad un ambito generico di SARP">
														<i class="ti ti-home" />
														SARP
													</span>
												</label>
												<div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</div>
												<label class="form-selectgroup-item">
													<input
														type="radio"
														name="applicazione"
														value="PCTO"
														class="form-selectgroup-input"
                                                        class:is-invalid="{errors.applicazione_select}"
                                                        bind:group={form_values.applicazione_select}
														checked
													/>
													<span class="form-selectgroup-label"  data-tippy-content="Riporta un problema o un'idea relativa alla sezione PCTO">
														<i class="ti ti-building-factory-2" />
														PCTO
													</span>
												</label>
											</div>
                                            {#if errors.applicazione_select}
                                                <span class="feedback-invalid">{errors.applicazione_select}</span>
                                            {/if}
										</div>
									</div>
									<div class="col-md-8">
										<InputText
											label="Titolo Segnalazione (problema o suggerimento)"
											name="titolo"
											{errors}
											placeholder=""
											bind:val={form_values.titolo}
										/>
									</div>
								</div>
								<div class="row row-cards">
									<div class="col-md-12">
										<InputArea
											label="Descrizione segnalazione (cerca di essere il più preciso e dettagliato possibile)"
											bind:val={form_values.descrizione}
											name="descrizione"
											rows="12"
											placeholder="Descrivi in dettaglio il problema o la segnalazione..."
											{errors}
										/>
									</div>
								</div>
							</div>
                            <div class="card-footer text-end">
                                <button type="submit" class="btn btn-primary">Invia Segnalazione</button>
                            </div>
						</form>
						
					</div>
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.messaggio {
		font-weight: bolder;
		font-size: 1.3rem;
	}

	i {
		font-size: 1.5rem;
	}

    /* hack siccome  invalid-feedback non funziona per i radio*/
    .feedback-invalid {
        color: #d63939;
        font-size: 85.714285%;
    }   
</style>
