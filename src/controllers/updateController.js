const catchAsync = require('../utils/catchAsync');
const axios = require('axios');
const schedule = require('node-schedule');

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

var cron = require('node-cron');
const coins = require('../utils/data')

const server = 1

let data = coins.usdtCoins.slice(0, 100)


if (server === 1) {
    data = coins.usdtCoins.slice(0, 100)
} else if (server === 2) {
    data = coins.usdtCoins.slice(100, 200)
} else if (server === 3) {
    data = coins.usdtCoins.slice(200, 300)
} else if (server === 4) {
    data = coins.usdtCoins.slice(300, 405)
}




console.log(data)

module.exports = async () => {


    // const timeframes = ['1d', '12h', '6h', '4h', '1h', '30m', '15m', '5m', '3m', '1m']

    const timeframes = ['1m',]

    let crontime = '* * * * * *'


    for (let ind = 0; ind < timeframes.length; ind++) {
        const timeframe = timeframes[ind]

        // for (let index = 0; index < data.length; index++) {
        //     const el = data[index];

        //     try {
        //         await axios.post(`${process.env.base_link}/api/trading-room-v2/data?coinpair=${el}&call=1&timeframe=${timeframe}&limit=1000`)
        //     } catch (error) {
        //         console.log(error)
        //     }


        // }




        if (timeframe === '1m') {
            crontime = '1 */1 * * * *'
        } else if (timeframe === '3m') {
            crontime = '6 */3 * * * *'
        } else if (timeframe === '5m') {
            crontime = '55 */5 * * * *'
        } else if (timeframe === '15m') {
            crontime = '18 */15 * * * *'
        } else if (timeframe === '30m') {
            crontime = '45 */30 * * * *'
        } else if (timeframe === '1h') {
            crontime = '1 1 */1 * * *'
        } else if (timeframe === '4h') {
            crontime = '1 5 */4 * * *'
        } else if (timeframe === '6h') {
            crontime = '1 10 */6 * * *'
        } else if (timeframe === '12h') {
            crontime = '1 12 */12 * * *'
        } else if (timeframe === '1d') {
            crontime = '1 1 1 */1 * *'
        }




        cron.schedule(crontime, catchAsync(async () => {
            // for (let index = 0; index < data.length; index++) {
            // const el = data[index];
            let d = []
            data.forEach(async (el, index) => {
                try {
                    // await axios.post(`${process.env.base_link}/api/trading-room-v2/data?coinpair=${el}&call=2&timeframe=${timeframe}&limit=3`)
                    console.log(el)
                    const results = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${el}&interval=${timeframe}&limit=2`)


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

                    requiredData.pop();

                    d.push({
                        symbol: el,
                        data: requiredData
                    }
                    )
                    console.log(d.length)

                    if (d.length > 99) {
                        d.forEach(async (element, index) => {

                            console.log(element.symbol, " : ", index)

                            let requiredData1 = element.data

                            for (let index = 0; index < requiredData1.length; index++) {
                                const elem = requiredData[index];
                                console.log(elem)
                                await m1_usdt_data.updateOne(
                                    { symbol: element.symbol },
                                    {
                                        $push: {
                                            data: elem
                                        }
                                    }
                                )
                            }
                        });
                    }

                } catch (error) {
                    console.log(error)
                }
            });


            // }
        }));




    }





}