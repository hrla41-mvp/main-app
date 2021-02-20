DROP TABLE IF EXISTS Users;
CREATE TABLE Users(
  user_id VARCHAR(100) PRIMARY KEY NOT NULL,
  first_name VARCHAR(40) UNIQUE NOT NULL,
  last_name VARCHAR(40) NOT NULL,
  cohort VARCHAR(100) NOT NULL,
  staff BOOLEAN,
  friends TEXT[],
  profile_pic VARCHAR(250) NOT NULL,
  last_login VARCHAR(100),
  rooms TEXT[]
);
-- let's try this
-- DROP TYPE IF EXISTS Messages;
-- CREATE TYPE Messages AS(
--   created_on TIMESTAMP,
--   user_id INT,
--   first_name VARCHAR(40),
--   profile_pic TEXT,
--   post VARCHAR(1000)
--   -- FOREIGN KEY (user_id)
--   --     REFERENCES Users (user_id),
--   -- FOREIGN KEY (first_name)
--   --     REFERENCES Users (first_name),
--   -- FOREIGN KEY (profile_pic)
--   --     REFERENCES Users (profile_pic),
-- );

DROP TABLE IF EXISTS Rooms;
CREATE TABLE Rooms(
  room_id SERIAL NOT NULL,
  room_name VARCHAR(100) UNIQUE,
  messages TEXT[],
  users TEXT[]
);


-- insert into rooms (room_name) values ('HEllO');
-- insert into rooms (room_name) values ('ROOMID');
-- INSERT INTO ROOMS (room_name, messages, users) VALUES ('ROOMID', '{hello people}', '{bépo, auie}');
-- INSERT INTO ROOMS (room_name, messages, users) VALUES ('ROOMID', '{hello people}', '{bépo, auie}');


-- DROP TABLE IF EXISTS passwords;
-- CREATE TABLE passwords(
--   id INT,
--   passwrd VARCHAR(100) NOT NULL
-- );

-- CREATE TABLE Cohort(
--   cohort_id SERIAL,
--   cohort_name VARCHAR(100) PRIMARY KEY UNIQUE,
--   users VARCHAR(100)[],
--   rooms Rooms[],
--   messages Messages[],
-- );


--  {
--      "user_id": "whateva",
--      "first_name": "Anthony",
--      "last_name": "Pecillo",
--      "cohort": "hrla25",
--      "staff": "true",
--      "friends": ["none", "sike"],
--      "profile_pic": "Nonejustyet",
--      "rooms": ["FirstRoom", "SecondRoom"]
--  }


-- {
--         "user_id": "whateva",
--         "first_name": "Anthony",
--         "last_name": "Pecillo",
--         "cohort": "hrla25",
--         "staff": "true",
--         "friends": [
--             "none",
--             "sike",
--             "rickRoss"
--         ],
--         "profile_pic": "http:yomama",
--         "last_login": null,
--         "rooms": [
--             "One",
--             "Two",
--             "BuckleMyShoe"
--         ]
--     }