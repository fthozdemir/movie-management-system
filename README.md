# Movie Management System

## Table of Contents

- [Movie Management System](#movie-management-system)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Docker](#docker)
    - [Steps](#steps)
  - [Scripts](#scripts)
    - [Build](#build)
    - [Start](#start)
    - [Docs](#docs)
    - [Code Quality](#code-quality)
  - [Database Commands](#database-commands)
  - [Testing](#testing)
  - [Features](#features)
  - [Decisions](#decisions)
  - [Challenges](#challenges)
  - [Nice If It Had Been Done](#nice-if-it-had-been-done)

## Installation

### Prerequisites

- Node.js (v18.12.x or higher)
- MySQL (tested v10.4.27)
- Prisma ORM
- NestJS CLI
- pnpm (v9.4.0 or higher)

### Docker

Set up environment variables by creating a production `.env` file in the root directory.
set the DATABASE_URL according to `.env` docker-compose.yml _use db:3306 instead of localhost:3306_ for docker-compose

```bash
docker-compose up --build
```

### Steps

1. Install the dependencies:

   ```bash
   pnpm install
   ```

2. Set up environment variables by creating a `.env` file in the root directory:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your database credentials and other necessary configurations.

3. Set up test environment variables by creating a `.env.test` file in the root directory:

   ```bash
   cp .env.example .env.test
   ```

   Update the `.env` file with your database credentials and other necessary configurations.**Important:Test DATABASE_URL must be different than development or production**

   Test database will be created automaticly during tests, no need to be generate manually

4. Generate Prisma Client:

   ```bash
   pnpm db:generate
   ```

5. Push your Prisma schema to the database:

   ```bash
   pnpm db:push
   ```

## Scripts

Here is a list of available commands for development and production.

### Build

- **Build the project**:

  ```bash
  pnpm build
  ```

  This will compile the TypeScript code into JavaScript.

### Start

- **Start the server**:

  ```bash
  pnpm start
  ```

  This will start the NestJS server.

- **Start in development mode** (with live-reload):

  ```bash
  pnpm run dev
  ```

- **Start in production mode**:

  ```bash
  pnpm run start:prod
  ```

### Docs

while application is running go [http://localhost:3000/docs](http://localhost:3000/docs).

### Code Quality

- **Lint the project** (and automatically fix errors):

  ```bash
  pnpm lint
  ```

## Database Commands

- **Generate Prisma Client**:

  ```bash
  pnpm db:generate
  ```

- **Push schema changes to the database**:

  ```bash
  pnpm db:push
  ```

## Testing

The project is configured with Jest for unit and end-to-end testing.

- **Run all unit tests**:

  ```bash
  pnpm test
  ```

- **Run end-to-end tests**:

  ```bash
  pnpm test:e2e
  ```

## Features

- **General**
  - Customizable error filters
  - Custom logger
  - env paramaters validation
  - Separate Prisma database process logger
- **Authantication**
  - Body object validation
  - Unique username check
  - JWT tokens (accessToken validation JWT, as an improvement, the token could be taken from the .env file. For now, it is hardcoded for 1 hour)
  - Role and auth guards
  - Used Prisma middleware to remove the password
- **Movie Sessions**
  - Sorting, ordering, and pagination in listing all movies
  - Bulk session adding to a movie.
  - If a movie is scheduled at a specific time, timeSlot, and room, no other movie can be scheduled for that session
  - Except for listing movies, all features can only be used by MANAGER
  - Proper validators are used for the body when creating a session
  - Deleting a movie also deletes its related sessions and the tickets purchased for those sessions.
  - The room numbers for a session can range from 0 to maxRoomNumber, which is assigned to a variable.
- **Ticketing**
  - Customers can only view and manage tickets related to themselves, and watch the movies they purchased tickets for.
  - Customers can cancel their tickets if they haven’t watched the movie. The session for that ticket becomes available again.
  - Managers can cancel any ticket
  - Only one ticket can be purchased for a single session.
  - Age restrictions are only checked when buying a ticket. Purchased tickets can still be watched regardless of the restriction.
- **Testing**
  - testler için 2 ayrı config mevcuttur. ayrı ayrı test kkomutları çağırılır

## Decisions

- I wanted to store all necessary user information (except the password) in the JWT token. This way, there's no need to query the database for the user on each request.

- All actions except Register and Login require the user to be logged in.
- A movie can be created without an assigned session. After a movie is created, bulk sessions can be added to it. Deleting or modifying sessions is done one by one to prevent user errors, which is why this method was preferred.
- In the database, TimeSlot and UserType are stored as enums. I'm aware this is not the best practice, and it would be better to store them as separate tables. However, enums were used to accelerate the implementation for this case.
- To keep the structure simple, each ticket has an isWatched flag. The watch history is handled by checking this flag. For this reason, a separate history table was not created.
- Instead of deleting a movie, marking it as inactive could have been another solution. This way, users wouldn't lose their watch history.
- There are few comments in the code. Effort was made to ensure that the code explains itself. Clean code principles were followed as much as possible.

## Challenges

- Due to time constraints, I couldn't implement the interface and inheritance structure I had in mind. NestJS pushed me more towards working directly with classes.
- Bulk adding and deleting movies could have been done in the same way as bulk session adding. After showing that this could be done, I couldn't fully implement it for movies due to time limitations.
- Tests could have been written better.

## Nice If It Had Been Done

- Password-protected access for Swagger
- Better permission control with useAbility
- If the viewer age restriction for a movie is increased, tickets for users who do not meet the age requirement could have been canceled
- Prevent creating sessions for past dates
- When a user registers, a token could have been returned immediately, so they wouldn’t have to log in again.
