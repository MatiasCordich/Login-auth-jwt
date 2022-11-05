const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
    // Exstraigo el token que tengo el header
    const token = req.header('token')

    // Valido si existe o no el token

    if (!token) {
        return res.status(400).send({ error: "Acceso denegado" })
    }

    // Valido si el token es valido o no

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        next()
    } catch (error) {
        res.status(400).send({ error: "Token invalido" })
    }
}

module.exports = verifyToken