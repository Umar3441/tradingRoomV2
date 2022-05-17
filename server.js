const express = require('express')
require('dotenv').config()
const mongoose = require('mongoose')
const dataRouter = require('./src/routes/data_router')
const errorHandler = require('./src/controllers/errorController')
const AppError = require('./src/utils/appError')
const updateController = require('./src/controllers/updateController')

const d1_data = require('./src/models/d1_data')


const app = express();
app.use(express.json());

const url = process.env.mongo_link;
const connection = mongoose.connect(process.env.mongo_link).then(
    async () => {
        console.log('connected to database')
        updateController()

    }
).catch(
    (error) => console.log(error)
)


app.use('/api/trading-room-v2/data', dataRouter)



app.all('*', (req, res, next) => {
    const err = new AppError(`Requested url ${req.originalUrl}`, 404)
    next(new AppError(`Requested url ${req.originalUrl}`, 404))
})


app.use(errorHandler)

let port = process.env.port || 5000


app.listen(port, () => {
    console.log('listening')
})



