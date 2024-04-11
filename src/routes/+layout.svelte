<script>
	import { page_pre_title, page_title, page_action_title, page_action_modal } from '$js/store';
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
            <!-- <NavMenu resource="menu_doc" text="Documentazione" icon="vocabulary">
				<NavSubItem resource="menu_doc_utenti" text="Utenti" link="/documentazione/utenti" />
                <NavSubItem resource="menu_doc_classi" text="Classi" link="/documentazione/classi" />
                <NavSubItem resource="menu_doc_pcto" text="PCTO" link="/documentazione/pcto" />
                <NavSubItem resource="menu_doc_pdp" text="PDP" link="/documentazione/pdp" />
                <NavSubItem resource="menu_doc_programmazione" text="Programmazione Annuale" link="/documentazione/programmazione_annuale" />
                <NavSubItem resource="menu_doc_sicurezza" text="Sicurezza sul Lavoro" link="/documentazione/sicurezza_lavoro" />
                <NavSubItem resource="menu_doc_tools" text="Tools" link="/documentazione/tools" />
			</NavMenu> -->
            <NavItem resource="menu_utenti" text="Utenti" icon="users" link="/support/utenti" />
            <NavItem resource="menu_classi" text="Classi" icon="school" link="/support/classi" />
            <NavMenu resource="menu_pcto" text="PCTO" icon="building-factory-2">
                <NavSubItem resource="menu_aziende" text="Aziende" link="/pcto/aziende" />
                <NavSubItem resource="menu_stage" text="Stage" link="/pcto/stage" />
                <NavSubItem resource="menu_presenze" text="Presenze" link="/pcto/presenze" />
                <NavSubItem resource="menu_valutazione_studenti" text="Valutazione Studenti" link="/pcto/valutazione_studenti" />
                <NavSubItem resource="menu_verifica_stato" text="Verifica Stato" link="/pcto/verifica_stato" />
            </NavMenu>
            <NavMenu resource="menu_pdp" text="PDP" icon="certificate">
                <NavSubItem resource="menu_mipresento" text="Mi Presento" link="/pdp/mipresento" />
                <NavSubItem resource="menu_autovalutazione" text="Autovalutazione" link="/pdp/autovalutazione" />
                <NavSubItem resource="menu_patto_educativo" text="Patto Educativo" link="/pdp/patto_educativo" />
                <NavSubItem resource="menu_pdp_template" text="Template Docente" link="/pdp/template" />
                <NavSubItem resource="menu_griglia_osservativa" text="Griglia Osservativa" link="/pdp/griglia_osservativa" />
                <NavSubItem resource="menu_griglia_diagnosi" text="Griglia Diagnosi" link="/pdp/griglia_diagnosi" />
                <NavSubItem resource="menu_pdp_docente" text="PDP Docente" link="/pdp/docente" />
                <NavSubItem resource="menu_genera_pdp" text="PDP Alunni" link="/pdp/genera_pdp" />
            </NavMenu>
            <NavMenu resource="menu_programmazione" text="Programma Annuale" icon="list">
				<NavSubItem resource="menu_programmazione_template" text="Template Docente" link="/programmazione/template" />
                <NavSubItem resource="menu_programmazione_docente" text="Programmazione Docente" link="/programmazione/docente" />
                <NavSubItem resource="menu_programmazione_classe" text="Programmazione Classe" link="/programmazione/classe" />
			</NavMenu>
            <NavMenu resource="menu_sicurezza_lavoro" text="Sicurezza sul Lavoro" icon="shield-half">
				<NavSubItem resource="menu_sicurezza_corsi" text="Corsi Sicurezza" link="/sicurezza_sul_lavoro/corsi" />
                <NavSubItem resource="menu_sicurezza_test" text="Test Sicurezza" link="/sicurezza_sul_lavoro/test" />
			</NavMenu>
            <NavMenu resource="menu_tools" text="Tools" icon="tools">
				<NavSubItem resource="menu_convert_to_print" text="Convert to Print" link="/tools/convert-to-print" />
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
	{#if $page.route.id == "/pcto/presenze"}
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
