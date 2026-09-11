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
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-serif font-black text-gray-900">Paramètres globaux</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Nom du site</label>
              <input type="text" value={config.name} onChange={(e) => setConfig({...config, name: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Slogan</label>
              <input type="text" value={config.slogan} onChange={(e) => setConfig({...config, slogan: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Adresse</label>
              <input type="text" value={config.address} onChange={(e) => setConfig({...config, address: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Téléphone</label>
              <input type="text" value={config.phone} onChange={(e) => setConfig({...config, phone: e.target.value})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Facebook (URL)</label>
              <input type="url" value={config.socials?.facebook || ''} onChange={(e) => setConfig({...config, socials: {...config.socials, facebook: e.target.value}})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Twitter/X (URL)</label>
              <input type="url" value={config.socials?.twitter || ''} onChange={(e) => setConfig({...config, socials: {...config.socials, twitter: e.target.value}})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">YouTube (URL)</label>
              <input type="url" value={config.socials?.youtube || ''} onChange={(e) => setConfig({...config, socials: {...config.socials, youtube: e.target.value}})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">WhatsApp (URL)</label>
              <input type="url" value={config.socials?.whatsapp || ''} onChange={(e) => setConfig({...config, socials: {...config.socials, whatsapp: e.target.value}})} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red" />
            </div>
          </div>
          <div className="pt-6 flex items-center justify-between border-t border-gray-100">
            <span className="text-green-600 font-bold">{message}</span>
            <button type="submit" disabled={saving} className="flex items-center gap-2 bg-brand-red text-white px-8 py-3 rounded-lg font-bold hover:bg-red-700 transition disabled:opacity-50">
              <Save size={18} /> {saving ? 'Sauvegarde...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2"><Key size={20} /> Modifier le mot de passe</h2>
        <form onSubmit={handlePasswordChange} className="max-w-md space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase mb-2">Nouveau mot de passe</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red"
              placeholder="Minimum 6 caractères"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-brand-red font-bold text-sm">{passwordMessage}</span>
            <button type="submit" className="bg-gray-900 text-white px-4 py-2 rounded-lg font-bold hover:bg-gray-800 transition">
              Mettre à jour
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
