import mongoose from 'mongoose';

const snippetSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
      default: '',
    },
    code: {
      type: String,
      required: [true, 'Code content is required'],
    },
    language: {
      type: String,
      required: [true, 'Programming language is required'],
      trim: true,
      lowercase: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for searching and filtering
snippetSchema.index({ language: 1, isPublic: 1, user: 1 });
snippetSchema.index({ tags: 1 });
snippetSchema.index(
  { title: 'text', description: 'text' },
  {
    // Do not treat the `language` field as a MongoDB text language override.
    // This avoids errors like "language override unsupported: javascript".
    default_language: 'none',
    language_override: '__ignored_text_language',
  }
);

const Snippet = mongoose.model('Snippet', snippetSchema);

export default Snippet;
