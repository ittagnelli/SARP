<script>
	import { user_ruolo, has_grant } from '../../../js/helper';
	import { page } from '$app/stores';

	let ruolo = user_ruolo($page.data);

	export let text;
	export let icon;
	export let link;
	export let resource;
</script>

{#if resource && has_grant(ruolo, 'view', resource)}
	<li class="nav-item">
		<a class="nav-link" href={link}>
			<span class="nav-link-icon d-md-none d-lg-inline-block">
				<i class="ti ti-{icon} icon" />
			</span>
			<span class="nav-link-title">{text}</span>
		</a>
	</li>
{/if}
