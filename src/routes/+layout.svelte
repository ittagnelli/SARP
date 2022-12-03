<script>
	import { page_pre_title, page_title, page_action_title, page_action_modal } from '../js/store';
	import Footer from '$lib/components/layout/footer.svelte';
	import Navbar from '$lib/components/layout/nav_bar.svelte';
	import NavItem from '$lib/components/layout/nav_item.svelte';
	import NavMenu from '$lib/components/layout/nav_menu.svelte';
	import NavSubItem from '$lib/components/layout/nav_sub_item.svelte';

    let version = "0.1.0"
</script>

<div class="page">
	<Navbar>
		<NavItem text="Home" icon="home-2" link="/" />
        <NavItem text="Utenti" icon="users" link="/utenti" />
		<NavMenu text="PCTO" icon="building-factory-2">
			<NavSubItem text="Aziende" link="aziende" />
			<NavSubItem text="Stage" link="stage" />
			<NavSubItem text="Presenze" link="presenze" />
			<NavSubItem text="Valutazioni" link="valutazioni" />
		</NavMenu>
		<NavItem text="Submenu2" icon="home-2" link="/" />
		<NavItem text="Submenu3" icon="home-2" link="/" />
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
