import express from 'express';
import { Note } from '../models/Note';
import { createError } from '../middleware/errorHandler';
import { generateSummary, extractKeywords, findRelationships } from '../utils/aiProcessor';

const router = express.Router();

// @route   POST /api/ai/summarize
// @desc    Generate AI summary for content
// @access  Private
router.post('/summarize', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    const { content, maxLength = 150 } = req.body;

    if (!content) {
      throw createError('Content is required', 400);
    }

    const summary = await generateSummary(content, maxLength);

    res.json({
      success: true,
      data: { summary }
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/ai/extract-keywords
// @desc    Extract keywords from content
// @access  Private
router.post('/extract-keywords', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    const { content, maxKeywords = 10 } = req.body;

    if (!content) {
      throw createError('Content is required', 400);
    }

    const keywords = await extractKeywords(content, maxKeywords);

    res.json({
      success: true,
      data: { keywords }
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/ai/process-note
// @desc    Process a note with AI (summarize + extract keywords)
// @access  Private
router.post('/process-note', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    const { content, title } = req.body;

    if (!content) {
      throw createError('Content is required', 400);
    }

    // Process content with AI
    const [summary, keywords] = await Promise.all([
      generateSummary(content, 150),
      extractKeywords(content, 8)
    ]);

    res.json({
      success: true,
      data: {
        summary,
        keywords,
        suggestedTitle: title || await generateSummary(content, 50)
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/ai/find-relationships
// @desc    Find relationships between notes using AI
// @access  Private
router.post('/find-relationships', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    const { noteId, limit = 5 } = req.body;

    if (!noteId) {
      throw createError('Note ID is required', 400);
    }

    // Get the source note
    const sourceNote = await Note.findOne({ _id: noteId, userId });
    if (!sourceNote) {
      throw createError('Note not found', 404);
    }

    // Get user's other notes for comparison
    const otherNotes = await Note.find({
      userId,
      _id: { $ne: noteId }
    }).select('title content summary keywords tags category');

    if (otherNotes.length === 0) {
      return res.json({
        success: true,
        data: { relationships: [] }
      });
    }

    // Find relationships using AI
    const relationships = await findRelationships(
      sourceNote,
      otherNotes,
      limit
    );

    res.json({
      success: true,
      data: { relationships }
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/ai/suggest-connections
// @desc    Get AI suggestions for connecting notes
// @access  Private
router.post('/suggest-connections', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    const { noteId } = req.body;

    if (!noteId) {
      throw createError('Note ID is required', 400);
    }

    // Get the note and its current relationships
    const note = await Note.findOne({ _id: noteId, userId })
      .populate('relatedNotes', 'title summary keywords tags');

    if (!note) {
      throw createError('Note not found', 404);
    }

    // Get potential connections (notes not already related)
    const potentialNotes = await Note.find({
      userId,
      _id: { $nin: [...note.relatedNotes, noteId] }
    }).select('title summary keywords tags category');

    if (potentialNotes.length === 0) {
      return res.json({
        success: true,
        data: { suggestions: [] }
      });
    }

    // Get AI suggestions for connections
    const suggestions = await findRelationships(
      note,
      potentialNotes,
      10
    );

    res.json({
      success: true,
      data: { suggestions }
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/ai/auto-categorize
// @desc    Automatically categorize notes using AI
// @access  Private
router.post('/auto-categorize', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    const { noteId } = req.body;

    if (!noteId) {
      throw createError('Note ID is required', 400);
    }

    const note = await Note.findOne({ _id: noteId, userId });
    if (!note) {
      throw createError('Note not found', 404);
    }

    // Get existing categories from user's notes
    const existingCategories = await Note.distinct('category', { 
      userId, 
      category: { $exists: true, $ne: null } 
    });

    // Use AI to suggest category and tags
    const content = `${note.title} ${note.content}`;
    const [suggestedCategory, suggestedTags] = await Promise.all([
      generateSummary(content, 20), // Short category suggestion
      extractKeywords(content, 5)   // Tags
    ]);

    res.json({
      success: true,
      data: {
        suggestedCategory,
        suggestedTags,
        existingCategories
      }
    });
  } catch (error) {
    next(error);
  }
});

// @route   POST /api/ai/chat
// @desc    Chat with AI about user's notes
// @access  Private
router.post('/chat', async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw createError('User not authenticated', 401);
    }

    const { message, context = 'general' } = req.body;

    if (!message) {
      throw createError('Message is required', 400);
    }

    // Get relevant notes based on context
    let relevantNotes: any[] = [];
    
    if (context === 'recent') {
      relevantNotes = await Note.find({ userId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title summary keywords tags');
    } else if (context === 'related') {
      // Find notes related to the message
      relevantNotes = await Note.find({
        userId,
        $or: [
          { title: { $regex: message, $options: 'i' } },
          { keywords: { $in: [new RegExp(message, 'i')] } },
          { tags: { $in: [new RegExp(message, 'i')] } }
        ]
      })
      .limit(5)
      .select('title summary keywords tags');
    }

    // Generate AI response based on context and user's notes
    const aiResponse = await generateAIResponse(message, relevantNotes);

    res.json({
      success: true,
      data: {
        response: aiResponse,
        relevantNotes: relevantNotes.length > 0 ? relevantNotes : undefined
      }
    });
  } catch (error) {
    next(error);
  }
});

// Helper function to generate AI response
async function generateAIResponse(message: string, relevantNotes: any[]): Promise<string> {
  // This would integrate with OpenAI or Gemini API
  // For now, return a placeholder response
  if (relevantNotes.length > 0) {
    const noteTitles = relevantNotes.map(note => note.title).join(', ');
    return `Based on your notes about: ${noteTitles}. I can help you with that. What specific information are you looking for?`;
  }
  
  return "I'm here to help you with your knowledge management. You can ask me about your notes, request summaries, or get help organizing your thoughts.";
}

export default router;
