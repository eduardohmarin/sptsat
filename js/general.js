const makeXHttpRequest = (method, url) => {
    return new Promise((resolve, reject) => {
        const xhttp = new XMLHttpRequest();
        xhttp.open(method, url, true);
        xhttp.onload = () => {
            (xhttp.status === 200)
                ? resolve(xhttp.responseText)
                : reject(new Error(`Request not successful, status: ${xhttp.status}`));
        }
        xhttp.send();
    });
}

const fechaActual = () => {
    const d = new Date();
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    return {y, m};
}

const spMeses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
];

const mesContiguo = (year, month, i) => {
    let m = parseInt(month) + i;
    let y = parseInt(year);
    if (m === 13) {
        m = 1;
        y += 1;
    } else if (m === 0) {
        m = 12;
        y -= 1;
    }
    return { y, m };
}

export { makeXHttpRequest, fechaActual, spMeses, mesContiguo };