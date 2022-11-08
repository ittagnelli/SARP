//convert date to be displayed in a modal
export function convert_date(d) {
    let data = d.toLocaleDateString('it-IT', { year: 'numeric', month: 'numeric', day: '2-digit' }).split('/');
    return `${data[2]}-${data[1]}-${data[0]}`;
}