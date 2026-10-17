import { useCallback, useEffect, useRef, useState } from 'react';
import { BookDetail } from './components/BookDetail';
import { SearchBar } from './components/SearchBar';
import { SearchResults } from './components/SearchResults';
import { ShelfSection } from './components/ShelfSection';
import { ThemeToggle } from './components/ThemeToggle';
import { shelves } from './data/books';
import { useBookSearch } from './hooks/useBookSearch';
import { useTheme } from './hooks/useTheme';
import type { Book } from './types';

export default function App() {
  const { theme, toggle } = useTheme();
  const search = useBookSearch();
  const [selected, setSelected] = useState<Book | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const closeDetail = useCallback(() => setSelected(null), []);
  const isSearching = search.query.trim().length >= 2;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const typing = event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement;
      if (event.key === '/' && !typing) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5V4.5A2.5 2.5 0 0 1 6.5 2H20v15H6.5a2.5 2.5 0 0 0 0 5H20" />
              </svg>
            </span>
            <span className="brand-name">Shelf</span>
          </div>

          <SearchBar value={search.query} onChange={search.setQuery} inputRef={inputRef} />

          <ThemeToggle theme={theme} onToggle={toggle} />
        </div>
      </header>

      <main className="content">
        {isSearching ? (
          <SearchResults
            query={search.query}
            status={search.status}
            error={search.error}
            results={search.results}
            onSelect={setSelected}
          />
        ) : (
          <>
            <div className="hero">
              <h1>Your library</h1>
              <p>Browse your shelves, or search for any book, author or subject.</p>
            </div>
            {shelves.map((shelf) => (
              <ShelfSection
                key={shelf.id}
                shelf={shelf}
                selectedId={selected?.id ?? null}
                onSelect={setSelected}
              />
            ))}
          </>
        )}
      </main>

      {selected && <BookDetail key={selected.id} book={selected} onClose={closeDetail} />}
    </div>
  );
}
