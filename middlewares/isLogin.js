const { appErr } = require("../utils/appErr")
const getToken = require("../utils/getToken")
const verifyToken = require("../utils/verifyToken")

const isLogin = (req, res, next) => {
    //get token
    const token = getToken(req)
    //verify token
    const decodedUser = verifyToken(token)
    console.log("token", decodedUser)

    req.user = decodedUser.id

    if (!decodedUser) {
        return next(appErr("Invalid/expired Token, Please login again", 401))
    }

    next()

}

module.exports = isLogin