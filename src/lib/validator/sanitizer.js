/**
 * @param {string} input_from_client
 */

const anti_html_regex = new RegExp("<[^>]+>"); 

export const is_an_html_element = (/** @type {string} */ input_from_client) => anti_html_regex.test(input_from_client);
