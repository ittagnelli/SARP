<script>
	export let title, cols, rows;
</script>

<div class="card">
	<div class="card-header">
		<h3 class="card-title">{title}</h3>
	</div>
	<div class="card-body border-bottom py-3">
		<div class="d-flex">
			<div class="text-muted">
				Show
				<div class="mx-2 d-inline-block">
					<input
						type="text"
						class="form-control form-control-sm"
						value="8"
						size="3"
						aria-label="Invoices count"
					/>
				</div>
				entries
			</div>
		</div>
	</div>
	<div class="table-responsive">
		<table class="table card-table table-vcenter text-nowrap datatable">
			<thead>
				<tr>
					{#each cols as th}
						<th>{th}</th>
					{/each}
					<th />
				</tr>
			</thead>
			<tbody>
				{#each rows as td_raw}
					<tr>
						{#each td_raw as td}
							<td>
								<span>
									{@html td}
								</span>
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
</div>

<style>
	@import './css/tabler.min.css';
</style>
