import type { Shelf } from '../types';

/** Days until the next Halloween (Oct 31), counted from today. */
export function halloweenMeta(now: Date = new Date()): string {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let target = new Date(today.getFullYear(), 9, 31);
  if (target < today) target = new Date(today.getFullYear() + 1, 9, 31);
  const days = Math.round((target.getTime() - today.getTime()) / 86_400_000);
  if (days === 0) return 'Halloween is today';
  if (days === 1) return 'Halloween in 1 day';
  return `Halloween in ${days} days`;
}

export const shelves: Shelf[] = [
  {
    id: 'spooky',
    title: 'Spooky reads',
    meta: halloweenMeta(),
    metaAccent: true,
    books: [
      { id: 'it', title: 'It', author: 'Stephen King', year: 1986, pages: 1138, color: '#2b2b2e', genres: ['Horror'], publicDomain: false, description: 'A group of childhood friends reunite in their hometown of Derry to confront a shapeshifting evil that returns every few decades.' },
      { id: 'shining', title: 'The Shining', author: 'Stephen King', year: 1977, pages: 447, color: '#1f1f22', genres: ['Horror'], publicDomain: false, description: 'A recovering alcoholic takes a winter caretaking job at an isolated mountain hotel, where the past refuses to stay buried.' },
      { id: 'misery', title: 'Misery', author: 'Stephen King', year: 1987, pages: 310, color: '#26272b', genres: ['Thriller', 'Horror'], publicDomain: false, description: 'A novelist rescued from a car crash discovers that his nurse is his most devoted, and most dangerous, fan.' },
      { id: 'carrie', title: 'Carrie', author: 'Stephen King', year: 1974, pages: 199, color: '#1c1c1f', genres: ['Horror'], publicDomain: false, description: 'A bullied teenager with telekinetic powers pushes back against her tormentors at the senior prom.' },
      { id: 'dracula', title: 'Dracula', author: 'Bram Stoker', year: 1897, pages: 418, color: '#d9d6c3', genres: ['Gothic'], publicDomain: true, description: 'A young English solicitor travels to Transylvania to finalise a property deal and finds himself a prisoner of a count.' },
      { id: 'pet-sematary', title: 'Pet Sematary', author: 'Stephen King', year: 1983, pages: 374, color: '#2b1f1d', genres: ['Horror'], publicDomain: false, description: 'A doctor moves his family to rural Maine, where a burial ground behind their new house has a terrible power.' },
      { id: 'frankenstein', title: 'Frankenstein; or, The Modern Prometheus', author: 'Mary Shelley', year: 1818, pages: 280, color: '#5d6b4f', genres: ['Gothic', 'Sci-fi'], publicDomain: true, description: 'Driven by ambition, a young scientist brings a creature to life and must face what he has made.' },
      { id: 'dorian-gray', title: 'The Picture of Dorian Gray', author: 'Oscar Wilde', year: 1890, pages: 254, color: '#3e4433', genres: ['Gothic', 'Classic'], publicDomain: true, description: 'A beautiful young man sells his soul so that a portrait will age while he stays youthful, and the portrait bears the cost.' },
      { id: 'green-mile', title: 'The Green Mile', author: 'Stephen King', year: 1996, pages: 400, color: '#26272a', genres: ['Fantasy', 'Drama'], publicDomain: false, description: 'A death-row guard in 1930s Louisiana meets a prisoner with an extraordinary gift.' },
    ],
  },
  {
    id: 'this-week',
    title: 'This week',
    meta: 'Most read on Open Library',
    books: [
      { id: 'atomic-habits', title: 'Atomic Habits', author: 'James Clear', year: 2018, pages: 320, color: '#d8d4cc', genres: ['Self-help'], publicDomain: false, description: 'A practical framework for building good habits and breaking bad ones through small, consistent changes.' },
      { id: '48-laws', title: 'The 48 Laws of Power', author: 'Robert Greene', year: 1998, pages: 452, color: '#c0392b', genres: ['Strategy'], publicDomain: false, description: 'A study of power dynamics drawn from history, distilled into 48 laws with commentary and examples.' },
      { id: 'rich-dad', title: 'Rich Dad Poor Dad', author: 'Robert T. Kiyosaki', year: 1997, pages: 336, color: '#4a4145', genres: ['Personal finance'], publicDomain: false, description: 'Contrasts two fathers’ views on money, work and assets, and why financial education matters.' },
      { id: 'psychology-money', title: 'The Psychology of Money', author: 'Morgan Housel', year: 2020, pages: 256, color: '#bdb3a0', genres: ['Personal finance'], publicDomain: false, description: 'Short essays on how behaviour, not just knowledge, shapes the way people make and keep money.' },
      { id: 'harry-potter', title: 'Harry Potter and the Philosopher’s Stone', author: 'J.K. Rowling', year: 1997, pages: 309, color: '#a8405a', genres: ['Fantasy'], publicDomain: false, description: 'An orphaned boy discovers he is a wizard and enrols at Hogwarts School of Witchcraft and Wizardry.' },
      { id: 'win-friends', title: 'How to Win Friends and Influence People', author: 'Dale Carnegie', year: 1936, pages: 291, color: '#eeeeea', genres: ['Self-help'], publicDomain: false, description: 'Timeless principles for handling people, making a good impression and persuading others.' },
      { id: 'essentialism', title: 'Essentialism', author: 'Greg McKeown', year: 2014, pages: 272, color: '#b5773e', genres: ['Productivity'], publicDomain: false, description: 'The disciplined pursuit of less: how to focus on what truly matters and let go of the rest.' },
      { id: 'subtle-art', title: 'The Subtle Art of Not Giving a F*ck', author: 'Mark Manson', year: 2016, pages: 224, color: '#d35f1e', genres: ['Self-help'], publicDomain: false, description: 'A blunt counter-argument to positive thinking: choose what deserves your concern and let the rest go.' },
    ],
  },
  {
    id: 'classics',
    title: 'Free classics',
    meta: 'Public domain',
    books: [
      { id: 'art-of-war', title: 'The Art of War', author: 'Sun Tzu', year: -500, pages: 110, color: '#2c3a2a', genres: ['Strategy', 'Classic'], publicDomain: true, description: 'An ancient Chinese military treatise on strategy, planning and the art of winning without fighting.' },
      { id: 'metamorphosis', title: 'Metamorphosis', author: 'Franz Kafka', year: 1915, pages: 66, color: '#b3a77e', genres: ['Fiction'], publicDomain: true, description: 'A travelling salesman wakes one morning transformed into a giant insect.' },
      { id: 'wuthering-heights', title: 'Wuthering Heights', author: 'Emily Brontë', year: 1847, pages: 416, color: '#2b2b2f', genres: ['Gothic', 'Romance'], publicDomain: true, description: 'A turbulent love story across the Yorkshire moors, spanning two generations.' },
      { id: 'sherlock', title: 'The Adventures of Sherlock Holmes', author: 'Arthur Conan Doyle', year: 1892, pages: 307, color: '#2e4a6b', genres: ['Mystery'], publicDomain: true, description: 'Twelve short stories featuring the consulting detective and his faithful companion, Dr. Watson.' },
      { id: 'alice', title: 'Alice’s Adventures in Wonderland', author: 'Lewis Carroll', year: 1865, pages: 192, color: '#4e2e24', genres: ['Fantasy', 'Children'], publicDomain: true, description: 'A curious girl tumbles down a rabbit hole into a world of peculiar creatures and nonsense logic.' },
      { id: 'the-prince', title: 'The Prince', author: 'Niccolò Machiavelli', year: 1532, pages: 140, color: '#4a3420', genres: ['Politics', 'Classic'], publicDomain: true, description: 'A frank guide for rulers on acquiring and keeping power.' },
      { id: 'invisible-man', title: 'The Invisible Man', author: 'H. G. Wells', year: 1897, pages: 176, color: '#7fa3a0', genres: ['Sci-fi'], publicDomain: true, description: 'A scientist discovers how to become invisible, and the consequences quickly spiral out of control.' },
      { id: 'moby-dick', title: 'Moby-Dick', author: 'Herman Melville', year: 1851, pages: 635, color: '#c4a96a', genres: ['Adventure'], publicDomain: true, description: 'Captain Ahab pursues the white whale that took his leg, aboard the whaler Pequod.' },
      { id: 'hamlet', title: 'Hamlet', author: 'William Shakespeare', year: 1603, pages: 180, color: '#e8e3d0', genres: ['Tragedy', 'Drama'], publicDomain: true, description: 'A Danish prince vows revenge on the uncle who murdered his father and seized the throne.' },
    ],
  },
];
