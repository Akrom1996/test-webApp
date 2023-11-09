## Installation

```bash
$ npm install
```

## Create docker image

```bash
# To run postgres DB
$ docker-compose up -d
```

## Run server

```bash
# To run server. this will migrate tables and inserts one user in to db
$ npm run start
```

## To check the service
```bash
# Send POST request to localhost:3001/user/withdraw/{userId} with body
{
    "amount": 2
}
```