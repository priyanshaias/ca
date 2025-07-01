import React, { useState, useEffect, useRef, useCallback } from 'react';

interface Note {
  id: string;
  content: string;
  timestamp: Date;
  lastEdited: Date;
  characterCount: number;
  version: number;
}

interface NotesEditorProps {
  articleId: string;
  initialNotes?: Note[];
  onNotesChange?: (notes: Note[]) => void;
  className?: string;
}

interface EditorState {
  content: string;
  selectionStart: number;
  selectionEnd: number;
}

const NotesEditor: React.FC<NotesEditorProps> = ({
  articleId,
  initialNotes = [],
  onNotesChange,
  className = ''
}) => {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [lastEditTime, setLastEditTime] = useState<Date | null>(null);
  const [showFormatting, setShowFormatting] = useState(false);
  const [fontSize, setFontSize] = useState(14);
  const [textColor, setTextColor] = useState('#000000');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const autoSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const undoStackRef = useRef<EditorState[]>([]);
  const redoStackRef = useRef<EditorState[]>([]);

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(`article-notes-${articleId}`);
    if (savedNotes) {
      try {
        const parsedNotes = JSON.parse(savedNotes);
        setNotes(parsedNotes);
        if (parsedNotes.length > 0) {
          setCurrentNote(parsedNotes[0]);
        }
      } catch (error) {
        console.error('Error loading notes:', error);
      }
    }
  }, [articleId]);

  // Save notes to localStorage
  const saveNotes = useCallback(async () => {
    try {
      setAutoSaveStatus('saving');
      localStorage.setItem(`article-notes-${articleId}`, JSON.stringify(notes));
      setAutoSaveStatus('saved');
      onNotesChange?.(notes);
    } catch (error) {
      console.error('Error saving notes:', error);
      setAutoSaveStatus('error');
    }
  }, [notes, articleId, onNotesChange]);

  // Auto-save effect
  useEffect(() => {
    if (autoSaveTimeoutRef.current) {
      clearTimeout(autoSaveTimeoutRef.current);
    }
    
    if (notes.length > 0) {
      autoSaveTimeoutRef.current = setTimeout(() => {
        saveNotes();
      }, 30000); // 30 seconds
    }

    return () => {
      if (autoSaveTimeoutRef.current) {
        clearTimeout(autoSaveTimeoutRef.current);
      }
    };
  }, [notes, saveNotes]);

  // Create new note
  const createNewNote = useCallback(() => {
    const newNote: Note = {
      id: Date.now().toString(),
      content: '',
      timestamp: new Date(),
      lastEdited: new Date(),
      characterCount: 0,
      version: 1
    };
    
    setNotes(prev => [newNote, ...prev]);
    setCurrentNote(newNote);
    setLastEditTime(new Date());
  }, []);

  // Update current note
  const updateCurrentNote = useCallback((content: string) => {
    if (!currentNote) return;

    // Save current state to undo stack
    if (textareaRef.current) {
      const currentState: EditorState = {
        content: currentNote.content,
        selectionStart: textareaRef.current.selectionStart,
        selectionEnd: textareaRef.current.selectionEnd
      };
      undoStackRef.current.push(currentState);
      redoStackRef.current = []; // Clear redo stack on new edit
    }

    const updatedNote: Note = {
      ...currentNote,
      content,
      lastEdited: new Date(),
      characterCount: content.length,
      version: currentNote.version + 1
    };

    setCurrentNote(updatedNote);
    setNotes(prev => prev.map(note => 
      note.id === currentNote.id ? updatedNote : note
    ));
    setLastEditTime(new Date());
  }, [currentNote]);

  // Delete note
  const deleteNote = useCallback((noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
    if (currentNote?.id === noteId) {
      setCurrentNote(notes.find(note => note.id !== noteId) || null);
    }
  }, [currentNote, notes]);

  // Undo functionality
  const undo = useCallback(() => {
    if (undoStackRef.current.length === 0 || !textareaRef.current) return;

    const previousState = undoStackRef.current.pop()!;
    redoStackRef.current.push({
      content: currentNote?.content || '',
      selectionStart: textareaRef.current.selectionStart,
      selectionEnd: textareaRef.current.selectionEnd
    });

    updateCurrentNote(previousState.content);
    
    // Restore cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.setSelectionRange(
          previousState.selectionStart,
          previousState.selectionEnd
        );
      }
    }, 0);
  }, [currentNote, updateCurrentNote]);

  // Redo functionality
  const redo = useCallback(() => {
    if (redoStackRef.current.length === 0 || !textareaRef.current) return;

    const nextState = redoStackRef.current.pop()!;
    undoStackRef.current.push({
      content: currentNote?.content || '',
      selectionStart: textareaRef.current.selectionStart,
      selectionEnd: textareaRef.current.selectionEnd
    });

    updateCurrentNote(nextState.content);
    
    // Restore cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.setSelectionRange(
          nextState.selectionStart,
          nextState.selectionEnd
        );
      }
    }, 0);
  }, [currentNote, updateCurrentNote]);

  // Formatting functions
  const applyFormatting = useCallback((format: string) => {
    if (!textareaRef.current || !currentNote) return;

    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);

    let formattedText = '';
    switch (format) {
      case 'bold':
        formattedText = `**${selectedText}**`;
        break;
      case 'italic':
        formattedText = `*${selectedText}*`;
        break;
      case 'underline':
        formattedText = `__${selectedText}__`;
        break;
      case 'bullet':
        formattedText = `• ${selectedText}`;
        break;
      case 'number':
        formattedText = `1. ${selectedText}`;
        break;
      case 'highlight':
        formattedText = `==${selectedText}==`;
        break;
      default:
        return;
    }

    const newContent = 
      textarea.value.substring(0, start) + 
      formattedText + 
      textarea.value.substring(end);

    updateCurrentNote(newContent);
    
    // Restore cursor position
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.setSelectionRange(
          start + formattedText.length,
          start + formattedText.length
        );
      }
    }, 0);
  }, [currentNote, updateCurrentNote]);

  // Export notes
  const exportNotes = useCallback(() => {
    const notesText = notes.map(note => 
      `Note ${note.id}\n${note.content}\n\nLast edited: ${note.lastEdited.toLocaleString()}\n---\n`
    ).join('\n');
    
    const blob = new Blob([notesText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-${articleId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }, [notes, articleId]);

  // Import notes
  const importNotes = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const newNote: Note = {
        id: Date.now().toString(),
        content,
        timestamp: new Date(),
        lastEdited: new Date(),
        characterCount: content.length,
        version: 1
      };
      
      setNotes(prev => [newNote, ...prev]);
      setCurrentNote(newNote);
    };
    reader.readAsText(file);
  }, []);

  // Manual save
  const handleManualSave = useCallback(() => {
    saveNotes();
  }, [saveNotes]);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Notes Editor</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Auto-save status */}
          <div className="flex items-center space-x-1 text-xs">
            <div className={`w-2 h-2 rounded-full ${
              autoSaveStatus === 'saved' ? 'bg-green-500' :
              autoSaveStatus === 'saving' ? 'bg-yellow-500' : 'bg-red-500'
            }`}></div>
            <span className="text-gray-500 dark:text-gray-400">
              {autoSaveStatus === 'saved' ? 'Saved' :
               autoSaveStatus === 'saving' ? 'Saving...' : 'Error'}
            </span>
          </div>
          
          {/* Manual save button */}
          <button
            onClick={handleManualSave}
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
          >
            Save
          </button>
        </div>
      </div>

      {/* Notes List */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-sm font-medium text-gray-900 dark:text-white">Notes ({notes.length})</h4>
          <button
            onClick={createNewNote}
            className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200"
          >
            + New Note
          </button>
        </div>
        
        <div className="space-y-2 max-h-32 overflow-y-auto">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors duration-200 ${
                currentNote?.id === note.id
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                  : 'hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              onClick={() => {
                setCurrentNote(note);
              }}
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {note.content.substring(0, 50) || 'Empty note'}...
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {note.lastEdited.toLocaleString()}
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteNote(note.id);
                }}
                className="ml-2 p-1 text-gray-400 hover:text-red-500 transition-colors duration-200"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Editor */}
      {currentNote && (
        <div className="p-4">
          {/* Formatting Toolbar */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowFormatting(!showFormatting)}
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  {showFormatting ? 'Hide' : 'Show'} Formatting
                </button>
                
                {/* Undo/Redo */}
                <button
                  onClick={undo}
                  disabled={undoStackRef.current.length === 0}
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Undo
                </button>
                <button
                  onClick={redo}
                  disabled={redoStackRef.current.length === 0}
                  className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Redo
                </button>
              </div>
              
              {/* Export/Import */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={exportNotes}
                  className="px-2 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
                >
                  Export
                </button>
                <label className="px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 transition-colors duration-200 cursor-pointer">
                  Import
                  <input
                    type="file"
                    accept=".txt,.md"
                    onChange={importNotes}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            
            {/* Formatting Options */}
            {showFormatting && (
              <div className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                <button
                  onClick={() => applyFormatting('bold')}
                  className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200 font-bold"
                >
                  B
                </button>
                <button
                  onClick={() => applyFormatting('italic')}
                  className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200 italic"
                >
                  I
                </button>
                <button
                  onClick={() => applyFormatting('underline')}
                  className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200 underline"
                >
                  U
                </button>
                <button
                  onClick={() => applyFormatting('bullet')}
                  className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                >
                  •
                </button>
                <button
                  onClick={() => applyFormatting('number')}
                  className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                >
                  1.
                </button>
                <button
                  onClick={() => applyFormatting('highlight')}
                  className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-200"
                >
                  Highlight
                </button>
                
                {/* Font Size */}
                <select
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded border-0"
                >
                  <option value={12}>12px</option>
                  <option value={14}>14px</option>
                  <option value={16}>16px</option>
                  <option value={18}>18px</option>
                  <option value={20}>20px</option>
                </select>
                
                {/* Text Color */}
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="w-8 h-6 rounded border-0 cursor-pointer"
                />
              </div>
            )}
          </div>

          {/* Text Editor */}
          <div className="mb-4">
            <textarea
              ref={textareaRef}
              value={currentNote.content}
              onChange={(e) => updateCurrentNote(e.target.value)}
              placeholder="Start typing your notes here..."
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
              rows={8}
              style={{
                fontSize: `${fontSize}px`,
                color: textColor
              }}
            />
          </div>

          {/* Editor Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              <span>Characters: {currentNote.characterCount}</span>
              <span>Words: {currentNote.content.split(/\s+/).filter(word => word.length > 0).length}</span>
              <span>Version: {currentNote.version}</span>
            </div>
            <div>
              {lastEditTime && (
                <span>Last edited: {lastEditTime.toLocaleTimeString()}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!currentNote && notes.length === 0 && (
        <div className="p-8 text-center">
          <svg className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          <p className="text-gray-600 dark:text-gray-400 mb-4">No notes yet</p>
          <button
            onClick={createNewNote}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
          >
            Create Your First Note
          </button>
        </div>
      )}
    </div>
  );
};

export default NotesEditor; 