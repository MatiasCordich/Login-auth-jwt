const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
  res.send({
    data:{ user: req.user}
  })
})

module.exports = router