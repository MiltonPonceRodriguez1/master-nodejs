// IMPORTAR DEPENDENCIAS
const {connection} = require('./database/connection');
const express = require('express');
const cors = require('cors');

// MENSAJE DE BIENVENIDA
console.log('API NODE para RED SOCIAL arrancada!');

// CONEXIÓN A LA DB
connection();

// CREAR SERVIDOR NODE
const app = express();
const port = 3900;

// CONFIGURAR CORS
app.use(cors());

// CONVERTIR LOS DATOS DEL BODY A JSONS
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// CARGAR CONF DE RUTAS
const UserRoutes = require('./routes/user');
const PublicationRoutes = require('./routes/publication');
const FollowRoutes = require('./routes/follow');
const BannerRoutes = require('./routes/banner');

app.use('/api/user', UserRoutes);
app.use('/api/publication', PublicationRoutes);
app.use('/api/follow', FollowRoutes);
app.use('/api/banner', BannerRoutes);

// RUTA DE PRUEBA
app.get('/test', (req, res) => {
    return res.status(200).json({
        id:1,
        name: 'milton'
    });
})

// PONER A ESCUCHAR SERVIDOR PETICIONES HTTP
app.listen(port, () => {
    console.log(`Servidor de node corriendo en el puerto ${port}`);
});