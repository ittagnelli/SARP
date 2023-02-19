<script>
	import { page_pre_title, page_title, page_action_modal, page_action_title } from '../js/store';
	import KpiNumber from '../lib/components/common/kpi_number.svelte';

	$page_pre_title = '';
	$page_title = '';
	$page_action_modal = null;
	$page_action_title = null;

	export let data;
</script>

<svelte:head>
	<!-- <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap" rel="stylesheet"> -->
</svelte:head>

<div class="row row-cards">
	<KpiNumber icon="bell" icon_color="blue" title="Utenti PCTO" value=812 size="sm"/>
	<KpiNumber icon="building-factory-2" icon_color="green" title="Convenzioni PCTO" value=43 size="lg"/>
    <!-- <div class="col-lg-2">
        <div class="card">
          <div class="card-stamp">
            <div class="card-stamp-icon bg-yellow">
                <i class="ti ti-bell"></i>
            </div>
          </div>
          <div class="card-body">
            <h2 class="title-card">Utenti PCTO</h2>
            <div class="number">814</div>
          </div>
        </div>
      </div> -->

	<!-- <div class="col-lg-3">
        <div class="card">
          <div class="card-stamp">
            <div class="card-stamp-icon bg-yellow">
                <i class="ti ti-bell"></i>
            </div>
          </div>
          <div class="card-body">
            <h2 class="title-card">Convenzioni PCTO</h2>
            <div class="number">23</div>
          </div>
        </div>
      </div> -->

	<!-- <div class="col-lg-2">
        <div class="card">
          <div class="card-stamp">
            <div class="card-stamp-icon bg-yellow">
                <i class="ti ti-bell"></i>
            </div>
          </div>
          <div class="card-body">
            <h2 class="title-card">PCTO Attivi</h2>
            <div class="number">12</div>
          </div>
        </div>
      </div> -->
</div>

<!-- <div>
    <img class="logo" src="img/logo_quadrato_nero_small.png" alt="" />
</div> -->
<style>
	/* .title-card {
        border: 0px solid black;
        max-width: 8vw;
        min-height: 80px;
        color: black;
        font-size: 1.3vw;
        line-height: 2.5rem;
        font-weight: bold;
        opacity: .4;
    }

    .number {
        border: 0px solid black;
        display: flex;
        justify-content: center;
        align-items: center;
        color: black;
        font-size: 4.5rem;
        min-height: 150px;
        opacity: 0.5;
        font-family: 'Fredoka One';
        letter-spacing: 0.5rem;
    } */

	/* h1 {
		font-size: 3rem;
	}
	h2,
	li {
		font-size: 1.5rem;
	}

	div {
		text-align: center;
	}

    .logo {
        width: 300px;
    } */
</style>
