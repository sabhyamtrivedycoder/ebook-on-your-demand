import { Router } from 'express';
import { db } from '../db.js';

const router = Router();

/**
 * Get all books or user-filtered books
 */
router.get('/', (req, res) => {
  const { userId } = req.query;
  const books = db.getBooks(userId);
  res.json({ success: true, books });
});

/**
 * Get book by ID
 */
router.get('/:id', (req, res) => {
  const book = db.findBookById(req.params.id);
  if (!book) {
    return res.status(404).json({ error: 'Book not found' });
  }
  res.json({ success: true, book });
});

/**
 * Save or Update a Book
 */
router.post('/', (req, res) => {
  try {
    const bookData = req.body;
    if (!bookData.title) {
      return res.status(400).json({ error: 'Book title required' });
    }

    const saved = db.saveBook({
      id: bookData.id || `book-${Date.now()}`,
      title: bookData.title,
      subtitle: bookData.subtitle || '',
      synopsis: bookData.synopsis || '',
      author: bookData.author || 'Sabhyam Trivedy',
      genre: bookData.genre || 'General',
      tone: bookData.tone || 'Inspirational',
      language: bookData.language || 'English',
      modelUsed: bookData.modelUsed || 'Antigravity Neural Writer',
      chapters: bookData.chapters || [],
      coverPreset: bookData.coverPreset || 'royal-indigo',
      userId: bookData.userId || 'guest',
      createdAt: bookData.createdAt || new Date().toISOString()
    });

    res.status(201).json({ success: true, book: saved });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save book' });
  }
});

export default router;
