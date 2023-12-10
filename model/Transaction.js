const mongoose = require('mongoose')

const transactionSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    transactionType: {
        type: String,
        enum: [
            "Income", "Expenses"
        ],
        required: true
    },
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        require: true
    },

    amount: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        enum: [
            "Food",
            "Transportaion",
            "Entertainment",
            "Shopping",
            "Utilities",
            "Health",
            "Travel",
            "Education",
            "Personal",
            "Groceries",
            "Bills",
            "Others"
        ],
        required: true
    },
    color: {
        type: String
    },

    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    notes: {
        type: String,
        required: true
    }

}, {
    timestamps: true,
    toJSON: { virtuals: true }
})

const Transaction = mongoose.model("Transaction", transactionSchema)

module.exports = Transaction;