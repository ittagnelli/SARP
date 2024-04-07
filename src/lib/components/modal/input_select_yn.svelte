<script>
    export let label;
    export let name;
    export let val;

</script>


<label class="form-label">{label}</label>
<div class="form-selectgroup">
    <label class="form-selectgroup-item">
    <input
        type="radio"
        name="{name}"
        value="SI"
        class="form-selectgroup-input"
        bind:group={val}
    />
    <span class="form-selectgroup-label">SI</span>
    </label>
    <label class="form-selectgroup-item">
    <input
        type="radio"
        name="{name}"
        value="NO"
        class="form-selectgroup-input"
        bind:group={val}
    />
    <span class="form-selectgroup-label">NO</span>
    </label>
</div>