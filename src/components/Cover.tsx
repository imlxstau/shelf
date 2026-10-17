import { useState } from 'react';
import type { CSSProperties } from 'react';
import type { Book } from '../types';
import { coverUrl } from '../api/openLibrary';
import { inkFor } from '../lib/spine';

interface CoverProps {
  book: Book;
  size?: 'M' | 'L';
  className?: string;
}

export function Cover({ book, size = 'M', className }: CoverProps) {
  const [failed, setFailed] = useState(false);
  const base = className ? `cover ${className}` : 'cover';

  if (book.coverId && !failed) {
    return (
      <img
        className={`${base} cover-img`}
        src={coverUrl(book.coverId, size)}
        alt={`Cover of ${book.title}`}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div
      className={`${base} cover-fallback`}
      role="img"
      aria-label={`${book.title} by ${book.author}`}
      style={{ '--cover-color': book.color, '--cover-ink': inkFor(book.color) } as CSSProperties}
    >
      <span className="cover-fallback-author">{book.author}</span>
      <span className="cover-fallback-title">{book.title}</span>
    </div>
  );
}
