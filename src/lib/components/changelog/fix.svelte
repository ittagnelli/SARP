<script>
    export let issue;
    export let text;
</script>

<li>
    fix <a
        href="https://github.com/ittagnelli/SARP/issues/{issue}"
        target="_blank"
        rel="noopener">#{issue}</a
    >: {@html text}
</li>
