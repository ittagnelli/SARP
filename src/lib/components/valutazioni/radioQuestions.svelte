<script>
    import { createEventDispatcher } from 'svelte';
    export let answers;
    export let struct;

	const dispatch = createEventDispatcher();

    function handle_select(answer){
        struct[answers.id] = answer;
        dispatch('radio_changed', {
			text: struct
		});
    }
</script>

<div>
    <div class="form-selectgroup form-selectgroup-boxes d-flex flex-column container">
        {#each answers.question_a as answer }
        <label class="form-selectgroup-item flex-fill">
            <input type="radio" id={answer} name="form-payment" on:click={() => handle_select(answer)} class="form-selectgroup-input">
            <div class="form-selectgroup-label d-flex align-items-center p-3">
                <div class="me-3">
                    <span class="form-selectgroup-check"></span>
                </div>
            
                <span class="payment payment-provider-visa payment-xs me-2"></span>
                {answer}
            </div>
        </label>
        {/each}
    </div>
   
</div>

<style>
    .container{
        margin-top: 1em;
    }
</style>