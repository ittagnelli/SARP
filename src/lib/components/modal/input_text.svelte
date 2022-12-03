<script>
    export let val;
    export let label;
    export let name;
    export let placeholder;
    export let errors; 
</script>

<div class="mb-3">
    <label class="form-label">{label}</label>
    <input
        type="text"
        class="form-control"
        class:is-invalid="{errors[name]}"
        name="{name}"
        placeholder="{placeholder}"
        bind:value={val}
    />
    {#if errors[name]}
        <span class="invalid-feedback">{errors[name]}</span>
    {/if}
</div>