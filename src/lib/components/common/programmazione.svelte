<script>
	import Argomento from './argomento.svelte';
	export let argomenti;

	function new_argomento() {
		argomenti.push({
			titolo: '',
			sotto_argomenti: [""]
		});
		argomenti = argomenti;
	}

    /**
	 * @param {number} index
	 */
    function new_sotto_argomento(index) {
		argomenti[index].sotto_argomenti.push("");
        argomenti = argomenti;
	}

	/**
	 * @param {number} index
	 */
	function remove_argomento(index) {
		argomenti.splice(index, 1);
		argomenti = argomenti;
	}
</script>

<div>
	{#each argomenti as argomento, i}
		<Argomento id={i} bind:argomento />
        <button class="btn btn-primary mt-2" on:click={() => new_sotto_argomento(i)} type="button">Aggiungi nuovo sotto argomento</button>
		{#if i > 0}
			<button class="btn btn-danger mt-2" on:click={() => remove_argomento(i)} type="button">Rimuovi argomento</button>
		{/if}
	{/each}
	<button class="btn btn-primary mt-2" on:click={new_argomento} type="button">Aggiungi nuovo argomento</button>
</div>
