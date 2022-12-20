<script>
	import { page_pre_title, page_title, page_action_title, page_action_modal } from '../../js/store';
	import Table from '$lib/components/common/table.svelte';
    import RadioQuestions from '$lib/components/valutazioni/radioQuestions.svelte';
    import * as helper from '../../js/helper';
    import * as yup from 'yup';
    import InputText from '$lib/components/modal/input_text.svelte';
    import { Logger } from '../../js/logger';
    
    let logger = new Logger("client");
	export let data; //contiene l'oggetto restituito dalla funzione load() eseguita nel back-end
    //let valutazioni = helper.data2arr(data);
	let stages = []; // alias per maggior leggibilità

	//inizializzo la lista delle aziende con il risultato della query SQL, data.val si riferisce alle valutazioni
	Object.keys(data.vals).forEach((key) => {
		stages = [...stages, data.vals[key]];
	});
    // data.pcto.forEach(stage => {
    //     stages.push(stage.titolo);
    // });
	console.log(data);

	//configura la pagina pre-titolo, titolo e nome del modale
	$page_pre_title = 'PCTO';
	$page_title = 'Valutazioni';
	$page_action_title = 'Aggiungi valutazione';
	$page_action_modal = 'modal-add-azienda';

	let istituto_select = 'ITT';

	let modal_action = 'create';
    let modal_form; // entry point del form nel modale 
    let errors = {}; //traccia gli errori di validazione del form
    let selected_answers = {}
    let id_valutazione = 0



    let form_values = {
        id_valutazione: 0,
        idPcto: undefined,
        idUtente: undefined,
        risposte: ""
    };

    // const form_schema = yup.object().shape({
        
    // });

	async function start_update(e) {
		modal_action = 'update';
        form_values.id_valutazione = e.detail.id;
        //console.log(e.detail.id)
        let stage = stages.filter((item) => item.id == form_values.id_valutazione)[0];
        form_values.idPcto = stage.id_pcto;
        form_values.idUtente = stage.idUtente

	}

    async function handleSubmit() {
        console.log("VALIDAZIONE FORM")
        console.log("FORM VALIDO")
        modal_form.submit();
        // try {
        //     // valida il form prima del submit
        //     await form_schema.validate(form_values, { abortEarly: false });
        //     errors = {};
        //     modal_form.submit();
        // } catch (err) {
        //     errors = err.inner.reduce((acc, err) => {
        //         return { ...acc, [err.path]: err.message };
        //     }, {});
        //     console.log("CI SONO ERORRI:", errors)
        // }
    }



    let question = 0;
    let answers = [
        {
            id: 1,
            question_a: [
                "da una persona con ruolo direttivo",
                "da un impiegato",
                "da un operaio",
                "da nessuno"
            ]
        },
        {
            id: 2,
            question_a: ["A1,2","A2, 2"]
        },
        {
            id: 3,
            question_a: ["A1,3","A2, 3", "A3,3"]
        }
    ];

    let questions = [
        "Durante l’esperienza lavorativa seistato/a affiancato/a:",
        "La relazione con il tutor aziendale è stata:",
        "Ti sei trovato inserito/a in un clima direlazioni:",
        "Il contesto in cui sei stato/a inserito/a ha permesso di avere spazi di autonomia e di iniziativa personale?",
        "Durante l’esperienza lavorativa hai svolto:",
        "Le attività realizzate ti sono sembrate in linea con il tuo percorso formativo?",
        "Le conoscenze e le competenze da tepossedute, rispetto all’esperienza svolta, sono",
        "Il tempo a disposizione per svolgerel’esperienza svolta è stato:",
        "Ritieni che l’esperienza lavorativa ti abbia permesso di conoscere e comprendere l’organizzazione di lavoro in cui sei stato/a inserito/a?"
    ];

	function clear_radio(){
        if(modal_action == "create"){
            let inputs = document.getElementsByName("form-payment");
            for(const input of inputs)
                input.checked = false;
        } else if(modal_action == "update"){
            let input = document.getElementById(selected_answers[question]);
            input.checked = true;
        }
    }

</script>


<Table
	columns={[
		{ name: 'utente', type: 'object', display: 'Autore', key: 'nome' },
        { name: 'pcto', type: 'object', display: 'Stage', key: 'titolo'},
		{ name: 'createdAt', type: 'date', display:'data creazione'},
        { name: 'id', type: 'hidden', display: 'id'}
	]}
	rows={stages}
	page_size={5}
	modal_name={$page_action_modal}
	on:update_start={start_update}
    type_genre="f"
    type="valutazioni"
    print={false}
/>

<div
	class="modal modal-blur fade"
	id={$page_action_modal}
	tabindex="-1"
	role="dialog"
	aria-hidden="true"
>
    <form method="POST" action="?/{modal_action}" on:submit|preventDefault={handleSubmit} bind:this={modal_form}>
        {#if modal_action == 'update'}
			<input type="hidden" name="id" bind:value={form_values.id_valutazione} />
		{/if}
		<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header">
					{#if modal_action == 'create'}
						<h5 class="modal-title">Nuova Valutazione</h5>
					{:else}
						<h5 class="modal-title">Aggiorna Valutazione</h5>
					{/if}
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
				</div>
                <div class="modal-body">
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="form-label select_text">PCTO</div>
                            <select class="form-select" name="id_pcto" bind:value={id_valutazione}>
                                {#each data.stages as stage}
                                    <option value={stage.id}>{stage.titolo}</option>
                                {/each}
					        </select>	
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-lg-12">
                            <div class="form-label select_text">Domande:</div>
                            <select class="form-select" bind:value={question} on:change={clear_radio} >
                            {#each questions as quiz }
                                    {#if questions.indexOf(quiz) == 0}
                                        <option value={questions.indexOf(quiz)} selected>{quiz}</option>
                                    {:else}
                                        <option value={questions.indexOf(quiz)}>{quiz}</option>
                                    {/if}
                            {/each}
                            </select>
                        </div>
                    </div>
                    <div class="row">
                        <RadioQuestions answers={answers[question]} struct={selected_answers} on:radio_changed={(struct) => selected_answers = struct.detail.text}></RadioQuestions>
                    </div>
                    <div>
                        <input name="answers" type="hidden" value={JSON.stringify(selected_answers)}>
                    </div>

                </div>
                <div class="modal-footer">
					<a href="#" class="btn btn-danger" data-bs-dismiss="modal">
						<b>Cancel</b>
					</a>
					<button class="btn btn-success ms-auto">
						<i class="ti ti-plus icon" />
						{#if modal_action == 'create'}
							<b>Crea Valutazione</b>
						{:else}
							<b>Aggiorna Valutazione</b>
						{/if}
					</button>
				</div>
    </form>
</div> 

<!-- <Modal
	{modal_action}
	{company_id}
	{istituto_select}
	new_title="Nuova valutazione"
	update_title="Aggiorna valutazione"
>
	<div class="row">
		<div class="row">
			<div class="col-lg-4">
				<p class="text">Voto:</p>
				<div class="rate">
					<input type="radio" id="star5" name="voto" value="5" />
					<label for="star5" title="text">5 stars</label>
					<input type="radio" id="star4" name="voto" value="4" />
					<label for="star4" title="text">4 stars</label>
					<input type="radio" id="star3" name="voto" value="3" />
					<label for="star3" title="text">3 stars</label>
					<input type="radio" id="star2" name="voto" value="2" />
					<label for="star2" title="text">2 stars</label>
					<input type="radio" id="star1" name="voto" value="1" />
					<label for="star1" title="text">1 star</label>
				</div>
			</div>
			<div class="col-lg-4">
				<label for="valutatore" title="text" class="select_text">Valutatore</label>
				<input type="text" id="valutatore" name="valutatore" bind:value={valutatore} on:change={update_ids_val}/>
			</div>
		</div>
		{#if modal_action == "update"}
			<input type="hidden" id="valutatore" name="ids" bind:value={ids_update}/>
			<input type="hidden" id="valutatore" name="old_ids" bind:value={old_ids}/>
		{/if}
		<div class="row">
			<div class="col-lg-6">
				<div class="select_companies">
					<div class="form-label select_text">Azienda che fornisce PCTO</div>
					<select class="form-select" name="id_pcto" bind:value={company_id} on:change={update_ids_id}>
						{#each data.companies as company}
							<option value={company.id}>{company.nome}</option>
						{/each}
					</select>		
				</div>
			</div>
		</div>
	</div>
</Modal> -->

<!-- <style>
	.select_text{
		margin-bottom: 7px;
	}
	.select_companies{
		padding: 0 14px;
	}
	.text {
		padding: 0 14px;
	}
	* {
		margin: 0;
		padding: 0;
	}
	.rate {
		float: left;
		height: 46px;
		padding: 0 10px;
	}
	.rate:not(:checked) > input {
		position: absolute;
		top: -9999px;
	}
	.rate:not(:checked) > label {
		float: right;
		width: 1em;
		overflow: hidden;
		white-space: nowrap;
		cursor: pointer;
		font-size: 30px;
		color: #ccc;
	}
	.rate:not(:checked) > label:before {
		content: '★ ';
	}
	.rate > input:checked ~ label {
		color: #ffc700;
	}
	.rate:not(:checked) > label:hover,
	.rate:not(:checked) > label:hover ~ label {
		color: #deb217;
	}
	.rate > input:checked + label:hover,
	.rate > input:checked + label:hover ~ label,
	.rate > input:checked ~ label:hover,
	.rate > input:checked ~ label:hover ~ label,
	.rate > label:hover ~ input:checked ~ label {
		color: #c59b08;
	}
</style> -->
