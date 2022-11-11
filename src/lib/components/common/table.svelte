<script>
	// @ts-nocheck
	import { createEventDispatcher } from 'svelte';

	// dichiara le colonne della tabella
	// il nome di ogni colonna deve coincidere esattamente con il nome
	// del campo della tabella contenuta in rows
	export let columns;
	export let rows;
	export let page_size;
	export let modal_name;
	export let type;	// Cosa visualizza la tabella?

	const dispatch = createEventDispatcher();

	let num_pages = Math.ceil(rows.length / page_size); //numero di pagines
	let current_page = 1; //pagina da visualizzare nella tabella
	let col_names = columns.map((item) => item.name); //nomi delle colonne
	let page_start = 0; //inizio della pagine nell'array rows
	let page_end = page_size; //fine della pagina nell'array rows
	let rows_paged = []; //pagina attuale di rows
	let rows_filtered = []; // contiene le righe di rows con le chiavi ordinate come la tabella

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
		//al cambiamento dell'inizio e fine pagina aggiorno le righe della tabella
		rows_paged = [...rows_filtered.slice(page_start, page_end)];
	}

	function change_page(page) {
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
	}

	function prev_page() {
		if (current_page > 1) {
			current_page--;
			page_end = page_start;
			page_start -= page_size;
		}
	}

	function update_row(id) {
		console.log('UPDATING ID:', id);
		dispatch('update_start', { id: id });
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
								{#if col.name != 'id'}
									<th>
										<button class="table-sort" data-sort="sort-{col.name}">{col.display}</button>
									</th>
								{/if}
							{/each}
							<th>Azioni</th>
						</tr>
					</thead>
					<tbody class="table-tbody">
						{#each rows_paged as row}
							<tr>
								{#each Object.keys(row) as col, i}
									{#if col_names.includes(col) && col != 'id'}
										{#if columns[i].type == 'date'}
											<td class="sort-{col}" valign="middle">{row[col].toLocaleDateString()}</td>
										{:else if columns[i].type == 'object'}
											<td class="sort-{col}" valign="middle">
												{row[col][columns.filter((item) => item.name == col)[0].key]}
											</td>
										{:else}
											<td class="sort-{col}" valign="middle">{row[col]}</td>
										{/if}
									{/if}
								{/each}
								<td valign="middle">
									<a
										href="##"
										class=""
										data-bs-toggle="modal"
										data-bs-target="#{modal_name}"
										on:click={() => update_row(row.id)}
									>
										<icon class="ti ti-edit icon" />
									</a>
									<form id="form-delete" method="POST" action={`/${type}?/delete`}>
										<button class="icon-button" name="id" value={row.id}>
											<icon class="ti ti-trash icon" />
										</button>
									</form>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	</div>

	<!-- pager -->
	<div class="card-footer d-flex align-items-center">
		<p class="m-0 text-muted">Ci sono <span>{rows.length}</span> {type} attive</p>
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

<style>
	.icon-button {
		background: none;
		padding: 0px;
		border: none;
	}

	form {
		display: inline;
	}

	#form-delete {
		border: 0px solid red;
		position: relative;
		left: 1.5rem;
	}

	a {
		color: black;
	}
</style>