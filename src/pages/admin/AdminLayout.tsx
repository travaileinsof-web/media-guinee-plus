import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  FileText, LayoutDashboard, Settings, Tags, LogOut, Radio, 
  Image, Users, Handshake, FileEdit, ChevronLeft, ChevronRight,
  Bell, Search, User, AlertTriangle, Menu, X
} from 'lucide-react';
import { useLayoutEffect, useState } from 'react';
import { authFetch } from '../../lib/auth';
import { Toaster, toast } from 'sonner';
import { AdminPageSkeleton } from '../../components/AdminSkeleton';

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
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isChangingPwd, setIsChangingPwd] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  useLayoutEffect(() => {
    setIsPageLoading(true);
    const loadingTimer = window.setTimeout(() => setIsPageLoading(false), 360);

    return () => window.clearTimeout(loadingTimer);
  }, [location.pathname]);

  
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) return toast.error('Nouveau mot de passe trop court (min 6)');
    setIsChangingPwd(true);
    try {
      const res = await authFetch('/api/admin/password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword })
      });
      if (res.ok) {
        toast.success('Mot de passe mis à jour avec succès');
        setIsPasswordModalOpen(false);
        setOldPassword('');
        setNewPassword('');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      toast.error('Erreur système');
    } finally {
      setIsChangingPwd(false);
    }
  };

  const confirmLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  return (
    <div className="h-screen overflow-hidden bg-[#F8FAFC] flex font-sans text-gray-900">
      <Toaster position="top-right" richColors />
      {/* Sidebar Collapsible */}
      {isMobileSidebarOpen && (
        <button
          aria-label="Fermer le menu"
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 z-30 bg-gray-950/40 backdrop-blur-sm lg:hidden"
        />
      )}
      <aside 
        className={`${isCollapsed ? 'lg:w-20' : 'lg:w-64'} fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-gray-100 bg-white shadow-[8px_0_30px_rgba(0,0,0,0.08)] transition-transform duration-300 lg:relative lg:z-20 lg:translate-x-0 lg:shadow-[4px_0_24px_rgba(0,0,0,0.02)] ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="relative flex h-18 items-center justify-center border-b border-gray-100 px-4">
          {!isCollapsed ? (
            <span className="text-xl font-serif font-black tracking-tighter">
              Guinée<span className="text-brand-red">+</span>
            </span>
          ) : (
            <span className="text-xl font-serif font-black text-brand-red">G+</span>
          )}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            aria-label={isCollapsed ? 'Développer la sidebar' : 'Réduire la sidebar'}
            className="absolute -right-3 top-5 bg-white border border-gray-200 rounded-full p-1 text-gray-400 hover:text-brand-red hover:shadow-md transition-all"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
          <button aria-label="Fermer le menu" onClick={() => setIsMobileSidebarOpen(false)} className="absolute right-4 rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-900 lg:hidden">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 pb-3 pt-6 lg:px-4"><p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Navigation</p></div>
        <nav className="hide-scrollbar flex-1 space-y-1 overflow-y-auto px-3 pb-6">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileSidebarOpen(false)}
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

        <div className="space-y-2 border-t border-gray-100 p-4">
          <Link
            to="/admin/settings"
            onClick={() => setIsMobileSidebarOpen(false)}
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
            onClick={() => setIsLogoutModalOpen(true)}
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
        <header className="relative z-10 flex h-18 shrink-0 items-center justify-between border-b border-gray-100 bg-white px-4 md:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-3 md:gap-5">
            <button aria-label="Ouvrir le menu" onClick={() => setIsMobileSidebarOpen(true)} className="rounded-xl p-2 text-gray-500 hover:bg-red-50 hover:text-brand-red lg:hidden">
              <Menu size={21} />
            </button>
            <div className="hidden min-w-0 lg:block">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-red">Espace administration</p>
              <h2 className="mt-1 truncate font-serif text-xl font-black text-gray-900">
                {NAV_ITEMS.find(item => item.path === location.pathname)?.name || (location.pathname === '/admin' ? 'Vue d’ensemble' : 'Paramètres')}
              </h2>
            </div>
            <div className="relative hidden w-72 xl:block group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-red transition-colors" />
              <input 
                type="text" 
                placeholder="Rechercher dans l’espace..." 
                aria-label="Recherche globale"
                className="w-full rounded-xl border border-gray-100 bg-gray-50 py-2.5 pl-10 pr-4 text-sm transition-all placeholder:text-gray-400 focus:border-brand-red/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-red/10"
              />
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-5">
            <div className="hidden items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-700 sm:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Système opérationnel
            </div>
            
            {/* Notification Dropdown Container */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                aria-label="Ouvrir les notifications"
                className="relative rounded-xl p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-brand-red"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-brand-red rounded-full border-2 border-white"></span>
              </button>
              
              {isNotificationsOpen && (
                <>
                  {/* Invisible backdrop to close dropdown */}
                  <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)}></div>
                  
                  {/* Dropdown Panel */}
                  <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-2xl">
                      <h4 className="font-bold text-gray-900 text-sm">Notifications</h4>
                      <span className="bg-brand-red/10 text-brand-red text-xs font-bold px-2 py-0.5 rounded-full">2</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      <div className="p-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
                        <p className="text-sm font-semibold text-gray-900">Bienvenue sur le Dashboard 🎉</p>
                        <p className="text-xs text-gray-500 mt-1">Votre espace d'administration SaaS Premium est prêt à être utilisé.</p>
                        <p className="text-[10px] text-gray-400 mt-2 font-medium">À l'instant</p>
                      </div>
                      <div className="p-4 border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer">
                        <p className="text-sm font-semibold text-gray-900">Espaces publicitaires</p>
                        <p className="text-xs text-gray-500 mt-1">Pensez à configurer vos encarts publicitaires pour commencer à monétiser.</p>
                        <p className="text-[10px] text-gray-400 mt-2 font-medium">Il y a 2 heures</p>
                      </div>
                    </div>
                    <div className="p-2 border-t border-gray-100 text-center">
                      <button 
                        onClick={() => {
                          setIsNotificationsOpen(false);
                          toast.success('Toutes les notifications ont été marquées comme lues.');
                        }}
                        className="text-xs font-bold text-brand-red hover:text-red-700 p-2 w-full transition-colors"
                      >
                        Marquer tout comme lu
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="hidden h-7 w-px bg-gray-200 sm:block"></div>
            <div className="relative">
              <button aria-label="Ouvrir le profil administrateur" onClick={() => setIsProfileOpen(!isProfileOpen)} className="group flex items-center gap-2.5 rounded-xl p-1.5 transition-colors hover:bg-gray-50">
                <div className="hidden text-right sm:block">
                  <p className="text-sm font-bold text-gray-900 leading-none">Admin</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold mt-1">Super Utilisateur</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-tr from-brand-red to-orange-500 text-white shadow-md shadow-brand-red/20 transition-transform group-hover:scale-105">
                  <User className="w-5 h-5" />
                </div>
              </button>
              
              {isProfileOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                  <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200 py-2">
                    <button onClick={() => { setIsProfileOpen(false); setIsPasswordModalOpen(true); }} className="w-full text-left px-4 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 hover:text-brand-red transition-colors flex items-center gap-2">
                      <Settings size={16} /> Modifier mot de passe
                    </button>
                    <div className="h-px bg-gray-100 my-1"></div>
                    <button onClick={() => { setIsProfileOpen(false); setIsLogoutModalOpen(true); }} className="w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2">
                      <LogOut size={16} /> Déconnexion
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <div className="max-w-6xl mx-auto pb-12">
            {isPageLoading ? <AdminPageSkeleton /> : <Outlet />}
          </div>
        </main>
      </div>

      {/* Logout Premium Modal */}
      {isLogoutModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white shadow-sm">
                <AlertTriangle className="w-8 h-8 text-brand-red" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Déconnexion</h3>
              <p className="text-sm text-gray-500">
                Êtes-vous sûr de vouloir vous déconnecter de votre espace d'administration ?
              </p>
            </div>
            
            <div className="p-4 bg-gray-50 border-t border-gray-100 flex gap-3">
              <button 
                onClick={() => setIsLogoutModalOpen(false)}
                className="flex-1 px-4 py-2.5 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button 
                onClick={confirmLogout}
                className="flex-1 px-4 py-2.5 bg-brand-red text-white font-bold rounded-xl hover:bg-red-700 shadow-md shadow-brand-red/20 hover:-translate-y-0.5 transition-all"
              >
                Confirmer
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Password Premium Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="w-14 h-14 bg-linear-to-tr from-brand-red to-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-brand-red/30">
                <Settings className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-2xl font-black text-gray-900 mb-2 font-serif">Sécurité</h3>
              <p className="text-sm text-gray-500 font-medium mb-8">
                Mettez à jour le mot de passe de votre compte administrateur.
              </p>
              
              <form onSubmit={handlePasswordSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Ancien mot de passe</label>
                  <input 
                    type="password"
                    required
                    value={oldPassword}
                    onChange={e => setOldPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:bg-white transition-all text-sm font-medium"
                    placeholder="Saisissez le mot de passe actuel"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Nouveau mot de passe</label>
                  <input 
                    type="password"
                    required
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:bg-white transition-all text-sm font-medium"
                    placeholder="6 caractères minimum"
                  />
                </div>
                
                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => { setIsPasswordModalOpen(false); setOldPassword(''); setNewPassword(''); }}
                    className="flex-1 px-4 py-3 bg-gray-100/80 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    disabled={isChangingPwd}
                    className="flex-1 px-4 py-3 bg-brand-red text-white font-bold rounded-xl hover:bg-red-700 shadow-md shadow-brand-red/20 hover:-translate-y-0.5 transition-all disabled:opacity-50"
                  >
                    {isChangingPwd ? 'Validation...' : 'Valider'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
