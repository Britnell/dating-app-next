# A Test fullstack app

## Setup

- next js
- react
- mysql db on railway
- [mysql2](https://www.npmjs.com/package/mysql2) npm package for api points
-

## API

[/create/user](localhost:3000/api/user/create) - creates & returns "random" user
[/profiles?id=%s](localhost:3000/api/user/create?id=1234) - returns matching profiles for a user
[/swipe?user_id=%s&match_id=%s](localhost:3000/api/user/create?id=1234) - a user swipes on a profile (match_id) to enter preference, user_id being logging in user

[/login?email=%s&password=%s](http://localhost:3000/api/login?email=t@g&password=1234) - creates & returns "random" user

## DB mySQL

## User

```
CREATE TABLE User (
    id SERIAL,
    name text,
    email text,
    password text,
    gender text,
    age integer,
    primary key (id)
)
```

## Swipe

```
CREATE TABLE Swipe (
    id SERIAL,
    user_id bigint unsigned,
    match_id bigint unsigned,
    preference text,
    primary key (id),
    FOREIGN KEY (user_id) REFERENCES User(id),
    FOREIGN KEY (match_id) REFERENCES User(id)
)
```

# The front end (react) logic is not particularly nice, it was the simplest quickest way to get the app working, with basic loading
