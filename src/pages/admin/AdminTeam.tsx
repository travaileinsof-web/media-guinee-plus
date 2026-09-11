import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
}

export default function AdminTeam() {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleCreate = async () => {
    const name = prompt('Nom du membre ?');
    if (!name) return;
    const role = prompt('Rôle (ex: Journaliste, Photographe) ?') || 'Membre';
    const token = localStorage.getItem('adminToken');
    await fetch('/api/team', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ name, role })
    });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce membre ?')) return;
    const token = localStorage.getItem('adminToken');
    await fetch(`/api/team/${id}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchData();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-serif font-bold text-gray-900">Équipe & Rédaction</h2>
        <button onClick={handleCreate} className="bg-brand-red text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition">
          <Plus size={20} /> Ajouter
        </button>
      </div>

      {loading ? <p>Chargement...</p> : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rôle</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {team.map(m => (
                <tr key={m.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{m.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{m.role}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button onClick={() => handleDelete(m.id)} className="text-red-600 hover:text-red-900 ml-4"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
