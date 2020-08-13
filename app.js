const express = require('express')
const bodyParser = require('body-parser')
const http = require('http')
const mongoose = require('mongoose')
const dotenv = require('dotenv')

const smsRoute = require('./routes/smsRoute') 

const app = express()
dotenv.config()
app.use(express.static('./assets/'))

app.set('view engine', 'ejs')

mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if (err) throw(err)
    console.log('We are connected')
})

app.use((req, resp, next) => {
    resp.header('Access-Control-Allow-Origin', '*')
    resp.header('Access-Control-Allow-Methods', 'POST, GET, PUT, DELETE')
    resp.header('Access-Control-Allow-headers', 'Content-type, Accept, x-access-token, x-key')

    if(req.method === 'OPTIONS') {
        resp.status(200).end()
    } else {
        next()
    }
})

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/', smsRoute)

app.get('/chat', (req, res) => {
    res.sendFile(__dirname+ '/views/index.html')
})
app.get('/chat_room', (req, res) => {
    res.sendFile(__dirname+ '/views/chatRoom.html')
})
app.use((req, resp, next) => {
    resp.render('404')
    next()
})

app.use((error, req, resp, next) => {
    resp.status(error.status || 500)
    resp.json({
        status: error.status,
        message: error.message,
        stack: error.stack
    })
})

const server = http.createServer(app)
const io = require('socket.io')(server)

io.on('connection', (socket) => {
    socket.emit('connection')

    socket.broadcast.emit('new', 'A new user has joined the chat')

    socket.on('chat', (msg) =>{
        socket.broadcast.emit('message', msg)
    })

    socket.on('typing', (msg) => {
        socket.broadcast.emit('userTyping', `${msg} is typing...`)
    })
    socket.on('finish', (msg) => {
        socket.broadcast.emit('userStoppedTyping', msg)
    })
})

let port = process.env.PORT || 3000
server.listen(port, ()=> {
    console.log(`We are up at port ${port}`)
})