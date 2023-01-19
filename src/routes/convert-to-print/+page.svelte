<script>
    import { page_pre_title, page_title, page_action_title } from '../../js/store';

    $page_pre_title = 'Convertitore da file pdf o docx ad un unico file pdf pronto per la stampa';
	$page_title = 'Convertitore pdf per la stampa fronte e retro';
	$page_action_title = '';

    /* document.addEventListener("DOMContentLoaded", function() {
      new Dropzone("#dropzone-custom")
    }) */
</script>


<div class="convert-to-print">
    Convertitore in pdf pronto per la stampa fronte e retro<br>
    <sup>Dato i file delle verifiche degli allievi il programma restituisce un unico pdf adatto alla stampa fronte e retro</sup>
</div>


<br><br><br>

<form class="dropzone" id="dropzone-custom" action="../" autocomplete="off" novalidate>
    <div class="fallback">
      <input name="file" type="file" multiple />
    </div>
    <br>
    <div class="dz-message">
      <h3 class="dropzone-msg-title">Carica i file qui</h3>
      <br>
      <span class="dropzone-msg-desc">Carica file .pdf o .docx da convertire in un unico pdf</span>
    </div>
</form>

<style>
    .convert-to-print {
        font-size: 2rem;
        text-align: left;
        background-color:azure;
        color: black;

        border-left: solid 5px black;
        border-right: solid 5px black;
        padding: 1%;
        border-radius: 10px;
    }

    sup {
        font-size: 0.8rem;
    }

    .dropzone {
        text-align: center;
        border: 1px dotted black;
        padding: 5%;
        background-color: azure;
    }
</style>