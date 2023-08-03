<script>
	import { page_pre_title, page_title, page_action_title, page_action_modal } from '../../../js/store';
	import Table from '$lib/components/common/table.svelte';
    import * as helper from '../../../js/helper';
    import { Logger } from '../../../js/logger';
   
    let logger = new Logger("client");
	export let data; //contiene l'oggetto restituito dalla funzione load() eseguita nel back-end
   
    let test = helper.data2arr(data.test);
    test.forEach(test => {
        test['nome_studente'] = test.studente.cognome.concat(' ', test.studente.nome);
    });

    let current_test; //contiene il test selezionato per l'esecuzione
    let can_render = false; //dobbiamo generare il modale a runtime
    let tipi_corso = ['GENERICO', 'SPECIFICO'];

    //configura la pagina pre-titolo, titolo e nome del modale
	$page_pre_title = 'Sicurezza sul Lavoro';
	$page_title = 'Test';
	$page_action_title = '';
	let modal_action = 'run';

	let modal_form; // entry point del form nel modale
	let errors = {}; //traccia gli errori di validazione del form

    //scelgo la custom_icon in funzione del tipo di utente
    let custom_icon = helper.is_studente(data) ? 'checklist' : 'copy';

	async function handleSubmit() {
        console.log("HANDLE SUBIT DEL TEST");
        modal_form.submit();
        // try {
		// 	// valida il form prima del submit
		// 	await form_schema.validate(form_values, { abortEarly: false });
		// 	errors = {};
		// 	modal_form.submit();
		// } catch (err) {
		// 	errors = err.inner.reduce((acc, err) => {
		// 		return { ...acc, [err.path]: err.message };
		// 	}, {});
		// 	logger.error(`Errori nella validazione del form corso sicurezza. Oggetto: ${JSON.stringify(form_values)} -- Errore: ${JSON.stringify(errors)}`);
		// }
	}

    async function custom_action_handler(e) {
        current_test = test.filter(t => t.id == e.detail.row_id)[0];
        if(e.detail.action == 'run' && helper.is_studente(data)) {
            if(!current_test.svolto) {
                can_render = true;
                let test_run_modal = helper.get_modal('modal-run-test-generico');
                test_run_modal.show();
            } else {
                console.log("TEST GIA SVOLTO E COMPLETATO");
            }
        } else if(e.detail.action == 'run' && helper.is_admin(data)) {
            let studente = current_test.svoltoDa;
            const res = await fetch(`/sicurezza_sul_lavoro/test`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    corso: current_test.corso.id,
                    type: current_test.tipo,
                    studenti: [studente]
                })
            });
            
            if (res.ok) {
                //invalidate not working
                location.reload();
            } else {
                console.log("ERROR")
            }
        }
    }
</script>

<Table
	columns={[
		{ name: 'id', type: 'hidden', display: 'ID' },
        { name: 'nome_studente', type: 'string', display: 'studente', size: 30, search: true},
        { name: 'studente', type: 'object', key: 'istituto', display: 'istituto', size: 6, search: true },
		{ name: 'tipo', type: 'string', display: 'tipo', size: 50, search: true },
        { name: 'updatedAt', type: 'date', display: 'Eseguito', size: 30, },
        { name: 'svolto', type: 'boolean', display: 'completo', search: true },
        { name: 'superato', type: 'boolean', display: 'superato', search: true },
        { name: 'punti', type: 'number', display: 'punteggio' },
        { name: 'punti_max', type: 'number', display: 'punteggio max' },
	]}
	rows={test}
	page_size={6}
    actions={true}
    update={false}
    trash={false}
    custom_actions={[{action: 'run', icon: custom_icon}]}
    on:custom_action={custom_action_handler}
	endpoint="sicurezza_sul_lavoro/test"
    footer="Test di Sicurezza"
    resource="sicurezza_test"
/>

<!-- Modal from Page action -->
<div
	class="modal modal-blur fade"
	id="modal-run-test-generico"
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
		<div class="modal-dialog modal-xl" role="document">
			{#if can_render}
            <input type="hidden" name="id_test" bind:value={current_test.id} />
            <input type="hidden" name="type_test" bind:value={current_test.tipo} />
            <div class="modal-content">
				<div class="modal-header">
						<h5 class="modal-title">Test Sicurezza</h5>
				</div>
				<div class="modal-body">
                    {#each JSON.parse(current_test.domande) as question, idx}
                    <div class="row">
						<div class="col-lg-12">
							<div class="mb-3">
                                <label class="form-label">{idx + 1}. {question.question} </label>
                                <fieldset class="form-fieldset">
                                    <div class="{question.img && question.img != '' ? 'question-container' : ''}">
                                        {#if question.img && question.img != ''}
                                        <div>
                                            <img src="{question.img}" alt="cartello" />
                                        </div>
                                        {/if}
                                        <div>
                                            {#each question.answers as answer}
                                                <label class="form-check">
                                                    <input class="form-check-input" type="radio"  name="{question.qid}" value="{answer.aid}">
                                                    <span class="form-check-label">{answer.answer}</span>
                                                </label>
                                            {/each}
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
						</div>
					</div>
                    {/each}
					<div class="modal-footer">
						<a href="#" class="btn btn-danger" data-bs-dismiss="modal">
							<b>Cancel</b>
						</a>
						<button class="btn btn-success ms-auto">
							<i class="ti ti-mail-forward icon" />
							<b>Invia Risposte</b>
						</button>
					</div>
				</div>
			</div>
        {/if}
		</div>
	</form>
</div>

<style>
    .question-container {
        display: grid;
        grid-template-columns: 1fr 4fr;
        width: 500px;
        justify-items:flex-start;
        align-items: center;
    }
</style>