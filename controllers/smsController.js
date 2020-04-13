const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt')
const userModel = require('../models/chatAppModel')

module.exports.welcome = (req, res, next) => {
    
    res.render("index")
}

module.exports.register = async (req, resp, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            resp.status(422).json({ errors: errors.array()})
        } else {
            if (req.body.password !== req.body.passConfirm) {
                resp.status(422).json({ errors: 'password confirm field does not match'})
            } else if (req.body.fname === '' && req.body.lname === '') {
                resp.status(422).json({ errors: 'Please provide your name'})
            } else {

                const saltRounds = 10;
                bcrypt.hash(req.body.password, saltRounds)
                .then((hash)  => {
                    console.log(hash)
                    const newUser = new userModel({
                        lname: req.body.lname,
                        fname: req.body.fname,
                        nickName: req.body.nickName,
                        email: req.body.email,
                        password: hash                
                    })

                    newUser.save((err, data) =>{
                        if (err) next(err)
                        console.log(data)
                        resp.render('login')
                    })
                })
            }
        }
    } catch (error) {
        next(error)
    }
}

module.exports.login = async (req, resp, next) => {
    try {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            resp.status(224).json({'errors': errors.array()})
        } else {
            let user = await userModel.findOne({email: req.body.email})
            if (!user) return resp.status(401).json('Account not found')
            
            const match = await bcrypt.compare(req.body.password, user.password)
            
            if (match) {
                resp.staus(200).json(user)
            } else {
                return resp.status(401).json('Invalid Password')
            }
        }
    } catch (error) {
        next(error)
    }
}