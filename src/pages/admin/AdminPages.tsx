import { toast } from 'sonner';
import { useState, useEffect } from 'react';
import { Save, FileText } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { authFetch } from '../../lib/auth';

const AVAILABLE_PAGES = [
  { slug: 'about', label: 'À propos' },
  { slug: 'mentions-legales', label: 'Mentions Légales' },
  { slug: 'confidentialite', label: 'Politique de Confidentialité' }
];

export default function AdminPages() {
  const [currentSlug, setCurrentSlug] = useState(AVAILABLE_PAGES[0].slug);
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/pages/${currentSlug}`)
      .then(res => res.json())
      .then(data => {
        setTitle(data.title || '');
        setContent(data.content || '');
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [currentSlug]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await authFetch(`/api/pages/${currentSlug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, content })
      });
      toast.success('Page sauvegardée avec succès !');
    } catch (err) {
      console.error(err);
      toast.error('Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-serif font-black text-gray-900">Pages Statiques</h2>
          <p className="text-gray-500 text-sm mt-1">Gérez le contenu des pages informatives du site.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving || loading}
          className="bg-brand-red text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold hover:bg-red-700 transition disabled:opacity-50 hover:shadow-md hover:-translate-y-0.5"
        >
          <Save size={20} />
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>

      <div className="flex space-x-2 border-b border-gray-200">
        {AVAILABLE_PAGES.map(page => (
          <button
            key={page.slug}
            onClick={() => setCurrentSlug(page.slug)}
            className={`px-4 py-3 font-bold text-sm transition-colors border-b-2 flex items-center gap-2 ${
              currentSlug === page.slug
                ? 'border-brand-red text-brand-red'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <FileText size={16} />
            {page.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-4 border-gray-200 border-t-brand-red rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6 animate-in fade-in duration-300">
          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Titre de la page</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-red/50 focus:bg-white transition-all font-medium"
              placeholder="Ex: Politique de Confidentialité"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Contenu (Texte riche)</label>
            <div className="h-125 pb-12">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                className="h-full rounded-xl overflow-hidden"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
