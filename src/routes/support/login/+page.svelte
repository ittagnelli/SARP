<script>
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { PUBLIC_GOOGLE_CLIENT_ID } from '$env/static/public';
	import { invalidateAll } from '$app/navigation';
    import { Logger } from '$js/logger';

    export let data;
    
    let logger = new Logger("client");
	let login_error = false; // signal error to user
	let google_button; // google login button
	let dev_user; // user name to login ONLY for development

	async function login_callback(response) {
		login_error = false;

		// call auth backend to complete login
		const res = await fetch('/support/login', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			body: 'token=' + response.credential
		});

		if (res.ok) {
			login_error = false;
			invalidateAll();
		} else {
			login_error = true;
		}
	}

	function init_google_login() {
		google.accounts.id.initialize({
			client_id: PUBLIC_GOOGLE_CLIENT_ID,
			callback: login_callback,
			nonce: new Date().getTime().toString(),
			ux_mode: 'popup'
		});
	}

	function render_google_button() {
		if (google_button) {
			google.accounts.id.renderButton(google_button, {
				type: 'standard',
				theme: 'filled_blue',
				size: 'large',
				width: '300',
				shape: 'square',
				locale: 'it_IT'
			});
		}
	}

	onMount(() => {
		invalidateAll();
		init_google_login();
		render_google_button();
	});

	function dev_login() {
        // se in sviluppo chiamiamo il server login con 
        // credenziali uguali al nome utente (nome.cognome)
        // e anzichè fare il decode del token passiamo
        // subito all'autenticazione nel DB e alla sessione
		if (dev) {
        	login_callback({ credential: dev_user });
		}
	}
</script>

<div class="login-page row g-0 flex-fill">
	<div
		class="col-12 col-lg-6 col-xl-4 d-flex flex-column justify-content-center"
	>
		<div class="text-center mb-5 mt-5">
			<a href="." class="navbar-brand navbar-brand-autodark"
				><img class="logo" src="/img/logo_quadrato_nero_small.png" alt="" /></a
			>
		</div>

            <h2 class="h3 text-center mb-3 text-muted">Fai il Log In con account istituzionale Agnelli</h2>
            <div class="mb-4 mt-4 gbutton">
                <div id="googleButton" bind:this={google_button} />
            </div>
            {#if login_error}
                <div class="login-error text-center mt-3">Impossibile effettuare il login!!</div>
            {/if}

		{#if dev}
			<div class="text-center mb-2" style="width:50%; position:relative; left:25%;">
				<label class="form-label">Dev User</label>
				<input
					style="position:relative; left:5%;"
					name="email"
					type="text"
					class="form-control mb-3"
					placeholder="nome.cognome"
					size="30"
					bind:value={dev_user}
				/>
				<button type="submit" class="btn btn-primary" on:click={dev_login}>Dev Login</button>
			</div>
		{/if}

	</div>
	<div class="col-12 col-lg-6 col-xl-8 d-none d-lg-block">
		<div class="bg-cover h-100 min-vh-100" style="background-image: url(/img/login_cover.jpg)" />
	</div>
</div>

<style>
	.login-page {
		/* background-color: red; */
	}

    .logo {
        width: 400px;
    }

	.login {
		background-color: white;
	}

	.gbutton {
		left: 6.5rem;
		margin: auto;
	}

	.login-error {
		color: red;
	}
</style>
