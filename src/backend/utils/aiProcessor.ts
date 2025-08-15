import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize AI clients
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// AI Processing Functions

/**
 * Generate a summary of the given content
 */
export async function generateSummary(content: string, maxLength: number = 150): Promise<string> {
  try {
    if (process.env.OPENAI_API_KEY) {
      return await generateOpenAISummary(content, maxLength);
    } else if (process.env.GEMINI_API_KEY) {
      return await generateGeminiSummary(content, maxLength);
    } else {
      // Fallback to basic text processing
      return generateBasicSummary(content, maxLength);
    }
  } catch (error) {
    console.error('AI summary generation failed:', error);
    return generateBasicSummary(content, maxLength);
  }
}

/**
 * Extract keywords from the given content
 */
export async function extractKeywords(content: string, maxKeywords: number = 10): Promise<string[]> {
  try {
    if (process.env.OPENAI_API_KEY) {
      return await extractOpenAIKeywords(content, maxKeywords);
    } else if (process.env.GEMINI_API_KEY) {
      return await extractGeminiKeywords(content, maxKeywords);
    } else {
      // Fallback to basic keyword extraction
      return extractBasicKeywords(content, maxKeywords);
    }
  } catch (error) {
    console.error('AI keyword extraction failed:', error);
    return extractBasicKeywords(content, maxKeywords);
  }
}

/**
 * Find relationships between notes using AI
 */
export async function findRelationships(
  sourceNote: any,
  otherNotes: any[],
  limit: number = 5
): Promise<any[]> {
  try {
    if (process.env.OPENAI_API_KEY) {
      return await findOpenAIRelationships(sourceNote, otherNotes, limit);
    } else if (process.env.GEMINI_API_KEY) {
      return await findGeminiRelationships(sourceNote, otherNotes, limit);
    } else {
      // Fallback to basic similarity matching
      return findBasicRelationships(sourceNote, otherNotes, limit);
    }
  } catch (error) {
    console.error('AI relationship finding failed:', error);
    return findBasicRelationships(sourceNote, otherNotes, limit);
  }
}

// OpenAI Implementation

async function generateOpenAISummary(content: string, maxLength: number): Promise<string> {
  const prompt = `Summarize the following content in ${maxLength} characters or less:\n\n${content}`;
  
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that creates concise summaries."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: Math.ceil(maxLength / 4), // Rough estimate
    temperature: 0.3
  });

  return response.choices[0]?.message?.content?.trim() || '';
}

async function extractOpenAIKeywords(content: string, maxKeywords: number): Promise<string[]> {
  const prompt = `Extract ${maxKeywords} key terms or concepts from the following content. Return only the keywords separated by commas:\n\n${content}`;
  
  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that extracts key terms from text."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: 100,
    temperature: 0.1
  });

  const keywordsText = response.choices[0]?.message?.content?.trim() || '';
  return keywordsText.split(',').map(k => k.trim()).filter(k => k.length > 0);
}

async function findOpenAIRelationships(
  sourceNote: any,
  otherNotes: any[],
  limit: number
): Promise<any[]> {
  const sourceContent = `${sourceNote.title} ${sourceNote.content}`;
  const notesText = otherNotes.map(note => 
    `Note: ${note.title} - ${note.summary || note.content.substring(0, 100)}`
  ).join('\n');

  const prompt = `Given this source note: "${sourceContent}"
  
  And these other notes:
  ${notesText}
  
  Return the IDs of the ${limit} most related notes, ranked by relevance. Format as: id1,id2,id3...`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a helpful assistant that finds relationships between notes."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: 100,
    temperature: 0.1
  });

  const responseText = response.choices[0]?.message?.content?.trim() || '';
  const relatedIds = responseText.split(',').map(id => id.trim());
  
  return otherNotes
    .filter(note => relatedIds.includes(note._id.toString()))
    .slice(0, limit);
}

// Gemini Implementation

async function generateGeminiSummary(content: string, maxLength: number): Promise<string> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const prompt = `Summarize the following content in ${maxLength} characters or less:\n\n${content}`;
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text().trim();
}

async function extractGeminiKeywords(content: string, maxKeywords: number): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const prompt = `Extract ${maxKeywords} key terms or concepts from the following content. Return only the keywords separated by commas:\n\n${content}`;
  
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const keywordsText = response.text().trim();
  
  return keywordsText.split(',').map(k => k.trim()).filter(k => k.length > 0);
}

async function findGeminiRelationships(
  sourceNote: any,
  otherNotes: any[],
  limit: number
): Promise<any[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  
  const sourceContent = `${sourceNote.title} ${sourceNote.content}`;
  const notesText = otherNotes.map(note => 
    `Note: ${note.title} - ${note.summary || note.content.substring(0, 100)}`
  ).join('\n');

  const prompt = `Given this source note: "${sourceContent}"
  
  And these other notes:
  ${notesText}
  
  Return the IDs of the ${limit} most related notes, ranked by relevance. Format as: id1,id2,id3...`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const responseText = response.text().trim();
  
  const relatedIds = responseText.split(',').map(id => id.trim());
  
  return otherNotes
    .filter(note => relatedIds.includes(note._id.toString()))
    .slice(0, limit);
}

// Basic Fallback Implementation

function generateBasicSummary(content: string, maxLength: number): string {
  if (content.length <= maxLength) {
    return content;
  }
  
  // Simple truncation with word boundary
  const truncated = content.substring(0, maxLength);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > 0) {
    return truncated.substring(0, lastSpace) + '...';
  }
  
  return truncated + '...';
}

function extractBasicKeywords(content: string, maxKeywords: number): string[] {
  // Simple keyword extraction based on frequency and length
  const words = content.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3);
  
  const wordCount: { [key: string]: number } = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  return Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word);
}

function findBasicRelationships(
  sourceNote: any,
  otherNotes: any[],
  limit: number
): any[] {
  const sourceKeywords = new Set([
    ...(sourceNote.keywords || []),
    ...(sourceNote.tags || [])
  ]);
  
  const sourceText = `${sourceNote.title} ${sourceNote.content}`.toLowerCase();
  
  const scoredNotes = otherNotes.map(note => {
    let score = 0;
    
    // Check keyword overlap
    const noteKeywords = new Set([
      ...(note.keywords || []),
      ...(note.tags || [])
    ]);
    
    const keywordOverlap = [...sourceKeywords].filter(k => noteKeywords.has(k)).length;
    score += keywordOverlap * 2;
    
    // Check text similarity
    const noteText = `${note.title} ${note.content}`.toLowerCase();
    const commonWords = sourceText.split(' ')
      .filter(word => word.length > 3 && noteText.includes(word));
    score += commonWords.length;
    
    // Check category match
    if (sourceNote.category && note.category && sourceNote.category === note.category) {
      score += 3;
    }
    
    return { note, score };
  });
  
  return scoredNotes
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.note);
}

// Utility function to check if AI services are available
export function isAIServiceAvailable(): boolean {
  return !!(process.env.OPENAI_API_KEY || process.env.GEMINI_API_KEY);
}

// Utility function to get available AI service
export function getAvailableAIService(): string {
  if (process.env.OPENAI_API_KEY) return 'OpenAI';
  if (process.env.GEMINI_API_KEY) return 'Gemini';
  return 'None';
}
