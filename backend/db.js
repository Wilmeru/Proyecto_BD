const mysql = require('mysql2');

//Configuracion de la conexion a MySQL
const conexion = mysql.createConnection({
  host: 'localhost',    // Servidor local
  user: 'root',         // Usuario de MySQL (Por defecto en XAMPP)
  database: 'tienda',   // Nombre de nuestra BD
});

// Comprobar si la conexion fue exitosa
conexion.connect((error) => {
    if (error) {
        console.error("Error al conectar con MySQL:", error);
        return;
    }
    console.log("Conexion exitosa con MySQL");
});

//Exportar la conexion para reutilizarla en las rutas de servidor
module.exports = conexion;  