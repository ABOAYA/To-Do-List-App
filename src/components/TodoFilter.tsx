import type { FilterStatus } from '../types';

interface TodoFilterProps {
  activeFilter: FilterStatus;
  onFilterChange: (filter: FilterStatus) => void;
  activeCount: number;
  hasCompleted: boolean;
  onClearCompleted: () => void;
}

export function TodoFilter({
  activeFilter,
  onFilterChange,
  activeCount,
  hasCompleted,
  onClearCompleted,
}: TodoFilterProps) {
  const filters: { key: FilterStatus; label: string; id: string }[] = [
    { key: 'all', label: 'All', id: 'filter-btn-all' },
    { key: 'active', label: 'Active', id: 'filter-btn-active' },
    { key: 'completed', label: 'Completed', id: 'filter-btn-completed' },
  ];

  return (
    <div
      id="todo-footer-controls"
      className="flex flex-wrap items-center justify-between gap-3 pt-3 px-2 text-sm text-stone-500"
    >
      <span id="active-tasks-count" className="tabular-nums font-medium text-stone-600">
        {activeCount} {activeCount === 1 ? 'item left' : 'items left'}
      </span>

      <div id="filter-tabs" className="inline-flex rounded-lg bg-stone-100 p-0.5 border border-stone-200">
        {filters.map((f) => (
          <button
            key={f.key}
            id={f.id}
            type="button"
            onClick={() => onFilterChange(f.key)}
            className={`px-3 py-1 rounded-md text-xs sm:text-sm font-medium transition-all ${
              activeFilter === f.key
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {hasCompleted ? (
        <button
          type="button"
          id="clear-completed-btn"
          onClick={onClearCompleted}
          className="text-xs sm:text-sm text-stone-500 hover:text-rose-600 font-medium transition-colors cursor-pointer"
        >
          Clear completed
        </button>
      ) : (
        <span className="w-16 hidden sm:inline-block" aria-hidden="true" />
      )}
    </div>
  );
}
