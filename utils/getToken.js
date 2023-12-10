
const getToken = (req) => {
    const headerObj = req.headers;
    const token = headerObj["authorization"]?.split(" ")[1];
    if (token !== undefined) {
        return token;
    } else {
        return {
            status: "failed",
            message: "There is no token atteched in header"
        }
    }
}

module.exports = getToken