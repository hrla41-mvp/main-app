
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

DROP TABLE IF EXISTS Rooms;
CREATE TABLE Rooms(
  room_id SERIAL NOT NULL,
  room_name VARCHAR(100) UNIQUE,
  messages TEXT[],
  users TEXT[]
);

INSERT INTO ROOMS (room_name, messages, users) VALUES ('HRLA41', '{}', '{}');
INSERT INTO ROOMS (room_name, messages, users) VALUES ('HRLA40', '{}', '{}');
INSERT INTO ROOMS (room_name, messages, users) VALUES ('HRLA39', '{}', '{}');
INSERT INTO ROOMS (room_name, messages, users) VALUES ('HRLA38', '{}', '{}');
INSERT INTO ROOMS (room_name, messages, users) VALUES ('HRLA37', '{}', '{}');
INSERT INTO ROOMS (room_name, messages, users) VALUES ('HRLA36', '{}', '{}');
INSERT INTO ROOMS (room_name, messages, users) VALUES ('Hack Reactor', '{}', '{}');