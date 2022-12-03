<script>
    export let val;
    export let label;
    export let name;
    export let errors; 
    export let k;
    export let v;
    export let list;
</script>

<div class="mb-3">
    <div class="form-label select_text">{label}</div>
    <select bind:value={val} name="{name}" class="form-select" class:is-invalid="{errors[name]}">
        {#each list as item, i}
            <option value={item[k]}>{item[v]}</option>
        {/each}
    </select>
    {#if errors[name]}
        <span class="invalid-feedback">{errors[name]}</span>
    {/if}
</div>
