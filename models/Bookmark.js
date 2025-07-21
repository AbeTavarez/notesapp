import mongoose, { Schema } from "mongoose";

const bookmarkSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // Optional fields that could be useful
  folder: {
    type: String,
    default: "Default",
  },
  tags: [
    {
      type: String,
    },
  ],
  color: {
    type: String,
    enum: ["red", "blue", "green", "yellow", "purple"],
    default: "blue",
  },
});

// Prevent duplicate bookmarks
bookmarkSchema.index({ user: 1, note: 1 }, { unique: true });

const Bookmark = mongoose.model("Bookmark", bookmarkSchema);

export default Bookmark;
