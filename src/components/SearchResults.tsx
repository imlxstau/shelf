import type { SearchStatus } from '../hooks/useBookSearch';
import type { Book } from '../types';
import { Cover } from './Cover';

interface SearchResultsProps {
  query: string;
  status: SearchStatus;
  error: string | null;
  results: Book[];
  onSelect: (book: Book) => void;
}

export function SearchResults({ query, status, error, results, onSelect }: SearchResultsProps) {
  const term = query.trim();

  return (
    <section className="results" aria-live="polite">
      <div className="section-head">
        <h2 className="section-title">Results for “{term}”</h2>
        <span className="pill">{status === 'loading' ? 'Searching…' : `${results.length} found`}</span>
      </div>

      {status === 'error' && <p className="state">Couldn’t reach Open Library. {error}</p>}
      {status === 'done' && results.length === 0 && (
        <p className="state">No books match “{term}”. Try a different title or author.</p>
      )}

      <ul className="grid">
        {results.map((book) => (
          <li key={book.id}>
            <button type="button" className="book-card" onClick={() => onSelect(book)}>
              <Cover book={book} className="book-card-cover" />
              <span className="book-card-title">{book.title}</span>
              <span className="book-card-meta">
                {book.author}
                {book.year ? ` · ${book.year}` : ''}
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
