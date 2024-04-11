<script>
	import { page } from '$app/stores';
    import { page_pre_title, page_title, page_action_title } from '$js/store';
	export let data;
    
    $: {
        $page_pre_title = 'Documentazione';
    	$page_title = $page.params.page.toUpperCase().replace('_', ' ');
	    $page_action_title = '';
    }	
</script>

<div class="page-wrapper">
	<div class="page-body">
		<div class="container-xl">
			<div class="card card-lg">
				<div class="card-body">
					<div class="space-y-4">
                        {@html data.html[$page.params.page]}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
