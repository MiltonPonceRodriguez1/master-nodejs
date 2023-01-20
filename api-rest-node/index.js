const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");

// Inicializar app
console.log("App de Node Arrancada !!");

// Conectar a la base de datos
connection()

// Crear servidor Node
const app = express()
const port = 3900;

// Configurar CORS
app.use(cors())

// Convertir body a objeto js
app.use(express.json()) // Recibir datos con content-type application json
app.use(express.urlencoded({extended: true})) // Recibir datos con form-urlencoded

// Rutas
const article_routes = require('./routes/Article');
const { urlencoded } = require("express");

// Cargar Rutas del Fichero de rutas
app.use('/api', article_routes);

// Crear rutas de prueba hardcoreadas
app.get("/", (req, res) =>{
    console.log("Se ha ejecutado el endpoint test");

    /* METODO SEND DEVUELVE CUALQUIER TIPO DE DATOS (HTML,TXT, JSON , ETC) */
    return res.status(200).send(`
        <div>
            <h1>Empezando a crear un API REST con Node</h1>
            <p>Desarrollado por Milton Ponce</p>
        </div>
    `);
});

app.get("/test", (req, res) =>{
    console.log("Se ha ejecutado el endpoint test");

    /* METODO SEND DEVUELVE ESTRICTAMENTE UN JSON O COLECCION DE JSON's */
    return res.status(200).json([{
        curso: "Master en React",
        autor: "Victor Robles",
        url: "victorroblesweb.es/master-react"
    },
    {
        curso: "Master en React",
        autor: "Victor Robles",
        url: "victorroblesweb.es/master-react"
    }])
});

// Crear servidor y escuchar peticiones http
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});

