const calc_sumaRetencion = (n) => {
    let sumas = {
        baseISRinter: parseFloat(document.getElementById("div_baseISRinter").innerText.substring(2)),
        baseISRdirect: parseFloat(document.getElementById("div_baseISRdirect").innerText.substring(2)),
        ISRretenido: parseFloat(document.getElementById("div_ISRretenido").innerText.substring(2)),
        baseIVAinter: parseFloat(document.getElementById("div_baseIVAinter").innerText.substring(2)),
        baseIVAdirect: parseFloat(document.getElementById("div_baseIVAdirect").innerText.substring(2)),
        IVAretenido: parseFloat(document.getElementById("div_IVAretenido").innerText.substring(2)),
    };
    let signo = 1;
    if (!document.getElementById(`checkbox_contable_r_${n}`).checked) signo = -1;
    const tasaISR = document.getElementById(`span_tasaISR_r_${n}`).innerText;
    if (tasaISR === "1%") {
        sumas.baseISRinter += (signo)*parseFloat(document.getElementById(`span_baseISR_r_${n}`).innerText.substring(2));
        sumas.baseIVAinter += (signo)*parseFloat(document.getElementById(`span_baseIVA_r_${n}`).innerText.substring(2));
    } else if (tasaISR === "2.1%") {
        sumas.baseISRdirect += (signo)*parseFloat(document.getElementById(`span_baseISR_r_${n}`).innerText.substring(2));
        sumas.baseIVAdirect += (signo)*parseFloat(document.getElementById(`span_baseIVA_r_${n}`).innerText.substring(2));
    }
    sumas.ISRretenido += (signo)*parseFloat(document.getElementById(`div_ISRretenido_r_${n}`).innerText.substring(2));
    sumas.IVAretenido += (signo)*parseFloat(document.getElementById(`div_IVAretenido_r_${n}`).innerText.substring(2));
    totalIngresos = sumas.baseISRinter + sumas.baseISRdirect;
    document.getElementById("div_totalIngresos").innerText = `$ ${Math.round(totalIngresos*100)/100}`;
    document.getElementById("div_baseISRinter").innerText = `$ ${Math.round(sumas.baseISRinter*100)/100}`;
    document.getElementById("div_baseISRdirect").innerText = `$ ${Math.round(sumas.baseISRdirect*100)/100}`;
    document.getElementById("div_ISRretenido").innerText = `$ ${Math.round(sumas.ISRretenido*100)/100}`;
    document.getElementById("div_baseIVAinter").innerText = `$ ${Math.round(sumas.baseIVAinter*100)/100}`;
    document.getElementById("div_baseIVAdirect").innerText = `$ ${Math.round(sumas.baseIVAdirect*100)/100}`;
    document.getElementById("div_IVAretenido").innerText = `$ ${Math.round(sumas.IVAretenido*100)/100}`;
}

const calc_sumaGastos = (n) => {
    let IVAacreditable = parseFloat(document.getElementById("div_IVAacreditable").innerText.substring(2));
    let signo = 1;
    if (!document.getElementById(`checkbox_contable_g_${n}`).checked) signo = -1;
    IVAacreditable += (signo)*parseFloat(document.getElementById(`div_IVA_g_${n}`).innerText.substring(2));
    document.getElementById("div_IVAacreditable").innerText = `$ ${Math.round(IVAacreditable*100)/100}`;
}

const calc_resetRetGastos = () => {
    document.getElementById("div_totalIngresos").innerText = "$ 0.00";
    document.getElementById("div_baseISRinter").innerText = "$ 0.00";
    document.getElementById("div_baseISRdirect").innerText = "$ 0.00";
    document.getElementById("div_ISRretenido").innerText = "$ 0.00";
    document.getElementById("div_baseIVAinter").innerText = "$ 0.00";
    document.getElementById("div_baseIVAdirect").innerText = "$ 0.00";
    document.getElementById("div_IVAretenido").innerText = "$ 0.00";
    document.getElementById("div_IVAacreditable").innerText = "$ 0.00";
}