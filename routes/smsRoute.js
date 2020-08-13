const router = require('express').Router()
const { check } = require('express-validator')


const smsActions = require('../controllers/smsController')

const validation = [
    check('email', 'Invalid email address').isEmail(),
    check('password', 'Password not strong enough').isLength({min: 8, max: undefined})
]

router.get('/', smsActions.welcome)
router.post('/login', validation, smsActions.login)
router.post('/register', validation, smsActions.register)

module.exports = router