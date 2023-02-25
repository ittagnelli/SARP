<script>
// @ts-nocheck
import { createEventDispatcher } from 'svelte';
import { ellipses, user_id, is_admin,  has_grant, user_ruolo } from '../../../js/helper';
import { page } from '$app/stores';

// dichiara le colonne della tabella
// il nome di ogni colonna deve coincidere esattamente con il nome
// del campo della tabella contenuta in rows
export let columns;
export let rows;
export let page_size;
export let modal_name;
export let endpoint; // Cosa visualizza la tabella?
export let footer;
export let print;
export let actions;
export let resource;

const dispatch = createEventDispatcher();
const MAX_PAGES = 20; //massimo numero di pagine visualizzabili nella barra

let num_pages = Math.ceil(rows.length / page_size); //numero di pagines
let current_page = 1; //pagina da visualizzare nella tabella
let col_names = columns.map((item) => item.name); //nomi delle colonne
let page_start = 0; //inizio della pagine nell'array rows
let page_end = page_size; //fine della pagina nell'array rows
let rows_paged = []; //pagina attuale di rows
let bigpage; // numero di pagina contenente MAX_PAGES pagine
let rows_filtered = []; // contiene le righe di rows con le chiavi ordinate come la tabella
let footer_num = 0, footer_den = 0;

// filtra da rows le chiavi non presenti nelle colonne della tabella
//in questo modo viene rispettato l'ordine di visualizzazione
//come definito in columns
rows.forEach((row) => {
    let tmp_row = {};
    columns.forEach((col) => {
        tmp_row[col['name']] = row[col['name']];
    });
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

function calculate_bigpage(i) {
    bigpage = MAX_PAGES * Math.floor(current_page / (MAX_PAGES + 1));
    console.log(i, bigpage)
    return '';
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
                            <!-- {#if col.name != 'id'} -->
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
                    </thead>
                    <tbody class="table-tbody">
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
                                {#if print == true}
                                <form id="form-pdf" method="POST" action={`/${endpoint}?/pdf`}>
                                    <button class="icon-button" name="id" value={row.id}>
                                        <icon class="ti ti-printer icon" />
                                    </button>
                                </form>
                                {/if}
                                <a
                                    href="##"
                                    class=""
                                    data-bs-toggle="modal"
                                    data-bs-target="#{modal_name}"
                                    on:click={() => update_row(row.id)}
                                    >
                                    <icon class="ti ti-edit icon" />
                                </a>
                                {#if (user_id($page.data) == row.creatoDa && has_grant(user_ruolo($page.data),'delete', resource)) || is_admin($page.data)}
                                <form id="form-delete" method="POST" action={`/${endpoint}?/delete`}>
                                    <button class="icon-button" name="id" value={row.id}>
                                        <icon class="ti ti-trash icon" />
                                    </button>
                                </form>
                                {/if}
                            </td>
                            {/if}
                        </tr>
                        {/each}
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- pager -->
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

form {
    display: inline;
}

#form-delete {
    border: 0px solid red;
    position: relative;
    left: 1.5rem;
}

#form-pdf {
    border: 0px solid red;
    position: relative;
    left: -1.5rem;
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
</style>
