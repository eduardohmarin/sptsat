<?php

$spanishMonths = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre"
];

$formasPago = [
    "1" => "Efectivo",
    "2" => "Cheque Nominativo",
    "3" => "Transferencia Electrónica de Fondos SPEI",
    "4" => "Tarjeta de Crédito",
    "5" => "Monedero Electrónico",
    "6" => "Dinero Electrónico",
    "8" => "Vales de Despensa",
    "12" => "Dación en Pago",
    "13" => "Pago por Subrogación",
    "14" => "Pago por Consignación",
    "15" => "Condonación",
    "17" => "Compensación",
    "23" => "Novación",
    "24" => "Confusión",
    "25" => "Remisión de Deuda",
    "26" => "Prescripción o Caducidad",
    "27" => "A Satisfacción del Acreedor",
    "28" => "Tarjeta de Débito",
    "29" => "Tarjeta de Servicios",
    "30" => "Aplicación de Anticipos",
    "31" => "Intermediario Pagos",
    "99" => "Por Definir"
];

function monthFolder($m, $spanishMonths) {
    $zero = "";
    if ($m < 10) $zero = "0";
    return $zero . strval($m) . "_" . $spanishMonths[$m-1];
}

function folderFilesArray($ext, $folderPath) {
    $files = [];
    if (file_exists($folderPath)) {
        $txe = strrev($ext) . ".";
        foreach (scandir($folderPath) as $file) {
            $elif = strrev($file);
            if (strncasecmp($txe, $elif, 4) == 0) {
                array_push($files, $file);
            }
        }
    }
    return $files;
}

function formaDePago($cod, $formasPago) {
    $i = intval($cod);
    $c = strval($i);
    return $c . " - " . $formasPago[$c];
}

?>