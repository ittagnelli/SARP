<script>
    export let val;
    export let label;
    export let name;
    export let errors; 
</script>

<div class="mb-3">
    <label class="form-label">{label}</label>
    <input
        type="time"
        name="{name}"
        class="form-control"
        class:is-invalid="{errors[name]}"
        bind:value={val}
    />
    {#if errors[name]}
        <span class="invalid-feedback">{errors[name]}</span>
    {/if}
</div>
