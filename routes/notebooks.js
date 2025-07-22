import express from "express";
import NoteBook from "../models/NoteBook.js";
import Note from "../models/Notes.js";
import { authMiddleware } from "../utils/auth.js";

const router = express.Router();

// Apply authMiddleware to all routes in this file
router.use(authMiddleware);

// GET /api/notes - Get all notes for the logged-in user
// THIS IS THE ROUTE THAT CURRENTLY HAS THE FLAW
router.get("/", async (req, res) => {
  // This currently finds all notes in the database.
  // It should only find notes owned by the logged in user.
  try {
    const notebooks = await NoteBook.find({ user: req.user._id })
    .populate("notes");
    res.json(notebooks);
  } catch (err) {
    res.status(500).json(err);
  }
});


// POST /api/notes - Create a new note
router.post("/", async (req, res) => {
  try {
    const notebook = await NoteBook.create({
      ...req.body,
      // The user ID needs to be added here
      user: req.user._id,
    });
    res.status(201).json(notebook);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:notebookId/add/:noteId', async(req, res) => {
  try {
    // find the NoteBook by the id
    const notebook = await NoteBook.findById(req.params.notebookId);
    
    if (!notebook) {
      return res.status(404).json({ message: 'Notebook not found' });
    }
    // Authorization check
    if (notebook.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'User is not authorized to add notes to this notebook' });
    }
    // Create a new note
    const note = await Note.findById(req.params.noteId);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Add the note to the notebook
    notebook.notes.push(note._id);
    await notebook.save();
    
    res.status(201).json(note);
  } catch (err) {
    res.status(500).json(err);
  }
})


export default router;