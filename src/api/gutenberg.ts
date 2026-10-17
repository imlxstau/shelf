export interface GutenbergFile {
  label: string;
  url: string;
}

export interface GutenbergMatch {
  id: number;
  url: string;
  files: GutenbergFile[];
}

interface GutendexBook {
  id: number;
  title: string;
  authors: { name: string }[];
  formats: Record<string, string>;
}

const FORMATS: { label: string; matches: (mime: string) => boolean }[] = [
  { label: 'EPUB', matches: (mime) => mime === 'application/epub+zip' },
  { label: 'Kindle', matches: (mime) => mime === 'application/x-mobipocket-ebook' },
  { label: 'Plain text', matches: (mime) => mime.startsWith('text/plain') && mime.includes('utf-8') },
  { label: 'HTML', matches: (mime) => mime.startsWith('text/html') },
];

const normalize = (value: string) =>
  value
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

/**
 * Looks up a book on Project Gutenberg (public-domain titles only) through the
 * public Gutendex catalogue API. Returns null when there is no exact match.
 */
export async function findOnGutenberg(
  title: string,
  author: string,
  signal?: AbortSignal,
): Promise<GutenbergMatch | null> {
  // Gutendex matches straight apostrophes; curly ones return no results.
  const params = new URLSearchParams({ search: title.replace(/[‘’]/g, "'") });
  const res = await fetch(`https://gutendex.com/books/?${params}`, {
    signal,
    headers: { Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`Gutendex request failed (${res.status})`);
  const data = (await res.json()) as { results: GutendexBook[] };

  const wantedTitle = normalize(title);
  const lastName = normalize(author).split(' ').pop() ?? '';
  const hit = data.results.find((book) => {
    const candidate = normalize(book.title);
    const titleMatches = candidate === wantedTitle || candidate.startsWith(wantedTitle);
    const authorMatches = book.authors.some((a) => normalize(a.name).includes(lastName));
    return titleMatches && authorMatches;
  });
  if (!hit) return null;

  const files = FORMATS.flatMap(({ label, matches }) => {
    const entry = Object.entries(hit.formats).find(([mime]) => matches(mime));
    return entry ? [{ label, url: entry[1] }] : [];
  });
  if (files.length === 0) return null;

  return { id: hit.id, url: `https://www.gutenberg.org/ebooks/${hit.id}`, files };
}
