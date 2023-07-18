const mongoose = require('mongoose')
const donationSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,

    },
    location: {
        type: String,
        required: true,

    },
    swipes: {
        type: Number,
        required: true,

    }
})

module.exports = mongoose.model("Events", donationSchema)



