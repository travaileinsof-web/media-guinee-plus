import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Globe, Image as ImageIcon } from 'lucide-react';
import { authFetch } from '../../lib/auth';

interface Partner {
  id: string;
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
  description?: string;
}

export default function AdminPartners() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', logoUrl: '', websiteUrl: '', description: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    fetch('/api/partners')
      .then(res => res.json())
      .then(data => setPartners(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    setSaving(true);
    
    try {
      await authFetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setIsModalOpen(false);
      setFormData({ name: '', logoUrl: '', websiteUrl: '', description: '' });
      fetchData();
    } catch (err) {
      console.error(err);
      toast('Erreur lors de la création');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    toast.error('Confirmer la suppression ?', {
      action: {
        label: 'Supprimer',
        onClick: async () => {
          try {
            await authFetch(`/api/partners/${id}`, { method: 'DELETE' });
            fetchData();
            toast.success('Partenaire supprimé');
          } catch(e) { toast.error('Erreur'); }
        }
      },
      cancel: { label: 'Annuler', onClick: () => {} }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-serif font-black text-gray-900">Partenaires</h2>
          <p className="text-gray-500 text-sm mt-1">Gérez vos sponsors et institutions partenaires.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-brand-red text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold hover:bg-red-700 hover:shadow-md hover:-translate-y-0.5 transition-all"
        >
          <Plus size={20} /> Ajouter un partenaire
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-brand-red rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Partenaire</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Lien du site</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {partners.map(p => (
                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                        {p.logoUrl ? (
                          <img src={p.logoUrl} alt={p.name} className="w-full h-full object-contain p-1" />
                        ) : (
                          <span className="text-gray-400 font-bold">{p.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{p.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {p.websiteUrl ? (
                      <a href={p.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-brand-red hover:underline flex items-center gap-1">
                        <Globe size={14} /> Visiter
                      </a>
                    ) : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleDelete(p.id)} 
                      className="p-2 text-gray-400 hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {partners.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    Aucun partenaire enregistré.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal d'ajout */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">Nouveau Partenaire</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-900 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Nom du partenaire <span className="text-brand-red">*</span></label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red transition-all"
                  placeholder="Ex: Orange Guinée"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">URL du site web (Optionnel)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Globe size={16} className="text-gray-400" />
                  </div>
                  <input 
                    type="url" 
                    value={formData.websiteUrl}
                    onChange={e => setFormData({...formData, websiteUrl: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red transition-all"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">URL du logo (Optionnel)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ImageIcon size={16} className="text-gray-400" />
                  </div>
                  <input 
                    type="url" 
                    value={formData.logoUrl}
                    onChange={e => setFormData({...formData, logoUrl: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red transition-all"
                    placeholder="https://.../logo.png"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Description (Optionnel)</label>
                <textarea 
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  rows={2}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red transition-all resize-none"
                  placeholder="Brève description du partenariat..."
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Annuler
                </button>
                <button 
                  type="submit"
                  disabled={saving}
                  className="bg-brand-red text-white px-6 py-2.5 rounded-lg font-bold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? 'Enregistrement...' : 'Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
