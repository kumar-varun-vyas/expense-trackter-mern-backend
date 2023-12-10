const Account = require("../../model/Account")
const User = require("../../model/User")
const { appErr } = require("../../utils/appErr")


const accountCreate = async (req, res, next) => {
    const { name, accountType, initialBalance, notes } = req.body
    try {
        //find the login user
        const userFound = await User.findById(req.user)
        if (!userFound) {
            return next(appErr("user not found", 401))
        }
        //create account
        const acc = await Account.create({
            name,
            accountType,
            initialBalance,
            notes,
            createdBy: req.user

        })

        // push in accounts
        userFound.accounts.push(acc._id)
        // resave 
        userFound.save()
        res.json(
            {
                status: "success",
                data: acc
            }
        )

    } catch (err) {
        return next(appErr(err.message))
    }
}

const getSingleAccount = async (req, res, next) => {
    try {
        // const page = req.query.page || 1
        // const ITEM_PER_PAGE = 5
        // const skip = (page - 1) * ITEM_PER_PAGE
        let totalIncome = 0
        let totalExpense = 0
        let totalBalance = 0
        const { id } = req.params
        const count = await Account.countDocuments()

        const accFound = await Account.findById(id).populate(
            {
                path: 'transactions',
                options: {
                    sort: {
                        'createdAt': -1
                    }
                }
            }
        );

        // console.log("count-----", accdata)

        accFound?.transactions?.forEach((v) => {
            if (v?.transactionType == "Income") {
                totalIncome += v.amount ? v.amount : 0
            }
            if (v?.transactionType == "Expenses") {
                totalExpense += v.amount ? v.amount : 0
            }

        })
        totalBalance = totalIncome - totalExpense
        // console.log("v-----", totalBalance, totalIncome, totalExpense)

        if (!accFound) return next(appErr("Account not found"), 400)
        res.json({
            status: "success",
            data: accFound,
            totalBalance,
            totalExpense,
            totalIncome
        })

    } catch (err) {
        next(appErr(err.message, 500))
    }
}

const getAllAccounts = async (req, res, next) => {
    try {

        const acc = await Account.find().populate({
            path: 'transactions',
            options: {
                sort: { 'createdAt': -1 },
            }
        });
        if (!acc) return next(appErr("Account not found"), 400)
        res.json({
            msg: "success",
            data: acc
        })

    } catch (err) {
        next(appErr(err.message, 500))
    }
}

const deleteAccount = async (req, res, next) => {
    try {
        const { id } = req.params
        const acc = await Account.findByIdAndDelete(id)
        if (!acc) return next(appErr("Account not found"), 400)
        res.json({
            status: "success",
            data: null
        })

    } catch (err) {
        next(appErr(err.message, 500))
    }
}

const updateAccount = async (req, res, next) => {
    try {
        const { id } = req.params
        const acc = await Account.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true
        })
        if (!acc) return next(appErr("Account not found"), 400)

        res.json({
            status: "success",
            data: acc
        })

    } catch (err) {
        next(appErr(err.message, 500))
    }
}

module.exports = {
    accountCreate,
    getSingleAccount,
    getAllAccounts,
    deleteAccount,
    updateAccount
}