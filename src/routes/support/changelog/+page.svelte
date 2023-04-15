<script>
	import { page_pre_title, page_title, page_action_title } from '$js/store';
	import { Logger } from '$js/logger';
    export let data;

	let logger = new Logger('client');

	//configura la pagina pre-titolo, titolo e nome del modale
	$page_pre_title = 'Documentazione';
	$page_title = 'Changelog';
	$page_action_title = '';
</script>

<div class="page-wrapper">
	<div class="page-body">
		<div class="container-xl">
			<div class="card card-lg">
				<div class="card-body">
					<div class="markdown">
                        {@html data.changelog}
					</div>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
    .markdown {
        font-size: 1.0rem;
    }
</style>