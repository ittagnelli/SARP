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
					src="/img/logo_sarp.png"
					width="100"
					alt="SARP"
					style="position: relative; top: 0.5rem; left: -0.3rem;"
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
