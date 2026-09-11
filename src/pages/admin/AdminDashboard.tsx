import { useState, useEffect } from 'react';
import { FileText, Tags, Image as ImageIcon, Eye, TrendingUp, Clock, Plus, Handshake, Users, FileEdit } from 'lucide-react';
import { authFetch } from '../../lib/auth';
import { Link } from 'react-router-dom';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';

const viewsData = [
  { name: 'Lun', vues: 4000 },
  { name: 'Mar', vues: 3000 },
  { name: 'Mer', vues: 2000 },
  { name: 'Jeu', vues: 2780 },
  { name: 'Ven', vues: 1890 },
  { name: 'Sam', vues: 2390 },
  { name: 'Dim', vues: 3490 },
];

const categoryData = [
  { name: 'Politique', articles: 120 },
  { name: 'Sport', articles: 85 },
  { name: 'Culture', articles: 45 },
  { name: 'Économie', articles: 65 },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState({ articles: 0, categories: 0, ads: 0, views: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      authFetch('/api/articles').then(r => r.json()),
      authFetch('/api/categories').then(r => r.json()),
      authFetch('/api/ads').then(r => r.json())
    ]).then(([articles, categories, ads]) => {
      const articlesList = Array.isArray(articles) ? articles : [];
      setStats({
        articles: articlesList.length,
        categories: Array.isArray(categories) ? categories.length : 0,
        ads: Array.isArray(ads) ? ads.length : 0,
        views: articlesList.reduce((acc, curr) => acc + (curr.views || 0), 0)
      });
      setLoading(false);
    }).catch(console.error);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-brand-red rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif font-black text-gray-900">Vue d'ensemble</h1>
          <p className="text-gray-500 text-sm mt-1">Gérez l'activité de Guinée+ en temps réel.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/admin/articles" className="bg-brand-red text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm shadow-brand-red/20 hover:bg-red-700 hover:shadow-md hover:-translate-y-0.5 transition-all flex items-center gap-2">
            <Plus size={16} /> Nouvel article
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Articles Publiés', value: stats.articles, icon: <FileText size={24} className="text-blue-500" />, trend: '+12%', color: 'bg-blue-50' },
          { label: 'Catégories', value: stats.categories, icon: <Tags size={24} className="text-amber-500" />, trend: '+2', color: 'bg-amber-50' },
          { label: 'Espaces Pub.', value: stats.ads, icon: <ImageIcon size={24} className="text-emerald-500" />, trend: 'Actifs', color: 'bg-emerald-50' },
          { label: 'Vues Totales', value: stats.views.toLocaleString(), icon: <Eye size={24} className="text-brand-red" />, trend: '+24%', color: 'bg-red-50' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow relative overflow-hidden group">
            <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${kpi.color}`}>
                {kpi.icon}
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                <TrendingUp size={12} /> {kpi.trend}
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-black text-gray-900 tracking-tight">{kpi.value}</h3>
              <p className="text-sm font-medium text-gray-500 mt-1">{kpi.label}</p>
            </div>
            <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gray-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none scale-0 group-hover:scale-100 duration-500"></div>
          </div>
        ))}
      </div>

      {/* Charts section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-900">Audience (7 derniers jours)</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={viewsData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorVues" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E30613" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#E30613" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
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
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-6">
            <h3 className="font-bold text-gray-900">Répartition par catégorie</h3>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9CA3AF', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#F3F4F6'}}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
                />
                <Bar dataKey="articles" fill="#0A369D" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Grid: Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-6">Activités récentes</h3>
          <div className="space-y-6">
            {[
              { text: 'Nouvel article publié dans Politique', time: 'Il y a 2h', type: 'article' },
              { text: 'Mise à jour de la page À propos', time: 'Il y a 5h', type: 'page' },
              { text: 'Nouveau partenaire ajouté: Orange', time: 'Hier', type: 'partner' },
              { text: 'Modification des espaces publicitaires', time: 'Hier', type: 'ad' }
            ].map((act, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                  <Clock size={16} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{act.text}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-900 mb-6">Actions rapides</h3>
          <div className="space-y-3">
            <Link to="/admin/partenaires" className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-brand-red hover:bg-red-50 transition-colors group">
              <span className="text-sm font-bold text-gray-700 group-hover:text-brand-red">Gérer les partenaires</span>
              <Handshake size={18} className="text-gray-400 group-hover:text-brand-red" />
            </Link>
            <Link to="/admin/equipe" className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-brand-red hover:bg-red-50 transition-colors group">
              <span className="text-sm font-bold text-gray-700 group-hover:text-brand-red">Modifier l'équipe</span>
              <Users size={18} className="text-gray-400 group-hover:text-brand-red" />
            </Link>
            <Link to="/admin/pages" className="w-full flex items-center justify-between p-4 rounded-xl border border-gray-100 hover:border-brand-red hover:bg-red-50 transition-colors group">
              <span className="text-sm font-bold text-gray-700 group-hover:text-brand-red">Éditer "À propos"</span>
              <FileEdit size={18} className="text-gray-400 group-hover:text-brand-red" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
