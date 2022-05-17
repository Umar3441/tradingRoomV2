const express = require('express')
const { dataHandler } = require('../controllers/dataHandler')

const Router = express.Router();

Router.post('/', dataHandler)


module.exports = Router