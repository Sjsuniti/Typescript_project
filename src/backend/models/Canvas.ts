import mongoose, { Document, Schema, Types } from 'mongoose';

export interface ICanvas extends Document {
  name: string;
  description?: string;
  userId: Types.ObjectId;
  notes: Types.ObjectId[];
  layout: {
    nodes: Array<{
      id: string;
      type: string;
      position: { x: number; y: number };
      data: any;
    }>;
    edges: Array<{
      id: string;
      source: string;
      target: string;
      type: string;
      label?: string;
    }>;
  };
  settings: {
    theme: 'light' | 'dark' | 'auto';
    layout: 'hierarchical' | 'force' | 'circular';
    showLabels: boolean;
    showArrows: boolean;
    nodeSpacing: number;
    autoLayout: boolean;
  };
  isPublic: boolean;
  collaborators: Types.ObjectId[];
  tags: string[];
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

const canvasSchema = new Schema<ICanvas>({
  name: {
    type: String,
    required: [true, 'Canvas name is required'],
    trim: true,
    maxlength: [100, 'Canvas name cannot exceed 100 characters']
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters']
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  notes: [{
    type: Schema.Types.ObjectId,
    ref: 'Note'
  }],
  layout: {
    nodes: [{
      id: {
        type: String,
        required: true
      },
      type: {
        type: String,
        default: 'default'
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
      },
      data: {
        type: Schema.Types.Mixed,
        default: {}
      }
    }],
    edges: [{
      id: {
        type: String,
        required: true
      },
      source: {
        type: String,
        required: true
      },
      target: {
        type: String,
        required: true
      },
      type: {
        type: String,
        default: 'default'
      },
      label: String
    }]
  },
  settings: {
    theme: {
      type: String,
      enum: ['light', 'dark', 'auto'],
      default: 'light'
    },
    layout: {
      type: String,
      enum: ['hierarchical', 'force', 'circular'],
      default: 'force'
    },
    showLabels: {
      type: Boolean,
      default: true
    },
    showArrows: {
      type: Boolean,
      default: true
    },
    nodeSpacing: {
      type: Number,
      default: 100,
      min: 50,
      max: 300
    },
    autoLayout: {
      type: Boolean,
      default: true
    }
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  collaborators: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  category: {
    type: String,
    trim: true,
    maxlength: [100, 'Category cannot exceed 100 characters']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
canvasSchema.index({ userId: 1, createdAt: -1 });
canvasSchema.index({ userId: 1, category: 1 });
canvasSchema.index({ userId: 1, tags: 1 });
canvasSchema.index({ isPublic: 1, createdAt: -1 });

// Virtual for note count
canvasSchema.virtual('noteCount').get(function() {
  return this.notes.length;
});

// Virtual for collaborator count
canvasSchema.virtual('collaboratorCount').get(function() {
  return this.collaborators.length;
});

// Method to add note to canvas
canvasSchema.methods.addNote = function(noteId: Types.ObjectId) {
  if (!this.notes.includes(noteId)) {
    this.notes.push(noteId);
  }
  return this.save();
};

// Method to remove note from canvas
canvasSchema.methods.removeNote = function(noteId: Types.ObjectId) {
  this.notes = this.notes.filter(id => !id.equals(noteId));
  return this.save();
};

// Method to add collaborator
canvasSchema.methods.addCollaborator = function(userId: Types.ObjectId) {
  if (!this.collaborators.includes(userId)) {
    this.collaborators.push(userId);
  }
  return this.save();
};

// Method to remove collaborator
canvasSchema.methods.removeCollaborator = function(userId: Types.ObjectId) {
  this.collaborators = this.collaborators.filter(id => !id.equals(userId));
  return this.save();
};

// Static method to find public canvases
canvasSchema.statics.findPublic = function() {
  return this.find({ isPublic: true }).sort({ createdAt: -1 });
};

// Static method to find canvases by user and category
canvasSchema.statics.findByUserAndCategory = function(userId: string, category: string) {
  return this.find({ userId, category }).sort({ createdAt: -1 });
};

export const Canvas = mongoose.model<ICanvas>('Canvas', canvasSchema);
