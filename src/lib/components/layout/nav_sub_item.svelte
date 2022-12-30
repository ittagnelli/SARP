<script>
	import { user_ruolo, has_grant } from '../../../js/helper';
	import { page } from '$app/stores';

	let ruolo = user_ruolo($page.data);

	export let text;
	export let link;
	export let resource;
</script>

{#if resource && has_grant(ruolo, 'view', resource)}
	<a class="dropdown-item" href={link}>{text}</a>
{/if}
