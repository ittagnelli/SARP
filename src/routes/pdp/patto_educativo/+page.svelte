<script>
	import { page_pre_title, page_title, page_action_title, page_action_modal } from '$js/store';
	import Table from '$lib/components/common/table.svelte';
	import * as helper from '$js/helper';
	import { Logger } from '$js/logger';
    import { griglia_pdp_c2 } from './griglia_pdp_c2.js';

	export let data; //contiene l'oggetto restituito dalla funzione load() eseguita nel back-end
	export let form; // Risposta del form dal server

	let logger = new Logger('client');
	let studenti = helper.data2arr(data.studenti);
    //set default griglia_pdp_c2 for students never evaluated
    studenti.forEach((s) => {
        if(s.griglia_pdp_c2 == null)
            s.griglia_pdp_c2 = griglia_pdp_c2;
    })
    
	//configura la pagina pre-titolo, titolo e nome del modale
	$page_pre_title = 'TUTOR';
	$page_title = 'Patto Educativo';
	$page_action_title = '';
	$page_action_modal = 'modal-update-griglia';

	let modal_action = 'create';
	let modal_form; // entry point del form nel modale

	// campi del form
	// quest'oggetto deve contenere tutti i valori presenti nel form per
	// le operazione di create e update
	let form_values = {
		student_id: 0,
		griglia_pdp_c2: '[]'
	};

	async function start_update(e) {
		modal_action = 'update';
		form_values.student_id = e.detail.id;
		//cerca l'utente da fare update
		let studente = studenti.filter((item) => item.id == form_values.student_id)[0];
		form_values.griglia_pdp_c2 = studente.griglia_pdp_c2;
	}

	async function cancel_action(){
		if(modal_action == 'update'){
			await helper.wait_fade_finish(150);
			modal_action = 'create';	// Reset model string
			form_values = {	// Reset form values
				student_id: 0,
				griglia_pdp_c2: '[]'
			};
		}
	}
</script>

<Table
	columns={[
		{ name: 'id', type: 'hidden', display: 'ID' },
		{ name: 'cognome', type: 'string', display: 'Cognome', size: 11, search: true },
		{ name: 'nome', type: 'string', display: 'Nome', size: 11, search: true },
        { name: 'natoIl', type: 'date', display: 'Nato il' },
        { name: 'email', type: 'string', display: 'email', size: 30 },
		{ name: 'bes', type: 'boolean', display: 'pdp' },
        { name: 'griglia_pdp_c2_completo', type: 'boolean', display: 'completo' }
	]}
	rows={studenti}
	page_size={10}
	modal_name={$page_action_modal}
	on:update_start={start_update}
	footer="Studenti"
    endpoint="pdp/patto_educativo"
	actions={true}
    trash={false}
    update_tip="Aggiorna Patto Educativo"
    resource="pdp_patto_educativo"
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
		bind:this={modal_form}
	>
		<div class="modal-dialog modal-xl" role="document">
            <input type="hidden" name="student_id" bind:value={form_values.student_id} />
            <input type="hidden" name="griglia_pdp_c2" bind:value={form_values.griglia_pdp_c2} />
            <div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Griglia Osservativa</h5>
				</div>
				<div class="modal-body">
                    <!-- very ugly but svelte is not php and tag must be closed in each loop
                    so this solution is not nice but overcome the problem -->
                    {#if form_values.griglia_pdp_c2.length > 0}
                        {@const questions = JSON.parse(form_values.griglia_pdp_c2)}
                        {@const max_questions = questions.length}
                        {#each questions as question,idx}
                            {#if idx % 2 == 0}
                            <div class="row">
                                <div class="col-lg-6">
                                    <div class="mb-3">
                                        <label class="form-label">{idx + 1}. {questions[idx].question} </label>
                                        <fieldset class="form-fieldset">
                                            <div>
                                                <div>
                                                    {#each questions[idx].answers as answer}
                                                        <label class="form-check">
                                                            <input 
                                                                class="form-check-input" 
                                                                type="radio"  
                                                                name="{questions[idx].qid}" 
                                                                value="{answer.aid}"
                                                                checked={answer.aid == questions[idx].answer}
                                                            >
                                                            <span class="form-check-label">{answer.answer}</span>
                                                        </label>
                                                    {/each}
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                                {#if questions[idx + 1]} <!-- needed to handle odd number of questions -->
                                <div class="col-lg-6">
                                    <div class="mb-3">
                                        <label class="form-label">{idx + 2}. {questions[idx + 1].question} </label>
                                        <fieldset class="form-fieldset">
                                            <div>
                                                <div>
                                                    {#each questions[idx + 1].answers as answer}
                                                        <label class="form-check">
                                                            <input 
                                                                class="form-check-input" 
                                                                type="radio"  
                                                                name="{questions[idx + 1].qid}" 
                                                                value="{answer.aid}"
                                                                checked={answer.aid == questions[idx + 1].answer}
                                                            >
                                                            <span class="form-check-label">{answer.answer}</span>
                                                        </label>
                                                    {/each}
                                                </div>
                                            </div>
                                        </fieldset>
                                    </div>
                                </div>
                                {/if}
                            </div>
                            {/if}
                        {/each}
                    {/if}
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
		</div>
	</form>
</div>
