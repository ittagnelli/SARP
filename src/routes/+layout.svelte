<script>
	import { page_pre_title, page_title, page_action_title, page_action_modal } from '../js/store';
	import Footer from '$lib/components/layout/footer.svelte';
	import Navbar from '$lib/components/layout/nav_bar.svelte';
	import NavItem from '$lib/components/layout/nav_item.svelte';
	import NavMenu from '$lib/components/layout/nav_menu.svelte';
	import NavSubItem from '$lib/components/layout/nav_sub_item.svelte';
	import { fade } from 'svelte/transition';
    import { page } from '$app/stores';

	export let data;
    let version = data.version;
</script>

{#if data.session && !data.session.mobile}
	<div class="page" in:fade={{ delay: 200, duration: 1500 }}>
		<Navbar>
                <NavItem resource="menu_home" text="Home" icon="home-2" link="/" />
                <NavItem resource="menu_utenti" text="Utenti" icon="users" link="/utenti" />
			<NavMenu resource="menu_pcto" text="PCTO" icon="building-factory-2">
				<NavSubItem resource="menu_aziende" text="Aziende" link="/aziende" />
				<NavSubItem resource="menu_stage" text="Stage" link="/stage" />
				<NavSubItem resource="menu_presenze" text="Presenze" link="/presenze" />
				<NavSubItem resource="menu_valutazioni" text="Valutazioni" link="/valutazioni" />
				<NavSubItem resource="menu_verifica_stato" text="Verifica Stato" link="/verifica_stato" />
			</NavMenu>
			<NavMenu resource="menu_tools" text="Tools" icon="tools">
				<NavSubItem resource="menu_convert_to_print" text="Convert to Print" link="/tools/convert-to-print" />
			</NavMenu>
            <NavMenu resource="menu_sicurezza_lavoro" text="Sicurezza sul Lavoro" icon="shield-half">
				<NavSubItem resource="menu_sicurezza_corsi" text="Corsi Sicurezza" link="/sicurezza_sul_lavoro/corsi" />
			</NavMenu>
		</Navbar>

		<!-- Page Header -->
		<div class="page-wrapper">
			<div class="container-xl">
				<div class="page-header d-print-none">
					<div class="row g-2 align-items-center">
						<div class="col">
							<div class="page-pretitle">
								{$page_pre_title}
							</div>
							<h2 class="page-title">
								{$page_title}
							</h2>
						</div>
						{#if $page_action_title}
							<div class="col-12 col-md-auto ms-auto d-print-none">
								<div class="btn-list">
									<a
										href="/"
										class="btn btn-primary d-none d-sm-inline-block"
										data-bs-toggle="modal"
										data-bs-target="#{$page_action_modal}"
										id="btn_action_modal"
									>
										<i class="ti ti-plus icon" />
										{$page_action_title}
									</a>
								</div>
							</div>
						{/if}
					</div>
				</div>
			</div>

			<!-- page body -->
			<div class="page-body">
				<div class="container-xl">
                    <slot />
				</div>
			</div>

			<!-- Page Footer -->
			<Footer {version} />
		</div>
	</div>
	{:else if  data.session &&  data.session.mobile}
	{#if $page.route.id == "/presenze"}
	<Navbar />
		<div class="col p-2">
			<div class="page-pretitle">
				{$page_pre_title}
			</div>
			<h2 class="page-title">
				{$page_title}
			</h2>
			{#if $page_action_title}
				<br>
				<div class="col-12 col-md-auto ms-auto d-print-none">
					<div class="btn-list">
						<a
							href="/"
							class="btn btn-primary d-sm-inline-block"
							data-bs-toggle="modal"
							data-bs-target="#{$page_action_modal}"
							id="btn_action_modal"
						>
							<i class="ti ti-plus icon" />
							{$page_action_title}
						</a>
					</div>
				</div>
				<br>
			{/if}
		</div>
		<slot />
		<Footer {version} />
	{:else}
		<div class="col-12 col-lg-6 col-xl-4 d-flex flex-column justify-content-center">
		<div class="text-center mb-5 mt-5">
			<a href="." class="navbar-brand navbar-brand-autodark"
				><img class="logo" src="/img/logo_quadrato_nero_small.png" alt="" />
			</a>
		</div>
		</div>
		<h1 class="text-center text-muted">Il sistema è disponibile solo dal desktop!!</h1>
		<h3 class="text-center text-muted">Per cortesia, accedi comodamente dal tuo PC.</h3>
	{/if}
	{:else}
		<slot />
{/if}
