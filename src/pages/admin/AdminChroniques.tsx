import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Save, AlertTriangle } from 'lucide-react';
import { authFetch } from '../../lib/auth';
import { toast } from 'sonner';
import type { FormEvent } from 'react';

export default function AdminChroniques() {
  const [chroniques, setChroniques] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentChronique, setCurrentChronique] = useState<any>({});
  const [chroniqueToDelete, setChroniqueToDelete] = useState<any>(null);

  const fetchChroniques = async () => {
    const res = await fetch('/api/chroniques', { cache: 'no-store' });
    const data = await res.json();
    setChroniques(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchChroniques();
  }, []);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (currentChronique.id) {
      await authFetch(`/api/chroniques/${currentChronique.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentChronique)
      });
    } else {
      await authFetch('/api/chroniques', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentChronique)
      });
    }
    setIsEditing(false);
    fetchChroniques();
  };

  const handleDelete = async () => {
    if (!chroniqueToDelete) return;

    try {
      const response = await authFetch(`/api/chroniques/${chroniqueToDelete.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Suppression impossible');
      setChroniqueToDelete(null);
      toast.success('Chronique supprimée');
      fetchChroniques();
    } catch {
      toast.error('Impossible de supprimer cette chronique');
    }
  };



  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-serif font-black text-gray-900">Gestion des Chroniques</h1>
        <button
          onClick={() => {
            setCurrentChronique({});
            setIsEditing(true);
          }}
          className="bg-brand-red text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700"
        >
          <Plus size={20} />
          Nouvelle Chronique
        </button>
      </div>

      {isEditing ? (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">{currentChronique.id ? 'Modifier' : 'Ajouter'} une chronique</h2>
            <button onClick={() => setIsEditing(false)} className="p-2 hover:bg-gray-100 rounded-full">
              <X size={24} />
            </button>
          </div>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Titre de la chronique</label>
                <input type="text" required value={currentChronique.title || ''} onChange={e => setCurrentChronique({...currentChronique, title: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Nom de l'auteur</label>
                <input type="text" required value={currentChronique.author || ''} onChange={e => setCurrentChronique({...currentChronique, author: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Rôle de l'auteur (ex: Éditorialiste)</label>
                <input type="text" required value={currentChronique.authorRole || ''} onChange={e => setCurrentChronique({...currentChronique, authorRole: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Photo de l'auteur</label>
                <div className="flex flex-col gap-2">
                  {currentChronique.authorImage && (
                    <img src={currentChronique.authorImage} alt="Auteur" className="h-20 w-20 object-cover rounded-full bg-gray-100" />
                  )}

                  <input 
                    type="url" 
                    value={currentChronique.authorImage || ''}
                    onChange={e => setCurrentChronique({...currentChronique, authorImage: e.target.value})}
                    className="w-full px-4 py-2 border rounded-lg bg-gray-50" 
                    placeholder="... ou coller une URL d'image ici"
                    required={!currentChronique.authorImage}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Contenu (Extrait / Texte)</label>
              <textarea required rows={4} value={currentChronique.excerpt || ''} onChange={e => setCurrentChronique({...currentChronique, excerpt: e.target.value})} className="w-full px-4 py-2 border rounded-lg" />
            </div>
            
            <div className="flex justify-end pt-4">
              <button type="submit" className="bg-brand-red text-white px-6 py-2 rounded-lg flex items-center gap-2">
                <Save size={20} />
                Enregistrer
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase">Auteur</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase">Titre</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {chroniques.map((chronique) => (
                <tr key={chronique.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={chronique.authorImage} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <div className="font-bold text-gray-900">{chronique.author}</div>
                        <div className="text-sm text-gray-500">{chronique.authorRole}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{chronique.title}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => { setCurrentChronique(chronique); setIsEditing(true); }} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Edit2 size={18} />
                      </button>
                      <button aria-label={`Supprimer ${chronique.title}`} onClick={() => setChroniqueToDelete(chronique)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {chroniques.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    Aucune chronique trouvée.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {chroniqueToDelete && (
        <div className="fixed inset-0 z-100 flex items-center justify-center bg-gray-950/50 p-4 backdrop-blur-sm">
          <div role="dialog" aria-modal="true" aria-labelledby="delete-chronique-title" className="w-full max-w-md overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-2xl">
            <div className="flex items-start justify-between border-b border-gray-100 p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-brand-red">
                  <AlertTriangle size={22} />
                </div>
                <div>
                  <h2 id="delete-chronique-title" className="font-serif text-xl font-black text-gray-900">Supprimer cette chronique ?</h2>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-400">Action définitive</p>
                </div>
              </div>
              <button aria-label="Fermer" onClick={() => setChroniqueToDelete(null)} className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900">
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm leading-relaxed text-gray-600">
                La chronique <strong className="text-gray-900">{chroniqueToDelete.title}</strong> de {chroniqueToDelete.author} sera définitivement supprimée.
              </p>
            </div>
            <div className="flex gap-3 border-t border-gray-100 bg-gray-50 p-4">
              <button onClick={() => setChroniqueToDelete(null)} className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 font-bold text-gray-700 transition-colors hover:bg-gray-100">Annuler</button>
              <button onClick={handleDelete} className="flex-1 rounded-xl bg-brand-red px-4 py-2.5 font-bold text-white shadow-md shadow-brand-red/20 transition-colors hover:bg-red-700">Supprimer</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
