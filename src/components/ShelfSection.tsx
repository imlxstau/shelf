import type { CSSProperties } from 'react';
import type { Book, Shelf } from '../types';
import { inkFor, spineHeight, spineWidth } from '../lib/spine';

interface ShelfSectionProps {
  shelf: Shelf;
  selectedId: string | null;
  onSelect: (book: Book) => void;
}

export function ShelfSection({ shelf, selectedId, onSelect }: ShelfSectionProps) {
  const titleId = `shelf-${shelf.id}-title`;

  return (
    <section className="shelf-section" aria-labelledby={titleId}>
      <header className="shelf-header">
        <h2 id={titleId} className="shelf-title">{shelf.title}</h2>
        <span className={shelf.metaAccent ? 'shelf-meta is-accent' : 'shelf-meta'}>{shelf.meta}</span>
      </header>

      <div className="shelf">
        <ul className="shelf-books">
          {shelf.books.map((book) => (
            <li key={book.id}>
              <BookSpine book={book} selected={book.id === selectedId} onSelect={onSelect} />
            </li>
          ))}
        </ul>
        <div className="shelf-plank" aria-hidden="true" />
      </div>
    </section>
  );
}

interface BookSpineProps {
  book: Book;
  selected: boolean;
  onSelect: (book: Book) => void;
}

function BookSpine({ book, selected, onSelect }: BookSpineProps) {
  const style = {
    '--spine-color': book.color,
    '--spine-ink': inkFor(book.color),
    '--spine-width': `${spineWidth(book.pages ?? 250)}px`,
    '--spine-height': `${spineHeight(book.title)}px`,
  } as CSSProperties;

  return (
    <button
      type="button"
      className={selected ? 'spine is-selected' : 'spine'}
      style={style}
      onClick={() => onSelect(book)}
      aria-label={`${book.title} by ${book.author}`}
    >
      <span className="spine-label">
        <span className="spine-title">{book.title}</span>
        <span className="spine-author">{book.author}</span>
      </span>
    </button>
  );
}
