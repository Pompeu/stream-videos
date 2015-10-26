'use strict';

const app =  require('express')();
const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', (socket) => {
	console.log('user connect');
  socket.on('send:message', data => {
    console.log(data);
    io.emit('send:message', data);
  });
});

server.listen(1337);
