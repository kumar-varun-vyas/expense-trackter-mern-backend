const express = require('express')
require('dotenv').config();;
const app = express()
const usersRoute = require("./routes/users/usersRouts")
const accountsRoute = require('./routes/accounts/accountsRoute')
const transactionsRoute = require('./routes/transactions/transactionsRoutes')
const incomeRoute = require('./routes/income/incomeRoutes')
const globalErrHandler = require('./middlewares/globalErrHandler')
require('./config/dbConnect')
const cors = require('cors')


const PORT = process.env.PORT || 8080

//middlewares
app.use(express.json())
app.use(cors())
app.use('/api/v1/users', usersRoute)
app.use("/api/v1/accounts", accountsRoute)
app.use("/api/v1/transactions", transactionsRoute)
app.use("/api/v1/incomes", incomeRoute)




//error handler

app.use(globalErrHandler)
//listen app

app.listen(PORT, () => {
    console.log('express is running on port ', PORT)
})