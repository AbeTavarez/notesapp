import express from "express";
import { authMiddleware } from "../utils/auth.js";
import Bookmark from "../models/Bookmark.js";

const router = express.Router();

// Get all bookmarks for a user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user._id })
      .populate("note")
      .sort({ createdAt: -1 });
    res.json(bookmarks);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Create a bookmark
router.post("/", authMiddleware, async (req, res) => {
  try {
    const bookmark = await Bookmark.create({
      ...req.body,
      user: req.user._id
    });
    res.status(201).json(bookmark);
  } catch (err) {
    res.status(400).json(err);
  }
});

// Delete a bookmark
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Bookmark.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });
    res.status(204).send();
  } catch (err) {
    res.status(400).json(err);
  }
});

// Example of bookmark toggling in React component
// const toggleBookmark = async (noteId) => {
//   try {
//     if (isBookmarked) {
//       await axios.delete(`/api/bookmarks/${bookmarkId}`);
//     } else {
//       await axios.post('/api/bookmarks', { 
//         note: noteId,
//         folder: 'Default'
//       });
//     }
//     // Update UI state
//   } catch (error) {
//     console.error('Error toggling bookmark:', error);
//   }
// };

export default router;