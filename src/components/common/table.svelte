<script>
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { identity, text } from 'svelte/internal';

	// dichiara le colonne della tabella
	// il nome di ogni colonna deve coincidere esattamente con il nome
	// del campo della tabella contenuta in rows
	export let columns;
	export let rows;
	export let page_size;

	let num_pages = Math.ceil(rows.length / page_size); //numero di pagines
	let current_page = 1; //pagina da visualizzare nella tabella
	let col_names = columns.map((item) => item.name); //nomi delle colonne
	let page_start = 0; //inizio della pagine nell'array rows
	let page_end = page_size; //fine della pagina nell'array rows
	let rows_paged = []; //pagina attuale di rows
	let rows_filtered = []; // contiene le righe di rows con le chiavi ordinate come la tabella

	onMount(async () => {
		//configura la tabella per l'ordinamento delle colonne dinamico
		// questo collide con la paginazione quindi per il momento è disabilitato
		// const list = new List('table-default', {
		// 	sortClass: 'table-sort',
		// 	listClass: 'table-tbody',
		// 	valueNames: (function () {
		// 		let tmpa = [];
		// 		columns.forEach((item) => tmpa.push(`sort-${item.name}`));
		// 		return tmpa;
		// 	})()
		// });
	});

	// filtra da rows le chiavi non presenti nelle colonne della tabella
	//in questo modo viene rispettato l'ordine di visualizzazione
	//come definito in columns
	rows.forEach((row) => {
		let tmp_row = {};
		columns.forEach((col) => {
			tmp_row[col['name']] = row[col['name']];
		});
		rows_filtered.push(tmp_row);
	});

	$: {
		console.log(`PAGE: ${current_page}/${num_pages} -- ${page_start}->${page_end}`);
		//al cambiamento dell'inizio e fine pagina aggiorno le righe della tabella
		rows_paged = [...rows_filtered.slice(page_start, page_end)];
		console.log(rows_paged);
	}

	function change_page(page) {
		console.log('CHANGIN PAGE TO:', page);
		current_page = page;
		page_start = (current_page - 1) * page_size;
		page_end = page_start + page_size;
	}

	function next_page() {
		if (current_page != num_pages) {
			current_page++;
			page_start = page_end;
			page_end += page_size;
		}
		console.log('next', current_page);
	}

	function prev_page() {
		if (current_page > 1) {
			current_page--;
			page_end = page_start;
			page_start -= page_size;
		}
		console.log('prev', current_page);
	}
</script>

<div class="card">
	<div class="card-body">
		<div id="table-default">
			<div class="table-responsive py-2">
				<table class="table">
					<thead>
						<tr>
							{#each columns as col}
								<th
									><button class="table-sort" data-sort="sort-{col.name}">{col.display}</button></th
								>
							{/each}
						</tr>
					</thead>
					<tbody class="table-tbody">
						{#each rows_paged as row}
							<tr>
								{#each Object.keys(row) as col, i}
									{#if col_names.includes(col)}
										{#if columns[i].type == 'date'}
											<td class="sort-{col}" valign="middle">{row[col].toLocaleDateString()}</td>
										{:else}
											<td class="sort-{col}" valign="middle">{row[col]}</td>
										{/if}
									{/if}
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>

	<!-- pager -->
	<div class="card-footer d-flex align-items-center">
		<p class="m-0 text-muted">Ci sono <span>{rows.length}</span> convenzioni attive</p>
		{#if rows.length > page_size}
			<ul class="pagination m-0 ms-auto">
				<li class="page-item" class:disabled={current_page == 1}>
					<a class="page-link" href="##" on:click={prev_page}>
						<i class="ti ti-chevron-left icon" />
						prev
					</a>
				</li>
				{#each Array(num_pages) as _, i}
					<li class="page-item" class:active={i == current_page - 1}>
						<a class="page-link" href="##" on:click={() => change_page(i + 1)}>{i + 1}</a>
					</li>
				{/each}
				<li class="page-item" class:disabled={current_page == num_pages}>
					<a class="page-link" href="##" on:click={next_page}>
						next
						<i class="ti ti-chevron-right icon" />
					</a>
				</li>
			</ul>
		{/if}
	</div>
</div>
