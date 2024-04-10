<script>
	import Table from "$lib/components/common/table.svelte";
	import { page_action_title, page_title, page_pre_title, page_action_modal } from '$js/store';
    import { saveAs } from 'file-saver';
	import { onMount } from "svelte";
    import * as helper from '$js/helper';
	import { construct_svelte_component, identity } from "svelte/internal";
	
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
        return studenti.map((s,i) => {
            s['studente_col'] = `${s.cognome} ${s.nome}`;
            s['classe_col'] = `${s.classe.classe} ${s.classe.istituto} ${s.classe.sezione}`;
            s['sintesi_vocale'] = s.pdp.some(i => i.sintesi_vocale == true);
            s['tempo_esteso'] = s.pdp.some(i => i.tempo_esteso == true);
            let tot_materie = s.pdp.length;
            let materie_complete = s.pdp.filter(m => m.completo == true).length;
            s['materie_col'] = `${materie_complete}/${tot_materie}`;
            s['can_print'] = (materie_complete == tot_materie) &&
                             s.griglia_valutazione_done && 
                             s.griglia_pdp_a1_done && 
                             s.griglia_pdp_c1_done &&
                             s.griglia_pdp_c2_done &&
                             s.griglia_pdp_b_done;
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
        { name: 'sintesi_vocale', type: 'boolean', display: "Sintesi Vocale", search: true },
        { name: 'tempo_esteso', type: 'boolean', display: "Tempo Esteso", search: true },
		{ name: 'griglia_valutazione_done', type: 'boolean', display: "Griglia Osservativa", search: true },
        { name: 'griglia_pdp_a1_done', type: 'boolean', display: "Mi Presento", search: true },
        { name: 'griglia_pdp_c1_done', type: 'boolean', display: "Autovalutazione", search: true },
        { name: 'griglia_pdp_c2_done', type: 'boolean', display: "Patto Educativo", search: true },
        { name: 'griglia_pdp_b_done', type: 'boolean', display: "Griglia Abilità", search: true },
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
