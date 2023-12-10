const express = require('express')
const { addIncome, allIncomes, deleteIncome } = require('../../controller/incomes/incomesCtrlr')
const isLogin = require('../../middlewares/isLogin')
const incomeRoutes = express.Router()

incomeRoutes.post('/addIncome', isLogin, addIncome)
incomeRoutes.get('/allIncomes', allIncomes)
incomeRoutes.delete('/:id', deleteIncome)

module.exports = incomeRoutes