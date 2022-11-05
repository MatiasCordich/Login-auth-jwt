const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { schemaRegister, schemaLogin } = require('../helpers/validation_schema')

const registerUser = async (req, res) => {

  try {

    // Voy a crear dos tipos de validaciones

    // La primera validacion es en base al schemaRegister

    const { error } = schemaRegister.validate(req.body)

    if (error) {
      return res.status(400).send({
        error: error.details[0].message
      })
    }

    // La segunda validacion es que no haya un email repetido

    const { name, email, password } = req.body

    const user = await User.findOne({ email: email })

    if (user) {
      return res.status(400).send({ msg: "Email existente" })
    }

    // Si paso todas las validaciones entoncnes se crea el nuevo usuario


    // Primero hasheamos la contraseña (encriptar contraseña)

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)


    // Despues creamos el nuevo usuario con la contraseña encriptada
    const newUser = new User({
      name: name,
      email: email,
      password: hashedPassword
    })

    // Guardamos el usuario en la DB

    await newUser.save()

    res.send({ msg: "Te has registrado exitosamente", data: newUser })

  } catch (error) {
    return res.status(500).send({ msg: error.message })
  }

}



const loginUser = async (req, res) => {
  try {

    const { email, password, name } = req.body

    // Voy a crear tres tipos de validaciones

    // La primera validacion es en base al schemaLogin

    const { error } = schemaLogin.validate(req.body)

    if (error) {
      return res.status(400).send({
        error: error.details[0].message
      })
    }

    // La segunda validacion es si el usuario existe o no

    const user = await User.findOne({email: email})

    if (!user) {
      return res.status(400).send({ error: "Usuario no econtrado"})
    }

    // La tercera validacion es en base a la contraseña si coincide o no con la que envio en base a la guarda en la DB

    const validPassword = await bcrypt.compare(password, user.password)

    if(!validPassword){
      return res.status(400).send({ error: "Contraseña incorrecta"})
    }

    // Si paso todas las validaciones

    // Creamos el token

    const payload = {
      id: user._id,
      name: user.name,
    }

    const token = jwt.sign(payload, process.env.TOKEN_SECRET)

    res.header('token', token).send({data: `Bienvenido/a ${user.name}`, token})

  } catch (error) {
    return res.status(400).send({ msg: error.message })
  }
}

module.exports = {
  registerUser,
  loginUser
}