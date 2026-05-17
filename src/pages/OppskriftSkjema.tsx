import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Plus, Trash2 } from 'lucide-react'
import { useOppskrifterStore } from '../store/oppskrifterStore'
import type { Ingrediens, Oppskrift } from '../data/typer'

export default function OppskriftSkjema() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { oppskrifter, leggTil, oppdater } = useOppskrifterStore()

  const eksisterende = id !== 'ny' ? oppskrifter.find((o) => o.id === id) : undefined

  const [navn, setNavn] = useState(eksisterende?.navn ?? '')
  const [kilde, setKilde] = useState(eksisterende?.kilde ?? '')
  const [notater, setNotater] = useState(eksisterende?.notater ?? '')
  const [porsjoner, setPorsjoner] = useState(eksisterende?.porsjoner ?? 2)
  const [ingredienser, setIngredienser] = useState<Ingrediens[]>(
    eksisterende?.ingredienser ?? [{ navn: '', mengde: 0, enhet: '' }],
  )
  const [steg, setSteg] = useState<string[]>(eksisterende?.fremgangsmåte ?? [''])

  function oppdaterIng(i: number, felt: keyof Ingrediens, verdi: string | number) {
    setIngredienser((prev) =>
      prev.map((x, idx) => (idx === i ? { ...x, [felt]: verdi } : x)),
    )
  }

  function leggTilIng() {
    setIngredienser((prev) => [...prev, { navn: '', mengde: 0, enhet: '' }])
  }

  function fjernIng(i: number) {
    setIngredienser((prev) => prev.filter((_, idx) => idx !== i))
  }

  function oppdaterSteg(i: number, verdi: string) {
    setSteg((prev) => prev.map((x, idx) => (idx === i ? verdi : x)))
  }

  function leggTilSteg() {
    setSteg((prev) => [...prev, ''])
  }

  function fjernSteg(i: number) {
    setSteg((prev) => prev.filter((_, idx) => idx !== i))
  }

  function lagre() {
    if (!navn.trim()) return
    const oppskrift: Oppskrift = {
      id: eksisterende?.id ?? crypto.randomUUID(),
      navn: navn.trim(),
      kilde: kilde.trim() || undefined,
      notater: notater.trim() || undefined,
      porsjoner,
      ingredienser: ingredienser.filter((i) => i.navn.trim()),
      fremgangsmåte: steg.filter((s) => s.trim()),
    }
    if (eksisterende) {
      oppdater(oppskrift)
    } else {
      leggTil(oppskrift)
    }
    navigate(`/oppskrifter/${oppskrift.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto pb-24">
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between z-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-600">
          <ArrowLeft size={18} />
          Avbryt
        </button>
        <button
          onClick={lagre}
          disabled={!navn.trim()}
          className="bg-primary-600 disabled:bg-gray-200 text-white px-4 py-1.5 rounded-lg text-sm font-medium"
        >
          Lagre
        </button>
      </div>

      <div className="p-4 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Navn *</label>
          <input
            value={navn}
            onChange={(e) => setNavn(e.target.value)}
            placeholder="F.eks. Pasta med pesto og laks"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400"
          />
        </div>

        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">Kilde (URL)</label>
            <input
              value={kilde}
              onChange={(e) => setKilde(e.target.value)}
              placeholder="https://..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
          <div className="w-24">
            <label className="block text-sm font-medium text-gray-700 mb-1">Porsjoner</label>
            <select
              value={porsjoner}
              onChange={(e) => setPorsjoner(Number(e.target.value))}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Ingredienser */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-gray-800">Ingredienser</h2>
            <button
              onClick={leggTilIng}
              className="flex items-center gap-1 text-xs text-primary-600 font-medium"
            >
              <Plus size={14} />
              Legg til
            </button>
          </div>
          <div className="space-y-2">
            {ingredienser.map((ing, i) => (
              <div key={i} className="flex gap-2 items-center">
                <input
                  value={ing.navn}
                  onChange={(e) => oppdaterIng(i, 'navn', e.target.value)}
                  placeholder="Ingrediens"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
                <input
                  type="number"
                  value={ing.mengde || ''}
                  onChange={(e) => oppdaterIng(i, 'mengde', parseFloat(e.target.value) || 0)}
                  placeholder="Mengde"
                  className="w-20 border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
                <input
                  value={ing.enhet}
                  onChange={(e) => oppdaterIng(i, 'enhet', e.target.value)}
                  placeholder="Enhet"
                  className="w-16 border border-gray-200 rounded-lg px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
                <button onClick={() => fjernIng(i)} className="text-gray-300 hover:text-red-400">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Fremgangsmåte */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold text-gray-800">Fremgangsmåte</h2>
            <button
              onClick={leggTilSteg}
              className="flex items-center gap-1 text-xs text-primary-600 font-medium"
            >
              <Plus size={14} />
              Legg til steg
            </button>
          </div>
          <div className="space-y-2">
            {steg.map((s, i) => (
              <div key={i} className="flex gap-2 items-start">
                <span className="mt-2 w-5 h-5 flex-shrink-0 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">
                  {i + 1}
                </span>
                <textarea
                  value={s}
                  onChange={(e) => oppdaterSteg(i, e.target.value)}
                  placeholder={`Steg ${i + 1}`}
                  rows={2}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
                />
                <button onClick={() => fjernSteg(i)} className="mt-2 text-gray-300 hover:text-red-400">
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Notater */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Notater</label>
          <textarea
            value={notater}
            onChange={(e) => setNotater(e.target.value)}
            placeholder="Tips, varianter, spesielle hensyn..."
            rows={3}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
          />
        </div>
      </div>
    </div>
  )
}
