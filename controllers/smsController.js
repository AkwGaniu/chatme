const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt')
const userModel = require('../models/chatAppModel')

module.exports.welcome = (req, resp, next) => {
    userModel.find({}, {password: false}, (error, data) => {
        if (error) next(error)
        resp.status(200).json(data)
    })
}

module.exports.register = async (req, resp, next) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            resp.status(422).json({ errors: errors.array()})
        } else {
           if (req.body.nickName === '' && req.body.name === '') {
                resp.status(422).json({ errors: 'Your name or nick name is missing'})
            } else {
                const saltRounds = 10;
                bcrypt.hash(req.body.password, saltRounds)
                .then((hash)  => {
                    const newUser = new userModel({
                        names: req.body.names,
                        nickName: req.body.nickName,
                        email: req.body.email,
                        password: hash                
                    })

                    newUser.save((err, data) =>{
                        if (err) next(err)
                        resp.status(200).json('success')
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
                resp.status(200).json('welcome')
            } else {
                return resp.status(401).json({'error': 'Invalid Password'})
            }
        }
    } catch (error) {
        next(error)
    }
}