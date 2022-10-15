<script>
	import { page_pre_title, page_title, page_action, page_action_modal } from '../js/store';
	import Footer from '../components/layout/footer.svelte';
	import Navbar from '../components/layout/nav_bar.svelte';
	import NavItem from '../components/layout/nav_item.svelte';
	import NavSubSubItem from '../components/layout/nav_sub_sub_item.svelte';
	import NavMenu from '../components/layout/nav_menu.svelte';
	import NavSubItem from '../components/layout/nav_sub_item.svelte';
	import NavSubMenu from '../components/layout/nav_sub_menu.svelte';
</script>

<div class="page">
	<Navbar>
		<NavItem text="Home" icon="home-2" link="/" />
		<NavItem text="PDP" icon="clipboard" link="convenzioni" />
		<NavMenu text="PCTO" icon="building-factory-2">
			<NavSubItem slot="subitem" text="Aziende" link="Xxxx">
				<NavSubMenu slot="submenu" text="Stage">
					<NavSubSubItem slot="subsubitem" text="Presenze" link="543e" />
				</NavSubMenu>
			</NavSubItem>
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
					<div class="col-12 col-md-auto ms-auto d-print-none">
						<div class="btn-list">
							<a
								href="/"
								class="btn btn-primary d-none d-sm-inline-block"
								data-bs-toggle="modal"
								data-bs-target="#{$page_action_modal}"
							>
                                <i class="ti ti-plus icon"></i>
							    {$page_action}
							</a>
						</div>
					</div>
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
		<Footer />
	</div>
</div>