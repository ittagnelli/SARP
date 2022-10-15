<script>
    export let text;
    export let icon;
    export let link;
</script>

<li class="nav-item">
    <a class="nav-link" href="{link}">
        <span class="nav-link-icon d-md-none d-lg-inline-block">
            <i class="ti ti-{icon} icon"></i>
        </span>
        <span class="nav-link-title">{text}</span>
    </a>
</li>
