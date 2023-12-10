const jwt = require("jsonwebtoken")

const genrateToken = (id) => {
    return jwt.sign({ id }, "anykey", { expiresIn: "1h" });

}

module.exports = genrateToken