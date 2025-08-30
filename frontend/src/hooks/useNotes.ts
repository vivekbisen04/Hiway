import { useState, useEffect } from 'react';
import api from '../utils/api';
import type { Note, NotesResponse } from '../types';
import { getErrorMessage } from '../utils/errorHandler';

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await api.get<NotesResponse>('/notes');
      setNotes(response.data.notes);
      setError(null);
    } catch (error: unknown) {
      setError(getErrorMessage(error, 'Failed to fetch notes'));
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (title: string, content: string) => {
    try {
      const response = await api.post('/notes', { title, content });
      await fetchNotes(); // Refresh the list
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Failed to create note'));
    }
  };

  const updateNote = async (id: string, title: string, content: string) => {
    try {
      const response = await api.put(`/notes/${id}`, { title, content });
      await fetchNotes(); // Refresh the list
      return response.data;
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Failed to update note'));
    }
  };

  const deleteNote = async (id: string) => {
    try {
      await api.delete(`/notes/${id}`);
      setNotes(notes.filter(note => note._id !== id));
    } catch (error: unknown) {
      throw new Error(getErrorMessage(error, 'Failed to delete note'));
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return {
    notes,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    refetch: fetchNotes
  };
};