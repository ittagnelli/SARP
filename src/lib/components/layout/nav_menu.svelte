<script>
    import { user_ruolo, has_grant } from '../../../js/helper';
	import { page } from '$app/stores';

	let ruolo = user_ruolo($page.data);

	export let text;
	export let icon;
    export let resource;
</script>

{#if resource && has_grant(ruolo, 'view', resource)}
<li class="nav-item dropdown">
	<a
		class="nav-link dropdown-toggle"
		href="#navbar-base"
		data-bs-toggle="dropdown"
		data-bs-auto-close="false"
		role="button"
		aria-expanded="false"
	>
		<span class="nav-link-icon d-md-none d-lg-inline-block">
			<i class="ti ti-{icon} icon" />
		</span>
		<span class="nav-link-title">{text}</span>
	</a>
	<div class="dropdown-menu">
		<div class="dropdown-menu-columns">
			<div class="dropdown-menu-column">
				<slot />
			</div>
		</div>
	</div>
</li>
{/if}