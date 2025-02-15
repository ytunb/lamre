<?php
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = $_POST['email'];
    $transaction_id = $_POST['transaction_id'];

    if (isset($_FILES['comprobante'])) {
        $upload_dir = 'comprobantes/';
        $file_path = $upload_dir . basename($_FILES['comprobante']['name']);

        if (move_uploaded_file($_FILES['comprobante']['tmp_name'], $file_path)) {
            // Obtener la fecha y hora actual
            $fecha = date('Y-m-d H:i:s');
            // Guardar informaci¨®n del pago, incluyendo la fecha
            file_put_contents('pagos.txt', "ID: $transaction_id, Email: $email, Metodo: $_POST[method], Comprobante: $file_path, IP: {$_SERVER['REMOTE_ADDR']}, Fecha: $fecha\n", FILE_APPEND);
            http_response_code(200);
        } else {
            http_response_code(500);
        }
    } else {
        http_response_code(400);
    }
} else {
    http_response_code(405);
}
?>