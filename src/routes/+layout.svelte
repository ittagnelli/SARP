<script>
	import { page_pre_title, page_title, page_action_title, page_action_modal } from '../js/store';
	import Footer from '$lib/components/layout/footer.svelte';
	import Navbar from '$lib/components/layout/nav_bar.svelte';
	import NavItem from '$lib/components/layout/nav_item.svelte';
	import NavMenu from '$lib/components/layout/nav_menu.svelte';
	import NavSubItem from '$lib/components/layout/nav_sub_item.svelte';
	import { fade } from 'svelte/transition';
    
	export let data;
    let version = data.version;
</script>

{#if data.session}
	<div class="page" in:fade={{ delay: 200, duration: 1500 }}>
		<Navbar>
			<NavItem resource="menu_home" text="Home" icon="home-2" link="/" />
			<NavItem resource="menu_utenti" text="Utenti" icon="users" link="/utenti" />
			<NavMenu resource="menu_pcto" text="PCTO" icon="building-factory-2">
				<NavSubItem resource="menu_aziende" text="Aziende" link="aziende" />
				<NavSubItem resource="menu_stage" text="Stage" link="stage" />
				<NavSubItem resource="menu_presenze" text="Presenze" link="presenze" />
				<NavSubItem resource="menu_valutazioni" text="Valutazioni" link="valutazioni" />
			</NavMenu>
			<NavItem resource="menu_tools" text="Tools" icon="tools" link="/tools" />
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
{:else}
	<slot />
{/if}
