import express from 'express';
import { Note } from '../models/Note';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// @route   POST /api/notes
// @desc    Create a new note
// @access  Private
router.post('/', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    const {
      title,
      content,
      summary,
      keywords,
      category,
      tags,
      type,
      sourceUrl,
      importance,
      isPublic
    } = req.body;

    const note = new Note({
      title,
      content,
      summary,
      keywords: keywords || [],
      category,
      tags: tags || [],
      type: type || 'text',
      sourceUrl,
      importance: importance || 'medium',
      isPublic: isPublic || false,
      userId
    });

    await note.save();

    res.status(201).json({
      success: true,
      message: 'Note created successfully',
      data: { note }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/notes
// @desc    Get all notes for the authenticated user
// @access  Private
router.get('/', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    const {
      page = 1,
      limit = 20,
      category,
      tags,
      type,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query: any = { userId };

    // Apply filters
    if (category) query.category = category;
    if (type) query.type = type;
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }
    if (search) {
      query.$text = { $search: search as string };
    }

    // Build sort object
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const notes = await Note.find(query)
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit as string))
      .populate('relatedNotes', 'title summary');

    const total = await Note.countDocuments(query);

    res.json({
      success: true,
      data: {
        notes,
        pagination: {
          currentPage: parseInt(page as string),
          totalPages: Math.ceil(total / parseInt(limit as string)),
          totalNotes: total,
          hasNext: skip + notes.length < total,
          hasPrev: parseInt(page as string) > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/notes/:id
// @desc    Get a specific note by ID
// @access  Private
router.get('/:id', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    const note = await Note.findOne({ _id: req.params.id, userId })
      .populate('relatedNotes', 'title summary content keywords');

    if (!note) {
      throw createError('Note not found', 404);
    }

    res.json({
      success: true,
      data: { note }
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/notes/:id
// @desc    Update a note
// @access  Private
router.put('/:id', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    const note = await Note.findOne({ _id: req.params.id, userId });
    if (!note) {
      throw createError('Note not found', 404);
    }

    const updateData = req.body;
    delete updateData.userId; // Prevent changing ownership

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Note updated successfully',
      data: { note: updatedNote }
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/notes/:id
// @desc    Delete a note
// @access  Private
router.delete('/:id', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    const note = await Note.findOne({ _id: req.params.id, userId });
    if (!note) {
      throw createError('Note not found', 404);
    }

    await Note.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Note deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/notes/:id/relate
// @desc    Add a related note
// @access  Private
router.post('/:id/relate', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    const { relatedNoteId } = req.body;

    if (!relatedNoteId) {
      throw createError('Related note ID is required', 400);
    }

    const note = await Note.findOne({ _id: req.params.id, userId });
    if (!note) {
      throw createError('Note not found', 404);
    }

    const relatedNote = await Note.findOne({ _id: relatedNoteId, userId });
    if (!relatedNote) {
      throw createError('Related note not found', 404);
    }

    await note.addRelatedNote(relatedNoteId);

    res.json({
      success: true,
      message: 'Note relationship added successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/notes/:id/relate/:relatedId
// @desc    Remove a related note
// @access  Private
router.delete('/:id/relate/:relatedId', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    const note = await Note.findOne({ _id: req.params.id, userId });
    if (!note) {
      throw createError('Note not found', 404);
    }

    await note.removeRelatedNote(req.params.relatedId);

    res.json({
      success: true,
      message: 'Note relationship removed successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/notes/search/suggestions
// @desc    Get search suggestions based on user's notes
// @access  Private
router.get('/search/suggestions', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    const { query } = req.query;
    if (!query || typeof query !== 'string') {
      throw createError('Search query is required', 400);
    }

    const suggestions = await Note.find({
      userId,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { keywords: { $in: [new RegExp(query, 'i')] } },
        { tags: { $in: [new RegExp(query, 'i')] } }
      ]
    })
    .select('title keywords tags category')
    .limit(10);

    res.json({
      success: true,
      data: { suggestions }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
