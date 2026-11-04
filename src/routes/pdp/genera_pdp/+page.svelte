<script>
	import Table from '$lib/components/common/table.svelte';
	// import { page_action_title, page_title, page_pre_title, page_action_modal } from '$js/store';
	import { page_action_title, page_title, page_pre_title, page_action_modal, page_header_link } from '$js/store';
	import { saveAs } from 'file-saver';
	// import { onMount } from 'svelte';
	import { onMount, onDestroy } from 'svelte';
	import * as helper from '$js/helper';
	import { construct_svelte_component, identity } from 'svelte/internal';
	// import { statoPdpStudente, PDP_COMPLETO, PDP_MAI_SALVATO } from '$js/pdp_status';
	import { statoPdpStudente, PDP_COMPLETO } from '$js/pdp_status';

	/* Page properties */
	$page_action_title = '';
	$page_pre_title = 'PDP';
	$page_title = 'Generazione Documenti';
	$page_action_modal = 'modal-template';
	// pulsante download report Excel nell'header, accanto al titolo (generato da ./report/+server.js)
	$page_header_link = { href: '/pdp/genera_pdp/report', title: 'Scarica report Excel', icon: 'file-spreadsheet' };
	onDestroy(() => ($page_header_link = null)); // non deve restare visibile nelle altre pagine

	export let data;
	export let form;

	let studenti = helper.data2arr(data.studenti);
  let insegnamenti = helper.data2arr(data.insegnamenti);
	let pdp_studenti = is_pdp_complete(studenti);

  //conta gli insegnamenti o materie relative ad una specifica classe
  function countMaterieClasse(classeId) {
    return insegnamenti.filter(insegnamento => insegnamento.idClasse == classeId).length; 
  }

  //verifica che un pdp entry sia associato ad un insegnamento specifico
  //per esempio se c'e' un PDP per TLC ma il docente non fa match, perchè è cambiato
  //questo PDP non è valido. Il nuovo docente deve creare il PDP per lo studente e per la materia
  //in tal modo gestisco il cambio di professore e le materie degli anni passati che non sono più valide
  function pdpMatchInsegnamenti(idDocente, idMateria, idClasse) {
    return insegnamenti.filter(insegnamento => 
              insegnamento.idDocente == idDocente &&
              insegnamento.idMateria == idMateria &&
              insegnamento.idClasse == idClasse).length == 1; 
  }

  function getMaterieComplete(studente) {
    return studente.pdp.filter(p => p.completo == true).map(p => p.idMateria);
  }

  function getInsegnamentiMancanti(studente) {

  }

	function is_pdp_complete(studenti) {

  // codice di debug: rompeva la pagina se non ci sono studenti (studenti[0] undefined)
  // let stu = studenti[0]
  //   console.log(stu)
  //   let cid = stu.classe.id
  //   console.log(insegnamenti.filter(insegnamento => insegnamento.idClasse == cid))
  //   let meterieCompleteId = getMaterieComplete(stu)
  //   console.log(meterieCompleteId)


		return studenti.map((s, i) => {
			s['studente_col'] = `${s.cognome} ${s.nome}`;
			s['classe_col'] = `${s.classe.classe} ${s.classe.istituto} ${s.classe.sezione}`;
			s['sintesi_vocale'] = s.pdp.some((i) => i.sintesi_vocale == true);
			s['tempo_esteso'] = s.pdp.some((i) => i.tempo_esteso == true);

      //stato PDP per ogni insegnamento della classe (regola condivisa in $js/pdp_status.js)
      const stato_insegnamenti = statoPdpStudente(s, insegnamenti);

      //ora il totale materie sonoo quelle insegnate (vedi insegnamenti)
      // let tot_materie = countMaterieClasse(s.classe.id);
      let tot_materie = stato_insegnamenti.length;

      //se tot materie è 0 allora non visualizzare pdp
      s['can_show'] = tot_materie > 0;

      //ora le materie complete sono le entry nel PDP la cui materia è nella lista delle materie dello studente associata al docente dell'anno
      // let materie_complete = s.pdp.filter(p =>
      //     p.completo == true &&
      //     pdpMatchInsegnamenti(p.idDocente, p.idMateria, s.classe.id) == true
      // ).length;
      let materie_complete = stato_insegnamenti.filter(si => si.stato == PDP_COMPLETO).length;

			s['materie_col'] = `${materie_complete}/${tot_materie}`;
			s['can_print'] =
				materie_complete == tot_materie &&
				tot_materie > 0 //posso stampare solo se ci sono tutte le materi e sono >0

     //s['materie_mancanti'] = [{materia: 'MATE'}, {materia: 'FISICA'}, {materia: 'GEOGRAFICA'}, {materia: 'FILOSOFIA'}];
      //materie il cui PDP non è completo, con il docente che lo deve completare
      s['materie_mancanti'] = stato_insegnamenti
        .filter(si => si.stato != PDP_COMPLETO)
        // .map(si => ({ materia: `${si.materia} (${si.docente})${si.stato == PDP_MAI_SALVATO ? ' *' : ''}` }));
        // .map(si => ({ materia: `${si.materia}${si.stato == PDP_MAI_SALVATO ? ' *' : ''}` })); //solo materia: con il docente l'etichetta era poco leggibile
        .map(si => ({ materia: si.materia })); //non completo o mai salvato: per chi consulta la pagina è comunque un PDP da completare
			return s;
		}).filter(p => p.can_show == true);
	}

	onMount(async () => {
		// Controlliamo che l'inserimento sia andato a buon fine, usiamo on mount per richiamare le funzioni del DOM
		if (form != null) {
			const buffer = new Uint8Array(JSON.parse(form.file).data); // Convertiamo la stringa in un oggetto che conterrà il nostro array di bytes che verrà poi convertito in Uint8Array, necessario all'oggetto Blob
			var blob = new Blob([buffer], { type: 'application/msword' });
			saveAs(blob, form.nome_documento);
		}
	});
</script>

<!-- report Excel con lo stato dei PDP di tutti gli studenti BES (generato da ./report/+server.js) -->
<!-- <div class="d-flex justify-content-between align-items-center mb-3"> -->
<!-- <small class="text-muted">Materie Mancanti: * = PDP mai salvato dal docente</small> -->
<!-- <div class="d-flex justify-content-end align-items-center mb-3"> -->
<!-- 	<a href="/pdp/genera_pdp/report" class="btn btn-primary" data-sveltekit-reload download> -->
<!-- 		<i class="ti ti-file-spreadsheet icon" /> -->
<!-- 		Scarica report Excel -->
<!-- 	</a> -->
<!-- </div> -->
<!-- il pulsante "Scarica report Excel" è ora nell'header della pagina (vedi $page_header_link) -->

<Table
	columns={[
		{ name: 'id', type: 'hidden', display: 'ID' },
		{ name: 'classe_col', type: 'string', display: 'Classe', size: 50, search: true },
		{ name: 'studente_col', type: 'string', display: 'Studente', size: 50, search: true },
		{ name: 'sintesi_vocale', type: 'boolean', display: 'Sintesi Vocale', search: true },
		{ name: 'tempo_esteso', type: 'boolean', display: 'Tempo Esteso', search: true },
		{ name: 'griglia_pdp_a_done', type: 'boolean', display: 'Sezione A', search: true },
		{
			name: 'griglia_valutazione_done',
			type: 'boolean',
			display: 'Griglia Osservativa',
			search: true
		},
		{ name: 'griglia_pdp_a1_done', type: 'boolean', display: 'Mi Presento', search: true },
		{ name: 'griglia_pdp_c1_done', type: 'boolean', display: 'Autovalutazione', search: true },
		{ name: 'griglia_pdp_c2_done', type: 'boolean', display: 'Patto Educativo', search: true },
		{ name: 'griglia_pdp_b_done', type: 'boolean', display: 'Griglia Abilità', search: true },
		{ name: 'materie_col', type: 'string', display: 'Materie Complete', size: 10 },
		//{ name: 'materie_mancanti', type: 'array', subtype: 'object', key: 'materia', display: 'Materie Mancanti', size: 10 },
		// { name: 'materie_mancanti', type: 'array', subtype: 'object', key: 'materia', display: 'Materie Mancanti', size: 10, color: 'orange' },
		{ name: 'materie_mancanti', type: 'array', subtype: 'object', key: 'materia', display: 'Materie Mancanti', size: 10, color: 'orange', wrap: 20 },
    { name: 'can_print', type: 'boolean', display: 'PDP Completo', search: true }
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
	print_filter={'can_print'}
/>
