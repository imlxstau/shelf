import { useEffect, useRef, useState } from 'react';
import type { Book } from '../types';
import { enrichBook } from '../api/openLibrary';
import { findOnGutenberg } from '../api/gutenberg';
import type { GutenbergMatch } from '../api/gutenberg';
import { Cover } from './Cover';

type LoadStatus = 'loading' | 'ready' | 'error';

interface BookDetailProps {
  book: Book;
  onClose: () => void;
}

export function BookDetail({ book, onClose }: BookDetailProps) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const [openLibrary, setOpenLibrary] = useState<{ status: LoadStatus; data?: Partial<Book> }>({
    status: 'loading',
  });
  const [gutenberg, setGutenberg] = useState<{ status: LoadStatus; match?: GutenbergMatch | null }>({
    status: 'loading',
  });

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    enrichBook(book, signal)
      .then((data) => {
        if (!signal.aborted) setOpenLibrary({ status: 'ready', data });
      })
      .catch(() => {
        if (!signal.aborted) setOpenLibrary({ status: 'error' });
      });

    findOnGutenberg(book.title, book.author, signal)
      .then((match) => {
        if (!signal.aborted) setGutenberg({ status: 'ready', match });
      })
      .catch(() => {
        if (!signal.aborted) setGutenberg({ status: 'error' });
      });

    return () => controller.abort();
  }, [book]);

  const view: Book = { ...book, ...openLibrary.data };
  const description =
    view.description ??
    (openLibrary.status === 'loading' ? 'Loading description…' : 'No description available for this book.');

  return (
    <div
      className="modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="book-detail-title">
        <button ref={closeRef} type="button" className="icon-button modal-close" onClick={onClose} aria-label="Close">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        <div className="modal-cover">
          <Cover book={view} size="L" className="modal-cover-image" />
        </div>

        <div className="modal-body">
          {view.genres.length > 0 && <p className="eyebrow">{view.genres.join(' · ')}</p>}
          <h2 id="book-detail-title" className="modal-title">{view.title}</h2>
          <p className="byline">by {view.author}</p>

          <dl className="facts">
            <div>
              <dt>First published</dt>
              <dd>{view.year === undefined ? '—' : view.year < 0 ? `${Math.abs(view.year)} BC` : view.year}</dd>
            </div>
            <div>
              <dt>Pages</dt>
              <dd>{view.pages ?? '—'}</dd>
            </div>
            <div>
              <dt>Rights</dt>
              <dd>{view.publicDomain ? 'Public domain' : 'In copyright'}</dd>
            </div>
          </dl>

          <p className="description">{description}</p>

          <section className="downloads" aria-labelledby="downloads-title">
            <h3 id="downloads-title" className="block-title">Get this book</h3>

            {gutenberg.status === 'loading' && <p className="muted">Checking Project Gutenberg…</p>}
            {gutenberg.status === 'error' && <p className="muted">Couldn’t reach Project Gutenberg right now.</p>}
            {gutenberg.status === 'ready' && gutenberg.match && (
              <div className="source">
                <span className="source-name">Free · Project Gutenberg</span>
                <ul className="format-list">
                  {gutenberg.match.files.map((file) => (
                    <li key={file.label}>
                      <a className="format-chip" href={file.url} target="_blank" rel="noopener noreferrer">
                        {file.label}
                        <span aria-hidden="true">↓</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {gutenberg.status === 'ready' && !gutenberg.match && (
              <p className="muted">
                Not on Project Gutenberg. Its free downloads cover public-domain titles only.
              </p>
            )}

            {view.workKey && (
              <a
                className="btn btn-ghost"
                href={`https://openlibrary.org${view.workKey}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read or borrow on Open Library ↗
              </a>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
