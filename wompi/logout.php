<?php
// Iniciar sesión para poder destruirla
session_start();

// Destruir la sesión
session_destroy();

// Redirigir al login
header("Location: login.php");
exit;
?>
