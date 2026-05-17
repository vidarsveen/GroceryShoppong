import { HashRouter, Routes, Route, NavLink } from 'react-router-dom'
import { BookOpen, CalendarDays, ShoppingCart } from 'lucide-react'
import OppskrifterSide from './pages/OppskrifterSide'
import OppskriftDetalj from './pages/OppskriftDetalj'
import OppskriftSkjema from './pages/OppskriftSkjema'
import UkesplanSide from './pages/UkesplanSide'
import HandlelisteSide from './pages/HandlelisteSide'
import { useHandlelisteStore } from './store/handlelisteStore'
import { useUkesplanStore } from './store/ukesplanStore'

function NavBar() {
  const { varer } = useHandlelisteStore()
  const { plan } = useUkesplanStore()
  const ikkeKjøpt = varer.filter((v) => !v.kjøpt).length

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex z-20">
      <NavLink
        to="/oppskrifter"
        className={({ isActive }) =>
          `flex-1 flex flex-col items-center py-2 gap-0.5 text-xs font-medium transition-colors ${
            isActive ? 'text-primary-600' : 'text-gray-400'
          }`
        }
      >
        <BookOpen size={22} />
        Oppskrifter
      </NavLink>
      <NavLink
        to="/ukesplan"
        className={({ isActive }) =>
          `flex-1 flex flex-col items-center py-2 gap-0.5 text-xs font-medium transition-colors relative ${
            isActive ? 'text-primary-600' : 'text-gray-400'
          }`
        }
      >
        <div className="relative">
          <CalendarDays size={22} />
          {plan.length > 0 && (
            <span className="absolute -top-1 -right-2 bg-primary-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
              {plan.length}
            </span>
          )}
        </div>
        Ukesplan
      </NavLink>
      <NavLink
        to="/handleliste"
        className={({ isActive }) =>
          `flex-1 flex flex-col items-center py-2 gap-0.5 text-xs font-medium transition-colors relative ${
            isActive ? 'text-primary-600' : 'text-gray-400'
          }`
        }
      >
        <div className="relative">
          <ShoppingCart size={22} />
          {ikkeKjøpt > 0 && (
            <span className="absolute -top-1 -right-2 bg-primary-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
              {ikkeKjøpt}
            </span>
          )}
        </div>
        Handleliste
      </NavLink>
    </nav>
  )
}

export default function App() {
  return (
    <HashRouter>
      <div className="min-h-screen pb-16">
        <Routes>
          <Route path="/" element={<OppskrifterSide />} />
          <Route path="/oppskrifter" element={<OppskrifterSide />} />
          <Route path="/oppskrifter/ny" element={<OppskriftSkjema />} />
          <Route path="/oppskrifter/:id" element={<OppskriftDetalj />} />
          <Route path="/oppskrifter/:id/rediger" element={<OppskriftSkjema />} />
          <Route path="/ukesplan" element={<UkesplanSide />} />
          <Route path="/handleliste" element={<HandlelisteSide />} />
        </Routes>
        <NavBar />
      </div>
    </HashRouter>
  )
}
