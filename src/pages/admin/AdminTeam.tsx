import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Image as ImageIcon } from 'lucide-react';
import { authFetch } from '../../lib/auth';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  imageUrl?: string;
}

export default function AdminTeam() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const [formData, setFormData] = useState({ name: '', role: '', bio: '', imageUrl: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    fetch('/api/team')
      .then(res => res.json())
      .then(data => setTeam(Array.isArray(data) ? data : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;
    setSaving(true);
    
    try {
      await authFetch('/api/team', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      setIsModalOpen(false);
      setFormData({ name: '', role: '', bio: '', imageUrl: '' });
      fetchData();
    } catch (err) {
      console.error(err);
      toast('Erreur lors de la création');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: string) => {
    toast('Confirmer la suppression ?', {
      description: 'Ce membre sera supprimé définitivement.',
      action: {
        label: 'Supprimer',
        onClick: async () => {
          try {
            await authFetch(`/api/team/${id}`, { method: 'DELETE' });
            fetchData();
            toast.success('Membre supprimé');
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
          <h2 className="text-3xl font-serif font-black text-gray-900">Équipe & Rédaction</h2>
          <p className="text-gray-500 text-sm mt-1">Gérez les membres de votre rédaction.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-brand-red text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-bold hover:bg-red-700 hover:shadow-md hover:-translate-y-0.5 transition-all"
        >
          <Plus size={20} /> Ajouter un membre
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
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Membre</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Rôle</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {team.map(m => (
                <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center">
                        {m.imageUrl ? (
                          <img src={m.imageUrl} alt={m.name} className="w-full h-full object-cover" />
                        ) : (
                          <span className="text-gray-400 font-bold">{m.name.charAt(0)}</span>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{m.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {m.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleDelete(m.id)} 
                      className="p-2 text-gray-400 hover:text-brand-red hover:bg-red-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {team.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    Aucun membre dans l'équipe pour le moment.
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
              <h3 className="text-xl font-bold text-gray-900">Nouveau Membre</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-900 transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="p-6 space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Nom complet <span className="text-brand-red">*</span></label>
                <input 
                  type="text" 
                  required
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red transition-all"
                  placeholder="Ex: Mohamed Fofana"
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Rôle <span className="text-brand-red">*</span></label>
                <select 
                  required
                  value={formData.role}
                  onChange={e => setFormData({...formData, role: e.target.value})}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red transition-all appearance-none"
                >
                  <option value="" disabled>Sélectionnez un rôle</option>
                  <option value="Directeur de Publication">Directeur de Publication</option>
                  <option value="Rédacteur en Chef">Rédacteur en Chef</option>
                  <option value="Journaliste / Rédacteur">Journaliste / Rédacteur</option>
                  <option value="Chroniqueur">Chroniqueur</option>
                  <option value="Photographe / Reporter">Photographe / Reporter</option>
                  <option value="Éditeur">Éditeur</option>
                  <option value="Webmaster">Webmaster</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">URL de la photo de profil (Optionnel)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <ImageIcon size={16} className="text-gray-400" />
                  </div>
                  <input 
                    type="url" 
                    value={formData.imageUrl}
                    onChange={e => setFormData({...formData, imageUrl: e.target.value})}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red transition-all"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-bold text-gray-700">Petite biographie (Optionnel)</label>
                <textarea 
                  value={formData.bio}
                  onChange={e => setFormData({...formData, bio: e.target.value})}
                  rows={3}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:border-brand-red transition-all resize-none"
                  placeholder="Quelques mots sur le parcours..."
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
