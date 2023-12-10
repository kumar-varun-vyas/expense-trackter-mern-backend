const User = require('../../model/User')
const Incomes = require('../../model/Incomes')

const addIncome = async (req, res, next) => {
    const { name, amount, category, notes } = req.body
    if (!name || !amount || !category || !notes) {
        res.status(400).json({
            status: "faild",
            error: "All fields are required"
        })
    }
    if (amount <= 0 || amount !== 'number') {
        res.status(400).json({
            status: "faild",
            error: "Amount should be positive number"
        })
    }
    try {
        const userFound = await User.findById(req.user)
        if (!userFound) {
            return next(appErr("User not found", 401))
        }
        const addInc = await Incomes.create({
            name, amount, category, notes, createdBy: req.user
        })
        console.log(name, amount, category, notes, req.user, addInc)
        res.json({
            status: "success",
            data: addInc
        })

    } catch (err) {
        return next(appErr(err))
    }

}

const allIncomes = async (req, res, next) => {
    try {
        const allData = await Incomes.find().sort({ createdAt: -1 })
        res.json({
            status: "success",
            data: allData
        })

    } catch (err) {
        return next(appErr(err))

    }
}

const deleteIncome = async (req, res, next) => {
    const { id } = req.params
    try {
        await Incomes.findByIdAndDelete(id)
        res.json({
            status: "success",
            massage: "deleted successfully!"
        })

    } catch (err) {
        return next(appErr(err))

    }
}

module.exports = {
    addIncome,
    allIncomes,
    deleteIncome
}