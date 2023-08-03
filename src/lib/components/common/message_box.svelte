<script>
	 import { fade } from 'svelte/transition';
     import { mb_type, mb_color, mb_title, mb_message, mb_show } from '$js/store';    
</script>

{#if $mb_show}
	<div class="alert alert-{$mb_type} alert-box" style="--color:{$mb_color}" role="alert" in:fade={{duration: 500}} out:fade={{duration: 250}}>
		<div class="d-flex">
			<div>
                {#if $mb_type == 'success'}
				    <i class="ti ti-circle-check icon" />
                {:else if $mb_type == 'warning'}
                    <i class="ti ti-alert-triangle icon" />
                {:else}
                    <i class="ti ti-ban icon" />
                {/if}
			</div>
			<div>
				<h1>{$mb_title}</h1>
				<div class="text-muted"><h3>{$mb_message}</h3></div>
			</div>
		</div>
	</div>
{/if}

<style>
	.alert-box {
		border: 2px solid var(--color);
	}

	.icon {
		font-size: 64px;
		margin-right: 2rem;
	}
</style>
