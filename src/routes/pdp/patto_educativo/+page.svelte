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
		griglia_pdp_c2: '[]',
        completo: 'NO'
	};

	async function start_update(e) {
		modal_action = 'update';
		form_values.student_id = e.detail.id;
		//cerca l'utente da fare update
		let studente = studenti.filter((item) => item.id == form_values.student_id)[0];
        form_values.completo = studente.griglia_pdp_c2_done ? 'SI': 'NO';
        form_values.griglia_pdp_c2 = JSON.parse(studente.griglia_pdp_c2);
	}

	async function cancel_action(){
		if(modal_action == 'update'){
			await helper.wait_fade_finish(150);
			modal_action = 'create';	// Reset model string
			form_values = {	// Reset form values
				student_id: 0,
				griglia_pdp_c2: '[]',
                completo: 'NO'
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
        { name: 'griglia_pdp_c2_done', type: 'boolean', display: 'completo' }
	]}
	rows={studenti}
	page_size={10}
	modal_name={$page_action_modal}
	on:update_start={start_update}
	footer="Studenti"
    endpoint="pdp/patto_educativo"
	actions={true}
    trash={false}
    print={false}
    print_filter={false}
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
            <input type="hidden" name="griglia_pdp_c2" value={JSON.stringify(form_values.griglia_pdp_c2)} />
            <div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Patto Educativo</h5>
				</div>
				<div class="modal-body">
                    {#each form_values.griglia_pdp_c2 as question,idx}
                        <div class="row">
                            <div class="col-lg-12">
                                <div class="mb-3">
                                    <label class="form-label">{idx + 1}. {question.question} </label>
                                    <!-- gestisce la domanda 0 che è un caso speciale -->
                                    {#if idx == 0}
                                        <div class="form-selectgroup">
                                            <label class="form-selectgroup-item">
                                                    <input
                                                        type="radio"
                                                        name="answer{idx}"
                                                        value="SI"
                                                        class="form-selectgroup-input"
                                                        bind:group={(form_values.griglia_pdp_c2[idx]).answer}
                                                    />
                                                <span class="form-selectgroup-label">SI</span>
                                            </label>
                                            <label class="form-selectgroup-item">
                                                    <input
                                                        type="radio"
                                                        name="answer{idx}"
                                                        value="NO"
                                                        class="form-selectgroup-input"
                                                        bind:group={(form_values.griglia_pdp_c2[idx]).answer}
                                                    />
                                                <span class="form-selectgroup-label">NO</span>
                                            </label>
                                        </div>
                                        <br><br>
                                        <input type="text" name="disc_1" bind:value={(form_values.griglia_pdp_c2[idx]).disc_1} />
                                        <input type="text" name="cadenza_1" bind:value={(form_values.griglia_pdp_c2[idx]).cadenza_1} /><br><br>
                                        <input type="text" name="disc_2" bind:value={(form_values.griglia_pdp_c2[idx]).disc_2} />
                                        <input type="text" name="cadenza_2" bind:value={(form_values.griglia_pdp_c2[idx]).cadenza_2} /><br><br>
                                        <input type="text" name="disc_3" bind:value={(form_values.griglia_pdp_c2[idx]).disc_3} />
                                        <input type="text" name="cadenza_3" bind:value={(form_values.griglia_pdp_c2[idx]).cadenza_3} /><br><br>
                                        <input type="text" name="disc_4" bind:value={(form_values.griglia_pdp_c2[idx]).disc_4} />
                                        <input type="text" name="cadenza_4" bind:value={(form_values.griglia_pdp_c2[idx]).cadenza_4} />
                                    {/if}
                                    <!-- gestisce la domanda 16 che è un caso speciale -->
                                    {#if idx == 16 || idx == 17}
                                        <input type="text" name="answer{idx}" size="80" bind:value={(form_values.griglia_pdp_c2[idx]).answer} />
                                    {/if}
                                    <!-- gestisce tutte le altre domande -->
                                    {#if idx != 0 && idx != 16 && idx != 17}
                                    <div class="form-selectgroup">
                                        <label class="form-selectgroup-item">
                                                <input
                                                    type="radio"
                                                    name="answer{idx}"
                                                    value="SI"
                                                    class="form-selectgroup-input"
                                                    bind:group={(form_values.griglia_pdp_c2[idx]).answer}
                                                />
                                            <span class="form-selectgroup-label">SI</span>
                                        </label>
                                        <label class="form-selectgroup-item">
                                                <input
                                                    type="radio"
                                                    name="answer{idx}"
                                                    value="NO"
                                                    class="form-selectgroup-input"
                                                    bind:group={(form_values.griglia_pdp_c2[idx]).answer}
                                                />
                                            <span class="form-selectgroup-label">NO</span>
                                        </label>
                                    </div>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    {/each}
                    <div class="row">
                        <div class="col-lg-4">
                            <br>
                            <label class="form-label">Patto Educativo Completo</label>
                            <div class="form-selectgroup">
                                <label class="form-selectgroup-item">
                                        <input
                                            type="radio"
                                            name="completo"
                                            value="SI"
                                            class="form-selectgroup-input"
                                            bind:group={form_values.completo}
                                        />
                                    <span class="form-selectgroup-label">SI</span>
                                </label>
                                <label class="form-selectgroup-item">
                                        <input
                                            type="radio"
                                            name="completo"
                                            value="NO"
                                            class="form-selectgroup-input"
                                            bind:group={form_values.completo}
                                        />
                                    <span class="form-selectgroup-label">NO</span>
                                </label>
                            </div>
                        </div>
                    </div>
                    <br>
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
