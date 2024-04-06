<script>
	import { page_pre_title, page_title, page_action_title, page_action_modal } from '$js/store';
	import Table from '$lib/components/common/table.svelte';
	import * as helper from '$js/helper';
	import { Logger } from '$js/logger';
    import { griglia_pdp_b } from './griglia_pdp_b.js';

	export let data; //contiene l'oggetto restituito dalla funzione load() eseguita nel back-end
	export let form; // Risposta del form dal server

	let logger = new Logger('client');
	let studenti = helper.data2arr(data.studenti);
    //set default griglia_pdp_b for students never evaluated
    studenti.forEach((s) => {
        if(s.griglia_pdp_b == null)
            s.griglia_pdp_b = griglia_pdp_b;
    })
    
	//configura la pagina pre-titolo, titolo e nome del modale
	$page_pre_title = 'Referente BES';
	$page_title = 'Griglia Diagnosi Abilità';
	$page_action_title = '';
	$page_action_modal = 'modal-update-griglia';

	let modal_action = 'create';
	let modal_form; // entry point del form nel modale

	// campi del form
	// quest'oggetto deve contenere tutti i valori presenti nel form per
	// le operazione di create e update
	let form_values = {
		student_id: 0,
		griglia_pdp_b: '[]',
        completo: 'NO'
	};

	async function start_update(e) {
		modal_action = 'update';
		form_values.student_id = e.detail.id;
		//cerca l'utente da fare update
		let studente = studenti.filter((item) => item.id == form_values.student_id)[0];
        form_values.completo = studente.griglia_pdp_b_done ? 'SI': 'NO';
        form_values.griglia_pdp_b = JSON.parse(studente.griglia_pdp_b);
	}

	async function cancel_action(){
		if(modal_action == 'update'){
			await helper.wait_fade_finish(150);
			modal_action = 'create';	// Reset model string
			form_values = {	// Reset form values
				student_id: 0,
				griglia_pdp_b: '[]',
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
        { name: 'griglia_pdp_b_done', type: 'boolean', display: 'completo' }
	]}
	rows={studenti}
	page_size={10}
	modal_name={$page_action_modal}
	on:update_start={start_update}
	footer="Studenti"
    endpoint="pdp/griglia_diagnosi"
	actions={true}
    trash={false}
    print={false}
    print_filter={false}
    update_tip="Aggiorna Patto Educativo"
    resource="pdp_griglia_diagnosi"
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
            <input type="hidden" name="griglia_pdp_b" value={JSON.stringify(form_values.griglia_pdp_b)} />
            <div class="modal-content">
				<div class="modal-header">
					<h5 class="modal-title">Griglia Diagnosi Abilità</h5>
				</div>
				<div class="modal-body">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="mb-3">
                                <table>
                                    <tr>
                                        <td class="header">LETTURA</td>
                                        <td class="header">VELOCITA'</td>
                                        <td class="header">CORRETTEZZA</td>
                                    </tr>
                                    <tr>
                                        <td class="right">BRANO</td>
                                        <td class="center"><input class="input" type="text" value="{form_values.griglia_pdp_b['brano_velocita']}"/></td>
                                        <td class="center"><input class="input" type="text" value="{form_values.griglia_pdp_b['brano_correttezza']}"/></td>
                                    </tr>
                                    <tr>
                                        <td class="right">PAROLE</td>
                                        <td class="center"><input class="input" type="text" value="{form_values.griglia_pdp_b['parole_velocita']}"/></td>
                                        <td class="center"><input class="input" type="text" value="{form_values.griglia_pdp_b['parole_correttezza']}"/></td>
                                    </tr>
                                    <tr>
                                        <td class="right">NON PAROLE</td>
                                        <td class="center"><input class="input" type="text" value="{form_values.griglia_pdp_b['notparole_velocita']}"/></td>
                                        <td class="center"><input class="input" type="text" value="{form_values.griglia_pdp_b['notparole_correttezza']}"/></td>
                                    </tr>
                                    <tr>
                                        <td class="header" colspan="3">COMPRENSIONE</td>
                                    </tr>
                                    <tr>
                                        <td class="center">
                                            BRANO DI CRONACA
                                            <input class="input" type="text" value="{form_values.griglia_pdp_b['brano_cronaca']}"/>
                                        </td>
                                        <td class="center">
                                            BRANO INFORMATIVO
                                            <input class="input" type="text" value="{form_values.griglia_pdp_b['brano_informativo']}"/>
                                        </td>
                                        <td class="center">
                                            TOTALE
                                            <input class="input" type="text" value="{form_values.griglia_pdp_b['brano_totale']}"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="header" colspan="3">SCRITTURA</td>
                                    </tr>
                                    <tr>
                                        <td class="center">
                                            DETTATO DI BRANO
                                            <input class="input" type="text" value="{form_values.griglia_pdp_b['dettato_brano']}"/>
                                        </td>
                                        <td class="center">
                                            OMOFONE NON OMOGRAFE
                                            <input class="input" type="text" value="{form_values.griglia_pdp_b['omografe']}"/>
                                        </td>
                                        <td class="center">
                                            LISTA DI PAROLE
                                            <input class="input" type="text" value="{form_values.griglia_pdp_b['lista_parole']}"/><br>
                                            LISTA DI NON PAROLE
                                            <input class="input" type="text" value="{form_values.griglia_pdp_b['lista_notparole']}"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="center" colspan="3">
                                            <input class="input" type="text" value="{form_values.griglia_pdp_b['scrittura_altro']}"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="header" colspan="3">GRAFIA</td>
                                    </tr>
                                    <tr>
                                        <td class="center">
                                            lele<br>
                                            <input class="input" type="text" value="{form_values.griglia_pdp_b['grafia_lele']}"/>
                                        </td>
                                        <td class="center">
                                            uno<br>
                                            <input class="input" type="text" value="{form_values.griglia_pdp_b['grafia_uno']}"/>
                                        </td>
                                        <td class="center">
                                            Numeri in parole
                                            <input class="input" type="text" value="{form_values.griglia_pdp_b['grafia_numeri']}"/><br>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="center" colspan="3">
                                            <input class="input" type="text" value="{form_values.griglia_pdp_b['grafia_altro']}"/>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="header" colspan="3">CALCOLO</td>
                                    </tr>
                                    <tr>
                                        <td class="center">
                                            AREA DEL NUMERO<br>
                                            <input class="input" type="text" value="{form_values.griglia_pdp_b['calcolo_area_numero']}"/>
                                        </td>
                                        <td class="center">
                                            AREA DEL CALCOLO<br>
                                            <input class="input" type="text" value="{form_values.griglia_pdp_b['calcolo_area_calcolo']}"/>
                                        </td>
                                        <td class="center">
                                            SENSO DEL NUMERO<br>
                                            <input class="input" type="text" value="{form_values.griglia_pdp_b['senso_numero']}"/><br>
                                        </td>
                                    </tr> 
                                    <tr>
                                        <td class="center">
                                            Conteggio<br>
                                            <input class="input" type="text" value="{form_values.griglia_pdp_b['calcolo_conteggio']}"/>
                                        </td>
                                        <td class="center">
                                            Moltiplicazioni a mente<br>
                                            <input class="input" type="text" value="{form_values.griglia_pdp_b['calcolo_moltiplicazioni']}"/>
                                        </td>
                                        <td class="center">
                                            Triplette<br>
                                            <input class="input" type="text" value="{form_values.griglia_pdp_b['senso_triplette']}"/><br>
                                        </td>
                                    </tr> 
                                    <tr>
                                        <td class="center">
                                            Lettura dei numeri<br>
                                            <input class="input" type="text" value="{form_values.griglia_pdp_b['calcolo_lettura']}"/>
                                        </td>
                                        <td class="center">
                                            Calcolo a mente<br>
                                            <input class="input" type="text" value="{form_values.griglia_pdp_b['calcolo_mente']}"/>
                                        </td>
                                        <td class="center">
                                            Inserzioni<br>
                                            <input class="input" type="text" value="{form_values.griglia_pdp_b['senso_inserzioni']}"/><br>
                                        </td>
                                    </tr> 
                                    <tr>
                                        <td class="center">
                                            Scrittura di numeri<br>
                                            <input class="input" type="text" value="{form_values.griglia_pdp_b['calcolo_scrittura']}"/>
                                        </td>
                                        <td class="center">
                                            Calcolo rapido<br>
                                            <input class="input" type="text" value="{form_values.griglia_pdp_b['calcolo_rapido']}"/>
                                        </td>
                                        <td class="center">
                                            Calcolo approssimativo<br>
                                            <input class="input" type="text" value="{form_values.griglia_pdp_b['senso_approssimativo']}"/><br>
                                        </td>
                                    </tr> 
                                    <tr>
                                        <td class="center"></td>
                                        <td class="center">
                                            Operazioni scritte<br>
                                            <input class="input" type="text" value="{form_values.griglia_pdp_b['calcolo_scritte']}"/>
                                        </td>
                                        <td class="center"></td>
                                    </tr> 
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    <div class="row">
                        <div class="col-lg-4">
                            <br>
                            <label class="form-label">Griglia Diagnosi Completa</label>
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
    .lettura-label {
        position: relative;
        top: 2.5rem;
        font-weight: bold;
    }

    table {
        width: 100%;
    }

    tr,td {
        border: 1px solid black;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
    }

    .header {
        text-align: center;
        font-weight: bold;
        background-color: grey;
    }

    .center {
        text-align: center;
    }

    .right {
        text-align: right;
        padding-right: 1rem;
    }

    .input {
        width: 70%;
    }

</style>