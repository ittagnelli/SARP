<script>
    export let text;
</script>

<div class="dropend">
    <a
        class="dropdown-item dropdown-toggle"
        href="#sidebar-cards"
        data-bs-toggle="dropdown"
        data-bs-auto-close="false"
        role="button"
        aria-expanded="false"
    >
        {text}
    </a>
    <slot name="subsubitem" />
</div>