import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Edit, Trash2, ExternalLink, Users } from 'lucide-react'
import { useOppskrifterStore } from '../store/oppskrifterStore'
import { useUkesplanStore } from '../store/ukesplanStore'

export default function OppskriftDetalj() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { oppskrifter, slett } = useOppskrifterStore()
  const { leggTilMåltid } = useUkesplanStore()

  const oppskrift = oppskrifter.find((o) => o.id === id)

  if (!oppskrift) {
    return (
      <div className="p-4 text-center text-gray-500">
        Oppskrift ikke funnet.{' '}
        <Link to="/oppskrifter" className="text-primary-600 underline">
          Tilbake
        </Link>
      </div>
    )
  }

  function handleSlett() {
    if (confirm(`Slett «${oppskrift!.navn}»?`)) {
      slett(oppskrift!.id)
      navigate('/oppskrifter')
    }
  }

  function leggTilPlan(porsjoner: 1 | 2) {
    leggTilMåltid(oppskrift!.id, porsjoner)
    navigate('/ukesplan')
  }

  return (
    <div className="max-w-2xl mx-auto pb-24">
      <div className="sticky top-0 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between z-10">
        <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-gray-600">
          <ArrowLeft size={18} />
          Tilbake
        </button>
        <div className="flex gap-3">
          <Link to={`/oppskrifter/${id}/rediger`} className="text-primary-600">
            <Edit size={20} />
          </Link>
          <button onClick={handleSlett} className="text-red-400">
            <Trash2 size={20} />
          </button>
        </div>
      </div>

      <div className="p-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{oppskrift.navn}</h1>

        {oppskrift.kilde && (
          <a
            href={oppskrift.kilde}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-primary-600 mb-4"
          >
            <ExternalLink size={12} />
            Kilde
          </a>
        )}

        {oppskrift.notater && (
          <p className="text-sm text-gray-500 italic mb-4 bg-gray-50 rounded-lg p-3">
            {oppskrift.notater}
          </p>
        )}

        {/* Legg til i ukesplan */}
        <div className="bg-primary-50 rounded-xl p-4 mb-6">
          <p className="text-sm font-medium text-primary-800 mb-2 flex items-center gap-1">
            <Users size={14} />
            Legg til i ukesplan
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => leggTilPlan(1)}
              className="flex-1 bg-white border border-primary-300 text-primary-700 py-2 rounded-lg text-sm font-medium"
            >
              1 porsjon
            </button>
            <button
              onClick={() => leggTilPlan(2)}
              className="flex-1 bg-primary-600 text-white py-2 rounded-lg text-sm font-medium"
            >
              2 porsjoner
            </button>
          </div>
        </div>

        {/* Ingredienser */}
        <h2 className="font-semibold text-gray-800 mb-2">
          Ingredienser ({oppskrift.porsjoner} porsjoner)
        </h2>
        <ul className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50 mb-6">
          {oppskrift.ingredienser.map((ing, i) => (
            <li key={i} className="flex justify-between px-4 py-2.5 text-sm">
              <span className="text-gray-800">{ing.navn}</span>
              <span className="text-gray-500 font-medium">
                {ing.mengde} {ing.enhet}
              </span>
            </li>
          ))}
        </ul>

        {/* Fremgangsmåte */}
        <h2 className="font-semibold text-gray-800 mb-2">Fremgangsmåte</h2>
        <ol className="space-y-3">
          {oppskrift.fremgangsmåte.map((steg, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center font-bold text-xs">
                {i + 1}
              </span>
              <p className="text-gray-700 leading-relaxed">{steg}</p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}
