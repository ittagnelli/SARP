<script>
	export let logo,
		logoAlt,
		logoHeight,
		logoWidth,
		submenus;

	// import { onMount } from 'svelte';

	// // @ts-ignore
	// onMount(async () => await import('./js/tabler.min.js'));
</script>

<aside class="navbar navbar-vertical navbar-expand-lg navbar-dark">
	<div class="container-fluid">
		<!-- mobile menu button   -->
		<button
			class="navbar-toggler"
			type="button"
			data-bs-toggle="collapse"
			data-bs-target="#navbar-menu"
		>
			<span class="navbar-toggler-icon" />
		</button>
		<!-- logo -->
		<h1 class="navbar-brand navbar-brand-autodark">
			<a href=".">
				<img
					src={logo}
					width={logoWidth}
					height={logoHeight}
					alt={logoAlt}
					style="position: relative; left: -1.5rem;"
				/>
			</a>
		</h1>
		<!-- navigation bar -->
		<div class="collapse navbar-collapse" id="navbar-menu">
			<ul class="navbar-nav pt-lg-3">
				{#each submenus as submenu}
					{#if submenu.submenus.length < 0}
						<li class="nav-item dropdown">
							<a class="nav-link" href={submenu.href}>
								<span class="nav-link-icon d-md-none d-lg-inline-block">
									<slot />
								</span>
								<span class="nav-link-title">
									{submenu.title}
								</span>
							</a>
						</li>
					{:else}
						<li class="nav-item dropdown">
							<a
								class="nav-link dropdown-toggle"
								href="#navbar-base"
								data-bs-toggle="dropdown"
								data-bs-auto-close="false"
								role="button"
								aria-expanded="false"
							>
								<span class="nav-link-icon d-md-none d-lg-inline-block">
									<slot />
								</span>
								<span class="nav-link-title">
									{submenu.title}
								</span>
							</a>
							<div class="dropdown-menu">
								<div class="dropdown-menu-columns">
									<div class="dropdown-menu-column">
										{#each submenu.submenus as su_submenu}
											<a class="dropdown-item" href={su_submenu.href}>
												{su_submenu.title}
											</a>
										{/each}
									</div>
								</div>
							</div>
						</li>
					{/if}
				{/each}
			</ul>
		</div>
	</div>
</aside>

<style>
	@import './css/tabler.min.css';
</style>
