# Book Library Management API

A RESTful API to manage book collection with MySQL database.

## Tech Stack
- Node.js + Express.js
- MySQL (XAMPP)
- Prisma ORM

## Features
- Add, View, Update, Delete books (CRUD)
- Data permanently stored in MySQL
- Interactive web interface

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/books` | Get all books |
| GET | `/api/books/:id` | Get single book |
| POST | `/api/books` | Add new book |
| PUT | `/api/books/:id` | Update book |
| DELETE | `/api/books/:id` | Delete book |

## How to Run

### 1. Install Dependencies

npm install

### 2. Setup Database
Start XAMPP MySQL

Create database: book_library (via phpMyAdmin)

Create .env file:

DATABASE_URL="mysql://root:@localhost:3306/book_library"

### 3. Setup Prisma

npx prisma generate
npx prisma db push

### 4. Start Server

npm run dev

### 5. Open Browser

http://localhost:3000

### Example Requests
#### Add a Book

POST /api/books
{
  "title": "Aag Ka Darya",
  "author": "Quratulain Haider",
  "year": 1959,
  "genre": "Urdu Novel"
}
#### Get All Books

GET /api/books

### Database Schema

CREATE TABLE books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    genre VARCHAR(100) NOT NULL,
    UNIQUE KEY unique_book (title, author)
);

### Project Structure

book-library/
├── prisma/schema.prisma
├── public/index.html
├── server.js
├── .env
└── package.json

### Author
Laiba Zahid | Batch 2026 | DecodeLabs
