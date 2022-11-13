const ELLIPSES_LENGTH = 50;

//convert date to be displayed in a modal
export function convert_date(d) {
    let data = d.toLocaleDateString('it-IT', { year: 'numeric', month: '2-digit', day: '2-digit' }).split('/');
    return `${data[2]}-${data[1]}-${data[0]}`;
}

export function ellipses(text) {
    return text.length < ELLIPSES_LENGTH || typeof(text) != "string" 
    ? text 
    : text.substring(0,ELLIPSES_LENGTH).concat('...');
}