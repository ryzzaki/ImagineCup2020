## Connecting a PostgreSQL DB and Redis

Configure the DB and Redis in the .env file for your own development server. Copy variables from the .env-example.

## Follow the in place design pattern

Each module does its own thing (i.e. Booking Module processes only booking related tasks, cohesive private functions, etc..).

## Follow the pre-set structure... even if it's not ideal

Every module has its own DTO (Data Transfer Object) and Entity. Modules have the following structure:

1.  Controller - request handler
2.  Service - business logic
3.  Repository - database related logic

Make use of private functions within classes to avoid code repetition. Aim for high readability.

## Use Classes and not Interfaces for DTOs and validate them

All DTOs are defined in classes as it is recommended by NestJS. Validation logic is done using Class Validation Decorators and preferably performed on the level of DTOs.

## Use Validation Pipes

Use Validation Pipes or make your own custom pipes wherever and whenever it is necessary.

## Commands to create a new module and its controllers and services

IMPORTANT: Do not forget to include the same module-name when generating in @nest-cli. This automatically adds controllers and services to the "module-name.module.ts" file for us.

```bash
# nest generate new modules
$ nest g module module-name

# nest generate new controller
$ nest g controller module-name

# nest generate new controller without test files
$ nest g controller module-name --no-spec

# nest generate new service
$ nest g service module-name

# nest generate new service without test files
$ nest g service module-name --no-spec
```

## Make your own branch for every new feature

Seriously. Make a new branch and edit your code there. Once you're done, ensure that your changes are properly tested and run all the unit tests. Afterwards, get a Code Review and if your changes are approved, then your branch will be merged with master.

## Example of a Structure

```bash
└── src
    └── module-name
        ├── dto
        |   └── something.dto.ts
        ├── pipes
        |   └── custom-pipe.pipe.ts
        ├── entities
        |   └── module-name.entity.ts
        ├── repositories
        |   └── module-name.repository.ts
        ├── module-name.module.ts
        ├── module-name.service.ts
        └── module-name.controller.ts
```

# Configuration for .env

```bash
# Server setup
PORT=3000
COOKIE_SECRET=
REFRESH_TOKEN_AGE=

# Database setup
DB_HOST=
DB_PORT=
DB_NAME=
DB_USERNAME=
DB_PASSWORD=
# Set this to true in development mode
DB_SYNCHRONIZE=

# Redis setup
RDS_HOST=
RDS_PORT=
RDS_DB=
RDS_PASSWORD=

# Facebook passport strategy configuration
FACEBOOK_ID=
FACEBOOK_SECRET=

# Google passport strategy configuration
GOOGLE_ID=
GOOGLE_SECRET=

# JWT Secrets
ACCESS_JWT_PUBLIC=
ACCESS_JWT_PRIVATE=
REFRESH_JWT_PUBLIC=
REFRESH_JWT_PRIVATE=

# RS256 or SHA256
JWT_HASHING_ALGORITHM=

# Azure
AZURE_ROUTE_MATRIX=

#FireBase
FIREBASE_ADMIN=
```

## Versions

```bash
Node v10.16.0
Nest 6.5.0
Redis 5.0.5
PostgreSQL 11.4
pgAdmin 4 / TablePlus
```

## Deployment

Not deployed yet. No CI/CD integrated.
