import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UkesPlanElement } from '../data/typer'

interface UkesplanState {
  plan: UkesPlanElement[]
  leggTilMåltid: (oppskriftId: string, porsjoner: 1 | 2, dag?: string) => void
  oppdaterPorsjoner: (id: string, porsjoner: 1 | 2) => void
  fjernMåltid: (id: string) => void
  tømPlan: () => void
}

export const useUkesplanStore = create<UkesplanState>()(
  persist(
    (set) => ({
      plan: [],
      leggTilMåltid: (oppskriftId, porsjoner, dag) =>
        set((s) => ({
          plan: [
            ...s.plan,
            { id: crypto.randomUUID(), oppskriftId, porsjoner, dag },
          ],
        })),
      oppdaterPorsjoner: (id, porsjoner) =>
        set((s) => ({
          plan: s.plan.map((x) => (x.id === id ? { ...x, porsjoner } : x)),
        })),
      fjernMåltid: (id) =>
        set((s) => ({ plan: s.plan.filter((x) => x.id !== id) })),
      tømPlan: () => set({ plan: [] }),
    }),
    { name: 'matkasse-ukesplan' },
  ),
)
