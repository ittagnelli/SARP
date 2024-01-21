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
    let pdps = build_pdp_obj(studenti);

    // console.log(pdps)


	onMount(async () => { // Controlliamo che l'inserimento sia andato a buon fine, usiamo on mount per richiamare le funzioni del DOM
        if (form != null) {
			const buffer = new Uint8Array(JSON.parse(form.file).data); // Convertiamo la stringa in un oggetto che conterrà il nostro array di bytes che verrà poi convertito in Uint8Array, necessario all'oggetto Blob
            var blob = new Blob([buffer], { type: 'application/msword' });
            saveAs(blob, form.nome_documento);        
		}
    });

    // data.classi.forEach(classe => classe.classe_name = `${classe?.classe} ${classe?.istituto} ${classe?.sezione}`);
    // data.classi = data.classi.slice(1, data.classi.length);	// Rimuovo classe 0

    function build_pdp_obj(studenti) {
        return studenti.map((s) => {
            s['can_print'] = s.griglia_valutazione != null;
            return s;
        });

//         {
//     "id": 22,
//     "createdAt": "2023-02-14T10:50:25.153Z",
//     "updatedAt": "2023-09-18T17:05:28.251Z",
//     "creatoDa": 1,
//     "tipo": "STUDENTE",
//     "nome": "Davide",
//     "cognome": "Buczkowsky",
//     "natoA": "Moncalieri ",
//     "natoIl": "2006-05-16T00:00:00.000Z",
//     "codiceF": "BCZDVD06E16F335X",
//     "cartaI": null,
//     "email": "davide.buczkowsky@istitutoagnelli.it",
//     "telefono": null,
//     "picture": "/img/users/BUCZKOWSKY_DAVIDE.png",
//     "bes": true,
//     "can_login": true,
//     "istituto": "ITT",
//     "classeId": 12,
//     "griglia_valutazione": null
// }
    }
</script>


<Table
	columns={[
		{ name: 'id', type: 'hidden', display: 'ID' },
        { name: 'cognome', type: 'string', display: 'Cognome', size: 50, search: true },
        { name: 'nome', type: 'string', display: 'Nome', size: 50, search: true },
        { name: 'bes', type: 'boolean', display: "PDP", search: true },
		{ name: 'can_print', type: 'boolean', display: "PDP Completo", search: true },
	]}
	page_size={10}
	rows={pdps}
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


<!-- print_filter={"can_print"} -->
