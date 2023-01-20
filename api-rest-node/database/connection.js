const mongoose = require("mongoose");

const connection = async() => {
    try {
        /* PARAMETROS OPCIONALES (solo en caso de aviso) */
        /*
            useNewUrlParser: true
            useUnifiedTopology: true
            useCreateIndex: true
        */
        mongoose.set('strictQuery', false);
        await mongoose.connect("mongodb://127.0.0.1:27017/my_blog");

        console.log("Conectado correctamente a la base de datos my_blog !!");
    } catch(error) {
        console.log(error);
        throw new Error("No se ha podido conectar a la base de datos");
    }
}

module.exports = {
    connection
}