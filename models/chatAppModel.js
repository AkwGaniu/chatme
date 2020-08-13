const mongoose = require('mongoose')

const userModel = new mongoose.Schema({
    names: {
        type: String,
        required: true
    },
    nickName: {
        type: String,
        required: true
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


module.exports = mongoose.model('users', userModel)