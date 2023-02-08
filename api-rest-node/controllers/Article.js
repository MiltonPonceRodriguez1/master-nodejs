/* SE PUEDEN TRABAJAR CONTROLADORES COMO PROGRAMACIÓN FUNCIONAL O POO */
const { articleValidator } = require('../helpers/validation')
const fs = require('fs');
const path = require('path');
/* IMPORTAR MODELOS */
const Article = require('../models/Article');

const errorData = (code, message) => {
    return {
        code,
        status: "error",
        message,
    }
}

const test = (req, res) => {
    return res.status(200).json({
        msg: "Soy una acción de prueba en mi controlador de articulos!"
    });
}

const course = (req, res) => {
    console.log(`Se ha ejecutado el endpoint test`);
    return res.status(200).json([
        {
            curso: "Master en React",
            autor: "Victor Robles",
            url: "victorroblesweb.es/master-react"
        },
        {
            curso: "Master en React",
            autor: "Victor Robles",
            url: "victorroblesweb.es/master-react"
        }
    ]);
}

/* METODOS PARA EL API DE UN BLOG */

/* METODO PARA CREAR UN ARTICULO */
const create = (req, res) => {
    // Recoger datos por POST a guardar
    let params = req.body;

    // Validar los datos
    try {
        articleValidator(params);
    } catch(error) {
        data = errorData(400, 'Faltan datos por enviar');
        return res.status(data.code).json(data);
    }

    // Instanciar objeto a guardar
    const article = Article(params) // Asiganción Automatica => identifica keys y los mapea

    // Asignar valores al objeto basado en el modelo (manual, automatico)
    // article.title = params.title // Asignación Manual

    // Guardar articulo en la DB
    article.save((error, article) =>{
        if(error || !article) {
            data = errorData(400, 'Error al guardar el articulo!');
            return res.status(data.code).json(data);
        }

        // Devolver respuesta
        return res.status(200).json({
            status: "success",
            message: "Articulo creado con exito",
            article: article
        });
    });
}
/* FIN METODO PARA CREAR UN ARTICULO */

/* METODO PARA CONSULTAR ARTICULOS */
const list = (req, res) => {
    let articles = Article.find({});

    if(req.params.last) {
        articles.limit(3);
    }

    articles.sort({date: -1})
            .exec((error, articles) => {
        if(error || !articles) {
            data = errorData(404, 'No se han encontrado articulos !');
            return res.status(data.code).json(data);
        }

        return res.status(200).send({
            status: "success",
            count: articles.length,
            articles
        });
    });
}
/* FIN METODO PARA CONSULTAR ARTICULOS */

/* METODO PARA CONSULTAR UN ARTICULO */
const detail = (req, res) => {
    // Recoger ID por la url
    let id = req.params.id;

    // Buscar el articulo
    Article.findById(id, (error, article) => {
        // En caso de no existir devolver error
        if(error || !article) {
            data = errorData(404, 'No se encontro el articulo !!');
            return res.status(data.code).json(data);
        }

        // Devolver resultado
        return res.status(200).json({
            status: "success",
            article
        })
    });
}
/* FIN METODO PARA CONSULTAR UN ARTICULO */

/* METODO PARA ELIMINAR UN ARTICULO */
const delete_article = (req, res) => {
    let id = req.params.id;

    Article.findByIdAndDelete(id, (error, article) => {
        if(error || !article) {
            data = errorData(500, 'Error al eliminar el articulo!');
            return res.status(data.code).json(data);
        }

        return res.status(200).json({
            status: "success",
            article
        });
    });
}
/* FIN METODO PARA ELIMINAR UN ARTICULO */

/* METODO PARA ACTUALIZAR UN ARTICULO */
const update = (req, res) => {
    // Recoger id del articulo a editar
    let id = req.params.id;

    // recoger datos del body
    let params = req.body;

    // Validar los datos
    try {
        articleValidator(params);
    } catch(error) {
        data = errorData(400, 'Faltan datos por enviar');
        return res.status(data.code).json(data);
    }

    Article.findByIdAndUpdate(id, params, {new: true}, (error, article) => {
        if (error || !article) {
            data = errorData(500, 'No se encontro el articulo a actualizar function');
            return res.status(data.code).json(data);
        }

        return res.status(200).json({
            status: "success",
            article
        });
    });
}
/* FIN METODO PARA ACTUALIZAR UN ARTICULO */

/* METODO PARA SUBIR UN FICHERO */
const upload = (req, res) => {
    // Recoger el fichero de imagen subido
    if(!req.file && !req.files) {
        data = errorData(400, 'Petición invalida!');
        return res.status(data.code).json(data);
    }

    // Nombre del archivo
    let filename = req.file.originalname;

    // Extension del archivo
    let filename_split = filename.split('\.');
    let extension = filename_split[1];

    // Comprobar extension correcta
    if (extension != 'png' && extension != 'jpg' && extension != 'jpeg' && extension != 'gif') {
        // Eliminar archivo y dar respuesta
        fs.unlink(req.file.path, (error) => {
            data = errorData(400, 'Imagen invalida!');
            return res.status(data.code).json(data);
        });
    } else {
        // Si todo va bien, actualizar articulo
        let id = req.params.id;

        Article.findByIdAndUpdate(id, {image: req.file.filename}, {new: true}, (error, article) =>{
            if (error || !article) {
                data = errorData(500, 'Error al actualizar el articulo!');
                return res.status(data.code).json(data);
            }

            // Devolver respuesta
            return res.status(200).json({
                status: "success",
                article,
                file: req.file
            });
        });
    }
}

const image = (req, res) => {
    let file = req.params.file;
    let file_path = `./images/articles/${file}`;

    fs.stat(file_path, (error, exist) =>{
        if (error || !exist) {
            data = errorData(404, 'La imagen no existe');
            data.path = file_path;
            data.file = file;
            return res.status(data.code).json(data);
        }

        return res.sendFile(path.resolve(file_path));
    });
}

const search= (req, res) => {
    // ? Obtener string de busqueada
    let key = req.params.key;

    // Find OR
    Article.find({"$or": [
        {title: {"$regex": key, "$options": "i"}},
        {content: {"$regex": key, "$options": "i"}}
    ]})
    .sort({'date': -1})
    .exec((error, articles) => {
        if (error || !articles || articles.length < 1) {
            data = errorData(404, 'No hay articulos coincidentes!');
            return res.status(data.code).json(data);
        }

        return res.status(200).json({
            status: "success",
            articles
        });
    });
}

module.exports = {
    test,
    course,
    create,
    list,
    detail,
    update,
    delete_article,
    upload,
    image,
    search
}