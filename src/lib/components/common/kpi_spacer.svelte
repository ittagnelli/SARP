<svelte:head>
    <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap" rel="stylesheet">
</svelte:head>

<script>
    export let size;
</script>

<div class="col-{size}">
	<div class="card">
		<div class="card-stamp">
			<!-- <div class="card-stamp-icon bg-yellow">
				<i class="ti ti-clock-2" />
			</div> -->
		</div>
		<div class="card-body">
			<h2 class="title-card"></h2>
			<div class="number"></div>
		</div>
	</div>
</div>

<style>
	.title-card {
		border: 0px solid black;
		min-height: 80px;
		color: black;
		font-size: 1.3vw;
		line-height: 2.5rem;
		font-weight: bold;
		opacity: 0.5;
	}

	.number {
		border: 0px solid black;
		display: flex;
		justify-content: center;
		align-items: center;
		color: black;
		font-size: 4.5rem;
		min-height: 150px;
		opacity: 0.4;
		font-family: 'Fredoka One';
		letter-spacing: 0.5rem;
	}
</style>
