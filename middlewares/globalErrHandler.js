const globalErrHandler = (err, req, res, next) => {
    //message
    //status
    //statusCode
    //stack

    const statusCode = err.statusCode = err.statusCode || 500
    const message = err.message
    const status = err.status || 'error'
    const stack = err.stack

    console.log("err---", err)
    return res.status(statusCode).json({
        status,
        message,
        stack
    })
}

module.exports = globalErrHandler