

const devError = (err, res) => {
    res.status(err.statusCode).json(
        {
            status: err.statusCode,
            message: err.message,
            stack: err.stack,
            error: err
        }
    )
}


const prodError = (err, res) => {


    if (err.isOperational) {
        res.status(err.statusCode).json(
            {
                status: err.statusCode,
                message: err.message,

            }
        )
    } else {
        res.status(500).json(
            {
                status: 500,
                message: 'something went wrong',

            })
    }
}




module.exports = (err, req, res, next) => {


    console.log(err)

    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';



    if (process.env.NODE_ENV === 'development') {
        devError(err, res)
    } else if (process.env.NODE_ENV === 'production') {
        prodError(err, res)
    }



}