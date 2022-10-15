<script>
    export let text;
    export let link;
</script>

<div class="dropdown-menu">
	<div class="dropdown-menu-columns">
		<div class="dropdown-menu-column">
			<a class="dropdown-item" href="{link}">{text}</a>
            <slot name="submenu" />
		</div>
	</div>
</div>
