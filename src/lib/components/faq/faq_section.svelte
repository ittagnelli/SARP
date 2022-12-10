<script>
    export let title;
    export let number;
</script>

<div>
    <h2 class="mb-3">{title}</h2>
    <div id="faq-{number}" class="accordion" role="tablist" aria-multiselectable="true">
        <slot />
    </div>
</div>