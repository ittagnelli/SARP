<script>
	import Table from "$lib/components/common/table.svelte";
	import { page_action_title, page_title, page_pre_title, page_action_modal } from '$js/store';
    import { saveAs } from 'file-saver';
	import { onMount } from "svelte";
    import * as helper from '$js/helper';
	
    /* Page properties */
	$page_action_title = '';
	$page_pre_title = 'PDP';
	$page_title = 'Generazione Documenti';
	$page_action_modal = 'modal-template';

    export let data;
	export let form;

    // let insegnamenti = helper.data2arr(data.insegnamenti);
    // let classi = helper.data2arr(data.classi);
    let studenti = helper.data2arr(data.studenti);
    let pdp_studenti = is_pdp_complete(studenti);

    function is_pdp_complete(studenti) {
        return studenti.map((s) => {
            s['studente_col'] = `${s.cognome} ${s.nome}`;
            s['classe_col'] = `${s.classe.classe} ${s.classe.istituto} ${s.classe.sezione}`;
            s['griglia_val_col'] = s.griglia_valutazione != null;
            let tot_materie = s.pdp.length;
            let materie_complete = s.pdp.filter(m => m.completo == true).length;
            s['materie_col'] = `${materie_complete}/${tot_materie}`;
            s['can_print'] = (s.griglia_valutazione != null) && (materie_complete == tot_materie);
            return s;
        });
    }

	onMount(async () => { // Controlliamo che l'inserimento sia andato a buon fine, usiamo on mount per richiamare le funzioni del DOM
        if (form != null) {
			const buffer = new Uint8Array(JSON.parse(form.file).data); // Convertiamo la stringa in un oggetto che conterrà il nostro array di bytes che verrà poi convertito in Uint8Array, necessario all'oggetto Blob
            var blob = new Blob([buffer], { type: 'application/msword' });
            saveAs(blob, form.nome_documento);        
		}
    });
</script>


<Table
	columns={[
		{ name: 'id', type: 'hidden', display: 'ID' },
        { name: 'classe_col', type: 'string', display: 'Classe', size: 50, search: true },
        { name: 'studente_col', type: 'string', display: 'Studente', size: 50, search: true },
		{ name: 'griglia_val_col', type: 'boolean', display: "Griglia Valutativa", search: true },
        { name: 'materie_col', type: 'string', display: "Materie Complete", size: 10},
        { name: 'can_print', type: 'boolean', display: "PDP Completo", search: true },
	]}
	page_size={10}
	rows={pdp_studenti}
	endpoint="pdp/genera_pdp"
	footer="Documenti PDP"
	actions={true}
	resource="genera_pdp"
    modal_name={$page_action_modal}
    trash={false}
    print={true}
    update={false}
    print_tip="Stampa PDP per lo studente selezionato"
    print_filter={"can_print"}
/>
