const bcrypt = require("bcryptjs")
const User = require("../../model/User")
const { AppErr, appErr } = require("../../utils/appErr")
const genrateToken = require("../../utils/genrateToken")



const userRegister = async (req, res, next) => {
    const { fullname, email, password } = req.body
    try {
        //check if user exist
        const userFound = await User.findOne({ email })
        if (userFound) {
            next(new Error("User alredy exist"))
        }
        //check feilds empty
        if (!fullname || !email || !password) {
            next(new Error("All fields are required"))
        }

        // hash password
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)
        // create user
        const user = await User.create({
            fullname,
            email,
            password: hashPassword
        })
        res.json({
            status: "success",
            fullname: user.fullname,
            email: user.email,
            id: user._id,

        })

    } catch (err) {
        next(appErr(err, 500))
    }
}

const userLogin = async (req, res, next) => {
    const { email, password } = req.body
    try {
        if (!email || !password) {
            return next(appErr("All fields are required", 400))
        }

        //check email 
        const userFound = await User.findOne({ email })
        if (!userFound) {
            return next(appErr("Invalid login credentials", 400))
        }

        const matchPassword = await bcrypt.compare(password, userFound.password)
        // next(new Error("Invalid login credentials"))
        //  return res.json({ message: "Invalid login credentials" })
        if (!matchPassword) return next(new Error("Invalid login credentials"))
        //check password

        res.json({
            status: "success",
            fullname: userFound.fullname,
            email: userFound.email,
            id: userFound._id,
            token: genrateToken(userFound._id)
        })


    } catch (err) {
        next(appErr(err, 500))
    }
}

const userProfile = async (req, res) => {
    // const result = verifyToken(
    //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0Y2VhYjJjN2M4NzJlYjJlMzc5YWUzMSIsImlhdCI6MTY5MTMzMjczMywiZXhwIjoxNjkxMzM2MzMzfQ.AZLXsKGmBGZySkNOT80SIX9eF02TSd5eRfOCdnZdoU8"
    // )
    try {
        let totalIncome = 0
        let totalExpense = 0
        let totalBalance = 0

        const user = await User.findById(req.user).populate({
            path: "accounts",
            options: { sort: { 'createdAt': -1 } },
            populate: {
                path: "transactions",
                model: "Transaction",
                options: { sort: { 'createdAt': -1 } },
            }
        })

        user?.accounts?.forEach((v) => {

            v?.transactions?.forEach((tr) => {
                console.log(tr)
                if (tr?.transactionType == "Income") {
                    totalIncome += tr.amount ? tr.amount : 0
                }
                if (tr?.transactionType == "Expenses") {
                    totalExpense += tr.amount ? tr.amount : 0
                }
            })



        })

        totalBalance = totalIncome - totalExpense
        console.log("v----", totalBalance, totalIncome, totalExpense)
        // console.log('profile--', user)

        res.json(
            {
                status: "success",
                data: user,
                totalBalance,
                totalExpense,
                totalIncome
            })

    } catch (err) {
        next(appErr(err, 500))
    }
}

const userDelete = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.user)

        res.json({
            status: "success",
            msg: 'User has been deleted'
        })

    } catch (err) {
        next(appErr(err, 500))
    }
}

const userProfileUpdate = async (req, res, next) => {
    const { email, password } = req.body
    try {
        //check if email exist
        const emailFound = await User.find({ email })
        console.log(emailFound)
        if (email && emailFound) { return next(appErr("Email is taken", 400)) }
        if (password) {
            console.log(password)

            const salt = await bcrypt.genSalt(10)
            const hashPassword = await bcrypt.hash(password, salt)
            const user = await User.findByIdAndUpdate(req.user, {
                password: hashPassword
            }, {
                new: true,
                runValidators: true
            })
            res.status(200).json({
                status: "successs",
                msg: "password updated successfully"
            })
        }
        const user = await User.findByIdAndUpdate(req.user, req.body, {
            new: true,
            runValidators: true
        })
        res.status(200).json({
            status: "successs",
            data: user
        })

    } catch (err) {
        next(appErr(err, 500))
    }
}

module.exports = {
    userRegister,
    userLogin,
    userProfile,
    userDelete,
    userProfileUpdate
}