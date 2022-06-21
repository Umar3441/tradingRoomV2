const catchAsync = require('../utils/catchAsync')
const axios = require('axios')
const d1_usdt_data = require('../models/d1_usdt_data')
const h1_usdt_data = require('../models/h1_usdt_data')
const h4_usdt_data = require('../models/h4_usdt_data')
const h6_usdt_data = require('../models/h6_usdt_data')
const h12_usdt_data = require('../models/h12_usdt_data')
const m1_usdt_data = require('../models/m1_usdt_data')
const m3_usdt_data = require('../models/m3_usdt_data')
const m5_usdt_data = require('../models/m5_usdt_data')
const m15_usdt_data = require('../models/m15_usdt_data')
const m30_usdt_data = require('../models/m30_usdt_data')



exports.dataHandler = async (req, res, next) => {
    const query = req.query
    console.log(query.coinpair, " : ", query.endTime)
    if (query.call === '1') {
        try {
            const results = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${query.coinpair}&interval=${query.timeframe}&endTime=${query.endTime * 1}&limit=${query.limit * 1}`)
            const requiredData = results.data.map(
                el => {
                    return [el[0].toString(),
                    el[1],
                    el[2],
                    el[3],
                    el[4],
                    el[5],
                    el[6].toString(),
                    el[7]]
                }
            )


            requiredData.pop()


            const finalObject = {
                symbol: query.coinpair,
                data: requiredData
            }

            // console.log(finalObject)

            let tf = null

            if (query.timeframe === '1d') {
                tf = new d1_usdt_data(finalObject)
            } else if (query.timeframe === '1h') {
                tf = new h1_usdt_data(finalObject)
            } else if (query.timeframe === '4h') {
                tf = new h4_usdt_data(finalObject)
            } else if (query.timeframe === '6h') {
                tf = new h6_usdt_data(finalObject)
            } else if (query.timeframe === '12h') {
                tf = new h12_usdt_data(finalObject)
            } else if (query.timeframe === '1m') {
                tf = new m1_usdt_data(finalObject)
            } else if (query.timeframe === '3m') {
                tf = new m3_usdt_data(finalObject)
            } else if (query.timeframe === '5m') {
                tf = new m5_usdt_data(finalObject)
            } else if (query.timeframe === '15m') {
                tf = new m15_usdt_data(finalObject)
            } else if (query.timeframe === '30m') {
                tf = new m30_usdt_data(finalObject)
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

            let requiredData = results.data.map(
                el => {
                    return [el[0].toString(),
                    el[1],
                    el[2],
                    el[3],
                    el[4],
                    el[5],
                    el[6].toString(),
                    el[7]]

                }
            )

            let tf = null

            // if (query.timeframe === '1d') {
            //     tf = d1_usdt_data
            // } else if (query.timeframe === '1h') {
            //     tf = h1_usdt_data
            // } else if (query.timeframe === '4h') {
            //     tf = h4_usdt_data
            // } else if (query.timeframe === '6h') {
            //     tf = h6_usdt_data
            // } else if (query.timeframe === '12h') {
            //     tf = h12_usdt_data
            // } else if (query.timeframe === '1m') {
            //     tf = m1_usdt_data
            // } else if (query.timeframe === '3m') {
            //     tf = m3_usdt_data
            // } else if (query.timeframe === '5m') {
            //     tf = m5_usdt_data
            // } else if (query.timeframe === '15m') {
            //     tf = m15_usdt_data
            // } else if (query.timeframe === '30m') {
            //     tf = m30_usdt_data
            // }







            // requiredData.pop();

            // console.log(requiredData)


            // const previousCandels = await tf.findOne({ symbol: query.coinpair }, { data: { $slice: -3 } })

            // let tempPreviousData = previousCandels.data[previousCandels.data.length - 1]

            // const isSame = requiredData[0][6] * 1 === tempPreviousData[6] * 1

            // if (isSame) {
            //     requiredData.shift()
            // }



            requiredData.forEach(async element => {
                try {
                    await tf.updateOne(
                        { symbol: query.coinpair },
                        {
                            $push: {
                                data: element
                            }
                        }
                    )
                } catch (error) {
                    console.log(error)
                }

            })







            res.send('success')
        } catch (error) {
            console.log(error)
            res.send(error)
        }
    }


}