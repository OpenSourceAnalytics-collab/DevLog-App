import express from 'express';
import { body, param, validationResult } from 'express-validator';
import {
  getEntries,
  addEntry,
  deleteEntry,
  updateEntry,
  getEntryById,
  getStatistics,
} from '../utils/storage.js';
import { validateEntryId } from '../utils/validation.js';

const router = express.Router();

// Validation middleware
const validateEntryInput = [
  body('message')
    .trim()
    .notEmpty().withMessage('Message is required')
    .isLength({ max: 10000 }).withMessage('Message exceeds maximum length'),
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array')
    .isLength({ max: 20 }).withMessage('Maximum 20 tags allowed'),
  body('tags.*')
    .optional()
    .trim()
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Invalid tag format'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Category exceeds maximum length')
    .matches(/^[a-zA-Z0-9\s_-]+$/).withMessage('Invalid category format'),
];

const validateEntryUpdate = [
  body('message')
    .optional()
    .trim()
    .notEmpty().withMessage('Message cannot be empty')
    .isLength({ max: 10000 }).withMessage('Message exceeds maximum length'),
  body('tags')
    .optional()
    .isArray().withMessage('Tags must be an array')
    .isLength({ max: 20 }).withMessage('Maximum 20 tags allowed'),
  body('tags.*')
    .optional()
    .trim()
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Invalid tag format'),
  body('category')
    .optional()
    .trim()
    .isLength({ max: 100 }).withMessage('Category exceeds maximum length')
    .matches(/^[a-zA-Z0-9\s_-]+$/).withMessage('Invalid category format'),
];

const validateId = [
  param('id')
    .trim()
    .notEmpty().withMessage('ID is required')
    .matches(/^[a-zA-Z0-9_-]+$/).withMessage('Invalid ID format')
    .isLength({ max: 100 }).withMessage('ID is too long'),
];

// Helper to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Validation Error',
      details: errors.array(),
    });
  }
  next();
};

// GET /api/entries - Get all entries
router.get('/', (req, res, next) => {
  try {
    const entries = getEntries();
    res.json(entries);
  } catch (error) {
    next(error);
  }
});

// GET /api/entries/stats - Get statistics
router.get('/stats', (req, res, next) => {
  try {
    const stats = getStatistics();
    res.json(stats);
  } catch (error) {
    next(error);
  }
});

// GET /api/entries/:id - Get entry by ID
router.get('/:id', validateId, handleValidationErrors, (req, res, next) => {
  try {
    const entry = getEntryById(req.params.id);
    res.json(entry);
  } catch (error) {
    if (error.message === 'Entry not found') {
      return res.status(404).json({ error: 'Entry not found' });
    }
    next(error);
  }
});

// POST /api/entries - Create new entry
router.post('/', validateEntryInput, handleValidationErrors, (req, res, next) => {
  try {
    const newEntry = addEntry(req.body);
    res.status(201).json(newEntry);
  } catch (error) {
    next(error);
  }
});

// PUT /api/entries/:id - Update entry
router.put('/:id', validateId, validateEntryUpdate, handleValidationErrors, (req, res, next) => {
  try {
    const updatedEntry = updateEntry(req.params.id, req.body);
    res.json(updatedEntry);
  } catch (error) {
    if (error.message === 'Entry not found') {
      return res.status(404).json({ error: 'Entry not found' });
    }
    next(error);
  }
});

// DELETE /api/entries/:id - Delete entry
router.delete('/:id', validateId, handleValidationErrors, (req, res, next) => {
  try {
    deleteEntry(req.params.id);
    res.status(204).send();
  } catch (error) {
    if (error.message === 'Entry not found') {
      return res.status(404).json({ error: 'Entry not found' });
    }
    next(error);
  }
});

export default router;
