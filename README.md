# AI Customer Support Platform
A full-stack customer support platform built using React, TypeScript, Express, PostgreSQL and Prisma. The application provides seperate customer and support-agent workflows, with AI-assisted features to help analyse tickets and support agents in resolving issues more efficiently.

# Overview
The platform simulates a customer support environment where customers can submit support tickets and support agents can manage, analyse and resolve them.

The project combines a React frontend with a REST API backend and a PostgreSQL relational database managed through Prisma.

# Features
## Authentication and User Management
- User registration and login
- Password hashing using bcrypt
- JWT-based authentication
- Customer and support-agent roles
- Role-based functionality

## Ticket Management
- Create support tickets
- View existing support tickets
- Categorise tickets
- Set ticket priority
- Update ticket status
- Resolve tickets with resolution notes
- Store customer and ticket information in PostgreSQL

## AI-Assisted Support
- Automatic sentiment analysis of support tickets
- Risk-level classification
- AI-generated suggested support replies
- Retrieval of similar previously resolved support cases
- Match scoring for similar solutions

## Database
The application uses PostgreSQL with Prisma as the ORM
The database contains relationships between:
- Users
- Support Tickets
- Ticket messages
Each ticket is associated with a customer and can contain multiple messages and a stored resolution

# Tech Stack
## Frontend 
- React
- TypeScript
- Vite
- HTML/CSS

## Backend
- Node.js
- Express
- TypeScript
- REST API
- JWT
- bcrypt

## Database
- PostgreSQL
- Prisma ORM

## Development Tools
- Git
- Github
- Visual Studio Code

# Prerequisites
Before runnign the application, make sure you have installed:
- Node.js
- PostgreSQL
- Git
You will also need a PostgreSQL database available locally
