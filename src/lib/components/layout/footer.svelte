<script>
	import { invalidateAll } from '$app/navigation';
    import * as helper from '../../../js/helper';
    import { onMount } from 'svelte';
    export let version;

    onMount(async () => { // Controlliamo che l'inserimento sia andato a buon fine, usiamo on mount per richiamare le funzioni del DOM
        helper.init_tippy();
    });

	async function logout() {
		const res = await fetch('/support/logout', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: 'user logout'
		});

		if (res.ok) invalidateAll();
	}
</script>

<footer class="footer footer-transparent d-print-none">
	<div class="container-xl">
		<div class="row text-center align-items-center flex-row-reverse">
			<div class="col-lg-auto ms-lg-auto">
				<ul class="list-inline list-inline-dots mb-0">
					<li class="list-inline-item">
						<a href="/support/ticket" class="link-secondary" data-tippy-content="Informa gli sviluppatori per eventuali problemi o suggerimenti">Segnala un problema</a>
					</li>
                    <li class="list-inline-item">
						<a href="/support/changelog" class="link-secondary" data-tippy-content="Storico dei cambiamenti in SARP">Changelog</a>
					</li>
                    <li class="list-inline-item" on:click={() => logout()}>
						<a href="#" class="link-secondary" data-tippy-content="Chiudi la sessione di lavoro">Log Out</a>
					</li>
				</ul>
			</div>
			<div class="col-12 col-lg-auto mt-3 mt-lg-0">
				<ul class="list-inline list-inline-dots mb-0">
					<li class="list-inline-item">
						Copyright &copy; 2022-2023 Antonio Mancuso & Studenti. All rights reserved
					</li>
					<li class="list-inline-item">
						v{version}
					</li>
				</ul>
			</div>
		</div>
	</div>
</footer>
