<script>
    export let modal_action;
    export let company_id;
    export let dataConvenzione;
    export let dataProtocollo;
    export let istituto_select;
</script>
<!-- Modal from Page action -->
<div
	class="modal modal-blur fade"
	id="modal-add-azienda"
	tabindex="-1"
	role="dialog"
	aria-hidden="true"
>
	<form method="POST" action="?/{modal_action}">
		{#if modal_action == 'update'}
			<input type="hidden" name="id" bind:value={company_id} />
		{/if}
		<div class="modal-dialog modal-lg" role="document">
			<div class="modal-content">
				<div class="modal-header">
					{#if modal_action == 'create'}
						<h5 class="modal-title">Nuova Valutazione</h5>
					{:else}
						<h5 class="modal-title">Aggiorna Valutazione</h5>
					{/if}
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
				</div>
				<div class="modal-body">
					<div class="row">
						<div class="col-lg-4">
							<div class="mb-3">
								<label class="form-label">Data Convenzione</label>
								<input
									type="date"
									name="data_convenzione"
									class="form-control"
									bind:value={dataConvenzione}
								/>
							</div>
						</div>
						<div class="col-lg-4">
							<div class="mb-3">
								<label class="form-label">Data Protocollo</label>
								<input
									type="date"
									name="data_protocollo"
									class="form-control"
									bind:value={dataProtocollo}
								/>
							</div>
						</div>
						<div class="col-lg-4">
							<div class="mb-3">
								<label class="form-label">Istituto</label>
								<div class="form-selectgroup">
									<label class="form-selectgroup-item">
										<input
											type="radio"
											name="istituto"
											value="ITT"
											class="form-selectgroup-input"
											bind:group={istituto_select}
										/>
										<span class="form-selectgroup-label">ITI</span>
									</label>
									<label class="form-selectgroup-item">
										<input
											type="radio"
											name="istituto"
											value="LICEO"
											class="form-selectgroup-input"
											bind:group={istituto_select}
										/>
										<span class="form-selectgroup-label">LICEO</span>
									</label>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<a href="#" class="btn btn-danger" data-bs-dismiss="modal">
						<b>Cancel</b>
					</a>
					<button class="btn btn-success ms-auto" data-bs-dismiss="modal">
						<i class="ti ti-plus icon" />
						{#if modal_action == 'create'}
							<b>Crea Azienda</b>
						{:else}
							<b>Aggiorna Azienda</b>
						{/if}
					</button>
				</div>
			</div>
		</div>
	</form>
</div>
