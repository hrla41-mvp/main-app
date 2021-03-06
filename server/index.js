const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = 3000;
const path = require('path');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const pool = require('../DB/index.js');
const upload = require('./s3Model.js');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const uuid = require('uuid').v4;
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
const axios = require('axios');

//ADDS A ROOM TO DATABASE
app.post('/slackreactor/rooms', async (req, res) => {
  try {
    const { room_name, users } = req.body;
    var room = room_name.replace(/[\/\(\)\']/g, "&apos;");
    const query = `INSERT INTO Rooms (room_name, messages, users) VALUES('${room}', '{}', '{${users}}') RETURNING room_name, messages, users, room_id;`
    const newMessage = await pool.query(query);
    res.json(newMessage.rows)
  } catch (err) {
    console.error(err.message)
  }
});


// UPLOAD IMAGE FILE
app.post('/slackreactor/upload', upload.array('profilePic'), (req, res) => {
  // res.json({ status: 'OK', uploaded: req.files.length });
  res.status(200).send(req.files[0].location);
})

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
    const product = await pool.query(`SELECT * FROM Rooms`);
    let returner = JSON.stringify(product.rows).replace(/(&apos;)/g, "'");
    res.json(JSON.parse(returner));
  } catch (err) {
    console.error(err.message)
  }
});
//GETS CERTAIN ROOMS MESSAGES

app.get('/slackreactor/rooms/:room', async (req, res) => {
  try {
    console.log(req.params)
    const product = await pool.query(`SELECT * FROM Rooms WHERE room_name = '${req.params.room}'`);
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
  // TBN THIS METHOD OVERWRITES ALL PREVIOUSLY RECORDED ROOMS OF THE USER
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
  // TBN THIS METHOD OVERWRITES ALL PREVIOUSLY RECORDED FRIENDS OF THE USER
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
  // TBN THIS METHOD OVERWRITES ALL OTHER DETAILS OF THE USER
  try {
    const column = Object.keys(req.body)

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

app.get('/slackreactor/rooms/:room', async (req, res) => {
  try {
    const room = await pool.query(`SELECT * FROM Rooms WHERE room_name = '${req.params.room}'`);
    res.json(room.rows)
  } catch (err) {
    console.error(err.message)
  }
})

// ADD ROOM TO USER IN DB
app.put('/slackreactor/addRoomToUser/:id', (req, res) => {
  const query = `UPDATE Users SET rooms = array_append(rooms, '${req.body.rooms}') WHERE user_id = '${req.params.id}'`
  return pool.query(query)
    .then((dbResponse) => res.status(200).send(dbResponse))
    .catch(err => res.status(404).send(err));
});

// ADD USER TO ROOM IN DB
app.put('/slackreactor/addUserToRoom/:room_name', async (req, res) => {
  const query = `UPDATE Rooms SET users = array_append(users, '${req.body.username}') WHERE room_name = '${req.params.room_name}' RETURNING room_name, messages, users, room_id`
  //
  return await pool.query(query)
    .then((dbResponse) => res.status(200).send(dbResponse))
    .catch(err => res.status(404).send(err));
});

//ADD USER TO ROOM ON SIGN UP
app.put('/slackreactor/addUserToRoomOnSignUp/:room_name', async (req, res) => {

  let query = `UPDATE Rooms SET users = array_append(users, '${req.body.username}') WHERE room_name = 'Hack Reactor' RETURNING room_name, messages, users, room_id`;
  let query1 = `UPDATE Rooms SET users = array_append(users, '${req.body.username}') WHERE room_name = '${req.params.room_name}' RETURNING room_name, messages, users, room_id`;
  // Scenario when they are not in cohort
  if (req.params.room_name !== 'None') {
    return await pool.query(query)
    .then((dbResponse) => res.status(200).send(dbResponse))
    .catch(err => res.status(404).send(err));
  } else {
    // Scenario when they are in a cohort
    return await pool.query(query)
    .then(() => {
      pool.query(query1)
        .then((dbResponse) => res.status(200).send(dbResponse))
    })
    .catch(err => res.status(404).send(err));
  }

    // .then((dbResponse) => res.status(200).send(dbResponse))
    // .catch(err => res.status(404).send(err));
});

//RETRIEVES ALL OF THE USERS FOR A PARTICULAR ROOM
app.get(`/slackreactor/roomUsers/:room`, async (req, res) => {
  console.log(req.params)
  try {
    const product = await pool.query(`SELECT * FROM Users WHERE rooms && '{${req.params.room}}'::text[];`);
    res.json(product.rows)
  } catch (err) {
    console.error(err.message)
  }
});

//This function adds messages from a room into a database
const addMessageToRoom = (room, message) => {

  var final_string = message.message.replace(/[\/\(\)\']/g, "&apos;");
  const text = `{user_id: ${message.user_id}, first_name: ${message.first_name}, last_name: ${message.last_name}, profile_pic: ${message.profile_pic}, message: ${final_string}, timestamp: ${message.timestamp}}`
  const query = `UPDATE Rooms SET messages = array_append(messages, '${text}') WHERE room_name = '${room}';`
  const newPost = pool.query(query)
    .catch(err => (console.log(err)))
}

// USE OF THIS FUNCTION IS DEPRECATED:
// THIS iS NOW HANDLED BY POST REQUEST ON FRONT END
const addRoomtoUser = (room, user_id) => {
  const query = `UPDATE Users SET rooms = array_append(rooms, '${room}') WHERE user_id = '${user_id}'`
  return pool.query(query)
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
        // connectedUsersList: formatToSend(roomRecords[room])
        connectedUsersList: Object.values(roomRecords[room])
      });
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
    // console.log(room, message);
    io.to(room).emit('message', message);
    addMessageToRoom(room, message);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    if (!!socket.room) leaveRoom(socket.room);
  })

  socket.on('swapRoom', ({ oldRoom, newRoom, username, user_id }) => {
    leaveRoom(oldRoom);
    joinRoom(newRoom, socket.nickname);
  });

});

http.listen(port, () => {
  console.log(`Socket.IO server running at http://localhost:${port}/`);
});

