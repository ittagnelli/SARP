<script>
    import Dropzone from "svelte-file-dropzone";
    import { page_pre_title, page_title, page_action_title } from '../../../js/store';

    $page_pre_title = 'Convertitore in un unico pdf per la stampa fronte e retro';
	$page_title = 'Convert-to-print';
	$page_action_title = '';
  
    let files = {
      accepted: [],
      rejected: []
    };
  
    function handleFilesSelect(e) {
      const { acceptedFiles, fileRejections } = e.detail;
      files.accepted = [...files.accepted, ...acceptedFiles];
      files.rejected = [...files.rejected, ...fileRejections];
    }
  </script>
  
  <Dropzone on:drop={handleFilesSelect} />
  <ol>
    {#each files.accepted as item}
      <li>{item.name}</li>
    {/each}
  </ol>