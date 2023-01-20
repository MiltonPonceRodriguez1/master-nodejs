const validator = require('validator');

const articleValidator = (params) => {
    let title_validator = !validator.isEmpty(params.title) &&
                        validator.isLength(params.title, {min:5, max:undefined});
    let content_validator = !validator.isEmpty(params.content);

    if(!title_validator || !content_validator) {
        throw new Error("No se ha validado la información correctamente");
    }
}

module.exports = {
    articleValidator
}