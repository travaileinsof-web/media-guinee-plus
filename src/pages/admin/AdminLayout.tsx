import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FileText, LayoutDashboard, Settings, Tags, LogOut, Radio, 
  Image, Users, Handshake, FileEdit, ChevronLeft, ChevronRight,
  Bell, Search, User
} from 'lucide-react';
import { useState } from 'react';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
  { name: 'Articles', path: '/admin/articles', icon: <FileText className="w-5 h-5" /> },
  { name: 'Catégories', path: '/admin/categories', icon: <Tags className="w-5 h-5" /> },
  { name: 'Chroniques', path: '/admin/chroniques', icon: <Radio className="w-5 h-5" /> },
  { name: 'Publicités', path: '/admin/ads', icon: <Image className="w-5 h-5" /> },
  { name: 'Pages', path: '/admin/pages', icon: <FileEdit className="w-5 h-5" /> },
  { name: 'Équipe', path: '/admin/equipe', icon: <Users className="w-5 h-5" /> },
  { name: 'Partenaires', path: '/admin/partenaires', icon: <Handshake className="w-5 h-5" /> },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-gray-900">
      {/* Sidebar Collapsible */}
      <aside 
        className={`${isCollapsed ? 'w-20' : 'w-64'} bg-white border-r border-gray-100 flex flex-col transition-all duration-300 relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]`}
      >
        <div className="h-16 flex items-center justify-center border-b border-gray-100 px-4 relative">
          {!isCollapsed ? (
            <span className="text-xl font-serif font-black tracking-tighter">
              Guinée<span className="text-brand-red">+</span>
            </span>
          ) : (
            <span className="text-xl font-serif font-black text-brand-red">G+</span>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-5 bg-white border border-gray-200 rounded-full p-1 text-gray-400 hover:text-brand-red hover:shadow-md transition-all"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1 hide-scrollbar">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                title={isCollapsed ? item.name : undefined}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-brand-red text-white shadow-md shadow-brand-red/20' 
                    : 'text-gray-500 hover:bg-red-50 hover:text-brand-red'
                }`}
              >
                <div className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-brand-red'}`}>
                  {item.icon}
                </div>
                {!isCollapsed && <span className="font-semibold text-sm">{item.name}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-2">
          <Link
            to="/admin/settings"
            title={isCollapsed ? "Paramètres" : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
              location.pathname === '/admin/settings' 
                ? 'bg-gray-900 text-white shadow-md' 
                : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'
            }`}
          >
            <Settings className={`w-5 h-5 ${location.pathname === '/admin/settings' ? 'text-white' : 'text-gray-400 group-hover:text-gray-900'}`} />
            {!isCollapsed && <span className="font-semibold text-sm">Paramètres</span>}
          </Link>
          <button
            onClick={handleLogout}
            title={isCollapsed ? "Déconnexion" : undefined}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:bg-red-50 hover:text-brand-red transition-all duration-200 group"
          >
            <LogOut className="w-5 h-5 text-gray-400 group-hover:text-brand-red" />
            {!isCollapsed && <span className="font-semibold text-sm">Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Minimalist Topbar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0 relative z-10">
          <div className="flex-1 flex items-center">
            <div className="relative w-96 hidden md:block group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-red transition-colors" />
              <input 
                type="text" 
                placeholder="Recherche globale (articles, pages...)" 
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:bg-white transition-all"
              />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-gray-400 hover:text-brand-red transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-red rounded-full border-2 border-white"></span>
            </button>
            <div className="w-px h-6 bg-gray-200"></div>
            <button className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900 leading-none">Admin</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mt-1">Super Utilisateur</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-brand-red to-orange-500 flex items-center justify-center text-white shadow-sm">
                <User className="w-5 h-5" />
              </div>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
