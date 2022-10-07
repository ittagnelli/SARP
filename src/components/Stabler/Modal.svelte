<script lang="ts">
	export let btnName: string, modalName: string;
	// import { onMount } from 'svelte';

	// // @ts-ignore
	// onMount(async () => await import('./js/tabler.min.js'));
</script>

<a href="0#" class="btn" data-bs-toggle="modal" data-bs-target="#modal-report">
	{btnName}
</a>
<div class="modal modal-blur fade" id="modal-report" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="modal-dialog modal-lg modal-dialog-centered" role="document">
		<div class="modal-content">
			<div class="modal-header">
				<h5 class="modal-title">{modalName}</h5>
				<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" />
			</div>
			<div class="modal-body">
				<slot />
				<div class="modal-footer">
					<a href="#" class="btn btn-link link-secondary" data-bs-dismiss="modal"> Cancel </a>
					<a href="#" class="btn btn-primary ms-auto" data-bs-dismiss="modal">
						<!-- Download SVG icon from http://tabler-icons.io/i/plus -->
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="icon"
							width="24"
							height="24"
							viewBox="0 0 24 24"
							stroke-width="2"
							stroke="currentColor"
							fill="none"
							stroke-linecap="round"
							stroke-linejoin="round"
							><path stroke="none" d="M0 0h24v24H0z" fill="none" /><line
								x1="12"
								y1="5"
								x2="12"
								y2="19"
							/><line x1="5" y1="12" x2="19" y2="12" /></svg
						>
						Create new report
					</a>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	@import './css/tabler.min.css';
</style>
