import { useState, useEffect, type FormEvent } from 'react';
import { Plus, CheckCheck, ListTodo } from 'lucide-react';
import type { Todo, FilterStatus } from './types';
import { TodoItem } from './components/TodoItem';
import { TodoFilter } from './components/TodoFilter';

const STORAGE_KEY = 'todolist_items_v1';

const INITIAL_TODOS: Todo[] = [
  {
    id: '1',
    text: 'Review daily priorities',
    completed: false,
    createdAt: Date.now() - 3600000,
  },
  {
    id: '2',
    text: 'Drink a glass of water',
    completed: true,
    createdAt: Date.now() - 7200000,
  },
  {
    id: '3',
    text: 'Plan tomorrow’s schedule',
    completed: false,
    createdAt: Date.now() - 1800000,
  },
];

export default function App() {
  const [todos, setTodos] = useState<Todo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // ignore localStorage parse errors
    }
    return INITIAL_TODOS;
  });

  const [inputVal, setInputVal] = useState('');
  const [filter, setFilter] = useState<FilterStatus>('all');

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch {
      // ignore storage errors
    }
  }, [todos]);

  const handleAddTodo = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed) return;

    const newTodo: Todo = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      text: trimmed,
      completed: false,
      createdAt: Date.now(),
    };

    setTodos((prev) => [newTodo, ...prev]);
    setInputVal('');
  };

  const handleToggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleDeleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const handleUpdateText = (id: string, newText: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, text: newText } : t))
    );
  };

  const handleClearCompleted = () => {
    setTodos((prev) => prev.filter((t) => !t.completed));
  };

  const handleToggleAll = () => {
    const allCompleted = todos.every((t) => t.completed);
    setTodos((prev) => prev.map((t) => ({ ...t, completed: !allCompleted })));
  };

  const activeCount = todos.filter((t) => !t.completed).length;
  const completedCount = todos.filter((t) => t.completed).length;

  const filteredTodos = todos.filter((t) => {
    if (filter === 'active') return !t.completed;
    if (filter === 'completed') return t.completed;
    return true;
  });

  return (
    <main
      id="todo-app-root"
      className="min-h-screen bg-stone-100/70 text-stone-900 py-12 px-4 sm:px-6 flex flex-col justify-start items-center"
    >
      <div id="todo-container" className="w-full max-w-xl">
        {/* Header */}
        <header id="app-header" className="mb-8 text-center sm:text-left">
          <div className="flex items-center justify-between gap-4 mb-2">
            <div className="flex items-center gap-3">
              <div
                id="app-icon-badge"
                className="w-10 h-10 rounded-xl bg-stone-900 text-white flex items-center justify-center shadow-xs"
              >
                <ListTodo className="w-5 h-5" />
              </div>
              <h1 id="app-title" className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                Todo List
              </h1>
            </div>

            {todos.length > 0 && (
              <button
                type="button"
                id="toggle-all-btn"
                onClick={handleToggleAll}
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-lg border border-stone-200 bg-white hover:bg-stone-50 transition-colors"
                title={todos.every((t) => t.completed) ? 'Mark all incomplete' : 'Mark all complete'}
              >
                <CheckCheck className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {todos.every((t) => t.completed) ? 'Uncheck all' : 'Check all'}
                </span>
              </button>
            )}
          </div>
          <p id="app-subtitle" className="text-sm text-stone-500">
            Keep track of what needs to get done today.
          </p>
        </header>

        {/* Task Input Card */}
        <div
          id="todo-card"
          className="bg-white rounded-2xl border border-stone-200 shadow-xs p-4 sm:p-5 space-y-4"
        >
          <form
            id="task-input-form"
            onSubmit={handleAddTodo}
            className="flex items-center gap-2"
          >
            <input
              id="task-input"
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="What needs to be done?"
              className="flex-1 px-4 py-3 text-base text-stone-900 placeholder:text-stone-400 bg-stone-50 border border-stone-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-stone-400 focus:border-stone-500 transition-all"
            />
            <button
              type="submit"
              id="add-task-btn"
              disabled={!inputVal.trim()}
              className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-3 text-sm font-medium text-white bg-stone-900 hover:bg-stone-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Add</span>
            </button>
          </form>

          {/* List of Tasks */}
          <section id="tasks-section" aria-label="Tasks list">
            {filteredTodos.length > 0 ? (
              <ul id="todo-list" className="space-y-2.5">
                {filteredTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggleTodo}
                    onDelete={handleDeleteTodo}
                    onUpdateText={handleUpdateText}
                  />
                ))}
              </ul>
            ) : (
              <div
                id="empty-state"
                className="py-12 text-center text-stone-400 border border-dashed border-stone-200 rounded-xl"
              >
                <p className="text-sm font-medium text-stone-500">
                  {filter === 'completed'
                    ? 'No completed tasks yet.'
                    : filter === 'active'
                    ? 'No active tasks to do.'
                    : 'No tasks yet. Type something above to get started!'}
                </p>
              </div>
            )}
          </section>

          {/* Filter & Summary Controls */}
          {todos.length > 0 && (
            <TodoFilter
              activeFilter={filter}
              onFilterChange={setFilter}
              activeCount={activeCount}
              hasCompleted={completedCount > 0}
              onClearCompleted={handleClearCompleted}
            />
          )}
        </div>

        {/* Footer Hint */}
        <footer id="app-footer-hint" className="mt-6 text-center text-xs text-stone-400">
          Double-click a task to edit it &bull; Press Enter to save
        </footer>
      </div>
    </main>
  );
}
