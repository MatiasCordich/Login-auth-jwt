const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const verifyToken = require('./helpers/validation_token')
const cors = require('cors')
require('dotenv').config()


// Configuracion de las rutas
const authRoutes = require('./routes/auth')
const dashboardRoutes = require('./routes/dashboard')

const app = express()

// URI para conectarse a la base de dato

const Uri = `mongodb+srv://root:${process.env.PASSWORD}@login.upisykl.mongodb.net/?retryWrites=true&w=majority`

// Los options

const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true
}

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200
}

// Conectarse a la DB
mongoose.connect(Uri, options)
  .then(() => console.log("Conectado a la DB"))
  .catch( e => console.log('Error DB ' + e))


app.use(bodyparser.urlencoded({extended: false}))
app.use(bodyparser.json())
app.use(cors(corsOptions))

// Configuarion de las rutas

app.use('/api/user', authRoutes)
app.use('/api/dashboard', verifyToken, dashboardRoutes )
app.get('/', (req, res) => {res.send({mensaje: "Server rendering"})})


const PORT = process.env.PORT || 9000

app.listen(PORT, () => {
  console.log("Server is running...")
})