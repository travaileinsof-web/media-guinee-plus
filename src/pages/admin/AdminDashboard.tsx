import { useState, useEffect } from 'react';
import { FileText, Tags, Image as ImageIcon, Eye, TrendingUp, Clock, Plus, Handshake, Users, FileEdit, ArrowUpRight, Activity, PenLine } from 'lucide-react';
import { authFetch } from '../../lib/auth';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Link } from 'react-router-dom';
import { AdminDashboardSkeleton } from '../../components/AdminSkeleton';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ articles: 0, categories: 0, ads: 0, views: 0, viewsData: [] as any[], categoryData: [] as any[], recentActivities: [] as any[] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authFetch('/api/admin/stats').then(r => {
      if (!r.ok) throw new Error('Impossible de charger les statistiques');
      return r.json();
    }).then(data => {
      setStats({
        articles: data.articles || 0,
        categories: data.categories || 0,
        ads: data.ads || 0,
        views: data.views || 0,
        viewsData: Array.isArray(data.viewsData) ? data.viewsData : [],
        categoryData: Array.isArray(data.categoryData) ? data.categoryData : [],
        recentActivities: Array.isArray(data.recentActivities) ? data.recentActivities : [{ text: 'Aucune activité récente', time: '-', type: 'none' }]
      });
      setLoading(false);
    }).catch(console.error);
  }, []);

  if (loading) {
    return <AdminDashboardSkeleton />;
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="mb-3 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.24em] text-brand-red"><Activity size={14} /> Centre de pilotage</div>
          <h1 className="text-3xl font-serif font-black tracking-tight text-gray-900 md:text-4xl">Vue d'ensemble</h1>
          <p className="mt-2 text-sm text-gray-500">La rédaction de Guinée+ en un coup d’œil.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/articles" className="flex items-center gap-2 rounded-xl bg-brand-red px-4 py-3 text-sm font-bold text-white shadow-lg shadow-brand-red/20 transition-all hover:-translate-y-0.5 hover:bg-red-700">
            <Plus size={16} /> Nouvel article
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Articles publiés', value: stats.articles, icon: <FileText size={21} />, trend: 'Éditorial', color: 'bg-blue-50 text-blue-600' },
          { label: 'Rubriques actives', value: stats.categories, icon: <Tags size={21} />, trend: 'Organisation', color: 'bg-amber-50 text-amber-600' },
          { label: 'Espaces publicitaires', value: stats.ads, icon: <ImageIcon size={21} />, trend: 'Monétisation', color: 'bg-emerald-50 text-emerald-600' },
          { label: 'Vues cumulées', value: stats.views.toLocaleString(), icon: <Eye size={21} />, trend: 'Audience', color: 'bg-red-50 text-brand-red' },
        ].map((kpi, i) => (
          <div key={i} className="group relative overflow-hidden rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl">
            <div className="mb-6 flex items-start justify-between">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${kpi.color}`}>
                {kpi.icon}
              </div>
              <ArrowUpRight size={17} className="text-gray-300 transition-colors group-hover:text-brand-red" />
            </div>
            <div>
              <h3 className="text-3xl font-black tracking-tight text-gray-900">{kpi.value}</h3>
              <p className="mt-1 text-sm font-medium text-gray-500">{kpi.label}</p>
              <p className="mt-4 text-[10px] font-black uppercase tracking-[0.18em] text-gray-400">{kpi.trend}</p>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gray-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none scale-0 group-hover:scale-100 duration-500"></div>
          </div>
        ))}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
          <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-7">
          <div className="mb-6 flex items-start justify-between">
            <div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-red">Performance</p><h3 className="mt-1 font-serif text-2xl font-black text-gray-900">Audience récente</h3></div>
            <span className="rounded-full bg-gray-50 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">7 jours</span>
          </div>
          <div className="h-75 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.viewsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVues" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E30613" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#E30613" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 11}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                  itemStyle={{ color: '#111827', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="vues" stroke="#E30613" strokeWidth={3} fillOpacity={1} fill="url(#colorVues)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Secondary Chart */}
          <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-7">
          <div className="mb-6"><p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue">Éditorial</p><h3 className="mt-1 font-serif text-2xl font-black text-gray-900">Vues par rubrique</h3>
          </div>
          <div className="h-75 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.categoryData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#F3F4F6'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                />
                <Bar dataKey="articles" fill="#0A369D" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-7">
          <div className="mb-6 flex items-center justify-between"><div><p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-red">Fil du jour</p><h3 className="mt-1 font-serif text-2xl font-black text-gray-900">Activités récentes</h3></div><Clock size={18} className="text-gray-300" /></div>
          <div className="space-y-1">
            {stats.recentActivities.map((act, i) => (
              <div key={i} className="flex gap-4 rounded-xl px-2 py-4 transition-colors hover:bg-gray-50">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-red/5 text-brand-red">
                  {act.type === 'article' ? <FileText size={16} /> : <PenLine size={16} />}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{act.text}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="rounded-2xl border border-gray-100 bg-brand-dark p-6 text-white shadow-sm md:p-7">
          <div className="mb-6"><p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-yellow">Raccourcis</p><h3 className="mt-1 font-serif text-2xl font-black">Actions rapides</h3></div>
          <div className="space-y-3">
            <Link to="/admin/partenaires" className="group flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
              <span className="text-sm font-bold text-white">Gérer les partenaires</span><Handshake size={18} className="text-gray-400 transition-colors group-hover:text-brand-yellow" />
            </Link>
            <Link to="/admin/equipe" className="group flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
              <span className="text-sm font-bold text-white">Modifier l'équipe</span><Users size={18} className="text-gray-400 transition-colors group-hover:text-brand-yellow" />
            </Link>
            <Link to="/admin/pages" className="group flex w-full items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4 transition-colors hover:bg-white/10">
              <span className="text-sm font-bold text-white">Éditer "À propos"</span><FileEdit size={18} className="text-gray-400 transition-colors group-hover:text-brand-yellow" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
