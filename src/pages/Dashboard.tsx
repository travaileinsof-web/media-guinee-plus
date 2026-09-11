import { useState } from 'react';
import { useCategories } from '../lib/hooks';
import { CheckCircle2, XCircle, LayoutDashboard, Settings, FileText, Plus, ArrowUpRight, RefreshCw, Layers3 } from 'lucide-react';

export default function Dashboard() {
  const { categories, setCategories, loading, error } = useCategories();
  const [activeTab, setActiveTab] = useState('categories');
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const activeCategories = categories.filter(category => category.isActive).length;

  const toggleCategory = async (id: string, currentState: boolean) => {
    const nextState = !currentState;
    setUpdatingId(id);
    setCategories(categories.map(category => category.id === id ? { ...category, isActive: nextState } : category));

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: nextState }),
      });

      if (!response.ok) throw new Error('La mise à jour a échoué.');
    } catch {
      setCategories(categories.map(category => category.id === id ? { ...category, isActive: currentState } : category));
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#f7f8fa] px-4 py-8 sm:px-6 lg:px-8" role="status" aria-label="Chargement du dashboard">
        <div className="mx-auto max-w-7xl animate-pulse space-y-8">
          <div className="space-y-3"><div className="h-9 w-64 rounded-lg bg-gray-200" /><div className="h-4 w-96 max-w-full rounded bg-gray-200" /></div>
          <div className="grid gap-4 sm:grid-cols-3">{[1, 2, 3].map(item => <div key={item} className="h-28 rounded-2xl bg-white shadow-sm ring-1 ring-gray-100" />)}</div>
          <div className="h-96 rounded-2xl bg-white shadow-sm ring-1 ring-gray-100" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-[#f7f8fa] px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-brand-red">
              <span className="h-2 w-2 rounded-full bg-brand-red" /> Espace de pilotage
            </div>
            <h1 className="text-3xl font-serif font-bold text-gray-950 sm:text-4xl">Administration</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-gray-500">Organisez les contenus visibles sur Guinée+ depuis un espace clair et centralisé.</p>
          </div>
          <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-brand-red px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand-red/20 transition hover:-translate-y-0.5 hover:bg-red-700">
            <Plus size={17} /> Nouvel article <ArrowUpRight size={15} />
          </button>
        </header>

        <section className="grid gap-4 sm:grid-cols-3" aria-label="Résumé">
          <div className="rounded-2xl bg-brand-dark p-5 text-white shadow-xl shadow-gray-900/10">
            <div className="flex items-start justify-between"><p className="text-sm text-white/65">Rubriques actives</p><Layers3 size={19} className="text-brand-yellow" /></div>
            <p className="mt-5 text-3xl font-bold">{activeCategories}<span className="ml-1 text-base font-medium text-white/45">/ {categories.length}</span></p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-start justify-between"><p className="text-sm text-gray-500">Total des rubriques</p><Settings size={19} className="text-gray-400" /></div>
            <p className="mt-5 text-3xl font-bold text-gray-950">{categories.length}</p>
          </div>
          <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-100">
            <div className="flex items-start justify-between"><p className="text-sm text-gray-500">État du contenu</p><CheckCircle2 size={19} className="text-brand-green" /></div>
            <p className="mt-5 text-lg font-bold text-gray-950">Navigation à jour</p>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
          <aside>
            <div className="rounded-2xl bg-white p-2 shadow-sm ring-1 ring-gray-100 lg:sticky lg:top-8">
              <div className="mb-2 rounded-xl bg-gray-950 p-4 text-white">
                <LayoutDashboard size={19} className="mb-7 text-brand-yellow" />
                <p className="text-sm font-bold">Centre de contrôle</p>
                <p className="mt-1 text-xs text-white/50">Gestion éditoriale</p>
              </div>
              <nav className="grid gap-1" aria-label="Sections de l'administration">
                <button
                  onClick={() => setActiveTab('categories')}
                  aria-current={activeTab === 'categories' ? 'page' : undefined}
                  className={`flex items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-bold transition ${activeTab === 'categories' ? 'bg-red-50 text-brand-red' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-950'}`}
                >
                  <span className="flex items-center gap-3"><Settings size={17} /> Rubriques</span><span className="text-xs opacity-60">{categories.length}</span>
                </button>
                <button
                  onClick={() => setActiveTab('articles')}
                  aria-current={activeTab === 'articles' ? 'page' : undefined}
                  className={`flex items-center justify-between rounded-xl px-3 py-3 text-left text-sm font-bold transition ${activeTab === 'articles' ? 'bg-red-50 text-brand-red' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-950'}`}
                >
                  <span className="flex items-center gap-3"><FileText size={17} /> Articles</span><ArrowUpRight size={15} />
                </button>
              </nav>
            </div>
          </aside>

          <main className="min-w-0">
            {activeTab === 'categories' && (
              <section className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-100">
                <div className="flex flex-col gap-4 border-b border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
                  <div><p className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-brand-red">Navigation du site</p><h2 className="text-2xl font-serif font-bold text-gray-950">Gestion des rubriques</h2><p className="mt-1 text-sm text-gray-500">Contrôlez les rubriques affichées dans le menu public.</p></div>
                  <div className="flex items-center gap-2 self-start rounded-full bg-green-50 px-3 py-1.5 text-xs font-bold text-green-700"><span className="h-2 w-2 rounded-full bg-green-500" /> {activeCategories} actives</div>
                </div>

                {error ? (
                  <div className="m-5 rounded-xl border border-red-100 bg-red-50 p-5 text-sm text-red-700 sm:m-7"><p className="font-bold">Impossible de charger les rubriques</p><p className="mt-1">Vérifiez la connexion à l'API puis rechargez la page.</p></div>
                ) : categories.length === 0 ? (
                  <div className="p-12 text-center"><Layers3 className="mx-auto text-gray-300" size={34} /><p className="mt-4 font-bold text-gray-900">Aucune rubrique</p><p className="mt-1 text-sm text-gray-500">Les rubriques apparaîtront ici dès leur création.</p></div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[560px] text-left">
                      <thead><tr className="border-b border-gray-100 bg-gray-50/70 text-[11px] font-bold uppercase tracking-wider text-gray-400"><th className="px-5 py-3.5 sm:px-7">Nom de la rubrique</th><th className="px-5 py-3.5 sm:px-7">Visibilité</th><th className="px-5 py-3.5 text-right sm:px-7">Action</th></tr></thead>
                      <tbody>{categories.map(category => (
                        <tr key={category.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/70">
                          <td className="px-5 py-4 sm:px-7"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-500">{category.name.slice(0, 2).toUpperCase()}</div><span className="font-bold text-gray-900">{category.name}</span></div></td>
                          <td className="px-5 py-4 sm:px-7">{category.isActive ? <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-xs font-bold text-green-700"><CheckCircle2 size={14} /> Publique</span> : <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs font-bold text-gray-500"><XCircle size={14} /> Masquée</span>}</td>
                          <td className="px-5 py-4 text-right sm:px-7"><button onClick={() => toggleCategory(category.id, category.isActive)} disabled={updatingId === category.id} className={`relative inline-flex h-7 w-12 items-center rounded-full p-1 transition disabled:cursor-wait disabled:opacity-60 ${category.isActive ? 'bg-brand-green' : 'bg-gray-200'}`} role="switch" aria-checked={category.isActive} aria-label={`Modifier la visibilité de ${category.name}`}>{updatingId === category.id ? <RefreshCw size={15} className="mx-auto animate-spin text-white" /> : <span className={`h-5 w-5 rounded-full bg-white shadow-sm transition-transform ${category.isActive ? 'translate-x-5' : 'translate-x-0'}`} />}</button></td>
                        </tr>
                      ))}</tbody>
                    </table>
                  </div>
                )}
              </section>
            )}

            {activeTab === 'articles' && (
              <section className="flex min-h-[440px] flex-col items-center justify-center rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-gray-100 sm:p-12"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-brand-red"><FileText size={30} /></div><p className="mt-6 text-xs font-bold uppercase tracking-[0.16em] text-brand-red">Rédaction</p><h2 className="mt-2 text-2xl font-serif font-bold text-gray-950">Gestion des articles</h2><p className="mt-2 max-w-md text-sm leading-6 text-gray-500">L'espace complet de rédaction et de publication sera bientôt disponible ici.</p><button className="mt-7 inline-flex items-center gap-2 rounded-xl bg-brand-red px-5 py-3 text-sm font-bold text-white shadow-lg shadow-brand-red/20 transition hover:-translate-y-0.5 hover:bg-red-700"><Plus size={17} /> Nouvel article</button></section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
