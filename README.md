SLTS Expense Tracker

A full-stack personal expense tracking application built with React, Spring Boot, Spring Security, JWT authentication, and MySQL. The application allows users to manage income and expenses, view financial summaries, filter transactions by month, and generate reports.

Tech Stack

Frontend

React

Vite

Tailwind CSS

React Router

Axios

Lucide React

jsPDF

Backend

Java 17

Spring Boot

Spring Security

Spring Data JPA

Hibernate

JWT

Maven

Database

MySQL 8.0

Docker

Docker

Docker Compose

Prerequisites

Install the following before running the project locally:

Java 17 or later

Maven

Node.js and npm

MySQL 8.0

Git

Docker Desktop is required if you want to run the backend and MySQL using Docker Compose.

Project Structure

SLTS Expense Tracker/
├── expense-tracker-frontend/
├── expense-tracker-backend/
├── .gitignore
└── README.md

Environment Setup

Backend Environment Variables

Create a local .env file inside:

expense-tracker-backend/.env

Example:

MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_DATABASE=expense_tracker
MYSQL_USER=expense_user
MYSQL_PASSWORD=your_database_password
DB_USERNAME=expense_user
DB_PASSWORD=your_database_password
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=86400000

Do not commit .env to GitHub. It is excluded by .gitignore.

For Docker Compose, these variables are used by the MySQL and Spring Boot services.

Run the Project Locally

Backend

Make sure MySQL 8.0 is running and create the database:

CREATE DATABASE expense_tracker;

Configure the database credentials in:

expense-tracker-backend/src/main/resources/application.properties

Then:

cd expense-tracker-backend
mvn clean install
mvn spring-boot:run

Backend:

http://localhost:8080

Frontend

Open another terminal:

cd expense-tracker-frontend
npm install
npm run dev

Vite normally runs at:

http://localhost:5173

Make sure the frontend API configuration points to the backend URL being used.

Frontend Commands

Install dependencies:

npm install

Development server:

npm run dev

Production build:

npm run build

Lint:

npm run lint

Backend Tests

Navigate to the backend:

cd expense-tracker-backend

Run the backend test suite:

mvn test

Run a complete build including tests:

mvn clean install

Docker / Docker Compose

Make sure Docker Desktop is running.

Navigate to:

cd expense-tracker-backend

Build and start the backend and MySQL:

docker compose up -d --build

Check containers:

docker compose ps

Expected services:

expense-tracker-mysql
expense-tracker-backend

MySQL should be healthy.

Docker Ports

Backend:

http://localhost:18080

MySQL:

localhost:3307

Inside the Docker network, the backend connects to MySQL using:

mysql:3306

Docker Commands

Start:

docker compose up -d

Build and start:

docker compose up -d --build

Stop:

docker compose down

Check status:

docker compose ps

View backend logs:

docker logs expense-tracker-backend --tail 50

View MySQL logs:

docker logs expense-tracker-mysql --tail 50

Application Features

User registration and login

JWT authentication

Dashboard

Income management

Expense management

Add, edit and delete income

Add, edit and delete expenses

Monthly income filtering

Monthly expense filtering

Transaction date validation

Balance calculation

Monthly financial summaries

Reports section

PDF report generation

User profile

Responsive UI

Security Notes

Do not commit sensitive information.

Never commit:

.env
node_modules/
target/
.idea/

Do not expose database passwords, JWT secrets, API keys, or other private credentials.

Development Workflow

Local

Terminal 1:

cd expense-tracker-backend
mvn spring-boot:run

Terminal 2:

cd expense-tracker-frontend
npm install
npm run dev

Docker

cd expense-tracker-backend
docker compose up -d --build

Then start the frontend separately:

cd expense-tracker-frontend
npm install
npm run dev

Verification Checklist

Before submission, verify:

Registration works

Login works

Dashboard works

Income CRUD works

Expense CRUD works

Monthly filters work

Reports work

PDF download works

Backend tests pass with mvn test

Docker Compose starts successfully

MySQL container is healthy

Backend connects to MySQL

.env is not committed

Repository is public

README is included

GitHub Submission

Public repository:

https://github.com/YOUR_USERNAME/slts-expense-tracker

Replace YOUR_USERNAME with the GitHub account that owns the repository.

Assessment Submission

This project is submitted as part of the SLTS Software Developer Take-Home Assessment.

The repository contains the frontend, backend, database integration, backend tests, Docker configuration, Docker Compose configuration, and setup instructions.