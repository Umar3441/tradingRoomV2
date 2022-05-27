const catchAsync = require('../utils/catchAsync');
const axios = require('axios');
const schedule = require('node-schedule');

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
}






module.exports = async () => {


    // const timeframes = ['1d', '12h', '6h', '4h', '1h', '30m', '15m', '5m', '3m', '1m']

    const timeframes = ['5m', '3m', '1m']

    let crontime = '* * * * * *'
    let call = '1'
    const query = { timeframe: '4h' }
    let i = 1;

    for (let ind = 0; ind < timeframes.length; ind++) {
        const timeframe = timeframes[ind]

        for (let index = 0; index < data.length; index++) {
            const el = data[index];
            cp = el
            cp = cp.slice(cp.length - 3, cp.length)

            if (timeframe === '1m' && cp === 'BTC') {

            } else {
                try {
                    await axios.post(`${process.env.base_link}/api/trading-room-v2/data?coinpair=${el}&call=1&timeframe=${timeframe}&limit=1000`)
                } catch (error) {
                    console.log(error)
                }
            }

        }




        if (timeframe === '1m') {
            crontime = '1 */1 * * * *'
        } else if (timeframe === '3m') {
            crontime = '6 */3 * * * *'
        } else if (timeframe === '5m') {
            crontime = '12 */5 * * * *'
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
            for (let index = 0; index < data.length; index++) {
                const el = data[index];

                try {
                    await axios.post(`${process.env.base_link}/api/trading-room-v2/data?coinpair=${el}&call=2&timeframe=${timeframe}&limit=3`)
                } catch (error) {
                    console.log(error)
                }
            }
        }));




    }





}