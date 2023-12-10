
const mongoose = require('mongoose')

const dbConnect = async () => {
    const dbString = process.env.DATABASE
    try {
        await mongoose.connect(`${dbString}`);
        console.log("DB Connection Successfully")
    } catch (err) {
        console.log("DB Connection failed", err.message)
        process.exit(1)
    }
}

dbConnect()