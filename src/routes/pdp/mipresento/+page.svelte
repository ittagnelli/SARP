<script>
	import { page_pre_title, page_title, page_action_title, page_action_modal } from '$js/store';
	import Table from '$lib/components/common/table.svelte';
    import * as helper from '$js/helper';
	import { Logger } from '$js/logger';
	import { onMount } from 'svelte';
    import { griglia_pdp_a1 } from './griglia_pdp_a1.js';

	export let data; //contiene l'oggetto restituito dalla funzione load() eseguita nel back-end
	export let form; // Risposta del form dal server

	let logger = new Logger('client');
	let studenti = helper.data2arr(data.studenti);
    let current_griglia_pdp_a1 = {};
    
    //set default griglia_a1 for students never evaluated
    studenti.forEach((s) => {
        if(s.griglia_pdp_a1 == null)
            s.griglia_pdp_a1 = griglia_pdp_a1;
    })
    
	//configura la pagina pre-titolo, titolo e nome del modale
	$page_pre_title = 'STUDENTE';
	$page_title = 'Mi Presento';
	$page_action_title = '';
	$page_action_modal = 'modal-update-griglia';

	let modal_action = 'create';
	let modal_form; // entry point del form nel modale

	// campi del form
	// quest'oggetto deve contenere tutti i valori presenti nel form per
	// le operazione di create e update
	let form_values = {
		student_id: 0,
        completo: 'NO'
	};

	async function start_update(e) {
		modal_action = 'update';
		form_values.student_id = e.detail.id;
		//cerca l'utente da fare update
		let studente = studenti.filter((item) => item.id == form_values.student_id)[0];
        form_values.completo = studente.griglia_pdp_a1_done ? 'SI': 'NO';
        current_griglia_pdp_a1 = JSON.parse(studente.griglia_pdp_a1);
	}

	async function cancel_action(){
		if(modal_action == 'update'){
			await helper.wait_fade_finish(150);
			modal_action = 'create';	// Reset model string
			form_values = {	// Reset form values
				student_id: 0,
                completo: 'NO'
			};
		}
	}
</script>

<Table
	columns={[
		{ name: 'id', type: 'hidden', display: 'ID' },
		{ name: 'cognome', type: 'string', display: 'Cognome', size: 30, search: true },
		{ name: 'nome', type: 'string', display: 'Nome', size: 30, search: true },
        { name: 'natoIl', type: 'date', display: 'Nato il' },
        { name: 'email', type: 'string', display: 'email', size: 30 },
		{ name: 'bes', type: 'boolean', display: 'pdp', search: true },
        { name: 'griglia_pdp_a1_done', type: 'boolean', display: 'competo', search: true }
	]}
	rows={studenti}
	page_size={10}
	modal_name={$page_action_modal}
	on:update_start={start_update}
	footer="Studenti"
    endpoint="pdp/griglia_osservativa"
	actions={true}
    trash={false}
    update_tip="Compila Presentazione al Consiglio di Classe"
    resource="pdp_mipresento"
/>

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
		<div class="modal-dialog modal-lg" role="document">
            <input type="hidden" name="student_id" bind:value={form_values.student_id} />
            <input type="hidden" name="griglia_pdp_a1" value={JSON.stringify(current_griglia_pdp_a1)} />
            <div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Mi Presento al Consiglio di Classe</h5>
				</div>
				<div class="modal-body">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="mb-3">
                                Io sono  <input size="14" class="input" type="text" name="nome" placeholder="Nome Cognome" bind:value={current_griglia_pdp_a1['mipresento_nome']} />
                                ho  <input class="input" type="number" id="anni" min="12" max="22" bind:value={current_griglia_pdp_a1['mipresento_anni']} /> anni 
                                e frequento la classe <input size="14" class="input" type="text" name="classe" placeholder="3 ITT INFO" bind:value={current_griglia_pdp_a1['mipresento_classe']} />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="mb-3">
                                <label class="form-label">Chi sono; quali sono i miei interessi, le difficoltà, le attività preferite</label>
                                <textarea name="testo_1" cols="100" rows="3" bind:value={current_griglia_pdp_a1['mipresento_testo_1']} />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="mb-3">
                                <label class="form-label">Quando sono soddisfatto; quando sto bene?</label>
                                <textarea name="testo_1" cols="100" rows="3" bind:value={current_griglia_pdp_a1['mipresento_testo_2']} />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="mb-3">
                                <label class="form-label">Che cosa non mi piace; che cosa mi è di aiuto; che cosa mi è difficile?</label>
                                <textarea name="testo_1" cols="100" rows="3" bind:value={current_griglia_pdp_a1['mipresento_testo_3']} />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="mb-3">
                                <label class="form-label">Che cosa vorrei che succedesse; che cosa mi aspetto dalla scuola, dagli insegnanti, dai compagni.</label>
                                <textarea name="testo_1" cols="100" rows="3" bind:value={current_griglia_pdp_a1['mipresento_testo_4']} />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="mb-3">
                                <label class="form-label">Quali sono i miei interessi, sport, hobby, attività, ….</label>
                                <textarea name="testo_1" cols="100" rows="3" bind:value={current_griglia_pdp_a1['mipresento_testo_5']} />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="mb-3">
                                <label class="form-label">A che gruppi extra scolastici partecipo?</label>
                                <textarea name="testo_1" cols="100" rows="3" bind:value={current_griglia_pdp_a1['mipresento_testo_6']} />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="mb-3">
                                <label class="form-label">I miei punti di forza</label>
                                <textarea name="testo_1" cols="100" rows="3" bind:value={current_griglia_pdp_a1['mipresento_testo_7']} />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="mb-3">
                                <label class="form-label">Le mie fragilità</label>
                                <textarea name="testo_1" cols="100" rows="3" bind:value={current_griglia_pdp_a1['mipresento_testo_8']} />
                            </div>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="mb-3">
                                <label class="form-label">Bisogni : che cosa chiedo ai miei insegnanti?</label>
                                <textarea name="testo_1" cols="100" rows="3" bind:value={current_griglia_pdp_a1['mipresento_testo_9']} />
                            </div>
                        </div>
                    </div>  
                    <div class="row">
                        <div class="col-lg-4">
                            <br>
                            <label class="form-label">Presentazione Completa</label>
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

<style>
    .input {
        margin-left: 0.5rem;
        margin-right: 0.5rem;
    }
</style>