const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 3000;
const path = require('path');

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'), function (err) {
    if (err) res.status(500).send(err);
  })
})

io.on('connection', (socket) => {
  console.log('user connected');
  socket.on('messaging', msg => {
    //look at which room this belongs to
    //push msg into db
    io.emit('messaging', msg);
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  })
});
//setup the username
//setup the room
//setup the database

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
