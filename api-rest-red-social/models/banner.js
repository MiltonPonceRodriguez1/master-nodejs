// IMPORTACIÓN DE DEPENDENCIAS
const {Schema, model} = require('mongoose');

const BannerSchema = Schema({
    user: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    text: {
        type: String,
        default: ''
    },
    banner: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = model('Banner', BannerSchema, 'banners');