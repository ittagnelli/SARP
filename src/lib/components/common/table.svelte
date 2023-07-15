<script>
// @ts-nocheck
import { createEventDispatcher } from 'svelte';
import { ellipses, user_id, is_admin,  has_grant, user_ruolo, get_modal } from '../../../js/helper';
import { page } from '$app/stores';

// dichiara le colonne della tabella
// il nome di ogni colonna deve coincidere esattamente con il nome
// del campo della tabella contenuta in rows
export let columns;
export let rows;
export let page_size;
let tmp_page_size = page_size; //memorizzo page_size durante la ricerca
export let modal_name;
export let endpoint; // Cosa visualizza la tabella?
export let footer;
export let print;
export let actions;
export let custom_actions = [];
export let resource;
export let trash = true;
export let update = true;
export let print_filter;    // Proprietà dell'oggetto che, se impostata su true farà vedere il tasto print

const dispatch = createEventDispatcher();
const MAX_PAGES = 20; //massimo numero di pagine visualizzabili nella barra

let num_pages = Math.ceil(rows.length / page_size); //numero di pagines
let current_page = 1; //pagina da visualizzare nella tabella
let col_names = columns.map((item) => item.name); //nomi delle colonne
let page_start = 0; //inizio della pagine nell'array rows
let page_end = page_size; //fine della pagina nell'array rows
let rows_paged = []; //pagina attuale di rows
let bigpage; // numero di pagina contenente MAX_PAGES pagine
let rows_db = []; // contiene le righe di rows con le chiavi ordinate come la tabella
let rows_filtered = []; //contiene le righe filtrate dall'utente
let footer_num = 0, footer_den = 0;
let show_pagination = true;
let current_item_delete = 0; //elemento corrente da eliminare per una data risorsa

// filtra da rows le chiavi non presenti nelle colonne della tabella
//in questo modo viene rispettato l'ordine di visualizzazione
//come definito in columns
rows.forEach((row) => {
    let tmp_row = {};
    columns.forEach((col) => {
        tmp_row[col['name']] = row[col['name']];
    });
    rows_db.push(tmp_row);
    rows_filtered.push(tmp_row);
});

$: {
    //al cambiamento dell'inizio e fine pagina aggiorno le righe della tabella
    rows_paged = [...rows_filtered.slice(page_start, page_end)];

    //determina gli elementi del footer
    let n_row = rows.length;
    footer_num = footer_den = n_row;
    if(n_row > page_size) footer_num = rows_paged.length;
}

function change_page(page) {
    current_page = page;
    page_start = (current_page - 1) * page_size;
    page_end = page_start + page_size;
}

function next_page() {
    if (current_page != num_pages) {
        current_page++;
        page_start = page_end;
        page_end += page_size;
    }
}

function prev_page() {
    if (current_page > 1) {
        current_page--;
        page_end = page_start;
        page_start -= page_size;
    }
}

function update_row(id) {
    dispatch('update_start', {
        id: id
    });
}

function custom_action_handler(action, id) {
    dispatch('custom_action', {
        action: action,
        row_id: id
    });
}

function start_delete(id) {
    current_item_delete = id;
    get_modal('delete_modal').show();
}

function table_filter(col, type, key) {
    if(type != 'boolean') {
        let val = document.getElementById(`filter_${col}`).value;
        if(val.length == 0)
            rows_filtered = rows_db;
        else {
            if(type == 'string') 
                rows_filtered = rows_db.filter(item => item[col].toLowerCase().startsWith(val.toLowerCase()));    
            if(type == 'number')
                rows_filtered = rows_db.filter(item => item[col] == +val);
            if(type == 'object')
                rows_filtered = rows_db.filter(item => item[col][key].toLowerCase().startsWith(val.toLowerCase()));
        }   
    } else {
        let valt = document.getElementById(`filter_${col}T`).checked;
        let valf = document.getElementById(`filter_${col}F`).checked;
        
        if(valt && !valf)
            rows_filtered = rows_db.filter(item => item[col] == valt);
        else if(!valt && valf)
            rows_filtered = rows_db.filter(item => item[col] == !valf);
        else
            rows_filtered = rows_db;
    }
    show_pagination = rows_filtered.length == rows_db.length;
    rows_paged = [...rows_filtered.slice(page_start, page_end)];
    //if need to paginate the restore original page size
    //else we are doing search so set page size to high number
    if(show_pagination)
        page_size = tmp_page_size;
    else
        page_size = 10000;
    change_page(1);
}

</script>

<div class="card">
    <div class="card-body">
        <div id="table-default">
            <div class="table-responsive py-2">
                <table class="table">
                    <thead>
                        <tr>
                            {#each columns as col}
                                {#if col.type != 'hidden'}
                                <th>
                                    <button class="table-sort" data-sort="sort-{col.name}">{col.display}</button>
                                </th>
                                {/if}
                            {/each}
                            {#if actions == true}
                                <th>Azioni</th>
                            {/if}
                        </tr>
                        <tr>
                            {#each columns as col}
                                {#if col.type != 'hidden'}
                                    {#if col.search == true}
                                        <th>
                                            {#if col.type != 'boolean'}
                                            <input
                                                id="filter_{col.name}"
                                                type="text"
                                                class="form-control"
                                                name={col.name}
                                                size=5  
                                                on:input={() => table_filter(`${col.name}`, col.type, col.key)}
                                                autocomplete="off"
                                                placeholder="filtro"
                                            />
                                            {:else}
                                                <label class="form-check">
                                                    <input 
                                                        id="filter_{col.name}T"
                                                        class="form-check-input" 
                                                        type="checkbox"
                                                        on:click={() => table_filter(`${col.name}`, col.type, col.key)}
                                                    />
                                                </label>
                                                <label class="form-check">
                                                    <input 
                                                        id="filter_{col.name}F"
                                                        class="form-check-input" 
                                                        type="checkbox"
                                                        on:click={() => table_filter(`${col.name}`, col.type, col.key)}
                                                    />
                                                </label>
                                            {/if}
                                        </th>
                                    {:else}
                                    <th>
                                    </th>
                                    {/if}
                                {/if}
                            {/each}
                            {#if actions == true}
                                <th></th>
                            {/if}
                        </tr>
                    </thead>
                    <tbody class="table-tbody">
                        {#if rows_paged.length > 0}
                            {#each rows_paged as row}
                            <tr>
                                {#each Object.keys(row) as col, i}
                                <!-- {#if col_names.includes(col) && col != 'id'} -->
                                {#if col_names.includes(col)}
                                {#if columns[i].type == 'date'}
                                <td class="sort-{col}" valign="middle">{row[col] ? row[col].toLocaleDateString() : "--"}</td>
                                {:else if columns[i].type == 'time'}
                                <td class="sort-{col}" valign="middle">{row[col] ? row[col].toLocaleTimeString() : "--"}</td>
                                {:else if columns[i].type == 'object'}
                                <td class="sort-{col}" valign="middle">
                                    {ellipses(columns[i].size || 3, row[col][columns.filter((item) => item.name == col)[0].key])}
                                </td>
                                {:else if columns[i].type == 'boolean'}
                                <td class="sort-{col}" valign="middle">
                                    <!-- {row[col] ? "SI" : "NO"} -->
                                    {#if row[col]}
                                        <icon class="ti ti-check icon green" />
                                    {:else}
                                        <icon class="ti ti-circle-x icon red" />
                                    {/if}
                                </td>
                                {:else if columns[i].type == 'image'}
                                <td class="sort-{col}" valign="middle">
                                    <img class="picture" src={row[col]}>
                                </td>
                                {:else if columns[i].type == 'number'}
                                    <td class="sort-{col}" valign="middle">{row[col]}</td>
                                {:else if columns[i].type == 'array'}
                                {#if columns[i].subtype == 'picture'}
                                <td class="sort-{col}" valign="middle">
                                    <div class="picture-container">
                                        {#each row[col] as item,idx }    
                                        {#if idx < (columns[i].size || 1)}
                                                <img class="picture-item" src={item[columns.filter((item) => item.name == col)[0].key]}>
                                            {/if}
                                        {/each}
                                    </div>
                                </td>
                                {:else if columns[i].subtype == 'object'}
                                <td class="sort-{col}" valign="middle">
                                    <div class="badges-list badge-container">
                                        {#each row[col] as item }
                                        <span class="badge bg-green">
                                            <b>{item[columns.filter((item) => item.name == col)[0].key]}</b>
                                        </span>
                                        {/each}
                                    </div>
                                </td>
                                {/if}
                                {:else if columns[i].type != 'hidden'}
                                <td class="sort-{col}" valign="middle">{ellipses(columns[i].size || 3, row[col])}</td>
                                {/if}
                                {/if}
                                {/each}
                                {#if actions == true}
                                <td valign="middle">
                                    <div class="action-container">
                                        <!-- print action icon -->
                                        {#if print == true}
                                        {#if print_filter == null}
                                            <form id="form-pdf" method="POST" action={`/${endpoint}?/pdf`}>
                                                <button class="icon-button" name="id" value={row.id}>
                                                    <icon class="ti ti-printer icon" />
                                                </button>
                                            </form>
                                        {:else}
                                            {#if row[print_filter] == true}
                                                <form id="form-pdf" method="POST" action={`/${endpoint}?/pdf`}>
                                                    <button class="icon-button" name="id" value={row.id}>
                                                        <icon class="ti ti-printer icon" />
                                                    </button>
                                                </form>
                                            {/if}
                                        {/if}
                                        {/if}
                                        {#if update}
                                            <!-- update action icon -->
                                            <a
                                                href="##"
                                                class=""
                                                data-bs-toggle="modal"
                                                data-bs-target="#{modal_name}"
                                                on:click={() => update_row(row.id)}
                                                >
                                                <icon class="ti ti-edit icon" />
                                            </a>  
                                        {/if}                                    
                                        <!-- custom action icon -->
                                        {#each custom_actions as action}
                                            <button class="icon-button" on:click={() => custom_action_handler(action.action, row.id)}>
                                                <icon class="ti ti-{action.icon} icon" />
                                            </button>
                                        {/each}
                                        <!-- delete action icon -->
                                        {#if (user_id($page.data) == row.creatoDa && has_grant(user_ruolo($page.data),'delete', resource)) || is_admin($page.data)}
                                            {#if trash}
                                                <button class="icon-button" name="delete-action" on:click={() => start_delete(row.id)}>
                                                    <icon class="ti ti-trash icon" />
                                                </button>
                                            {/if}
                                        {/if}
                                    </div>
                                </td>
                                {/if}
                            </tr>
                            {/each}
                        {/if}
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- pager -->
    {#if show_pagination}
    <div class="card-footer d-flex align-items-center">
        <p class="m-0 text-muted" id="users-count">
            {footer_num}/{footer_den} {footer}
        </p>
        {#if rows.length > page_size}
        <ul class="pagination m-0 ms-auto">
            <li class="page-item" class:disabled={current_page == 1}>
                <a class="page-link" href="##" on:click={prev_page}>
                    <i class="ti ti-chevron-left icon" />
                    prev
                </a>
            </li>
            {#each Array(num_pages > MAX_PAGES ? MAX_PAGES : num_pages) as _, i}
                {#if ((MAX_PAGES * Math.floor((current_page - 1) / (MAX_PAGES))) + 1 + i) <= num_pages }
                    <li class="page-item" class:active={i == ((current_page - 1) % MAX_PAGES)}>
                        <a class="page-link" href="##" on:click={() => change_page((MAX_PAGES * Math.floor((current_page  - 1)/ (MAX_PAGES))) + 1 + i)}>{(MAX_PAGES * Math.floor((current_page - 1) / (MAX_PAGES))) + 1 + i}</a>
                    </li>
                {/if}
            {/each}
            <li class="page-item" class:disabled={current_page == num_pages}>
                <a class="page-link" href="##" on:click={next_page}>
                    next
                    <i class="ti ti-chevron-right icon" />
                </a>
            </li>
        </ul>
        {/if}
    </div>
    {/if}
</div>

<div class="modal modal-blur fade" id="delete_modal" tabindex="-1" role="dialog" aria-hidden="true">
    <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-status bg-danger"></div>
        <div class="modal-body text-center py-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon mb-2 text-danger icon-lg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 9v2m0 4v.01" /><path d="M5 19h14a2 2 0 0 0 1.84 -2.75l-7.1 -12.25a2 2 0 0 0 -3.5 0l-7.1 12.25a2 2 0 0 0 1.75 2.75" /></svg>
          <h3>Sicuro?</h3>
          <div class="text-muted">Vuoi veramente cancellare l'elemento selezionato? Questa operazione è irreversibile</div>
        </div>
        <div class="modal-footer">
          <div class="w-100">
            <div class="row">
              <div class="col">
                <button type="button" class="btn w-100" data-bs-dismiss="modal" aria-label="Close">Annulla</button>
              </div>
              <div class="col">
                <form id="form-delete" method="POST" action={`/${endpoint}?/delete`}>
                    <button class="btn btn-danger w-100" name="id" value={current_item_delete}>
                        <icon class="ti ti-trash icon" /> Rimuovi
                    </button>
                </form>
             </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>


<style>
.icon-button {
    background: none;
    padding: 0px;
    border: none;
}

.green {
    color: green;
    font-weight: bolder;
}

.red {
    color: red;
    font-weight: bolder;
}

a {
    color: black;
}

.picture {
    /* width: 40px; */
    height: 50px;
    margin-right: 10px;
    border: 0px solid black;
    border-radius: 12px;
}

.picture-container {
    display: grid;
    width: 85%;
    grid-template-columns: auto auto auto auto auto;
    row-gap: 10px;
    column-gap: 10px;
}

.picture-item {
    margin: auto;
    /* width: 40px; */
    height: 50px;
    border-radius: 8px;
}

.badge-container {
    width: 25vh;
}

.action-container {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    justify-content:space-around;
    column-gap: 10px;
}
</style>
