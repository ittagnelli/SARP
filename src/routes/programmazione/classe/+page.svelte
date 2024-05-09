<script>
	import Table from "$lib/components/common/table.svelte";
	import { page_action_title, page_title, page_pre_title, page_action_modal } from '$js/store';
    import { saveAs } from 'file-saver';
    
    export let data;
    /* Page properties */
	$page_action_title = '';
	$page_pre_title = 'Programmazione classe';
	$page_title = 'Programmazione classi';
	$page_action_modal = 'modal-template';

    data.classi.forEach(classe => classe.classe_name = `${classe?.classe} ${classe?.istituto} ${classe?.sezione}`);
    data.classi = data.classi.slice(1, data.classi.length);	// Rimuovo classe 0

    async function print_doc(id, periodo) {
        //inviamo un form senza form così usiamo l'action del form nel baackend
        let formdata = new FormData();
        formdata.append("id", id);
        formdata.append("periodo", periodo);

        const res = await fetch('?/pdf', {
            method: 'POST',
            body: formdata
        });

        if (res.ok) {
            //salviamo il file generato dal backend
            let json = await res.json();
        	const buffer = new Uint8Array(JSON.parse(JSON.parse(json.data)[1]).data); // Convertiamo la stringa in un oggetto che conterrà il nostro array di bytes che verrà poi convertito in Uint8Array, necessario all'oggetto Blob
            var blob = new Blob([buffer], { type: 'application/msword' });
            saveAs(blob, JSON.parse(json.data)[2]);           
        }
    }

    async function custom_action_handler(e) {
        switch(e.detail.action) {
            case 'print_q1':
                print_doc(e.detail.row_id, 1);
                break;
            case 'print_q2':
                print_doc(e.detail.row_id, 2);
                break;
        }
    }
</script>

<Table
	columns={[
		{ name: 'id', type: 'hidden', display: 'ID' },
        { name: 'classe_name', type: 'string', display: 'Classe', size: 50, search: true },
		{ name: 'ins_ratio_q1', type: 'string', display: 'Insegnamenti', size: 20},
        { name: 'programmazione_q1_completa', type: 'boolean', display: "Programmazione inizio anno completa", search: true },
        { name: 'ins_ratio_q2', type: 'string', display: 'Insegnamenti', size: 20},
        { name: 'programmazione_q2_completa', type: 'boolean', display: "Programmazione fine anno completa", search: true }
	]}  
	page_size={10}
	rows={data.classi}
	endpoint="programmazione/classe"
	footer="Programmazione classe"
	actions={true}
	resource="programmazione_classe"
    modal_name={$page_action_modal}
    trash={false}
    print={false}
    update={false}
    custom_actions={[{
                        action: 'print_q1', 
                        icon:'printer', 
                        tip: 'Stampa programmazione per la classe selezionata per il primo periodo',
                        condition: 'programmazione_q1_completa'
                      }, 
                      {
                        action: 'print_q2', 
                        icon:'printer', 
                        tip: 'Stampa programmazione per la classe selezionata per il secondo periodo',
                        condition: 'programmazione_q2_completa'
                      }
                    ]}
    on:custom_action={custom_action_handler}
/>
