<script>
    export let modal_action;	// Action
    export let company_id;
    export let dataConvenzione;
    export let dataProtocollo;
    export let istituto_select;
	export let new_title;	// Title for create
	export let update_title;// Title for update
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
						<h5 class="modal-title">{new_title}</h5>
					{:else}
						<h5 class="modal-title">{update_title}</h5>
					{/if}
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
				</div>
				<div class="modal-body">
					<slot></slot>
			</div>
		</div>
	</form>
</div>
