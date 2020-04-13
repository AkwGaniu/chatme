const mongoose = require('mongoose')

const userModel = new mongoose.Schema({
    fname: {
        type: String,
        required: true
    },
    lname: {
        type: String,
        default: null
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        lenght: 200,
    }
})


module.exports = mongoose.model('userModel', userModel)