<script>
	import Table from "$lib/components/common/table.svelte";
	import { page_action_title, page_title, page_pre_title, page_action_modal } from '$js/store';
    import { saveAs } from 'file-saver';
	import { onMount } from "svelte";

    /* Page properties */
	$page_action_title = '';
	$page_pre_title = 'Programmazione classe';
	$page_title = 'Programmazione classi';
	$page_action_modal = 'modal-template';

    export let data;
	export let form;

	onMount(async () => { // Controlliamo che l'inserimento sia andato a buon fine, usiamo on mount per richiamare le funzioni del DOM
        if (form != null) {
			const buffer = new Uint8Array(JSON.parse(form.file).data); // Convertiamo la stringa in un oggetto che conterrà il nostro array di bytes che verrà poi convertito in Uint8Array, necessario all'oggetto Blob
            var blob = new Blob([buffer], { type: 'application/msword' });
            saveAs(blob, form.nome_documento);        
		}
    });

    data.classi.forEach(classe => classe.classe = `${classe?.classe} ${classe?.istituto} ${classe?.sezione}`);
    data.classi = data.classi.slice(1, data.classi.length);	// Rimuovo classe 0
</script>


<Table
	columns={[
		{ name: 'id', type: 'hidden', display: 'ID' },
        { name: 'classe', type: 'string', display: 'Classe', size: 50 },
		{ name: 'programmazione_q1_completa', type: 'boolean', display: "Programmazione primo quadrimestre terminata" },
		{ name: 'programmazione_q2_completa', type: 'boolean', display: "Programmazione secondo quadrimestre terminata" },
		{ name: 'programmazione_completa', type: 'hidden', display: "Programmazione secondo quadrimestre terminata" }

	]}
	page_size={10}
	rows={data.classi}
	endpoint="programmazione/classe"
	footer="Programmazione classe"
	actions={true}
	resource="programmazione_classe"
    modal_name={$page_action_modal}
    trash={false}
    print={true}
    update={false}
    print_tip="Stampa programmazione per la classe selezionata"
	print_filter={"programmazione_completa"}
/>

