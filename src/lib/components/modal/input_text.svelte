<script>
    export let val;
    export let label;
    export let name;
    export let placeholder;
    export let errors;
    export let readonly = false;
</script>

<div class="mb-3">
    <label class="form-label">{label}</label>
    <input
        type="text"
        class="form-control"
        class:is-invalid="{errors && errors[name]}"
        name="{name}"
        placeholder="{placeholder}"
        readonly="{readonly}"
        bind:value={val}
    />
    {#if errors && errors[name]}
        <span class="invalid-feedback">{errors[name]}</span>
    {/if}
</div>