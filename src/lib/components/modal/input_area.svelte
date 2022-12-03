<script>
    export let val;
    export let label;
    export let name;
    export let placeholder;
    export let errors; 
</script>


<div class="mb-3">
    <label class="form-label">{label}</label>
    <textarea
        class="form-control"
        class:is-invalid="{errors[name]}"
        {name}
        rows="3"
        {placeholder}
        bind:value={val}
    />
    {#if errors[name]}
        <span class="invalid-feedback">{errors[name]}</span>
    {/if}
</div>
