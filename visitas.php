<?php

// Acessa as vari_veis de ambiente diretamente pela superglobal $_ENV
$host = $_ENV['MYSQL_HOST'];
$dbname = $_ENV['MYSQL_DATABASE'];
$user = $_ENV['MYSQL_USER'];
$password = $_ENV['MYSQL_PASSWORD'];
$port = $_ENV['MYSQL_PORT'];

// Se as vari_veis de ambiente n_o estiverem definidas, exibe um erro
if (!$host || !$dbname || !$user || !$password || !$port) {
    http_response_code(500);
    die("Erro: Algumas variaveis de ambiente do MySQL n_o foram encontradas.");
}

// Cria a string DSN (Data Source Name)
$dsn = "mysql:host=$host;dbname=$dbname;port=$port";

try {
    // Conecta ao banco de dados
    $pdo = new PDO($dsn, $user, $password);

    // Cria a tabela de visitas se ela n_o existir
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS visitas (
            id INT PRIMARY KEY,
            contagem INT
        );
    ");

    // Inicia uma transa__o para garantir que a leitura e a escrita sejam seguras
    $pdo->beginTransaction();

    // L_ a contagem atual
    $stmt = $pdo->prepare("SELECT contagem FROM visitas WHERE id = 1");
    $stmt->execute();
    $contagem = $stmt->fetchColumn();

    // Se a tabela estiver vazia, inicializa com 0
    if ($contagem === false) {
        $contagem = 0;
        $pdo->exec("INSERT INTO visitas (id, contagem) VALUES (1, 0)");
    }

    // Incrementa a contagem
    $contagem++;

    // Atualiza a contagem no banco de dados
    $stmt = $pdo->prepare("UPDATE visitas SET contagem = ? WHERE id = 1");
    $stmt->execute([$contagem]);

    // Confirma a transa__o
    $pdo->commit();

    // Retorna a contagem em JSON
    header('Content-Type: application/json');
    echo json_encode(['visitas' => (int) $contagem]);

} catch (PDOException $e) {
    http_response_code(500);
    die("Erro de conexao com o banco de dados: " . $e->getMessage());
}

?>