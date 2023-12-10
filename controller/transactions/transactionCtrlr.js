const User = require("../../model/User")
const Account = require("../../model/Account")
const Transaction = require("../../model/Transaction")
const { appErr } = require("../../utils/appErr")
const mongoose = require('mongoose')


const createTransaction = async (req, res, next) => {
    const { name, transactionType, account, amount, category, notes } = req.body
    try {
        const userFound = await User.findById(req.user)
        if (!userFound) {
            return next(appErr("User not found", 401))
        }
        const accFound = await Account.findById(account)
        if (!accFound) {
            return next(appErr("Account not found", 401))
        }
        const transaction = await Transaction.create({
            createdBy: req.user,
            name,
            transactionType,
            account,
            amount,
            category,
            notes
        })

        accFound.transactions.push(transaction._id)
        await accFound.save()

        res.json({
            status: "success",
            data: transaction
        })

    } catch (err) {
        return next(appErr(err))
    }
}

const getAllTransaction = async (req, res, next) => {
    try {
        const tr = await Transaction.find();
        if (!tr) return next(appErr("Transaction not found"), 400)
        res.json({
            msg: "success",
            data: tr
        })

    } catch (err) {
        next(appErr(err.message, 500))
    }
}

const getSingleTransaction = async (req, res, next) => {
    try {
        const { id } = req.params
        console.log(id)
        const tr = await Transaction.findById(id);
        if (!tr) return next(appErr("Transaction not found"), 400)
        res.json({
            status: "success",
            data: tr
        })

    } catch (err) {
        next(appErr(err.message, 500))
    }
}

const updateTransaction = async (req, res, next) => {
    try {
        const { id } = req.params
        const tr = await Transaction.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        })
        if (!tr) return next(appErr("Transaction not found"), 400)

        res.json({
            status: "success",
            data: tr
        })

    } catch (err) {
        next(appErr(err.message, 500))
    }
}

const deleteTransaction = async (req, res, next) => {
    try {
        const { id } = req.params
        const acc = await Transaction.findByIdAndDelete(id)
        if (!acc) return next(appErr("Transaction not found"), 400)
        res.json({
            status: "success",
            data: null
        })

    } catch (err) {
        next(appErr(err.message, 500))
    }
}

const transactionsByAc = async (req, res, next) => {
    try {
        let { id } = req.params
        const page = req.query.page || 1
        const ITEM_PER_PAGE = 5
        const skip = (page - 1) * ITEM_PER_PAGE
        console.log(skip)

        id = new mongoose.Types.ObjectId(id)
        const count = await Transaction.countDocuments({ "account": id })
        const trs = await Transaction.aggregate(
            [
                { $match: { "account": id } },
                { $sort: { 'createdAt': -1 } },
                { $skip: skip },
                { $limit: ITEM_PER_PAGE }
            ]
        )
        const pagecount = Math.ceil(count / ITEM_PER_PAGE)
        if (!trs) return next(appErr("Transaction not found"), 400)
        res.json({
            status: "success",
            data: trs,
            pagination: {
                count: count,
                pagecount: pagecount
            }
        })

    } catch (err) {
        next(appErr(err.message, 500))
    }
}


module.exports = {
    createTransaction,
    getAllTransaction,
    getSingleTransaction,
    updateTransaction,
    deleteTransaction,
    transactionsByAc
}