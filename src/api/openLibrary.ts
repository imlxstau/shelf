import type { Book } from '../types';
import { paletteFor } from '../lib/spine';

const BASE = 'https://openlibrary.org';
const SEARCH_FIELDS = 'key,title,author_name,first_publish_year,cover_i,number_of_pages_median,subject';

interface SearchDoc {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  number_of_pages_median?: number;
  subject?: string[];
}

interface WorkDoc {
  description?: string | { value: string };
}

export function coverUrl(coverId: number, size: 'S' | 'M' | 'L' = 'M'): string {
  return `https://covers.openlibrary.org/b/id/${coverId}-${size}.jpg`;
}

async function getJson<T>(url: string, signal?: AbortSignal): Promise<T> {
  const res = await fetch(url, { signal, headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Open Library request failed (${res.status})`);
  return (await res.json()) as T;
}

function docToBook(doc: SearchDoc): Book {
  const year = doc.first_publish_year;
  return {
    id: doc.key,
    title: doc.title,
    author: doc.author_name?.[0] ?? 'Unknown author',
    year,
    pages: doc.number_of_pages_median,
    color: paletteFor(doc.title),
    genres: (doc.subject ?? []).slice(0, 2),
    // Works first published before 1930 are public domain in the US.
    publicDomain: year !== undefined && year < 1930,
    coverId: doc.cover_i,
    workKey: doc.key,
  };
}

/** Open Library descriptions often end with a "----- SOURCES" block; drop it. */
function cleanDescription(text: string): string {
  return text.split(/\n-{3,}/)[0].trim();
}

export async function searchBooks(query: string, signal?: AbortSignal): Promise<Book[]> {
  const params = new URLSearchParams({ q: query, limit: '24', fields: SEARCH_FIELDS });
  const data = await getJson<{ docs: SearchDoc[] }>(`${BASE}/search.json?${params}`, signal);
  return data.docs.filter((doc) => doc.title).map(docToBook);
}

/**
 * Fills in the cover, work key and description for a book from Open Library.
 * Books that already carry a work key only need the work lookup.
 */
export async function enrichBook(book: Book, signal?: AbortSignal): Promise<Partial<Book>> {
  let workKey = book.workKey;
  let coverId = book.coverId;

  if (!workKey) {
    const params = new URLSearchParams({
      title: book.title,
      author: book.author,
      limit: '1',
      fields: SEARCH_FIELDS,
    });
    const data = await getJson<{ docs: SearchDoc[] }>(`${BASE}/search.json?${params}`, signal);
    const match = data.docs[0];
    if (!match) return {};
    workKey = match.key;
    coverId = coverId ?? match.cover_i;
  }

  const work = await getJson<WorkDoc>(`${BASE}${workKey}.json`, signal);
  const raw = typeof work.description === 'string' ? work.description : work.description?.value;

  return {
    workKey,
    coverId,
    description: book.description ?? (raw ? cleanDescription(raw) : undefined),
  };
}
