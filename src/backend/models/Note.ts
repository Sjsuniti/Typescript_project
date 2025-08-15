import mongoose, { Document, Schema, Types } from 'mongoose';

export interface INote extends Document {
  title: string;
  content: string;
  summary?: string;
  keywords: string[];
  category?: string;
  tags: string[];
  type: 'text' | 'url' | 'pdf' | 'image' | 'voice';
  sourceUrl?: string;
  filePath?: string;
  embedding?: number[];
  importance: 'low' | 'medium' | 'high';
  isPublic: boolean;
  userId: Types.ObjectId;
  relatedNotes: Types.ObjectId[];
  canvasId?: Types.ObjectId;
  position?: {
    x: number;
    y: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  content: {
    type: String,
    required: [true, 'Content is required'],
    maxlength: [10000, 'Content cannot exceed 10000 characters']
  },
  summary: {
    type: String,
    maxlength: [500, 'Summary cannot exceed 500 characters']
  },
  keywords: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  category: {
    type: String,
    trim: true,
    maxlength: [100, 'Category cannot exceed 100 characters']
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  type: {
    type: String,
    enum: ['text', 'url', 'pdf', 'image', 'voice'],
    default: 'text'
  },
  sourceUrl: {
    type: String,
    validate: {
      validator: function(v: string) {
        if (this.type === 'url' && !v) return false;
        return true;
      },
      message: 'Source URL is required for URL type notes'
    }
  },
  filePath: {
    type: String
  },
  embedding: [{
    type: Number
  }],
  importance: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  relatedNotes: [{
    type: Schema.Types.ObjectId,
    ref: 'Note'
  }],
  canvasId: {
    type: Schema.Types.ObjectId,
    ref: 'Canvas'
  },
  position: {
    x: {
      type: Number,
      default: 0
    },
    y: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
noteSchema.index({ userId: 1, createdAt: -1 });
noteSchema.index({ userId: 1, category: 1 });
noteSchema.index({ userId: 1, tags: 1 });
noteSchema.index({ userId: 1, type: 1 });
noteSchema.index({ keywords: 'text', title: 'text', content: 'text' });

// Virtual for full content preview
noteSchema.virtual('contentPreview').get(function() {
  if (this.content.length <= 150) {
    return this.content;
  }
  return this.content.substring(0, 150) + '...';
});

// Method to add related note
noteSchema.methods.addRelatedNote = function(noteId: Types.ObjectId) {
  if (!this.relatedNotes.includes(noteId)) {
    this.relatedNotes.push(noteId);
  }
  return this.save();
};

// Method to remove related note
noteSchema.methods.removeRelatedNote = function(noteId: Types.ObjectId) {
  this.relatedNotes = this.relatedNotes.filter(id => !id.equals(noteId));
  return this.save();
};

// Static method to find notes by user and category
noteSchema.statics.findByUserAndCategory = function(userId: string, category: string) {
  return this.find({ userId, category }).sort({ createdAt: -1 });
};

// Static method to find notes by user and tags
noteSchema.statics.findByUserAndTags = function(userId: string, tags: string[]) {
  return this.find({ userId, tags: { $in: tags } }).sort({ createdAt: -1 });
};

export const Note = mongoose.model<INote>('Note', noteSchema);
