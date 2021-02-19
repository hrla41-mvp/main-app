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
    var room = room_name.replace(/[\/\(\)\']/g, "&apos;");
    const query = `INSERT INTO Rooms (room_name, messages, users) VALUES('${room}', '{}', '{${users}}');`
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
    var final_string = post.replace(/[\/\(\)\']/g, "&apos;");
    const text = `{user_id: ${user_id}, first_name: ${first_name}, last_name: ${last_name}, profile_pic: ${profile_pic}, message: ${final_string}}`

    const query = `UPDATE Rooms SET messages = array_append(messages, '${text}') WHERE room_id = '${newMessage}';`
    const newPost = await pool.query(query);
    res.json(query.rows)
  } catch (err) {
    console.error(err.message)
  }
});

//GETS ALL ROOMS
app.get('/slackreactor/rooms', async (req, res) => {
  try {
    const product = await pool.query(`SELECT * FROM Rooms LIMIT 10`);
    let returner = JSON.stringify(product.rows).replace(/(&apos;)/g, "'");
    res.json(JSON.parse(returner));
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
    // const {user_id, cohort, friends, staff, first_name, last_name, profile_pic, rooms, last_login} = req.body;
    const { room_name, users } = req.body;
    const user_id = req.body.user_id;
    const cohort = req.body.cohort;
    const friends = req.body.friends;
    const staff = req.body.staff;
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const profile_pic = req.body.profile_pic;
    const rooms = req.body.rooms;
    const last_login = req.body.last_login;

    const query = `INSERT INTO Users (user_id, cohort, friends, staff, first_name, last_name, profile_pic, last_login, rooms) VALUES('${user_id}', '${cohort}', '{${friends}}', '${staff}', '${first_name}', '${last_name}', '${profile_pic}','${last_login}', '{${rooms}}');`

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
app.get('/slackreactor/user/:id', async (req, res) => {
  try {
    console.log('userId ', req.params)
    const product = await pool.query(`SELECT * FROM Users WHERE user_id = '${req.params.id}'`);
    res.json(product.rows)
  } catch (err) {
    console.error(err.message)
  }
});

 //This function retrieves a specific room from the database
 const getRoom = (room) => {

  const text = `SELECT * FROM Rooms WHERE room_name = '${room}'`
  const newPost = pool.query(query)
    .catch(err => (console.log(err)))
}

  //This function adds messages from a room into a database
  const addMessageToRoom = (room, message) => {

    var final_string = message.message.replace(/[\/\(\)\']/g, "&apos;");
    const text = `{user_id: ${message.user_id}, first_name: ${message.first_name}, last_name: ${message.last_name}, profile_pic: ${message.profile_pic}, message: ${final_string}, timestamp: ${message.timestamp}}`
    const query = `UPDATE Rooms SET messages = array_append(messages, '${text}') WHERE room_name = '${room}';`
    const newPost = pool.query(query)
      .catch(err => (console.log(err)))
  }

  const addRoomtoUser = (room, user_id) => {
        const query = `UPDATE Users SET rooms = array_append(rooms, '${room}') WHERE user_id = '${user_id}'`
        const dbQuery = pool.query(query)
          .catch(err => console.log(err));
  }

  //this function adds rooms to a database
  const addRoomtoDB = (roomName, username) => {
    //if exists, and user is not within users, add user to room
      //if exists, and user is in users, do nothing
      //else create room
      const query = `INSERT INTO Rooms (room_name, messages, users) VALUES('${roomName}', '{}', '{${username}}') ON CONFLICT (room_name) DO UPDATE SET users = array_append(Rooms.users, '${username}');`

      const dbQuery = pool.query(query)
        .catch(err => (console.log(err)))
  }

  //this function adds users to a room - to be implemented already on front end

  //this function adds friends to a user


let roomRecords = {};

io.on('connection', (socket) => {

  const formatToSend = (connectedUsersList) => {
    var formattedUsers = [];
    for (var key in connectedUsersList) {
      var obj = {};
      obj['user'] = connectedUsersList[key];
      obj['status'] = 'online';
      obj['id'] = key;
      formattedUsers.push(obj);
    }
    return formattedUsers;
  };

  const joinRoom = (room, user) => {
    socket.join(room);

    if (!roomRecords[room]) roomRecords[room] = {};
    if (!roomRecords[room][socket.id]) roomRecords[room][socket.id] = user;
    io.to(room).emit('userWelcome',
      {
        newUser: {
          user: roomRecords[room][socket.id],
          status: 'online',
          id: socket.id
        },
        connectedUsersList: formatToSend(roomRecords[room])
      });
    console.log(roomRecords);
    socket.room = room;
    socket.nickname = user;
  }

  const leaveRoom = (room) => {
    delete roomRecords[socket.room][socket.id]
    socket.leave(room);
    io.to(room).emit('disconnection', { connectedUsersList: formatToSend(roomRecords[room]) });
  }

  socket.on('room', ({ room, user }) => {
    console.log('user connected');
    joinRoom(room, user);
  });

  socket.on('message', ({ room, message }) => {
    io.to(room).emit('message', message);
    console.log(message.message)
    addMessageToRoom(room, message);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    if (!!socket.room) leaveRoom(socket.room);
  })

  socket.on('swapRoom', ({ oldRoom, newRoom, username, user_id }) => {
    leaveRoom(oldRoom);
    joinRoom(newRoom, socket.nickname);
    addRoomtoUser(newRoom, user_id);
  });

});


http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

