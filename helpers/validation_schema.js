const Joi = require('@hapi/joi')

// Creo el schema para validar los campos del body en el register

const schemaRegister = Joi.object({
    name: Joi.string()
        .min(3)
        .max(255)
        .required(),
    email: Joi.string()
        .min(6)
        .max(255)
        .required(),
    password: Joi.string()
        .min(8)
        .max(1024)
        .required(),
})

// Creo el schema para validar los campos del body en el login

const schemaLogin = Joi.object({
    email: Joi.string().min(6).max(255).required().email(),
    password: Joi.string().min(8).max(1024).required(),
})

module.exports = {
    schemaRegister,
    schemaLogin
}