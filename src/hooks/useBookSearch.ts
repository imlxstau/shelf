import { useEffect, useState } from 'react';
import { searchBooks } from '../api/openLibrary';
import type { Book } from '../types';

export type SearchStatus = 'idle' | 'loading' | 'done' | 'error';

const DEBOUNCE_MS = 350;

export function useBookSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Book[]>([]);
  const [status, setStatus] = useState<SearchStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      setResults([]);
      setStatus('idle');
      setError(null);
      return;
    }

    const controller = new AbortController();
    setStatus('loading');

    const timer = window.setTimeout(() => {
      searchBooks(term, controller.signal)
        .then((books) => {
          setResults(books);
          setError(null);
          setStatus('done');
        })
        .catch((err: unknown) => {
          if (controller.signal.aborted) return;
          setError(err instanceof Error ? err.message : 'Something went wrong.');
          setStatus('error');
        });
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  return { query, setQuery, results, status, error };
}
