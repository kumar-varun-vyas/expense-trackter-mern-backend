
const mongoose = require('mongoose')

const IncomesSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        maxLength: 50,
    },

    amount: {
        type: Number,
        required: true,
        default: 0
    },
    category: {
        type: String,
        required: true
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

const Incomes = mongoose.model("Incomes", IncomesSchema)

module.exports = Incomes;