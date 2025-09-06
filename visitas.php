<?php

// Conecta ao banco de dados usando a variável de ambiente do Railway
$dbUrl = getenv('MYSQL_URL');

// Analisa a URL para extrair as informações de conexão
$url_parts = parse_url($dbUrl);

$host = $url_parts['host'];
$dbname = ltrim($url_parts['path'], '/');
$user = $url_parts['user'];
$password = $url_parts['pass'];
$port = $url_parts['port'];

// Cria a string DSN (Data Source Name)
$dsn = "mysql:host=$host;dbname=$dbname;port=$port";

try {
    // Conecta ao banco de dados
    $pdo = new PDO($dsn, $user, $password);
} catch (PDOException $e) {
    die("Erro de conexão: " . $e->getMessage());
}


// Cria a tabela de visitas se ela não existir
$pdo->exec("
    CREATE TABLE IF NOT EXISTS visitas (
        id INT PRIMARY KEY,
        contagem INT
    );
");

// Inicia uma transação para garantir que a leitura e a escrita sejam seguras
$pdo->beginTransaction();

// Lê a contagem atual
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

// Confirma a transação
$pdo->commit();

// Retorna a contagem em JSON
header('Content-Type: application/json');
echo json_encode(['visitas' => (int) $contagem]);

?>