export interface Ingrediens {
  navn: string
  mengde: number
  enhet: string
}

export interface Oppskrift {
  id: string
  navn: string
  kilde?: string
  porsjoner: number
  ingredienser: Ingrediens[]
  fremgangsmåte: string[]
  notater?: string
  bilde?: string
}

export interface UkesPlanElement {
  id: string
  oppskriftId: string
  porsjoner: number        // 1 eller 2
  dag?: string
}

export interface HandlelisteElement {
  id: string
  navn: string
  mengde: number
  enhet: string
  kjøpt: boolean
  manuell: boolean
}
