import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Search } from 'lucide-react'
import { useOppskrifterStore } from '../store/oppskrifterStore'

export default function OppskrifterSide() {
  const { oppskrifter } = useOppskrifterStore()
  const [søk, setSøk] = useState('')

  const filtrerte = oppskrifter.filter((o) =>
    o.navn.toLowerCase().includes(søk.toLowerCase()),
  )

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-primary-700">Oppskrifter</h1>
        <Link
          to="/oppskrifter/ny"
          className="flex items-center gap-1 bg-primary-600 text-white px-3 py-2 rounded-lg text-sm font-medium"
        >
          <Plus size={16} />
          Ny
        </Link>
      </div>

      <div className="relative mb-4">
        <Search size={16} className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Søk i oppskrifter..."
          value={søk}
          onChange={(e) => setSøk(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
      </div>

      <div className="space-y-3">
        {filtrerte.map((o) => (
          <Link
            key={o.id}
            to={`/oppskrifter/${o.id}`}
            className="block bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:border-primary-300 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <h2 className="font-semibold text-gray-900">{o.navn}</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {o.ingredienser.length} ingredienser · {o.porsjoner} porsjoner
                </p>
              </div>
              <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full">
                {o.porsjoner}p
              </span>
            </div>
            {o.notater && (
              <p className="text-xs text-gray-400 mt-2 italic">{o.notater}</p>
            )}
          </Link>
        ))}

        {filtrerte.length === 0 && (
          <p className="text-center text-gray-400 py-8">Ingen oppskrifter funnet.</p>
        )}
      </div>
    </div>
  )
}
