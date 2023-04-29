<script>
    export let id;
    export let argomento;

   /**
	 * @param {number} index
	 */
	 function remove_sotto_argomento(index) {
		argomento.sotto_argomenti.splice(index, 1);
        argomento = argomento;
	}
</script>

                                    <!--Per estetica aggiungiamo 1 all'indice-->
<div class="form-label select_text mt-3">Argomento {id + 1}</div>
<input type="text" class="form-control" bind:value={argomento.titolo} placeholder="Titolo argomento"/>
{#each argomento.sotto_argomenti as sotto_argomento, i}
    <input type="text" class="form-control" bind:value={sotto_argomento} style="margin-left: 1em; margin-top: 1em" placeholder="Sotto argomento"/>
    {#if i > 0}
        <button class="btn btn-danger mt-2" on:click={() => remove_sotto_argomento(i)} type="button">Elimina sotto argomento</button>
    {/if}
{/each}
