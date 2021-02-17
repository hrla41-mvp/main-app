const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 3000;
const path = require('path');

app.use(express.static(path.join(__dirname, '..', 'public')));

app.get(/\/(SignUp|MessageApp|Login)/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'), function (err) {
    if (err) res.status(500).send(err);
  })
})

app.get('/userInfo/:user_id', async (req, res)=> {
  try {
    const product = await pool.query(`SELECT * FROM Users WHERE user_id = ${req.params.user_id}`);
    res.json(product.rows)
  } catch (err) {
    console.error(err.message)
  }
});

app.get('/cohort', async (req, res) => {
  try {
    const product = await pool.query(`SELECT * FROM Rooms LIMIT 10`);
    res.json(product.rows)
  } catch (err) {
    console.error(err.message)
  }
});

io.on('connection', (socket) => {

  socket.on('room', ({room, user})=> {
    socket.join(room);
    // update database from here
    socket.user = user;
    socket.room = room;
    io.eio.clients.userNames === undefined ?
      io.eio.clients.userNames=[user] :
      io.eio.clients.userNames.push(user);
    console.log(io.eio.clients.userNames);

    io.to(room).emit('userWelcome', user.eio)
  });

  socket.on('message', ({ room, message })=> {
    io.to(room).emit('message', message);
  });

  socket.on('gotKicked', ()=> {
    //update the database
    //broadcast the message to room
  })

  socket.on('disconnect', ()=> {
    io.to(socket.room).emit('disconnection', socket.user)
  })
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});
