<?php
session_start();

// Verificar si el usuario está logueado
if (!isset($_SESSION['logged_in']) || !$_SESSION['logged_in']) {
    header('Location: login.php');
    exit();
}

// Leer los pagos desde el archivo pagos.txt
$pagos = file_get_contents('pagos.txt');
$pagos = explode("\n", $pagos); // Dividir los pagos por línea

// Eliminar las líneas vacías
$pagos = array_filter($pagos, function($pago) {
    return !empty($pago);
});

// Ordenar los pagos por la fecha (más reciente primero)
usort($pagos, function($a, $b) {
    // Extraer la fecha de cada pago
    $fecha_a = explode(", ", $a)[5];
    $fecha_b = explode(", ", $b)[5];

    // Convertir las fechas a timestamps para compararlas
    $timestamp_a = strtotime(str_replace("Fecha: ", "", $fecha_a));
    $timestamp_b = strtotime(str_replace("Fecha: ", "", $fecha_b));

    // Comparar los timestamps de las fechas (más reciente primero)
    return $timestamp_b - $timestamp_a;
});

// Paginación: limitar los pagos a 20 por página
$pagos_por_pagina = 20;
$total_pagos = count($pagos);
$total_paginas = ceil($total_pagos / $pagos_por_pagina);

// Obtener la página actual
$pagina_actual = isset($_GET['pagina']) ? (int)$_GET['pagina'] : 1;
$pagina_actual = max(1, $pagina_actual); // Evitar números menores que 1
$inicio = ($pagina_actual - 1) * $pagos_por_pagina;

// Obtener los pagos de la página actual
$pagos_pagina = array_slice($pagos, $inicio, $pagos_por_pagina);
?>

<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Panel de Administración - Transacciones</title>
    <style>
        /* Estilos generales */
        body {
            font-family: 'Arial', sans-serif;
            background-color: #f4f7fb;
            margin: 0;
            padding: 0;
        }
        .container {
            max-width: 1200px;
            margin: 20px auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
            overflow-x: hidden; /* Prevenir el desbordamiento horizontal */
        }
        h1 {
            font-size: 2.5rem;
            text-align: center;
            color: #2c3e50;
            margin-bottom: 20px;
        }
        .logout-btn {
            position: absolute;
            top: 20px;
            right: 20px;
            background-color: #e74c3c;
            color: white;
            padding: 10px;
            border-radius: 5px;
            cursor: pointer;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
            background-color: #fff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        th, td {
            padding: 15px;
            text-align: center;
            border-bottom: 1px solid #ddd;
            font-size: 16px;
        }
        th {
            background-color: #3498db;
            color: white;
        }
        td {
            background-color: #f9f9f9;
        }
        td a {
            color: white;
            text-decoration: none;
            font-weight: bold;
            padding: 10px 15px;
            border-radius: 5px;
            background-color: #000;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        td a:hover {
            background-color: #333;
            text-decoration: underline;
        }
        .status {
            padding: 5px 10px;
            border-radius: 5px;
            font-weight: bold;
            color: white;
        }
        .status.Pendiente {
            background-color: #e67e22;
        }
        .status.Paga {
            background-color: #27ae60;
        }
        .status.Declinada {
            background-color: #e74c3c;
        }

        /* Estilo de tarjetas de pago */
        .payment-card {
            background: linear-gradient(135deg, #8e44ad, #2980b9);
            color: white;
            width: 100%;
            padding: 20px;
            border-radius: 15px;
            box-shadow: 0px 8px 15px rgba(0, 0, 0, 0.1);
            margin: 15px 0;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 200px;
        }
        .payment-card p {
            font-size: 18px;
            margin: 0;
        }
        .payment-card .method {
            font-size: 20px;
            font-weight: bold;
        }

        /* Responsividad */
        @media (max-width: 768px) {
            table {
                font-size: 14px;
            }
            th, td {
                padding: 10px;
            }
            h1 {
                font-size: 2rem;
            }
            .logout-btn {
                top: 10px;
                right: 10px;
            }
            .payment-card {
                height: auto;
            }
        }

        /* Estilo para la paginación */
        .pagination {
            text-align: center;
            margin-top: 20px;
        }
        .pagination a {
            padding: 10px 15px;
            margin: 0 5px;
            background-color: #3498db;
            color: white;
            text-decoration: none;
            border-radius: 5px;
        }
        .pagination a:hover {
            background-color: #2980b9;
        }

        /* Estilo del botón "Ver Comprobante" */
        .btn-view {
            background-color: #000;
            color: white;
            padding: 10px 20px;
            font-weight: bold;
            text-decoration: none;
            border-radius: 5px;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }
        .btn-view:hover {
            background-color: #333;
            text-decoration: underline;
        }
        
        /* Ajuste para centrar las tarjetas y mejorar la responsividad */
.card-container {
    display: flex;
    justify-content: center;
    align-items: center; /* Alineación vertical */
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 20px;
}

/* Responsividad mejorada para las tarjetas */
@media (max-width: 768px) {
    .card-container {
        flex-direction: column; /* Alinear verticalmente en pantallas pequeñas */
        align-items: center; /* Centrar horizontalmente cada tarjeta */
    }

    .card {
        width: 90%; /* Ajustar el ancho de la tarjeta en móviles */
        max-width: 300px; /* Evitar que sea demasiado grande en pantallas medianas */
        height: auto; /* Ajustar la altura automáticamente */
    }
}

@media (max-width: 480px) {
    .card {
        width: 100%; /* Aprovechar todo el ancho en pantallas muy pequeñas */
    }
}


    </style>
</head>
<body>
    <div class="container">
        <button class="logout-btn" onclick="window.location.href='logout.php'">Cerrar sesión</button>
        <h1>Panel de Administración - Transacciones</h1>

        <!-- Mostrar cada pago como una tarjeta premium -->
        <?php foreach ($pagos_pagina as $pago): ?>
            <?php if (!empty($pago)): ?>
                <?php
                $data = explode(", ", $pago); // Separar los datos por comas
                $id = explode(": ", $data[0])[1];
                $email = explode(": ", $data[1])[1];
                $method = explode(": ", $data[2])[1]; // Método de pago
                $comprobante = explode(": ", $data[3])[1];
                $ip = explode(": ", $data[4])[1];
                $fecha = explode(": ", $data[5])[1];
                ?>
                <div class="payment-card">
                    <p class="method"><?= strtoupper($method) ?></p>
                    <p>COP $99.000,00</p>
                    <p><strong><?= $email ?></strong></p>
                    <p>Fecha: <?= date('d-m-Y H:i:s', strtotime($fecha)) ?></p>
                    <a href="<?= $comprobante ?>" target="_blank" class="btn-view">Ver Comprobante</a>
                </div>
            <?php endif; ?>
        <?php endforeach; ?>

        <!-- Paginación -->
        <div class="pagination">
            <?php if ($pagina_actual > 1): ?>
                <a href="?pagina=<?= $pagina_actual - 1 ?>">Anterior</a>
            <?php endif; ?>

            <?php for ($i = 1; $i <= $total_paginas; $i++): ?>
                <a href="?pagina=<?= $i ?>" <?= $i == $pagina_actual ? 'style="background-color:#2980b9;"' : '' ?>><?= $i ?></a>
            <?php endfor; ?>

            <?php if ($pagina_actual < $total_paginas): ?>
                <a href="?pagina=<?= $pagina_actual + 1 ?>">Siguiente</a>
            <?php endif; ?>
        </div>
    </div>
</body>
</html>
