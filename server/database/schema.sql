DROP TABLE IF EXISTS Users;
CREATE TABLE Users(
  user_id VARCHAR(100) PRIMARY KEY,
  first_name VARCHAR(40) UNIQUE NOT NULL,
  last_name VARCHAR(40) NOT NULL,
  cohort VARCHAR(100) NOT NULL,
  staff VARCHAR(10),
  friends TEXT[],
  profile_pic TEXT NOT NULL UNIQUE,
  last_login TIMESTAMP,
  rooms TEXT[]
--FOREIGN KEY(cohort)
--REFERENCES Cohort(cohort_name),
);
--DROP TABLE IF EXISTS Messages;
--CREATE TABLE Messages AS(
  --created_on TIMESTAMP,
  --user_id INT,
  --first_name VARCHAR(40),
  --profile_pic TEXT,
  --post VARCHAR(1000)
--   --FOREIGN KEY(user_id)
--   --REFERENCES Users(user_id),
  --   --FOREIGN KEY(first_name)
--   --REFERENCES Users(first_name),
  --   --FOREIGN KEY(profile_pic)
--   --REFERENCES Users(profile_pic),
  -- );
DROP TABLE IF EXISTS Rooms;
CREATE TABLE Rooms(
  room_id SERIAL,
  room_name VARCHAR(100),
  messages TEXT[],
  users VARCHAR(100)
);
--CREATE TABLE Cohort(
  --cohort_id SERIAL,
  --cohort_name VARCHAR(100) PRIMARY KEY UNIQUE,
  --users VARCHAR(100)[],
  --rooms Rooms[],
  --messages Messages[],
  -- );
--get room response{ user_id, username, message, profilepic(url), timestamp }
--save to database { user_id, message, timestamp }
--  “{ user_id: 2, first_name: test - dubz, profile_pic: nunya, message: testing 5, 6, timeStamp: now } ”
--on room get messages, room name, users w / user_id / name / picture
--roomname / room_id
--on post message { user_id, message, timestamp, room }