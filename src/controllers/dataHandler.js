const catchAsync = require('../utils/catchAsync')
const axios = require('axios')
const d1_data = require('../models/d1_data')
const h1_data = require('../models/h1_data')
const h4_data = require('../models/h4_data')
const h6_data = require('../models/h6_data')
const h12_data = require('../models/h12_data')
const m1_data = require('../models/m1_data')
const m3_data = require('../models/m3_data')
const m5_data = require('../models/m5_data')
const m15_data = require('../models/m15_data')
const m30_data = require('../models/m30_data')

exports.dataHandler = async (req, res, next) => {
    const query = req.query
    console.log(query.coinpair)

    if (query.call === '1') {
        try {
            const results = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${query.coinpair}&interval=${query.timeframe}&limit=${query.limit * 1}`)
            const requiredData = results.data.map(
                el => {
                    return {
                        openTime: el[0],
                        open: el[1],
                        high: el[2],
                        low: el[3],
                        close: el[4],
                        volume: el[5],
                        closeTime: el[6],
                        QuoteAssetvolume: el[7]
                    }
                }
            )


            requiredData.pop()


            const finalObject = {
                symbol: query.coinpair,
                data: requiredData
            }

            let tf = null

            if (query.timeframe === '1d') {
                tf = new d1_data(finalObject)
            } else if (query.timeframe === '1h') {
                tf = new h1_data(finalObject)
            } else if (query.timeframe === '4h') {
                tf = new h4_data(finalObject)
            } else if (query.timeframe === '6h') {
                tf = new h6_data(finalObject)
            } else if (query.timeframe === '12h') {
                tf = new h12_data(finalObject)
            } else if (query.timeframe === '1m') {
                tf = new m1_data(finalObject)
            } else if (query.timeframe === '3m') {
                tf = new m3_data(finalObject)
            } else if (query.timeframe === '5m') {
                tf = new m5_data(finalObject)
            } else if (query.timeframe === '15m') {
                tf = new m15_data(finalObject)
            } else if (query.timeframe === '30m') {
                tf = new m30_data(finalObject)
            }



            await tf.save()

            res.send('success')
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    } else {

        try {



            const results = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${query.coinpair}&interval=${query.timeframe}&limit=${query.limit * 1}`)

            const requiredData = results.data.map(
                el => {
                    return {
                        openTime: el[0],
                        open: el[1],
                        high: el[2],
                        low: el[3],
                        close: el[4],
                        volume: el[5],
                        closeTime: el[6],
                        QuoteAssetvolume: el[7]
                    }
                }
            )









            let tf = null

            if (query.timeframe === '1d') {
                tf = d1_data
            } else if (query.timeframe === '1h') {
                tf = h1_data
            } else if (query.timeframe === '4h') {
                tf = h4_data
            } else if (query.timeframe === '6h') {
                tf = h6_data
            } else if (query.timeframe === '12h') {
                tf = h12_data
            } else if (query.timeframe === '1m') {
                tf = m1_data
            } else if (query.timeframe === '3m') {
                tf = m3_data
            } else if (query.timeframe === '5m') {
                tf = m5_data
            } else if (query.timeframe === '15m') {
                tf = m15_data
            } else if (query.timeframe === '30m') {
                tf = m30_data
            }


            requiredData.pop();




            const previousCandels = await tf.findOne({ symbol: query.coinpair })

            let tempPreviousData = previousCandels.data[previousCandels.data.length - 1]

            const isSame = requiredData[0].closeTime === tempPreviousData.closeTime

            if (isSame) {
                requiredData.shift()
            }


            await tf.updateOne(
                { symbol: query.coinpair },
                {
                    $addToSet: {
                        data: requiredData
                    }
                }
            )




            res.send('success 1')
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }


}