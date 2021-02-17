const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 3000;
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const pool = require('../DB/index.js');
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
const axios = require('axios');

//ADDS A ROOM TO DATABASE
app.post('/slackreactor/rooms', async (req, res) => {
  try {
    const { room_name, users } = req.body;
    const user_id = req.body.messages[0].user_id;
    const first_name = req.body.messages[0].first_name;
    const last_name = req.body.messages[0].last_name;
    const profile_pic = req.body.messages[0].profile_pic;
    const post = req.body.messages[0].message;

    //this puts the object into an ingestible Postgres form
    const text = `{user_id: ${user_id}, first_name: ${first_name}, last_name: ${last_name}, profile_pic: ${profile_pic}, message: ${post}}`
    const stringified = JSON.stringify(text)

    const query = `INSERT INTO Rooms (room_name, messages, users) VALUES('${room_name}', '{${stringified}}', '{${users}}');`
    const newMessage = await pool.query(query);
    res.json(query.rows)
  } catch (err) {
    console.error(err.message)
  }
});

//UPDATES MESSAGES IN A ROOM
app.put('/slackreactor/rooms/messages:id', async (req, res) => {
  const newMessage = req.params.id
  try {
    const { room_name, users } = req.body;
    const user_id = req.body.user_id;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const profile_pic = req.body.profile_pic;
    const post = req.body.message;

    //this puts the object into an ingestible Postgres form
    const text = `{user_id: ${user_id}, first_name: ${first_name}, last_name: ${last_name}, profile_pic: ${profile_pic}, message: ${post}}`

    const query = `UPDATE Rooms SET messages = array_append(messages, '${text}') WHERE room_id = '${newMessage}';`

    const newPost = await pool.query(query);
    res.json(query.rows)
  } catch (err) {
    console.error(err.message)
  }
});

//UPDATES A ROOM'S USERS
app.put('/slackreactor/rooms/users:id', async (req, res) => {
  const roomToBeUpdated = req.params.id
    try {

      const query = `UPDATE Rooms SET users = array_append(users, '${req.body}' WHERE user_id = '${itemToBeUpdated}'`
      const dbQuery = await pool.query(query);
      res.json(query.rows)
    } catch (err) {
      console.error(err.message)
    }
});

//ADDS NEW USER
app.post('/slackreactor/users', async (req, res) => {
  console.log(req.body)
  try {
    const { room_name, users } = req.body;
    const user_id = req.body.user_id;
    const cohort = req.body.cohort;
    const friends = req.body.friends;
    const staff = req.body.staff;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const profile_pic = req.body.profile_pic;
    const rooms = req.body.rooms;

    const query = `INSERT INTO Users (user_id, cohort, friends, staff, first_name, last_name, profile_pic, rooms) VALUES('${user_id}', '${cohort}', '{${friends}}', '${staff}', '${first_name}', '${last_name}', '${profile_pic}', '{${rooms}}');`

    const newMessage = await pool.query(query);
    res.json(query.rows)
  } catch (err) {
    console.error(err.message)
  }
});

//UPDATES A USER'S DETAILS
app.put('/slackreactor/users/:id', async (req, res) => {
  const itemToBeUpdated = req.params.id
  //if updating a user's rooms:
  if (req.body.rooms) {
    try {
      const body = JSON.stringify(req.body.rooms)
      const formattedBody = body.slice(1, -1);
      const room = '{' + formattedBody + '}'
      const query = `UPDATE Users SET rooms = '${room}' WHERE user_id = '${itemToBeUpdated}'`
      const dbQuery = await pool.query(query);
      res.json(query.rows)
    } catch (err) {
      console.error(err.message)
    }
  }
  //if updating a user's friends:
  if (req.body.friends) {
    try {
      const body = JSON.stringify(req.body.friends)
      const formattedBody = body.slice(1, -1);
      const friends = '{' + formattedBody + '}'
      const query = `UPDATE Users SET friends = '${friends}' WHERE user_id = '${itemToBeUpdated}'`
      const dbQuery = await pool.query(query);
      res.json(query.rows)
    } catch (err) {
      console.error(err.message)
    }
  }
  //for all other user detail updates:
  try {
    const column = Object.keys(req.body)
    console.log(req.body[column])
    console.log(itemToBeUpdated)

    const query = `UPDATE Users SET ${column} = '${req.body[column]}' WHERE user_id = '${itemToBeUpdated}'`
    const dbQuery = await pool.query(query);
    res.json(query.rows)
  } catch (err) {
    console.error(err.message)
  }
});

//RETRIEVES ALL ROOMS
app.get('/slackreactor/rooms', async (req, res) => {
  try {
    const product = await pool.query(`SELECT * FROM Rooms LIMIT 10`);
    res.json(product.rows)
  } catch (err) {
    console.error(err.message)
  }
});

//RETRIEVES ALL USERS
app.get('/slackreactor/users', async (req, res) => {
  try {
    const product = await pool.query(`SELECT * FROM Users LIMIT 10`);
    res.json(product.rows)
  } catch (err) {
    console.error(err.message)
  }
});

app.get(/\/(SignUp|MessageApp|Login)/, (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'public/index.html'), function (err) {
    if (err) res.status(500).send(err);
  })
})

//RETRIEVES A SPECIFIC USER
app.get('/userInfo/:user_id', async (req, res) => {
  try {
    const product = await pool.query(`SELECT * FROM Users WHERE user_id = ${req.params.user_id}`);
    res.json(product.rows)
  } catch (err) {
    console.error(err.message)
  }
});

io.on('connection', (socket) => {

  socket.on('room', ({room, user})=> {
    socket.join(room);
    // update database from here
    // update the id to match the user id in database
    socket.user = {user:user, id:socket.client.conn.id, status: 'online'};
    socket.room = room;
    io.eio.clients.userNames === undefined ?
      io.eio.clients.userNames=[socket.user] :
      io.eio.clients.userNames.push(socket.user);

    io.to(room).emit('userWelcome', { newUser: socket.user, connectedUsersList: io.eio.clients.userNames});
  });

  //FUNCTION HELPERS
  //This function adds messages from a room into a database
  const addMessageToRoom = (room, message) => {
    axios.put(`http://localhost:3000/slackreactor/rooms/${room}`, message)
      .catch(err => {console.log(err)})
  }

  socket.on('message', ({ room, message })=> {
    io.to(room).emit('message', message);
    addMessageToRoom(room, message)
  });

  socket.on('gotKicked', ()=> {
    //update the database
    //broadcast the message to room
  })

  socket.on('disconnect', ()=> {
    io.to(socket.room).emit('disconnection', socket.user)
    // find socket.user in client.userNames & update
    if (io.eio.clients.userNames!==undefined) {
      for (var i = 0; i < io.eio.clients.userNames.length; i++){
        let curPos = io.eio.clients.userNames[i];
        if (curPos.user === socket.user.user && curPos.id === socket.user.id) {
          io.eio.clients.userNames.splice(i, 1);
        }
      }
    }
  })
});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

