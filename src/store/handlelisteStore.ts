import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { HandlelisteElement, Oppskrift, UkesPlanElement } from '../data/typer'

function normaliserEnhet(enhet: string): string {
  return enhet.toLowerCase().trim()
}

export function genererHandleliste(
  plan: UkesPlanElement[],
  oppskrifter: Oppskrift[],
): HandlelisteElement[] {
  const map = new Map<string, HandlelisteElement>()

  for (const element of plan) {
    const oppskrift = oppskrifter.find((o) => o.id === element.oppskriftId)
    if (!oppskrift) continue

    const faktor = element.porsjoner / oppskrift.porsjoner

    for (const ing of oppskrift.ingredienser) {
      const nøkkel = `${ing.navn.toLowerCase()}__${normaliserEnhet(ing.enhet)}`
      const existing = map.get(nøkkel)
      if (existing) {
        existing.mengde = Math.round((existing.mengde + ing.mengde * faktor) * 100) / 100
      } else {
        map.set(nøkkel, {
          id: crypto.randomUUID(),
          navn: ing.navn,
          mengde: Math.round(ing.mengde * faktor * 100) / 100,
          enhet: ing.enhet,
          kjøpt: false,
          manuell: false,
        })
      }
    }
  }

  return Array.from(map.values())
}

interface HandlelisteState {
  varer: HandlelisteElement[]
  generer: (plan: UkesPlanElement[], oppskrifter: Oppskrift[]) => void
  merkKjøpt: (id: string, kjøpt: boolean) => void
  leggTilManuell: (navn: string, mengde: number, enhet: string) => void
  fjern: (id: string) => void
  tøm: () => void
}

export const useHandlelisteStore = create<HandlelisteState>()(
  persist(
    (set) => ({
      varer: [],
      generer: (plan, oppskrifter) =>
        set((s) => {
          const genererte = genererHandleliste(plan, oppskrifter)
          const manuelle = s.varer.filter((v) => v.manuell)
          return { varer: [...genererte, ...manuelle] }
        }),
      merkKjøpt: (id, kjøpt) =>
        set((s) => ({
          varer: s.varer.map((v) => (v.id === id ? { ...v, kjøpt } : v)),
        })),
      leggTilManuell: (navn, mengde, enhet) =>
        set((s) => ({
          varer: [
            ...s.varer,
            { id: crypto.randomUUID(), navn, mengde, enhet, kjøpt: false, manuell: true },
          ],
        })),
      fjern: (id) =>
        set((s) => ({ varer: s.varer.filter((v) => v.id !== id) })),
      tøm: () => set({ varer: [] }),
    }),
    { name: 'matkasse-handleliste' },
  ),
)
