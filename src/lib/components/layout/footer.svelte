<script>
	import { invalidateAll } from '$app/navigation';
	export let version;

	async function logout() {
		const res = await fetch('/logout', {
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
					<!-- <li class="list-inline-item">
						<a href="./docs/index.html" class="link-secondary">Documentazione</a>
					</li> -->
					<li class="list-inline-item">
						<a href="/faq" class="link-secondary">FAQ</a>
					</li>
					<li class="list-inline-item">
						<a href="/ticket" class="link-secondary">Segnala un problema</a>
					</li>
                    <li class="list-inline-item">
						<a href="/changelog" class="link-secondary">Changelog</a>
					</li>
                    <li class="list-inline-item" on:click={() => logout()}>
						<a href="#" class="link-secondary">Log Out</a>
					</li>
				</ul>
			</div>
			<div class="col-12 col-lg-auto mt-3 mt-lg-0">
				<ul class="list-inline list-inline-dots mb-0">
					<li class="list-inline-item">
						Copyright &copy; 2022 Antonio Mancuso. All rights reserved
					</li>
					<li class="list-inline-item">
						v{version}
					</li>
				</ul>
			</div>
		</div>
	</div>
</footer>
