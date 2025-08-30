import express from 'express';
import { Note } from '../models/Note';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

router.use(authenticateToken);

router.get('/', async (req, res) => {
  const authReq = req as AuthRequest;
  try {
    const notes = await Note.find({ userId: authReq.user!.userId })
      .sort({ createdAt: -1 })
      .select('_id title content createdAt updatedAt');

    res.json({ notes });
  } catch (error) {
    console.error('Get notes error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/', async (req, res) => {
  const authReq = req as AuthRequest;
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    if (title.length > 200) {
      return res.status(400).json({ error: 'Title must be less than 200 characters' });
    }

    if (content.length > 10000) {
      return res.status(400).json({ error: 'Content must be less than 10000 characters' });
    }

    const note = await Note.create({
      title,
      content,
      userId: authReq.user!.userId
    });

    res.status(201).json({
      message: 'Note created successfully',
      note: {
        id: note._id,
        title: note.title,
        content: note.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt
      }
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/:id', async (req, res) => {
  const authReq = req as AuthRequest;
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({ error: 'Title and content are required' });
    }

    if (title.length > 200) {
      return res.status(400).json({ error: 'Title must be less than 200 characters' });
    }

    if (content.length > 10000) {
      return res.status(400).json({ error: 'Content must be less than 10000 characters' });
    }

    const note = await Note.findOneAndUpdate(
      { _id: id, userId: authReq.user!.userId },
      { title, content },
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({
      message: 'Note updated successfully',
      note: {
        id: note._id,
        title: note.title,
        content: note.content,
        createdAt: note.createdAt,
        updatedAt: note.updatedAt
      }
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/:id', async (req, res) => {
  const authReq = req as AuthRequest;
  try {
    const { id } = req.params;

    const note = await Note.findOneAndDelete({
      _id: id,
      userId: authReq.user!.userId
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;