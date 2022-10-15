<script>
	export let title, placeholder;
	// import { onMount } from 'svelte';

	// @ts-ignore
	// onMount(async () => await import('../../../static/js/tabler.min.js'));
</script>

<div class="mb-3">
	<label class="form-label">{title}</label>
	<input type="text" class="form-control" name="example-text-input" {placeholder} />
</div>

<!-- <style>
	@import './css/tabler.min.css';
</style> -->
