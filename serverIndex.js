// const cookieParser = require("cookie-parser"); //=>> optional cookie parser ?
// const csrf = require("csurf"); //=>> optional protection middleware, to use on top of  the cookie-parser
const bodyParser = require("body-parser");
const express = require("express");
const path = require('path');
// const admin = require("firebase-admin"); //=>> ??


const PORT = process.env.PORT || 3000;
const app = express();

app.use(express.static(path.join(__dirname, '..', 'client/dist')));

app.use(bodyParser.json());
// app.use(cookieParser());
//  app.use(csrfMiddleware);

// app.all("*", (req, res, next) => {
//   res.cookie("XSRF-TOKEN", req.csrfToken());
//   next();
// });

app.get("/login", function (req, res) {
});

app.get("/signup", function (req, res) {
});

app.get("/logout", (req, res) => {
});

app.get("/friends:user_id", (req, res) => {
});

app.get("/profilePage:user_id", function (req, res) {
});

app.get("/roomsList:user_id", (req, res) => {
});

app.post("/feed:room_id", (req, res) => {

});

app.post('/upload', uploadS3.array('profilePic'), (req, res) => {
  // res.json({ status: 'OK', uploaded: req.files.length });
  res.status(200).send(req.files[0].location);
})
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});

// |/login                    |
// |   get & post             |
// |/logout                   |
// |   update token/cookie ?  |
// |/signup                   |
// |/profilePage:user_id      |
// |/roomsList:user_id        |
// |/feed:room_id             |
// |/friends:user_id
