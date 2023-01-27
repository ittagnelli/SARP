<script>
	import { onMount } from 'svelte';
	import { page_pre_title, page_title, page_action_title } from '../../js/store';
    import { saveAs } from 'file-saver';
	
	$page_pre_title = 'Convertitore da file pdf o docx ad un unico file pdf pronto per la stampa';
	$page_title = 'Convertitore pdf per la stampa fronte e retro';
	$page_action_title = '';

	export let form; // Risposta del form dal server

	onMount(() => {
		// Controlliamo che l'inserimento sia andato a buon fine, usiamo on mount per richiamare le funzioni del DOM
		if (form != null) {
			if (form.file != null) {
				// è stato richiesto la generazione di un file
				const buffer = new Uint8Array(JSON.parse(form.file).data); // Convertiamo la stringa in un oggetto che conterrà il nostro array di bytes che verrà poi convertito in Uint8Array, necessario all'oggetto Blob
				var blob = new Blob([buffer], { type: 'application/msword' });
				saveAs(blob, form.nome_file);
			}
		}
	});
</script>

<div class="convert-to-print">
	Convertitore in pdf pronto per la stampa fronte e retro<br />
	<sup
		>Dato i file delle verifiche degli allievi il programma restituisce un unico pdf adatto alla
		stampa fronte e retro</sup
	>
</div>

<br /><br /><br />

<form
	class="dropzone"
	id="dropzone-custom"
	action="/convert-to-print?/pdf"
	method="POST"
	enctype="multipart/form-data"
	autocomplete="off"
	novalidate
>
	<div class="fallback">
		<input name="file-to-convert" id="file-to-convert" type="file" multiple />
	</div>
	<br />
	<div class="dz-message">
		<h3 class="dropzone-msg-title">Carica i file qui</h3>
		<br />
		<span class="dropzone-msg-desc">Carica file .pdf o .docx da convertire in un unico pdf</span>
	</div>

	<br />

	<div class="button">
		<button>Submit</button>
		<!-- <input type="submit" name="submit" id="submit" /> -->
		<!-- <input type="reset" name="erase" id="erase" /> -->
	</div>
</form>

<style>
	.convert-to-print {
		font-size: 2rem;
		text-align: left;
		background-color: azure;
		color: black;

		border-left: solid 5px black;
		border-right: solid 5px black;
		padding: 1%;
		border-radius: 10px;
	}

	sup {
		font-size: 0.8rem;
	}

	.dropzone {
		text-align: center;
		border: 1px dotted black;
		padding: 5%;
		background-color: azure;
	}
</style>