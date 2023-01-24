const mongoose = require('mongoose');
const database = 'red_social';

const connection = async() =>{
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(`mongodb://127.0.0.1:27017/${database}`);

        console.log(`Conectado correctamente a bd: ${database}`);
    } catch (error) {
        console.log(error);
        throw new Error("No se ha podido conectar a la base de datos!!");
    }
}

module.exports = {
    connection
}