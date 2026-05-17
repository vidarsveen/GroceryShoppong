import { useNavigate } from 'react-router-dom'
import { Trash2, ShoppingCart, Users, ChevronRight } from 'lucide-react'
import { useUkesplanStore } from '../store/ukesplanStore'
import { useOppskrifterStore } from '../store/oppskrifterStore'
import { useHandlelisteStore } from '../store/handlelisteStore'

export default function UkesplanSide() {
  const navigate = useNavigate()
  const { plan, fjernMåltid, oppdaterPorsjoner, tømPlan } = useUkesplanStore()
  const { oppskrifter } = useOppskrifterStore()
  const { generer } = useHandlelisteStore()

  function lagHandleliste() {
    generer(plan, oppskrifter)
    navigate('/handleliste')
  }

  return (
    <div className="p-4 max-w-2xl mx-auto pb-32">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-primary-700">Ukesplan</h1>
        {plan.length > 0 && (
          <button
            onClick={() => {
              if (confirm('Tøm hele ukesplanen?')) tømPlan()
            }}
            className="text-xs text-red-400 font-medium"
          >
            Tøm alt
          </button>
        )}
      </div>

      {plan.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="mb-2">Ingen måltider planlagt ennå.</p>
          <button
            onClick={() => navigate('/oppskrifter')}
            className="text-primary-600 font-medium text-sm"
          >
            Gå til oppskrifter →
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {plan.map((element) => {
            const oppskrift = oppskrifter.find((o) => o.id === element.oppskriftId)
            if (!oppskrift) return null
            return (
              <div
                key={element.id}
                className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <button
                    onClick={() => navigate(`/oppskrifter/${oppskrift.id}`)}
                    className="flex items-center gap-1 font-semibold text-gray-900 text-left"
                  >
                    {oppskrift.navn}
                    <ChevronRight size={14} className="text-gray-400" />
                  </button>
                  <button
                    onClick={() => fjernMåltid(element.id)}
                    className="text-gray-300 hover:text-red-400 ml-2 flex-shrink-0"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <Users size={14} className="text-gray-400" />
                  <span className="text-xs text-gray-500 mr-2">Porsjoner:</span>
                  <button
                    onClick={() => oppdaterPorsjoner(element.id, 1)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      element.porsjoner === 1
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    1
                  </button>
                  <button
                    onClick={() => oppdaterPorsjoner(element.id, 2)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      element.porsjoner === 2
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    2
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {plan.length > 0 && (
        <div className="fixed bottom-20 left-0 right-0 px-4">
          <button
            onClick={lagHandleliste}
            className="w-full max-w-2xl mx-auto flex items-center justify-center gap-2 bg-primary-600 text-white py-3 rounded-xl font-semibold shadow-lg"
          >
            <ShoppingCart size={20} />
            Lag handleliste ({plan.length} måltider)
          </button>
        </div>
      )}
    </div>
  )
}
