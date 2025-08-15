import express from 'express';
import { Canvas } from '../models/Canvas';
import { Note } from '../models/Note';
import { createError } from '../middleware/errorHandler';

const router = express.Router();

// @route   POST /api/canvas
// @desc    Create a new canvas
// @access  Private
router.post('/', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    const {
      name,
      description,
      category,
      tags,
      settings
    } = req.body;

    if (!name) {
      throw createError('Canvas name is required', 400);
    }

    const canvas = new Canvas({
      name,
      description,
      category,
      tags: tags || [],
      settings: settings || {},
      userId
    });

    await canvas.save();

    res.status(201).json({
      success: true,
      message: 'Canvas created successfully',
      data: { canvas }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/canvas
// @desc    Get all canvases for the authenticated user
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
      isPublic
    } = req.query;

    const query: any = { userId };

    // Apply filters
    if (category) query.category = category;
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }
    if (isPublic !== undefined) query.isPublic = isPublic === 'true';

    // Execute query with pagination
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const canvases = await Canvas.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit as string))
      .populate('notes', 'title summary type');

    const total = await Canvas.countDocuments(query);

    res.json({
      success: true,
      data: {
        canvases,
        pagination: {
          currentPage: parseInt(page as string),
          totalPages: Math.ceil(total / parseInt(limit as string)),
          totalCanvases: total,
          hasNext: skip + canvases.length < total,
          hasPrev: parseInt(page as string) > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/canvas/:id
// @desc    Get a specific canvas by ID
// @access  Private
router.get('/:id', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    const canvas = await Canvas.findOne({
      _id: req.params.id,
      $or: [
        { userId },
        { collaborators: userId },
        { isPublic: true }
      ]
    }).populate('notes', 'title summary content keywords tags category type');

    if (!canvas) {
      throw createError('Canvas not found', 404);
    }

    res.json({
      success: true,
      data: { canvas }
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/canvas/:id
// @desc    Update a canvas
// @access  Private
router.put('/:id', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    const canvas = await Canvas.findOne({
      _id: req.params.id,
      $or: [
        { userId },
        { collaborators: userId }
      ]
    });

    if (!canvas) {
      throw createError('Canvas not found or access denied', 404);
    }

    const updateData = req.body;
    delete updateData.userId; // Prevent changing ownership

    const updatedCanvas = await Canvas.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    res.json({
      success: true,
      message: 'Canvas updated successfully',
      data: { canvas: updatedCanvas }
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/canvas/:id
// @desc    Delete a canvas
// @access  Private
router.delete('/:id', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    const canvas = await Canvas.findOne({ _id: req.params.id, userId });
    if (!canvas) {
      throw createError('Canvas not found or access denied', 404);
    }

    await Canvas.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Canvas deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/canvas/:id/notes
// @desc    Add a note to a canvas
// @access  Private
router.post('/:id/notes', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    const { noteId, position } = req.body;

    if (!noteId) {
      throw createError('Note ID is required', 400);
    }

    const canvas = await Canvas.findOne({
      _id: req.params.id,
      $or: [
        { userId },
        { collaborators: userId }
      ]
    });

    if (!canvas) {
      throw createError('Canvas not found or access denied', 404);
    }

    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) {
      throw createError('Note not found', 404);
    }

    // Add note to canvas
    await canvas.addNote(noteId);

    // Update note position if provided
    if (position) {
      note.position = position;
      await note.save();
    }

    res.json({
      success: true,
      message: 'Note added to canvas successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/canvas/:id/notes/:noteId
// @desc    Remove a note from a canvas
// @access  Private
router.delete('/:id/notes/:noteId', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    const canvas = await Canvas.findOne({
      _id: req.params.id,
      $or: [
        { userId },
        { collaborators: userId }
      ]
    });

    if (!canvas) {
      throw createError('Canvas not found or access denied', 404);
    }

    await canvas.removeNote(req.params.noteId);

    res.json({
      success: true,
      message: 'Note removed from canvas successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @route   PUT /api/canvas/:id/layout
// @desc    Update canvas layout (nodes and edges)
// @access  Private
router.put('/:id/layout', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    const { layout } = req.body;

    if (!layout || !layout.nodes || !layout.edges) {
      throw createError('Layout with nodes and edges is required', 400);
    }

    const canvas = await Canvas.findOne({
      _id: req.params.id,
      $or: [
        { userId },
        { collaborators: userId }
      ]
    });

    if (!canvas) {
      throw createError('Canvas not found or access denied', 404);
    }

    canvas.layout = layout;
    await canvas.save();

    res.json({
      success: true,
      message: 'Canvas layout updated successfully',
      data: { layout: canvas.layout }
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/canvas/:id/collaborators
// @desc    Add a collaborator to a canvas
// @access  Private
router.post('/:id/collaborators', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    const { collaboratorId } = req.body;

    if (!collaboratorId) {
      throw createError('Collaborator ID is required', 400);
    }

    const canvas = await Canvas.findOne({ _id: req.params.id, userId });
    if (!canvas) {
      throw createError('Canvas not found or access denied', 404);
    }

    await canvas.addCollaborator(collaboratorId);

    res.json({
      success: true,
      message: 'Collaborator added successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @route   DELETE /api/canvas/:id/collaborators/:collaboratorId
// @desc    Remove a collaborator from a canvas
// @access  Private
router.delete('/:id/collaborators/:collaboratorId', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    const canvas = await Canvas.findOne({ _id: req.params.id, userId });
    if (!canvas) {
      throw createError('Canvas not found or access denied', 404);
    }

    await canvas.removeCollaborator(req.params.collaboratorId);

    res.json({
      success: true,
      message: 'Collaborator removed successfully'
    });
  } catch (error) {
    next(error);
  }
});

// @route   GET /api/canvas/public
// @desc    Get public canvases
// @access  Public
router.get('/public/list', async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      tags
    } = req.query;

    const query: any = { isPublic: true };

    // Apply filters
    if (category) query.category = category;
    if (tags) {
      const tagArray = Array.isArray(tags) ? tags : [tags];
      query.tags = { $in: tagArray };
    }

    // Execute query with pagination
    const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
    
    const canvases = await Canvas.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit as string))
      .populate('userId', 'username')
      .populate('notes', 'title summary type');

    const total = await Canvas.countDocuments(query);

    res.json({
      success: true,
      data: {
        canvases,
        pagination: {
          currentPage: parseInt(page as string),
          totalPages: Math.ceil(total / parseInt(limit as string)),
          totalCanvases: total,
          hasNext: skip + canvases.length < total,
          hasPrev: parseInt(page as string) > 1
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
