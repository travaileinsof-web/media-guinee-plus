import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

export default function AdminPages() {
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch('/api/pages/about')
      .then(res => res.json())
      .then(data => {
        setTitle(data.title || 'À propos');
        setContent(data.content || '');
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem('adminToken');
      await fetch('/api/pages/about', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content })
      });
      alert('Page sauvegardée avec succès !');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif font-bold text-gray-900">Gestion de la page "À propos"</h2>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-brand-red text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition disabled:opacity-50"
        >
          <Save size={20} />
          {saving ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>

      {loading ? (
        <p>Chargement du contenu...</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Titre de la page</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-gray-300 rounded-lg shadow-sm focus:border-brand-red focus:ring-brand-red"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Contenu (Texte riche)</label>
            <div className="h-96 pb-12">
              <ReactQuill
                theme="snow"
                value={content}
                onChange={setContent}
                className="h-full"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
