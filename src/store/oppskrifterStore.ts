import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Oppskrift } from '../data/typer'
import { startoppskrifter } from '../data/startoppskrifter'

interface OppskrifterState {
  oppskrifter: Oppskrift[]
  leggTil: (o: Oppskrift) => void
  oppdater: (o: Oppskrift) => void
  slett: (id: string) => void
}

export const useOppskrifterStore = create<OppskrifterState>()(
  persist(
    (set) => ({
      oppskrifter: startoppskrifter,
      leggTil: (o) => set((s) => ({ oppskrifter: [...s.oppskrifter, o] })),
      oppdater: (o) =>
        set((s) => ({
          oppskrifter: s.oppskrifter.map((x) => (x.id === o.id ? o : x)),
        })),
      slett: (id) =>
        set((s) => ({ oppskrifter: s.oppskrifter.filter((x) => x.id !== id) })),
    }),
    { name: 'matkasse-oppskrifter' },
  ),
)
