<script>
    export let version;
    export let date;
    export let comment;
</script>

<div class="mb-4">
	<h2 class="mb-2">
		<span>{version}</span> –
		<small>{date}</small>
        {#if comment}
		    – <small>{comment}</small>
        {/if}
	</h2>
	<ul>
		<slot></slot>
	</ul>
</div>
