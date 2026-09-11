import { useState, useEffect } from 'react';
import { Save, Key } from 'lucide-react';
import { authFetch } from '../../lib/auth';
import type { FormEvent } from 'react';

export default function AdminSettings() {
  const [config, setConfig] = useState<any>({
    name: '', slogan: '', address: '', phone: '', emails: [], socials: {}
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  
  const [password, setPassword] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    authFetch('/api/config')
      .then(res => res.json())
      .then(data => { setConfig(data); setLoading(false); });
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setMessage(''); setSaving(true);
    try {
      await authFetch('/api/config', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config)
      });
      setMessage('Paramètres enregistrés avec succès !');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) { setMessage('Erreur lors de l\'enregistrement.'); } 
    finally { setSaving(false); }
  };

  const handlePasswordChange = async (e: FormEvent) => {
    e.preventDefault();
    if (password.length < 6) return setPasswordMessage('Trop court (6 car. min)');
    try {
      const res = await authFetch('/api/admin/password', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ newPassword: password })
      });
      if (res.ok) {
        setPasswordMessage('Mot de passe mis à jour !');
        setPassword('');
      } else {
        setPasswordMessage('Erreur lors de la mise à jour.');
      }
    } catch (error) { setPasswordMessage('Erreur système.'); }
    setTimeout(() => setPasswordMessage(''), 3000);
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-black text-gray-900">Paramètres globaux</h1>
          <p className="text-gray-500 mt-1">Gérez la configuration générale de votre plateforme</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Informations publiques</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Nom du site</label>
              <input type="text" value={config.name} onChange={(e) => setConfig({...config, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:bg-white transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Slogan</label>
              <input type="text" value={config.slogan} onChange={(e) => setConfig({...config, slogan: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:bg-white transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Adresse (Siège)</label>
              <input type="text" value={config.address} onChange={(e) => setConfig({...config, address: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:bg-white transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Téléphone public</label>
              <input type="text" value={config.phone} onChange={(e) => setConfig({...config, phone: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:bg-white transition-all" />
            </div>
            
            {/* Reseaux Sociaux */}
            <div className="md:col-span-2 pt-4 pb-2 border-b border-gray-100">
              <h3 className="text-md font-bold text-gray-900">Réseaux Sociaux</h3>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Facebook (URL)</label>
              <input type="url" value={config.socials?.facebook || ''} onChange={(e) => setConfig({...config, socials: {...config.socials, facebook: e.target.value}})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:bg-white transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Twitter/X (URL)</label>
              <input type="url" value={config.socials?.twitter || ''} onChange={(e) => setConfig({...config, socials: {...config.socials, twitter: e.target.value}})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:bg-white transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">YouTube (URL)</label>
              <input type="url" value={config.socials?.youtube || ''} onChange={(e) => setConfig({...config, socials: {...config.socials, youtube: e.target.value}})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:bg-white transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">WhatsApp (URL)</label>
              <input type="url" value={config.socials?.whatsapp || ''} onChange={(e) => setConfig({...config, socials: {...config.socials, whatsapp: e.target.value}})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:bg-white transition-all" />
            </div>
          </div>
          
          <div className="pt-8 flex items-center justify-end">
            <button type="submit" disabled={saving} className="flex items-center gap-2 bg-brand-red text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 shadow-md shadow-brand-red/20 hover:-translate-y-0.5 transition-all disabled:opacity-50">
              <Save size={18} /> {saving ? 'Sauvegarde en cours...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
