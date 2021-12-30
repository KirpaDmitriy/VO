DROP TABLE IF EXISTS ROOMS;
DROP TABLE IF EXISTS USERS;
DROP TABLE IF EXISTS MESSAGES;
DROP TABLE IF EXISTS DORMS;
DROP TABLE IF EXISTS LIKES;

CREATE TABLE IF NOT EXISTS ROOMS (
    ID INTEGER AUTO_INCREMENT PRIMARY KEY,
    NUMBER VARCHAR(10) NOT NULL,
    NAME VARCHAR(20),
    DESCRIPTION VARCHAR(1000),
    RATE INTEGER DEFAULT 0,
    DORM INTEGER NOT NULL,
    AVA VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS USERS (
                                     VKID INTEGER PRIMARY KEY,
                                     DORM INTEGER NOT NULL,
                                     ROOM INTEGER NOT NULL,
                                     FIRSTNAME VARCHAR(15),
                                     LASTNAME VARCHAR(15),
                                     AVA VARCHAR(500)
);

CREATE TABLE IF NOT EXISTS MESSAGES (
                                     ID INTEGER AUTO_INCREMENT PRIMARY KEY,
                                     CONTENT VARCHAR(1000) NOT NULL,
                                     SOURCE INTEGER NOT NULL,
                                     DESTINATION INTEGER NOT NULL,
                                     DIRECTION INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS DORMS (
                                        ID INTEGER AUTO_INCREMENT PRIMARY KEY,
                                        NAME VARCHAR(20) NOT NULL,
                                        DESCRIPTION VARCHAR(1000) NOT NULL
);

CREATE TABLE IF NOT EXISTS LIKES (
                                     ID INTEGER AUTO_INCREMENT PRIMARY KEY,
                                     USERID INTEGER NOT NULL,
                                     ROOMID INTEGER NOT NULL
);