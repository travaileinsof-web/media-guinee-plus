import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Globe, Image as ImageIcon, Edit2 } from 'lucide-react';
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
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<string | null>(null);
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

  const openCreateModal = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({ name: '', logoUrl: '', websiteUrl: '', description: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (p: Partner) => {
    setIsEditing(true);
    setCurrentId(p.id);
    setFormData({ name: p.name, logoUrl: p.logoUrl || '', websiteUrl: p.websiteUrl || '', description: p.description || '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    setSaving(true);
    
    try {
      if (isEditing && currentId) {
        await authFetch(`/api/partners/${currentId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        toast.success('Partenaire mis à jour');
      } else {
        await authFetch('/api/partners', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
        toast.success('Partenaire ajouté');
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    toast('Confirmer la suppression ?', {
      description: 'Ce partenaire sera supprimé définitivement.',
      action: {
        label: 'Supprimer',
        onClick: async () => {
          try {
            await authFetch(`/api/partners/${id}`, { method: 'DELETE' });
            fetchData();
            toast.success('Partenaire supprimé');
          } catch(e) { toast.error('Erreur lors de la suppression'); }
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
          <p className="text-gray-500 text-sm mt-1">Gérez les partenaires et sponsors du média.</p>
        </div>
        <button 
          onClick={openCreateModal} 
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-shadow group relative">
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button 
                  onClick={() => openEditModal(p)} 
                  className="p-2 bg-white text-gray-500 hover:text-blue-600 rounded-lg shadow-sm border border-gray-100 transition-colors"
                  title="Modifier"
                >
                  <Edit2 size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(p.id)} 
                  className="p-2 bg-white text-gray-500 hover:text-brand-red rounded-lg shadow-sm border border-gray-100 transition-colors"
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
              
              <div className="h-20 flex items-center justify-center mb-6">
                {p.logoUrl ? (
                  <img src={p.logoUrl} alt={p.name} className="max-h-full max-w-full object-contain" />
                ) : (
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
                    <ImageIcon size={24} className="text-gray-300" />
                  </div>
                )}
              </div>
              
              <div className="text-center space-y-2">
                <h3 className="font-bold text-gray-900 text-lg">{p.name}</h3>
                {p.description && (
                  <p className="text-sm text-gray-500 line-clamp-2">{p.description}</p>
                )}
                {p.websiteUrl && (
                  <a 
                    href={p.websiteUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <Globe size={14} /> Visiter le site
                  </a>
                )}
              </div>
            </div>
          ))}
          {partners.length === 0 && (
            <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-2xl border border-dashed border-gray-200">
              Aucun partenaire enregistré.
            </div>
          )}
        </div>
      )}

      {/* Modal d'ajout/édition */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">{isEditing ? 'Modifier Partenaire' : 'Nouveau Partenaire'}</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-900 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
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
