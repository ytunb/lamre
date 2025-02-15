<?php
header('Content-Type: application/json');

$file = 'results.json';

// Cargar los resultados existentes
if (file_exists($file)) {
    $data = json_decode(file_get_contents($file), true);
} else {
    $data = [];
}

// Manejar las peticiones GET
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $phone = $_GET['phone'] ?? '';
    echo json_encode($data[$phone] ?? []);
    exit;
}

// Manejar las peticiones POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (isset($input['phone'], $input['results'])) {
        // Almacenar los resultados solo si el número no existe
        if (!isset($data[$input['phone']])) {
            // Guardar todos los datos (sin la IP) en el archivo
            $data[$input['phone']] = $input['results'];
            file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
        }
        
        echo json_encode(['status' => 'success']);
        exit;
    }
}

echo json_encode(['status' => 'error']);
?>
