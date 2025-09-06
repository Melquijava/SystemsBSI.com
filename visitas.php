<?php
// Arquivo onde vamos salvar o número de visitas
$arquivo = "contador.txt";

// Se o arquivo não existir, cria com valor inicial 0
if (!file_exists($arquivo)) {
    file_put_contents($arquivo, "0");
}

// Lê o número atual
$visitas = (int)file_get_contents($arquivo);

// Soma +1
$visitas++;

// Salva de volta
file_put_contents($arquivo, $visitas);

// Retorna em JSON
header('Content-Type: application/json');
echo json_encode(array("visitas" => $visitas));
?>