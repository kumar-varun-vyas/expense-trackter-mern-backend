const express = require('express')
const { createTransaction, getAllTransaction, getSingleTransaction, updateTransaction, deleteTransaction, transactionsByAc
} = require('../../controller/transactions/transactionCtrlr')
const isLogin = require('../../middlewares/isLogin')

const transactionsRoute = express.Router()


transactionsRoute.post('/', isLogin, createTransaction)

transactionsRoute.get('/', getAllTransaction)

transactionsRoute.get('/:id', getSingleTransaction)

transactionsRoute.put('/:id', updateTransaction)

transactionsRoute.delete('/:id', deleteTransaction)

transactionsRoute.get('/all-ac-transactions/:id', transactionsByAc)


module.exports = transactionsRoute