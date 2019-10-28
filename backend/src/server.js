require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const routes = require('./routes');

const app = express();
const server = require('http').Server(app);

const connectedUsers = {};

const io = require('socket.io')(server);
io.on('connection', socket => {
    const { user } = socket.handshake.query;
    connectedUsers[user] = socket.id;
});

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true
});

app.use((req, res, next)=>{
    req.io = io;
    req.connectedUsers = connectedUsers;
    return next();
})

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333);