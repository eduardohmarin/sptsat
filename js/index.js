import { makeXHttpRequest, fechaActual, spMeses, mesContiguo } from "./general.js";

const init = () => {
    const { y, m } = fechaActual();
    mostrarFecha(y, m);
    facturasInfo(y, m);
}

const cambiarMes = (i) => {
    const ym = document.getElementById("hidden_ym").value.split("_");
    const { y, m} = mesContiguo(ym[0], ym[1], i);
    mostrarFecha(y, m);
    facturasInfo(y, m);
    calc_resetRetGastos();
}

const mostrarFecha = (y, m) => {
    document.getElementById("span_mes").innerHTML = `${spMeses[m-1]} - ${y}`;
    document.getElementById("hidden_ym").value = `${y}_${m}`;
}

const facturasInfo = async (y, m) => {
    const response = await makeXHttpRequest("GET", `../api/facturas.php?y=${y}&m=${m}`);
    const resp = JSON.parse(response);
    let retenciones = "";
    for (let i=0; i<resp.facturas.retenciones.length; i++) {
         retenciones += tr_retenciones(i, resp.facturas.retenciones[i]);
    }
    document.getElementById("tbody_retenciones").innerHTML = retenciones;
    let gastos = "";
    for (let i=0; i<resp.facturas.gastos.length; i++) {
        gastos += tr_gastos(i, resp.facturas.gastos[i]);
    }
    document.getElementById("tbody_gastos").innerHTML = gastos;
}

const tr_retenciones = (n, ret) => {
    let baseIVA = "0.00";
    ret.retenciones.detalleIVA.forEach(detalle => {
        if (detalle.tasa === 0.16) baseIVA = detalle.base;
    });
    let tr = `
    <tr>
    <td>
        <div id="div_razonSocial_r_${n}" class="el_bold">${ret.emisor}</div>
        <div class="el_monosp">
            <span id="span_fecha_r_${n}">${ret.fecha}</span>
            <span> - </span>
            <span id="span_periodo_r_${n}" class="el_bold">${ret.periodo}</span>
        </div>
        <p>Tasa ISR --- <span id="span_tasaISR_r_${n}" class="el_monosp el_bold">${ret.retenciones.retenido.tasaISR*100}%</span></p>
        <ul>
            <li>Base ISR --- <span id="span_baseISR_r_${n}" class="el_monosp el_bold">$ ${ret.retenciones.retenido.base}</span></li>
            <li>Base IVA --- <span id="span_baseIVA_r_${n}" class="el_monosp el_bold">$ ${baseIVA}</span></li>
        </ul>
    </td>
    <td>
        <div id="div_ISRretenido_r_${n}" class="div_right el_monosp el_bold">$ ${ret.retenciones.retenido.ISR}</div>
        <div id="div_IVAretenido_r_${n}" class="div_right el_monosp el_bold">$ ${ret.retenciones.retenido.IVA}</div>
    </td>
    <td class="el_center"><input id="checkbox_contable_r_${n}" type="checkbox" onchange="calc_sumaRetencion(${n});"></td>
    </tr>
    `;
    return tr;
}

const tr_gastos = (n, gasto) => {
    let conceptos = "";
    for (let i=0; i<gasto.conceptos.length; i++) {
        conceptos += `<li id="li_concepto_g_${n}_${i}">${gasto.conceptos[i].concepto}</li>`;
    }

    let tr = `
    <tr>
    <td>
        <div id="div_razonSocial_g_${n}" class="el_bold">${gasto.emisor}</div>
        <div id="div_fecha_g_${n}" class="el_monosp">${gasto.fecha}</div>
        <ul>
            ${conceptos}
        </ul>
    </td>
    <td>
        <div id="div_subT_g_${n}" class="div_right el_monosp el_bold">$ ${gasto.subtotal}</div>
        <div id="div_IVA_g_${n}" class="div_right el_monosp el_bold">$ ${gasto.ivaTotal}</div>
        <div id="div_total_g_${n}" class="div_right el_monosp el_bold">$ ${gasto.total}</div>
    </td>
    <td class="el_center"><input id="checkbox_contable_g_${n}" type="checkbox" onchange="calc_sumaGastos(${n});"></td>
    </tr>
    `;
    return tr;
}

document.addEventListener("load", init());
document.getElementById("button_mesAnt").addEventListener("click", ()=>{cambiarMes(-1);});
document.getElementById("button_mesSig").addEventListener("click", ()=>{cambiarMes(1);});