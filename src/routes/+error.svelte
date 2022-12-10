<script>
	import { page } from '$app/stores';
	import { page_pre_title, page_title, page_action_title } from '../js/store';

	$page_pre_title = '';
	$page_title = '';
	$page_action_title = '';
</script>

<main>
	<div id="notfound">
		<div class="notfound">
			<div class="notfound-404" />
                <h1>{$page.status}</h1>
                <h2>Oops! Si è verificato un errore</h2>
                {#if $page.error.code && $page.error.message}
                    <p>
                        CODICE ERRORE: <b>{$page.error.code}</b><br>
                        MESSAGGIO: <b>{$page.error?.message}</b>
                        <br><br>Per cortesia riporta questo errore agli sviluppatori del sito
                    </p>
                {:else if $page.status != 500}
                    <p>
                        Mi dispiace ma la pagina richiesta non esiste, è stata rimossa o al momento non disponibile.
                    </p>
                {:else}
                    <p>
                        Si è verificato un errore imprevisto!!!
                        <br><br>Per cortesia riporta questo errore agli sviluppatori del sito
                    </p>
                {/if}
                <a href="/">Torna alla homepage</a>
		</div>
	</div>
</main>

<style>
	* {
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
	}

	#notfound {
		position: relative;
		height: 79vh;
	}

	#notfound .notfound {
		position: absolute;
		left: 50%;
		top: 50%;
		-webkit-transform: translate(-50%, -50%);
		-ms-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
	}

	.notfound {
        max-width: 800px;
		width: 100%;
		padding-left: 160px;
		line-height: 1.1;
	}

	.notfound .notfound-404 {
        position: absolute;
		left: 0;
		top: 0;
		display: inline-block;
		width: 140px;
		height: 140px;
		background-image: url('/img/emoji.png');
		background-size: cover;
	}

	.notfound .notfound-404:before {
        content: '';
		position: absolute;
		width: 100%;
		height: 100%;
		-webkit-transform: scale(2.4);
		-ms-transform: scale(2.4);
		transform: scale(2.4);
		border-radius: 50%;
		background-color:  #cee1f5;
		z-index: -1;
	}

	.notfound h1 {
		font-size: 65px;
		font-weight: 700;
		margin-top: 0px;
		margin-bottom: 20px;
		color: #151723;
		text-transform: uppercase;
	}

	.notfound h2 {
		font-size: 21px;
		font-weight: 400;
		margin: 0;
        margin-bottom: 20px;
		text-transform: uppercase;
		color: #151723;
	}

	.notfound p {
        font-size: 25px;
		/* color: #999fa5; */
        color: #7e8388;
		font-weight: 400;
	}

	.notfound a {
		display: inline-block;
		font-weight: 700;
		border-radius: 40px;
		text-decoration: none;
		color: #388dbc;
	}

	@media only screen and (max-width: 767px) {
		.notfound .notfound-404 {
			width: 110px;
			height: 110px;
		}
		.notfound {
			padding-left: 15px;
			padding-right: 15px;
			padding-top: 110px;
		}
	}
</style>
