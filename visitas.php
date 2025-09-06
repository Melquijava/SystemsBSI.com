<?php

$arquivo = "/mnt/data/contador.txt";

if (!file_exists($arquivo)) {
    file_put_contents($arquivo, "0");
}

$visitas = (int)file_get_contents($arquivo);
$visitas++;

file_put_contents($arquivo, $visitas);

header('Content-Type: application/json');
echo json_encode(['visitas' => (int) $visitas]);

?>