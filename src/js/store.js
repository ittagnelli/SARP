import { writable } from 'svelte/store';

export const page_pre_title = writable('PRE-TITLE'); // page pre-title
export const page_title = writable('TITLE'); // page title
export const page_action_title = writable(); // page action title
export const page_action_modal = writable('id'); // page action modal id
// link (es. download) mostrato nell'header della pagina accanto al titolo: { href, title, icon }
// la pagina che lo imposta deve azzerarlo in onDestroy, altrimenti resta visibile nelle altre pagine
export const page_header_link = writable(null);

// store variable for MessageBox component
export let mb_type = writable();
export let mb_color = writable();
export let mb_title = writable();
export let mb_message = writable();
export let mb_show = writable(false);

