import { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, Globe2, Key, Mail, MapPin, Phone, Save, Share2 } from 'lucide-react';
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
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  useEffect(() => {
    authFetch('/api/config')
      .then(res => res.json())
      .then(data => { setConfig({ name: '', slogan: '', address: '', phone: '', emails: [], socials: {}, ...data }); setLoading(false); })
      .catch(() => setLoading(false));
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
    if (password !== passwordConfirmation) return setPasswordMessage('Les mots de passe ne correspondent pas');
    try {
      const res = await authFetch('/api/admin/password', {
        method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ newPassword: password })
      });
      if (res.ok) {
        setPasswordMessage('Mot de passe mis à jour !');
        setPassword('');
        setPasswordConfirmation('');
      } else {
        setPasswordMessage('Erreur lors de la mise à jour.');
      }
    } catch (error) { setPasswordMessage('Erreur système.'); }
    setTimeout(() => setPasswordMessage(''), 3000);
  };

  if (loading) return <div className="flex min-h-64 items-center justify-center text-sm font-bold text-gray-400">Chargement des paramètres...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.22em] text-brand-red"><Globe2 size={14} /> Identité numérique</p>
          <h1 className="text-3xl font-serif font-black tracking-tight text-gray-900 md:text-4xl">Paramètres globaux</h1>
          <p className="mt-2 max-w-2xl text-sm text-gray-500">Contrôlez les informations visibles sur le site, les contacts de la rédaction et les accès administrateur.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-100 bg-gray-50/60 p-6">
          <div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red"><Globe2 size={19} /></div><div><h2 className="font-serif text-xl font-black text-gray-900">Présence publique</h2><p className="mt-1 text-sm text-gray-500">Les informations affichées sur l’identité et les pages de contact de Guinée+.</p></div></div>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700"><Globe2 size={15} className="text-gray-400" /> Nom du site</label>
              <input type="text" required value={config.name} placeholder="Ex. Guinée+" onChange={(e) => setConfig({...config, name: e.target.value})} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-brand-red/40 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-red/10" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Slogan</label>
              <input type="text" value={config.slogan} placeholder="Ex. Vivez l'info en temps réel" onChange={(e) => setConfig({...config, slogan: e.target.value})} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-brand-red/40 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-red/10" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Adresse (Siège)</label>
              <input type="text" value={config.address} placeholder="Ex. Bonfi, Matam, Conakry" onChange={(e) => setConfig({...config, address: e.target.value})} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-brand-red/40 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-red/10" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Téléphone public</label>
              <input type="tel" value={config.phone} placeholder="Ex. +224 625 80 87 66" onChange={(e) => setConfig({...config, phone: e.target.value})} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-brand-red/40 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-red/10" />
            </div>
            
            <div className="md:col-span-2 space-y-2 border-t border-gray-100 pt-6">
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700"><Mail size={15} className="text-gray-400" /> Email public principal</label>
              <input type="email" value={config.emails?.[0] || ''} placeholder="Ex. contact@guineeplus.com" onChange={(e) => setConfig({...config, emails: [e.target.value, ...(config.emails || []).slice(1)]})} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-brand-red/40 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-red/10" />
              <p className="text-xs text-gray-400">Adresse destinée aux demandes des lecteurs et partenaires.</p>
            </div>

            {/* Reseaux Sociaux */}
            <div className="md:col-span-2 pt-4 pb-2 border-b border-gray-100">
              <h3 className="flex items-center gap-2 text-md font-bold text-gray-900"><Share2 size={16} className="text-gray-400" /> Réseaux sociaux</h3>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Facebook (URL)</label>
              <input type="url" value={config.socials?.facebook || ''} placeholder="https://facebook.com/votre-page" onChange={(e) => setConfig({...config, socials: {...config.socials, facebook: e.target.value}})} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-brand-red/40 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-red/10" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">Twitter/X (URL)</label>
              <input type="url" value={config.socials?.twitter || ''} placeholder="https://x.com/votre-compte" onChange={(e) => setConfig({...config, socials: {...config.socials, twitter: e.target.value}})} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-brand-red/40 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-red/10" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">YouTube (URL)</label>
              <input type="url" value={config.socials?.youtube || ''} placeholder="https://youtube.com/@votre-chaine" onChange={(e) => setConfig({...config, socials: {...config.socials, youtube: e.target.value}})} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-brand-red/40 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-red/10" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700 uppercase tracking-wide">WhatsApp (URL)</label>
              <input type="url" value={config.socials?.whatsapp || ''} placeholder="https://wa.me/224..." onChange={(e) => setConfig({...config, socials: {...config.socials, whatsapp: e.target.value}})} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-brand-red/40 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-red/10" />
            </div>
          </div>
          
          <div className="flex flex-col items-start justify-between gap-4 border-t border-gray-100 pt-6 sm:flex-row sm:items-center">
            <p className="text-xs text-gray-400">Les modifications sont visibles sur le site après enregistrement.</p>
            <div className="flex items-center gap-4">
              {message && <span className={`flex items-center gap-1.5 text-sm font-bold ${message.startsWith('Paramètres') ? 'text-emerald-600' : 'text-brand-red'}`}>{message.startsWith('Paramètres') ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />} {message}</span>}
              <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-xl bg-brand-red px-6 py-3 font-bold text-white shadow-md shadow-brand-red/20 transition-all hover:-translate-y-0.5 hover:bg-red-700 disabled:opacity-50">
                <Save size={18} /> {saving ? 'Enregistrement...' : 'Enregistrer'}
              </button>
            </div>
          </div>
        </form>
      </div>

      <section className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-100 bg-gray-50/60 p-6"><div className="flex items-start gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-900 text-white"><Key size={18} /></div><div><h2 className="font-serif text-xl font-black text-gray-900">Sécurité du compte</h2><p className="mt-1 text-sm text-gray-500">Modifiez le mot de passe utilisé pour accéder à l’administration.</p></div></div></div>
        <form onSubmit={handlePasswordChange} className="grid gap-5 p-6 md:grid-cols-2 md:p-8">
          <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Nouveau mot de passe</label><input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="6 caractères minimum" minLength={6} required className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-brand-red/40 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-red/10" /></div>
          <div className="space-y-2"><label className="text-sm font-bold text-gray-700">Confirmation</label><input type="password" value={passwordConfirmation} onChange={e => setPasswordConfirmation(e.target.value)} placeholder="Retapez le nouveau mot de passe" minLength={6} required className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm placeholder:text-gray-400 focus:border-brand-red/40 focus:bg-white focus:outline-none focus:ring-4 focus:ring-brand-red/10" /></div>
          <div className="flex flex-col items-start justify-between gap-4 md:col-span-2 sm:flex-row sm:items-center"><p className={`flex items-center gap-1.5 text-sm font-bold ${passwordMessage.includes('mis à jour') ? 'text-emerald-600' : 'text-brand-red'}`}>{passwordMessage && <><AlertCircle size={16} /> {passwordMessage}</>}</p><button type="submit" className="flex items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 font-bold text-white transition-colors hover:bg-brand-red"><Key size={17} /> Mettre à jour</button></div>
        </form>
      </section>
    </div>
  );
}
