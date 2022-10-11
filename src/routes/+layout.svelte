<script>
	import { page_pre_title, page_title, page_action } from '../js/store';
	import LeftBar from '../components/Stabler/LeftBar.svelte';
	import Modal from '../components/Stabler/Modal.svelte';

	let submenus = [
		{
			submenus: [
				{
					submenus: [],
					title: 'Convenzioni',
					icon: '',
					href: '/convenzioni'
				}
			],
			title: 'Submenu 1',
			icon: '<svg xmlns="http://www.w3.org/2000/svg" class="icon" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><polyline points="5 12 3 12 12 3 21 12 19 12" /><path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" /><path d="M9 21v-6a2 2 0 0 1 2 -2h2a2 2 0 0 1 2 2v6" /></svg>',
			href: '/index'
		}
	];
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
	<title>SARP</title>
</svelte:head>

<LeftBar logo_alt="This is the logo" logo="/img/logo_agnelli.png" logo_height="55" logo_width="138" {submenus} />

<!-- Page Body-->
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
					<Modal btn_name={$page_action} modal_name={$page_action}>
						<p>Qua c'è il body del modale</p>
					</Modal>
				</div>
				<!-- Need this to contain page and align it to left -->
				<div>
					<slot/>
				</div>
			</div>
		</div>
	</div>
</div>
