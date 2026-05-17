import { useState } from 'react'
import { Plus, Trash2, RefreshCw } from 'lucide-react'
import { useHandlelisteStore } from '../store/handlelisteStore'
import { useUkesplanStore } from '../store/ukesplanStore'
import { useOppskrifterStore } from '../store/oppskrifterStore'

export default function HandlelisteSide() {
  const { varer, merkKjøpt, leggTilManuell, fjern, generer, tøm } = useHandlelisteStore()
  const { plan } = useUkesplanStore()
  const { oppskrifter } = useOppskrifterStore()

  const [nyVare, setNyVare] = useState('')
  const [nyMengde, setNyMengde] = useState('')
  const [nyEnhet, setNyEnhet] = useState('')
  const [visLeggTil, setVisLeggTil] = useState(false)

  const ikkeKjøpt = varer.filter((v) => !v.kjøpt)
  const kjøpt = varer.filter((v) => v.kjøpt)

  function leggTil() {
    if (!nyVare.trim()) return
    leggTilManuell(nyVare.trim(), parseFloat(nyMengde) || 1, nyEnhet.trim() || 'stk')
    setNyVare('')
    setNyMengde('')
    setNyEnhet('')
    setVisLeggTil(false)
  }

  return (
    <div className="p-4 max-w-2xl mx-auto pb-24">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-primary-700">Handleliste</h1>
        <div className="flex gap-3">
          <button
            onClick={() => generer(plan, oppskrifter)}
            className="flex items-center gap-1 text-xs text-primary-600 font-medium"
            title="Regenerer fra ukesplan"
          >
            <RefreshCw size={14} />
            Oppdater
          </button>
          {varer.length > 0 && (
            <button
              onClick={() => { if (confirm('Tøm handlelisten?')) tøm() }}
              className="text-xs text-red-400 font-medium"
            >
              Tøm
            </button>
          )}
        </div>
      </div>

      {varer.length === 0 && (
        <p className="text-center text-gray-400 py-8 text-sm">
          Handlelisten er tom. Legg til måltider i ukesplanen og trykk «Lag handleliste».
        </p>
      )}

      {/* Ikke kjøpt */}
      {ikkeKjøpt.length > 0 && (
        <ul className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50 mb-4">
          {ikkeKjøpt.map((v) => (
            <li key={v.id} className="flex items-center px-4 py-3 gap-3">
              <button
                onClick={() => merkKjøpt(v.id, true)}
                className="w-5 h-5 rounded-full border-2 border-gray-300 flex-shrink-0"
              />
              <span className="flex-1 text-sm text-gray-900">{v.navn}</span>
              <span className="text-xs text-gray-400 font-medium">
                {v.mengde} {v.enhet}
              </span>
              {v.manuell && (
                <button onClick={() => fjern(v.id)} className="text-gray-200 hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Kjøpt */}
      {kjøpt.length > 0 && (
        <div className="mb-4">
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-2 px-1">
            Kjøpt ({kjøpt.length})
          </p>
          <ul className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50 opacity-60">
            {kjøpt.map((v) => (
              <li key={v.id} className="flex items-center px-4 py-3 gap-3">
                <button
                  onClick={() => merkKjøpt(v.id, false)}
                  className="w-5 h-5 rounded-full bg-primary-500 border-2 border-primary-500 flex-shrink-0 flex items-center justify-center"
                >
                  <svg viewBox="0 0 10 8" className="w-3 h-3 fill-white">
                    <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>
                <span className="flex-1 text-sm line-through text-gray-400">{v.navn}</span>
                <span className="text-xs text-gray-300">
                  {v.mengde} {v.enhet}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Legg til manuell vare */}
      {visLeggTil ? (
        <div className="bg-white rounded-xl border border-primary-200 p-4 space-y-2">
          <input
            value={nyVare}
            onChange={(e) => setNyVare(e.target.value)}
            placeholder="Varenavn"
            autoFocus
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            onKeyDown={(e) => e.key === 'Enter' && leggTil()}
          />
          <div className="flex gap-2">
            <input
              type="number"
              value={nyMengde}
              onChange={(e) => setNyMengde(e.target.value)}
              placeholder="Mengde"
              className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
            <input
              value={nyEnhet}
              onChange={(e) => setNyEnhet(e.target.value)}
              placeholder="Enhet (stk, g, ...)"
              className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setVisLeggTil(false)}
              className="flex-1 border border-gray-200 text-gray-600 py-2 rounded-lg text-sm"
            >
              Avbryt
            </button>
            <button
              onClick={leggTil}
              disabled={!nyVare.trim()}
              className="flex-1 bg-primary-600 disabled:bg-gray-200 text-white py-2 rounded-lg text-sm font-medium"
            >
              Legg til
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setVisLeggTil(true)}
          className="flex items-center gap-2 text-primary-600 text-sm font-medium py-2"
        >
          <Plus size={16} />
          Legg til vare manuelt
        </button>
      )}
    </div>
  )
}
