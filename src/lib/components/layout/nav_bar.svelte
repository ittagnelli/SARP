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
                    class="logo"
					src="/img/logo_rettangolare_bianco_small.png"
					width="175"
					alt="SARP"
				/>
			</a>
		</h1>
		<!-- navigation bar -->
		<div class="collapse navbar-collapse" id="navbar-menu">
			<ul class="navbar-nav pt-lg-3">
				<slot />
			</ul>
		</div>
	</div>
</aside>

<style>
    .logo {
        margin-top: 1rem;
        margin-right: 0.7rem;
    }
</style>