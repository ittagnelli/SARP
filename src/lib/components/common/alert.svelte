<script>
	export let title, text;
</script>

<div class="modal modal-blur fade" id="alert_modal" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="modal-dialog modal-sm modal-dialog-centered" role="document">
		<div class="modal-content">
			<div class="modal-status bg-danger" />
			<div class="modal-body text-center py-4">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="icon mb-2 text-danger icon-lg"
					width="24"
					height="24"
					viewBox="0 0 24 24"
					stroke-width="2"
					stroke="currentColor"
					fill="none"
					stroke-linecap="round"
					stroke-linejoin="round"
					><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 9v2m0 4v.01" /><path
						d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75"
					/></svg
				>
				<h3>{title}</h3>
				<div class="text-muted">
                    {text}
                </div>
			</div>
			<div class="modal-footer">
				<button type="button" class="btn w-100" data-bs-dismiss="modal" aria-label="Close"
					>OK</button
				>
			</div>
		</div>
	</div>
</div>
