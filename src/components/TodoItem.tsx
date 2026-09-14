import { useState, useRef, useEffect, type KeyboardEvent } from 'react';
import { Check, Trash2, Edit2, X } from 'lucide-react';
import type { Todo } from '../types';

interface TodoItemProps {
  key?: string;
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdateText: (id: string, newText: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete, onUpdateText }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    const trimmed = editText.trim();
    if (trimmed && trimmed !== todo.text) {
      onUpdateText(todo.id, trimmed);
    } else {
      setEditText(todo.text);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setEditText(todo.text);
      setIsEditing(false);
    }
  };

  return (
    <li
      id={`todo-item-${todo.id}`}
      className={`group flex items-center justify-between gap-3 px-4 py-3 bg-white border border-stone-200 rounded-xl transition-all duration-150 hover:border-stone-300 hover:shadow-xs ${
        todo.completed ? 'bg-stone-50/70 border-stone-200/70' : ''
      }`}
    >
      <div className="flex items-center gap-3.5 flex-1 min-w-0">
        <button
          type="button"
          id={`todo-toggle-${todo.id}`}
          onClick={() => onToggle(todo.id)}
          aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
          className={`w-6 h-6 rounded-lg flex items-center justify-center border transition-colors shrink-0 ${
            todo.completed
              ? 'bg-stone-900 border-stone-900 text-white'
              : 'border-stone-300 hover:border-stone-500 bg-white'
          }`}
        >
          {todo.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {isEditing ? (
          <div className="flex items-center gap-2 flex-1">
            <input
              ref={inputRef}
              id={`todo-edit-input-${todo.id}`}
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSave}
              className="flex-1 px-2.5 py-1 text-base text-stone-900 bg-stone-50 border border-stone-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-stone-400 focus:border-stone-500"
            />
            <button
              type="button"
              id={`todo-edit-save-${todo.id}`}
              onClick={handleSave}
              className="p-1 text-stone-600 hover:text-stone-900 transition-colors"
              title="Save (Enter)"
            >
              <Check className="w-4 h-4" />
            </button>
            <button
              type="button"
              id={`todo-edit-cancel-${todo.id}`}
              onClick={() => {
                setEditText(todo.text);
                setIsEditing(false);
              }}
              className="p-1 text-stone-400 hover:text-stone-700 transition-colors"
              title="Cancel (Esc)"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <span
            id={`todo-text-${todo.id}`}
            onDoubleClick={() => setIsEditing(true)}
            className={`text-base font-normal tracking-tight break-words flex-1 cursor-pointer select-none transition-colors ${
              todo.completed
                ? 'line-through text-stone-400'
                : 'text-stone-800'
            }`}
          >
            {todo.text}
          </span>
        )}
      </div>

      {!isEditing && (
        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            id={`todo-edit-btn-${todo.id}`}
            onClick={() => setIsEditing(true)}
            aria-label="Edit task"
            className="p-1.5 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-md transition-colors"
          >
            <Edit2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            id={`todo-delete-btn-${todo.id}`}
            onClick={() => onDelete(todo.id)}
            aria-label="Delete task"
            className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      )}
    </li>
  );
}
