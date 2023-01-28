<script>
	import { onMount } from 'svelte';
	import { page_pre_title, page_title, page_action_title } from '../../../js/store';
	import { saveAs } from 'file-saver';

	let can_upload = false;
	let is_loading = false;
	let file_list = [];

	$page_pre_title = 'Tools';
	$page_title = 'Convertitore multi file';
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

	function files_selected(f) {
		can_upload = true;
		for (const file of f.target.files) file_list.push(file.name);
	}
</script>

<div class="card">
	<div class="card-body">
		<table>
			<tr>
				<td id="cell-left">
					<img src="/img/doc2pdf.png" alt="convert-to-print" />
				</td>
				<td id="cell-right">
					<h1>Benvenuto su Convert to Print</h1>
					<p>
						Questo servizio facilita la stampa di documenti multipli (es: verifiche, lezioni, ...)
					</p>
					<p>Puoi caricare più file in formato doc/docx (MS Word) e PDF</p>
					<p>Il sistema restuirà un unico documento PDF pronto per la stampa</p>
				</td>
			</tr>
		</table>

		<div class="file-uploader">
			<div class="row">
				<div class="col-12 text-center">
					<div class="file-mex">Carica file .docx o.pdf da convertire</div>
				</div>
			</div>

			<div class="row">
				<div class="col-4" />
				<div class="col-4 text-center">
					<form
						id="dropzone-custom"
						action="convert-to-print?/pdf"
						method="POST"
						enctype="multipart/form-data"
					>
						<label class="custom-file-upload {!can_upload ? '' : 'hide'}">
							<input
								name="file-to-convert"
								id="file-to-convert"
								type="file"
								multiple
								accept=".pdf, .doc, .docx"
								on:change={(f) => files_selected(f)}
							/>
							Seleziona i tuoi file
						</label>

						<div class={can_upload ? '' : 'hide'}>
							<button class="custom-file-upload" on:click={() => (is_loading = true)}
								>Converti i file</button
							>
						</div>

						<div class="row">
							<div class="col-12">
								{#if is_loading}
									<label class="form-label">Conversione Documenti</label>
									<div class="progress">
										<div class="progress-bar progress-bar-indeterminate bg-green" />
									</div>
								{/if}

								{#if can_upload == true && is_loading == false}
									<div class="select-mex">Hai selezionato i seguenti file:</div>
									{#each file_list as file, i}
										{#if i < 5}
											<p class="file-list">
												{file}
											</p>
										{/if}
									{/each}
								{/if}
							</div>
						</div>
					</form>
				</div>
				<div class="col-4" />
			</div>
		</div>
	</div>
</div>

<style>
	.hide {
		display: none;
	}

	table {
		width: 100%;
	}
	#cell-left {
		border: 0px solid black;
		width: 20%;
	}

	#cell-right {
		border: 0px solid black;
		width: 70%;
	}

	#cell-left > img {
		border: 0px solid black;
		width: 200px;
	}

	h1 {
		font-size: 3rem;
		margin-bottom: 2rem;
		margin-top: 0.5rem;
	}

	td > p {
		font-size: 1.5rem;
	}

	.file-uploader {
		border: 2px dotted black;
		border-radius: 10px;
		width: 70%;
		margin: auto;
		padding: 1rem;
		background-color: #f0f5f9;
		margin-top: 1rem;
		margin-bottom: 2rem;
		min-height: 20rem;
	}

	.file-mex {
		font-size: 1.8rem;
		margin-bottom: 2rem;
	}

	input[type='file'] {
		display: none;
	}
	.custom-file-upload {
		color: black;
		font-weight: bold;
		font-size: 1.2rem;
		width: 15rem;
		padding: 0.8rem;
		border-radius: 10px;
		border: 1px solid #bbb;
		text-align: center;
		background-color: #00c949;
		cursor: pointer;
		margin-bottom: 2rem;
	}

	.file-list {
		text-align: center;
		margin-bottom: 0.3rem;
	}

	.select-mex {
		font-size: 1.3rem;
		font-weight: bold;
		margin-bottom: 0.8rem;
	}
</style>
