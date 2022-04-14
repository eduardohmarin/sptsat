<?php

require("general.php");

$year = intval($_GET["y"]);
$monthNumber = intval($_GET["m"]);

$nextYear = $year;
$nextMonth = $monthNumber + 1;
if ($nextMonth > 12) {
    $nextMonth -= 12;
    $nextYear++;
}

$filesInfo = [];

// Retenciones a partir de aquí ---v

$tipo = ["retenciones", "retenciones", "emisor"];

$nextPath = "../cfdis/" . $nextYear . "/" . monthFolder($nextMonth, $spanishMonths) . "/" . $tipo[1];
$xmlFiles = folderFilesArray("xml", $nextPath);

$filesInfo[$tipo[0]] = [];

foreach ($xmlFiles as $file) {
    $filePath = $nextPath . "/" . $file;
    $xmlFile = simplexml_load_file($filePath);
    $ns = $xmlFile->getNamespaces(true);
    $xmlFile->registerXPathNamespace('t', $ns["tfd"]);
    $xmlFile->registerXPathNamespace('pT', $ns["plataformasTecnologicas"]);

    // Lectura del XML según la versión del CFDI de Retenciones
    $version = $xmlFile["Version"] -> __toString();
    $v = intval($version) - 1;
    $attribs = [
        "ejercicio"=> ["Ejerc", "Ejercicio"],
        "retencionTotal"=> ["montoTotRet", "MontoTotRet"]
    ];

    $retenciones = [];
    $xPeri = $xmlFile -> xpath("retenciones:Periodo[1]")[0];
    $plataformasNL = $xmlFile -> xpath("retenciones:Complemento[1]/pT:ServiciosPlataformasTecnologicas[1]");
    if (count($plataformasNL) > 0) {
        $plataformas = $plataformasNL[0];
        $base = floatval($plataformas["MonTotServSIVA"] -> __toString());
        $isr = floatval($plataformas["TotalISRRetenido"] -> __toString());
        $tasa = ($isr / $base);
        $retenciones["retenido"] = [
            "tasaISR" => round($tasa, 3),
            "base" => round($base, 2),
            "ISR" => round($isr, 2),
            "IVA" => round(floatval($plataformas["TotalIVARetenido"] -> __toString()), 2)
        ];
        $retenciones["detalleIVA"] = [];
        foreach ($plataformas -> xpath("plataformasTecnologicas:Servicios[1]/plataformasTecnologicas:DetallesDelServicio") as $servicio) {
            $detalle = ["base" => round(floatval($servicio["PrecioServSinIVA"] -> __toString()), 2)];
            $retencionNL = $servicio -> xpath("plataformasTecnologicas:ImpuestosTrasladadosdelServicio[1]");
            if (count($retencionNL) > 0) {
                $retencion = $retencionNL[0];
                $detalle["tasa"] = round(floatval($retencion["TasaCuota"] -> __toString()), 2);
            }
            else $detalle["tasa"] = 0;
            array_push($retenciones["detalleIVA"], $detalle);
        }
    }
    else {
        $retenciones["retenido"] = [
            "tasaISR" => 0,
            "base" => "0.00",
            "ISR" => "0.00",
            "IVA" => "0.00"
        ];
        $retenciones["detalleIVA"] = [];
        array_push($retenciones["detalleIVA"], [
            "base" => 0,
            "tasa" => 0,
        ]);
    }
    array_push($filesInfo[$tipo[0]], [
        "versionRetencion" => $version,
        "folioFiscal" => $xmlFile -> xpath("retenciones:Complemento[1]/t:TimbreFiscalDigital[1]")[0]["UUID"] -> __toString(),
        "fecha" => $xmlFile["FechaExp"] -> __toString(),
        $tipo[2] => $xmlFile -> xpath("retenciones:" . ucfirst($tipo[2]) . "[1]")[0]["NomDenRazSocE"] -> __toString(),
        "claveRetencion" => $xmlFile["CveRetenc"] -> __toString(),
        "periodo" => $xPeri[$attribs["ejercicio"][$v]] -> __toString() . "_" . $xPeri["MesIni"] -> __toString() . "-" . $xPeri["MesFin"] -> __toString(),
        "retenciones" => $retenciones,
        "retencionTotal" => $xmlFile -> xpath("retenciones:Totales[1]")[0][$attribs["retencionTotal"][$v]] -> __toString()
    ]);
}

// Fin de Retenciones ---^

// Ingresos y gastos a partir de aquí ---v

$tiposCFDI = [
    // ["ingresos", "emitidas", "receptor"],
    ["gastos", "recibidas", "emisor"]
];

foreach ($tiposCFDI as $tipo) {
    $folderPath = "../cfdis/" . $year . "/" . monthFolder(intval($monthNumber), $spanishMonths) . "/" . $tipo[1];
    $xmlFiles = folderFilesArray("xml", $folderPath);

    $filesInfo[$tipo[0]] = [];

    foreach ($xmlFiles as $file) {
        $filePath = $folderPath . "/" . $file;
        $xmlFile = simplexml_load_file($filePath);
        $ns = $xmlFile->getNamespaces(true);
        $xmlFile->registerXPathNamespace('t', $ns['tfd']);
        $conceptos = [];
        foreach ($xmlFile -> xpath("cfdi:Conceptos[1]/cfdi:Concepto") as $concepto) {
            $monto = $concepto["Importe"] -> __toString();
            $iva = "0.00";
            if (intval($monto) > 0.01) {
                $iva = $concepto -> xpath("cfdi:Impuestos[1]/cfdi:Traslados[1]/cfdi:Traslado[1]")[0]["Importe"] -> __toString();
            }
            array_push($conceptos, [
                "concepto" => $concepto["Descripcion"] -> __toString(),
                "monto" => $monto,
                "iva" => $iva
            ]);
        }
        $subtotal = $xmlFile["SubTotal"] -> __toString();
        $ivaTotal = "0.00";
            if (intval($subtotal) > 0.01) {
                $ivaTotal = $xmlFile -> xpath("cfdi:Impuestos[1]/cfdi:Traslados[1]/cfdi:Traslado[1]")[0]["Importe"] -> __toString();
            }
        array_push($filesInfo[$tipo[0]], [
            "versionCFDI" => $xmlFile["Version"] -> __toString(),
            "folioFiscal" => $xmlFile -> xpath("cfdi:Complemento[1]/t:TimbreFiscalDigital[1]")[0]["UUID"] -> __toString(),
            "fecha" => $xmlFile["Fecha"] -> __toString(),
            $tipo[2] => $xmlFile -> xpath("cfdi:" . ucfirst($tipo[2]) . "[1]")[0]["Nombre"] -> __toString(),
            "formaPago" => formaDePago($xmlFile["FormaPago"] -> __toString(), $formasPago),
            "conceptos" => $conceptos,
            "subtotal" => $subtotal,
            "ivaTotal" => $ivaTotal,
            "total" => $xmlFile["Total"] -> __toString()
        ]);
    }
}

// Fin de Ingresos y gastos

$facturas = ["facturas" => $filesInfo];
print_r($facturas);

?>