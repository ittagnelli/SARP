<script>
	import { page_pre_title, page_title, page_action_modal, page_action_title } from '../js/store';
	import KpiNumber from '../lib/components/common/kpi_number.svelte';
    import KpiSpacer from '../lib/components/common/kpi_spacer.svelte';

	$page_pre_title = '';
	$page_title = '';
	$page_action_modal = null;
	$page_action_title = null;

	export let data;
    let kpi = data.kpi[0];
</script>

<svelte:head>
	<!-- <link href="https://fonts.googleapis.com/css2?family=Fredoka+One&display=swap" rel="stylesheet"> -->
</svelte:head>

<div class="main-wrapper">
    
<div class="row row-cards">
	<KpiNumber icon="user" icon_color="red" title="Utenti SARP" value={kpi.n_utenti} size=3/>
    <KpiNumber icon="school" icon_color="blue" title="Studenti PCTO" value={kpi.n_studenti_pcto_attivi} size=3/>
	<KpiNumber icon="building-factory-2" icon_color="green" title="Convenzioni PCTO" value={kpi.n_pcto_aziende_attive} size=3/>
    <KpiNumber icon="chef-hat" icon_color="green" title="PCTO Attivi" value={kpi.n_pcto_attivi} size=3/>
    <KpiSpacer size=2 />
    <KpiNumber icon="hourglass-empty" icon_color="yellow" title="Ore PCTO Attivi" value={kpi.n_ore_tot_pcto_attivi} size=4/>
    <KpiNumber icon="clock-2" icon_color="yellow" title="Ore PCTO Totali" value={kpi.n_ore_tot_pcto} size=4/>    
    <KpiSpacer size=2 />
</div>

</div>

<style>
	.main-wrapper {
        border: 0px solid red;
        min-height: 80vh;
    }
</style>
