export interface Book {
  id: string;
  title: string;
  author: string;
  year?: number;
  pages?: number;
  /** Spine / placeholder cover colour as a hex string, e.g. #2b2b2e */
  color: string;
  genres: string[];
  publicDomain: boolean;
  description?: string;
  /** Open Library cover id, used to load a real cover image */
  coverId?: number;
  /** Open Library work key, e.g. /works/OL81633W */
  workKey?: string;
}

export interface Shelf {
  id: string;
  title: string;
  meta: string;
  metaAccent?: boolean;
  books: Book[];
}
