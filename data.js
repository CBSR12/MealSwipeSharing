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

const event = mongoose.model("events", donationSchema)

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    password:{
        type:String,
        required:true
    }
})

const users = mongoose.model("user", userSchema)

module.exports = {event, users}



