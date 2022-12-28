<script>
    export let msg; // Errore dal server
</script>

<div class="row error-mex">
    <div class="col-12">                                  
        {msg}                         
    </div>    
</div>

<style>
    .error-mex {
        border: 1px solid #d63939;
        border-radius: 4px;
        margin-bottom: 1rem;
        text-align: center;
        padding: 4px;
    }
</style>