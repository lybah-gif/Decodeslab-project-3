// SERVER.JS - PRISMA 5 (With Frontend)

const express = require('express');
const { PrismaClient } = require('@prisma/client');
const cors = require('cors');
require('dotenv').config();

//Prisma 5 tareeqa - Simple initialization
const prisma = new PrismaClient();
const app = express();
const PORT = 3000;

// MIDDLEWARE

app.use(cors());
app.use(express.json());

app.use(express.static('public'));

// HEALTH CHECK

app.get('/api/health', async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ status: 'Server & Database connected!' });
  } catch (error) {
    res.status(500).json({ 
      status: 'Database error', 
      error: error.message 
    });
  }
});

// CREATE - Book add karein (POST)

app.post('/api/books', async (req, res) => {
  try {
    const { title, author, year, genre } = req.body;

    // Validation
    if (!title || !author || !year || !genre) {
      return res.status(400).json({
        error: 'Please provide: title, author, year, genre'
      });
    }

    if (year < 1000 || year > 2026) {
      return res.status(400).json({
        error: 'Year must be between 1000 and 2026'
      });
    }

    // Database mein save
    const newBook = await prisma.book.create({
      data: {
        title: title.trim(),
        author: author.trim(),
        year: parseInt(year),
        genre: genre.trim()
      }
    });

    res.status(201).json({
      success: true,
      message: 'Book added successfully!',
      data: newBook
    });

  } catch (error) {
    if (error.code === 'P2002') {
      return res.status(409).json({
        error: 'This book already exists!'
      });
    }
    console.error('Create error:', error);
    res.status(500).json({
      error: 'Failed to add book',
      details: error.message
    });
  }
});

// READ ALL - Saari books (GET)

app.get('/api/books', async (req, res) => {
  try {
    const books = await prisma.book.findMany({
      orderBy: { title: 'asc' }
    });

    res.json({
      success: true,
      count: books.length,
      data: books
    });

  } catch (error) {
    console.error('Read error:', error);
    res.status(500).json({
      error: 'Failed to fetch books',
      details: error.message
    });
  }
});

// READ ONE - Ek book by ID (GET)

app.get('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const book = await prisma.book.findUnique({
      where: { id: parseInt(id) }
    });

    if (!book) {
      return res.status(404).json({ error: 'Book not found' });
    }

    res.json({ success: true, data: book });

  } catch (error) {
    console.error('Read one error:', error);
    res.status(500).json({
      error: 'Failed to fetch book',
      details: error.message
    });
  }
});


//UPDATE - Book update (PUT)

app.put('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, author, year, genre } = req.body;

    const existingBook = await prisma.book.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    const updatedBook = await prisma.book.update({
      where: { id: parseInt(id) },
      data: {
        title: title || existingBook.title,
        author: author || existingBook.author,
        year: year ? parseInt(year) : existingBook.year,
        genre: genre || existingBook.genre
      }
    });

    res.json({
      success: true,
      message: 'Book updated successfully!',
      data: updatedBook
    });

  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      error: 'Failed to update book',
      details: error.message
    });
  }
});

// DELETE - Book delete (DELETE)

app.delete('/api/books/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const existingBook = await prisma.book.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingBook) {
      return res.status(404).json({ error: 'Book not found' });
    }

    await prisma.book.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Book deleted successfully!'
    });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      error: 'Failed to delete book',
      details: error.message
    });
  }
});

// SERVER START

app.listen(PORT, () => {
  console.log('=================================');
  console.log('Book Library API is Running!');
  console.log('=================================');
  console.log(`URL: http://localhost:${PORT}`);
  console.log(`Books: http://localhost:${PORT}/api/books`);
  console.log(`Frontend: http://localhost:${PORT}`);
  console.log(`Database: http://localhost/phpmyadmin`);
  console.log('=================================');
  console.log('Press CTRL+C to stop server');
  console.log('=================================');
});

// Server band karne par database connection close
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('\n Server stopped');
  process.exit(0);
});