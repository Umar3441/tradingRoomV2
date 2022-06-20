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
const usdt_coins = require('../models/usdt_coins')

var cron = require('node-cron');
const coins = require('../utils/data')

// const server = 4

// let data = coins.usdtCoins.slice(0, 100)


// if (server === 1) {
//     data = coins.usdtCoins.slice(0, 2)
// } else if (server === 2) {
//     data = coins.usdtCoins.slice(100, 200)
// } else if (server === 3) {
//     data = coins.usdtCoins.slice(200, 300)
// } else if (server === 4) {
//     data = coins.usdtCoins.slice(300, 400)
// }

// console.log(data)





module.exports = async () => {



    let data = await usdt_coins.find({})
    data = data.map(el => el.symbol)

    const timeframes = ['1d', '12h', '6h', '4h', '1h', '30m', '15m', '5m', '3m']

    // const timeframes = ['3m']

    usdt_coins.watch().
        on('change', async (change) => {

            if (change.operationType === 'update') {

                for (let ind = 0; ind < timeframes.length; ind++) {
                    const timeframe = timeframes[ind]
                    console.log(timeframe)
                    let tf = null

                    if (timeframe === '1d') {
                        tf = d1_usdt_data
                    } else if (timeframe === '1h') {
                        tf = h1_usdt_data
                    } else if (timeframe === '4h') {
                        tf = h4_usdt_data
                    } else if (timeframe === '6h') {
                        tf = h6_usdt_data
                    } else if (timeframe === '12h') {
                        tf = h12_usdt_data
                    } else if (timeframe === '1m') {
                        tf = m1_usdt_data
                    } else if (timeframe === '3m') {
                        tf = m3_usdt_data
                    } else if (timeframe === '5m') {
                        tf = m5_usdt_data
                    } else if (timeframe === '15m') {
                        tf = m15_usdt_data
                    } else if (timeframe === '30m') {
                        tf = m30_usdt_data
                    }




                    let deletedCoinPair = await usdt_coins.findByIdAndDelete(change.documentKey._id.toString())
                    let tempData = await usdt_coins.find({})
                    data = tempData.map(el => el.symbol)

                    console.log(data)


                    try {
                        console.log(tf)
                        // if (deletedCoinPair.expired === true) {
                        await tf.deleteOne({ symbol: deletedCoinPair.symbol })
                        // }
                    } catch (error) {
                        console.log(error)
                    }

                }

            }


            if (change.operationType === 'insert') {

                let coinPair = change.fullDocument.symbol


                for (let ind = 0; ind < timeframes.length; ind++) {
                    const timeframe = timeframes[ind]


                    try {
                        await axios.post(`${process.env.base_link}/api/trading-room-v2/data?coinpair=${coinPair}&call=1&timeframe=${timeframe}&limit=1000`)
                    } catch (error) {
                        console.log(error)
                    }

                }
                data.push(coinPair)
            }


        });



    let crontime = '* * * * * *'


    for (let ind = 0; ind < timeframes.length; ind++) {
        const timeframe = timeframes[ind]



        for (let index = 0; index < data.length; index++) {
            const el = data[index];

            let tf = null

            if (timeframe === '1d') {
                tf = d1_usdt_data
            } else if (timeframe === '1h') {
                tf = h1_usdt_data
            } else if (timeframe === '4h') {
                tf = h4_usdt_data
            } else if (timeframe === '6h') {
                tf = h6_usdt_data
            } else if (timeframe === '12h') {
                tf = h12_usdt_data
            } else if (timeframe === '1m') {
                tf = m1_usdt_data
            } else if (timeframe === '3m') {
                tf = m3_usdt_data
            } else if (timeframe === '5m') {
                tf = m5_usdt_data
            } else if (timeframe === '15m') {
                tf = m15_usdt_data
            } else if (timeframe === '30m') {
                tf = m30_usdt_data
            }





            try {

                let exists = await tf.exists({ symbol: el })

                if (exists?._id) {
                    console.log('exists', el)
                } else {
                    await axios.post(`${process.env.base_link}/api/trading-room-v2/data?coinpair=${el}&call=1&timeframe=${timeframe}&limit=1000`)
                }



            } catch (error) {
                console.log(error)
            }
        }






        if (timeframe === '1m') {
            crontime = '5 */1 * * * *'
        } else if (timeframe === '3m') {
            crontime = '30 */3 * * * *'
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




        // cron.schedule(crontime, catchAsync(async () => {
        //     // for (let index = 0; index < data.length; index++) {
        //     // const el = data[index];
        //     let d = []
        //     let tf = null

        //     if (timeframe === '1d') {
        //         tf = d1_usdt_data
        //     } else if (timeframe === '1h') {
        //         tf = h1_usdt_data
        //     } else if (timeframe === '4h') {
        //         tf = h4_usdt_data
        //     } else if (timeframe === '6h') {
        //         tf = h6_usdt_data
        //     } else if (timeframe === '12h') {
        //         tf = h12_usdt_data
        //     } else if (timeframe === '1m') {
        //         tf = m1_usdt_data
        //     } else if (timeframe === '3m') {
        //         tf = m3_usdt_data
        //     } else if (timeframe === '5m') {
        //         tf = m5_usdt_data
        //     } else if (timeframe === '15m') {
        //         tf = m15_usdt_data
        //     } else if (timeframe === '30m') {
        //         tf = m30_usdt_data
        //     }



        //     data.forEach(async (el, index) => {
        //         try {


        //             const results = await axios.get(`https://api.binance.com/api/v3/klines?symbol=${el}&interval=${timeframe}&limit=5`)
        //             let requiredData = results.data.map(
        //                 el => {
        //                     return [el[0].toString(),
        //                     el[1],
        //                     el[2],
        //                     el[3],
        //                     el[4],
        //                     el[5],
        //                     el[6].toString(),
        //                     el[7]]

        //                 }
        //             )
        //             requiredData.pop();

        //             console.log('--->', el)
        //             let previousData = await tf.findOne({ symbol: el }, { data: { $slice: -4 } })

        //             let previousCandels = previousData.data;
        //             let newCandels = requiredData

        //             console.log('previos,', previousCandels.length)
        //             console.log('new,', newCandels.length)

        //             let newCandelsReal = []

        //             let isPresent = false

        //             for (let index = 0; index < newCandels.length; index++) {
        //                 const element = newCandels[index];
        //                 isPresent = false


        //                 for (let ind = 0; ind < previousCandels.length; ind++) {
        //                     const el = previousCandels[ind];
        //                     if (element[6] * 1 === el[6] * 1) {
        //                         isPresent = true;
        //                         break;
        //                     }

        //                 }

        //                 if (isPresent === false) {
        //                     newCandelsReal.push(element);
        //                 }


        //             }

        //             console.log('real', newCandelsReal.length);



        //             d.push({
        //                 symbol: el,
        //                 data: newCandelsReal
        //             }
        //             )
        //             console.log(data.length - 1)
        //             if (d.length > data.length - 1) {
        //                 d.forEach(async element => {
        //                     console.log(element.data[0])
        //                     try {

        //                         element.data.forEach(async el => {

        //                             await tf.updateOne(
        //                                 { symbol: element.symbol },
        //                                 {
        //                                     $push: {
        //                                         data: el
        //                                     }
        //                                 }
        //                             )
        //                         });
        //                     } catch (error) {
        //                         console.log(error)
        //                     }
        //                 });
        //             }



        //         } catch (error) {
        //             console.log(error)
        //         }
        //     });


        //     // }
        // }));




    }





}