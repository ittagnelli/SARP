<script>
    import { page_pre_title, page_title, page_action_title } from '../../js/store';

    $page_pre_title = 'Strumenti utili per semplificare il lavoro degli insegnati e degli allievi';
	$page_title = 'Tools';
	$page_action_title = '';
</script>

<div>
    <a href="/tools/convert-to-print">
        <div class="tools">
                Convertitore in pdf pronto per la stampa fronte e retro<br>
                <sup>Dato i file delle verifiche degli allievi il programma restituisce un unico pdf adatto alla stampa fronte e retro</sup>
        </div>
    </a>
</div>

<style>
    .tools {
        font-size: 32px;
        text-align: left;
        background-color:azure;
        color: black;

        border-left: solid 5px black;
        border-right: solid 5px black;
        padding: 10px;
        border-radius: 10px;

        cursor: pointer;
    }

    sup {
        font-size: 15px;
    }

    a {
        text-decoration: none;
    }
</style>