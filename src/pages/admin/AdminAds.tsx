import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, CheckCircle, XCircle, AlertTriangle, X } from 'lucide-react';
import { authFetch } from '../../lib/auth';
import { toast } from 'sonner';
import type { FormEvent } from 'react';

export default function AdminAds() {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentAd, setCurrentAd] = useState<any>(null);
  const [adToDelete, setAdToDelete] = useState<any>(null);

  const fetchAds = () => {
    fetch('/api/ads', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => {
        setAds(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setAds([]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAds();
  }, []);

  const handleEdit = (ad: any) => {
    setCurrentAd(ad);
    setIsEditing(true);
  };

  const handleDelete = async () => {
    if (!adToDelete) return;

    try {
      const response = await authFetch(`/api/ads/${adToDelete.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Suppression impossible');
      toast.success('Espace publicitaire supprimé');
      setAdToDelete(null);
      fetchAds();
    } catch {
      toast.error('Impossible de supprimer cet espace publicitaire');
    }
  };


  const handleToggleActive = async (ad: any) => {
    await authFetch(`/api/ads/${ad.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isActive: !ad.isActive })
    });
    fetchAds();
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const method = currentAd.id ? 'PUT' : 'POST';
    const url = currentAd.id ? `/api/ads/${currentAd.id}` : '/api/ads';
    
    await authFetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(currentAd)
    });
    
    setIsEditing(false);
    setCurrentAd(null);
    fetchAds();
  };

  if (loading) return <div>Chargement...</div>;

  if (isEditing) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-2xl font-serif font-black mb-8">{currentAd.id ? 'Modifier l\'espace publicitaire' : 'Nouvel espace publicitaire'}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Nom de l'espace</label>
              <input type="text" required value={currentAd.name || ''} onChange={e => setCurrentAd({...currentAd, name: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Format</label>
              <select required value={currentAd.format || 'horizontal'} onChange={e => setCurrentAd({...currentAd, format: e.target.value})} className="w-full px-4 py-2 border rounded-lg">
                <option value="horizontal">Horizontal (Bannière)</option>
                <option value="vertical">Vertical (Sidebar)</option>
                <option value="square">Carré</option>
                <option value="in-article">Dans l'article</option>
                <option value="popup">Pop-up</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Emplacement</label>
              <select required value={currentAd.location || ''} onChange={e => setCurrentAd({...currentAd, location: e.target.value})} className="w-full px-4 py-2 border rounded-lg">
                <option value="" disabled>Sélectionner un emplacement</option>
                <option value="header_top">En-tête - Bannière</option>
                <option value="home_top">Accueil - Haut (Bannière)</option>
                <option value="home_middle">Accueil - Milieu (Entre sections)</option>
                <option value="category_top">Rubrique - Haut (Bannière)</option>
                <option value="content_top">Contenus - Haut (Bannière)</option>
                <option value="sidebar">Barre latérale - Droite</option>
                <option value="article_top">Article - Haut</option>
                <option value="article_middle">Article - Milieu du texte</option>
                <option value="article_bottom">Article - Bas</option>
                <option value="popup">Pop-up Global (Toutes pages)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Image</label>
              <div className="flex flex-col gap-2">
                {currentAd.imageUrl && (
                  <img src={currentAd.imageUrl} alt="Aperçu" className="h-20 object-contain bg-gray-100 rounded" />
                )}
                <input 
                  type="url" 
                  value={currentAd.imageUrl || ''}
                  onChange={e => setCurrentAd({...currentAd, imageUrl: e.target.value})}
                  className="w-full px-4 py-2 border rounded-lg bg-gray-50" 
                  placeholder="... ou coller une URL d'image ici"
                  required={!currentAd.imageUrl}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Lien cible (URL) lors du clic</label>
              <input type="url" required value={currentAd.targetUrl || ''} onChange={e => setCurrentAd({...currentAd, targetUrl: e.target.value})} className="w-full px-4 py-2 border rounded-lg" placeholder="Ex: https://wa.me/... ou https://annonceur.com" />
            </div>
          </div>
          <div className="flex gap-4 pt-6">
            <button type="submit" className="bg-brand-red text-white px-6 py-2 rounded-lg font-bold">Enregistrer</button>
            <button type="button" onClick={() => setIsEditing(false)} className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-bold">Annuler</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-serif font-black text-gray-900">Espaces Publicitaires</h1>
        <button 
          onClick={() => { setCurrentAd({ format: 'horizontal', location: '', isActive: true }); setIsEditing(true); }}
          className="flex items-center gap-2 bg-brand-red text-white px-4 py-2 rounded-lg font-bold hover:bg-red-700 transition-colors"
        >
          <Plus size={18} />
          Nouvel Espace
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Format</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Aperçu</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Statut</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {ads.map((ad) => (
              <tr key={ad.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">
                  {ad.name}
                  <span className="block text-xs text-gray-500 font-mono mt-1">{ad.location}</span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 capitalize">{ad.format}</td>
                <td className="px-6 py-4">
                  <div className="h-10 w-20 bg-gray-200 rounded overflow-hidden">
                    {ad.imageUrl && <img src={ad.imageUrl} alt="Annonce" loading="lazy" decoding="async" className="w-full h-full object-cover" />}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <button onClick={() => handleToggleActive(ad)} className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full ${ad.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {ad.isActive ? <CheckCircle size={14} /> : <XCircle size={14} />}
                    {ad.isActive ? 'Actif' : 'Inactif'}
                  </button>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => handleEdit(ad)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"><Edit2 size={18} /></button>
                    <button aria-label={`Supprimer ${ad.name}`} onClick={() => setAdToDelete(ad)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={18} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {adToDelete && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-gray-950/50 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" aria-labelledby="delete-ad-title" className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-brand-red">
                  <AlertTriangle size={22} />
                </div>
                <div>
                  <h2 id="delete-ad-title" className="font-serif text-xl font-black text-gray-900">Supprimer cet espace ?</h2>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Action définitive</p>
                </div>
              </div>
              <button aria-label="Fermer" onClick={() => setAdToDelete(null)} className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900">
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm leading-relaxed text-gray-600">
                La publicité <strong className="text-gray-900">{adToDelete.name}</strong> sera retirée de tous ses emplacements. Cette action ne peut pas être annulée.
              </p>
            </div>
            <div className="flex gap-3 border-t border-gray-100 bg-gray-50 p-4">
              <button onClick={() => setAdToDelete(null)} className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 font-bold text-gray-700 transition-colors hover:bg-gray-100">Annuler</button>
              <button onClick={handleDelete} className="flex-1 rounded-xl bg-brand-red px-4 py-2.5 font-bold text-white shadow-md shadow-brand-red/20 transition-colors hover:bg-red-700">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
