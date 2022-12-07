/**
 * @param {string} input_from_client
 */
export function is_an_html_element(input_from_client){
    const anti_html_regex = new RegExp("<[^>]+>");  // This catch HTML elements
    return anti_html_regex.test(input_from_client);
}