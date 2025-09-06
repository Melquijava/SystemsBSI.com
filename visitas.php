<?php

// A pasta onde o arquivo ser_ salvo
$pasta = "/mnt/data";
// O caminho completo do arquivo
$arquivo = $pasta . "/contador.txt";

// Verifica se a pasta j_ existe. Se n_o, cria ela.
if (!is_dir($pasta)) {
    mkdir($pasta, 0777, true);
}

// Se o arquivo n_o existir, cria com valor inicial 0
if (!file_exists($arquivo)) {
    file_put_contents($arquivo, "0");
}

// L_ o n_mero atual
$visitas = (int)file_get_contents($arquivo);

// Soma +1
$visitas++;

// Salva de volta
file_put_contents($arquivo, $visitas);

// Retorna em JSON
header('Content-Type: application/json');
echo json_encode(['visitas' => (int) $visitas]);

?>