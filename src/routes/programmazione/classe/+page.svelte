<script>
	import Table from "$lib/components/common/table.svelte";
	import { page_action_title, page_title, page_pre_title, page_action_modal } from '$js/store';
    import { saveAs } from 'file-saver';
    import { get_modal, delay } from '../../../js/helper';
    
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

        get_modal('generate_modal').toggle();
        const res = await fetch('?/pdf', {
            method: 'POST',
            body: formdata
        });

         
        if (res.ok) {
            //salviamo il file generato dal backend
            let json = await res.json();

            //save to word
        	// const buffer = new Uint8Array(JSON.parse(JSON.parse(json.data)[1]).data); // Convertiamo la stringa in un oggetto che conterrà il nostro array di bytes che verrà poi convertito in Uint8Array, necessario all'oggetto Blob
            // // var blob = new Blob([buffer], { type: 'application/msword' });
            // saveAs(blob, JSON.parse(json.data)[2]);
          
            //save to pdf
            const buffer = new Uint8Array(JSON.parse(JSON.parse(json.data)[1]).data); // Convertiamo la stringa in un oggetto che conterrà il nostro array di bytes che verrà poi convertito in Uint8Array, necessario all'oggetto Blob
            var blob = new Blob([buffer], { type: 'application/pdf' });
            saveAs(blob, JSON.parse(json.data)[2]);
        }
        dismiss_button.click();
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

    let dismiss_button;
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

<div class="modal modal-blur fade" id="generate_modal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-sm modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-status bg-primary"></div>
        <div class="modal-body text-center py-4">
          <svg fill="#000000" viewBox="0 0 32 32" id="icon" xmlns="http://www.w3.org/2000/svg" class="icon mb-2 text-primary icon-lg" width="24" height="24"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <defs> <style> .cls-1 { fill: none; } </style> </defs> <title>generate-pdf</title> <path d="M24,24v4H8V24H6v4H6a2,2,0,0,0,2,2H24a2,2,0,0,0,2-2h0V24Z"></path> <polygon points="21 21 19.586 19.586 17 22.172 17 14 15 14 15 22.172 12.414 19.586 11 21 16 26 21 21"></polygon> <polygon points="28 4 28 2 22 2 22 12 24 12 24 8 27 8 27 6 24 6 24 4 28 4"></polygon> <path d="M17,12H13V2h4a3.0033,3.0033,0,0,1,3,3V9A3.0033,3.0033,0,0,1,17,12Zm-2-2h2a1.0011,1.0011,0,0,0,1-1V5a1.0011,1.0011,0,0,0-1-1H15Z"></path> <path d="M9,2H4V12H6V9H9a2.0027,2.0027,0,0,0,2-2V4A2.0023,2.0023,0,0,0,9,2ZM6,7V4H9l.001,3Z"></path> <rect id="_Transparent_Rectangle_" data-name="<Transparent Rectangle>" class="cls-1" width="32" height="32"></rect> </g></svg>
          <div class="text-muted">Sto generando il documento di programmazione. Solo un attimo di pazienza!!!</div>
        </div>
        <div class="modal-footer" style="display:none;">
          <div class="w-100">
            <div class="row">
              <div class="col">
                <button type="button" bind:this={dismiss_button}  class="btn w-100" data-bs-dismiss="modal" aria-label="Close">Annulla</button>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>