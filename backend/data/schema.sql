CREATE TABLE
    users (
        username VARCHAR(20) PRIMARY KEY,
        email VARCHAR(40) NOT NULL,
        password VARCHAR(256) NOT NULL
    );

CREATE TABLE
    movies (title VARCHAR(60) PRIMARY KEY);