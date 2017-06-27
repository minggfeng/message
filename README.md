# message

Chat microservice for pledgeit

## Team

- Ming Feng
- Ali Elgiadi
- Oliver Ullman
- Kriz Cortes

## Roadmap

View the project roadmap [here](https://docs.google.com/document/d/1Uc6yfhYeWaZFlB6Q7AkCwsTridQs7q7b_kHSwMbx0tY/edit)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

# Table of Contents

1. [Usage](#usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-system-dependecies)
1. [Database Initialization](#database-initialization)
1. [Running the App](#running-the-app)

## Usage

Ensure client has same domain and port for socket.IO to sync.

## Requirements

- Node 6.9.x
- Redis 3.2.x
- Postgresql 9.6.x
- Bookshelf
- Knex
- Docker
- Socket.IO

## Development

### Installing System Dependencies

```
brew install yarn
brew install redis
brew install postgresql
```

## Database Initialization

IMPORTANT: reusing Database on hrsf75-thesis repo.

## Running the App

To run server: `yarn run start`

To run redis: `yarn run redis`
