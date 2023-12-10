const express = require('express')
const { accountCreate, getSingleAccount, getAllAccounts, deleteAccount, updateAccount } = require('../../controller/accounts/accountCtrlr')
const isLogin = require('../../middlewares/isLogin')

const accountsRoute = express.Router()


accountsRoute.post('/', isLogin, accountCreate)

accountsRoute.get('/:id', getSingleAccount)

accountsRoute.get('/', isLogin, getAllAccounts)

accountsRoute.delete('/:id', deleteAccount)

accountsRoute.put('/:id', updateAccount)

module.exports = accountsRoute