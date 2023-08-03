import { writable } from 'svelte/store';

export const page_pre_title = writable('PRE-TITLE'); // page pre-title
export const page_title = writable('TITLE'); // page title
export const page_action_title = writable(); // page action title
export const page_action_modal = writable('id'); // page action modal id

// store variable for MessageBox component
export let mb_type = writable();
export let mb_color = writable();
export let mb_title = writable();
export let mb_message = writable();
export let mb_show = writable(false);

