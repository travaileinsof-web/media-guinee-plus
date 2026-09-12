import { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, PenLine } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { AdSpace } from '../components/AdSpace';

interface Chronique {
  id: string;
  title: string;
  author: string;
  authorRole?: string | null;
  authorImage?: string | null;
  date: string;
  excerpt?: string | null;
}

function formatDate(date: string) {
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return 'Date non disponible';

  return parsedDate.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function ChroniqueView() {
  const { id } = useParams<{ id: string }>();
  const [chronique, setChronique] = useState<Chronique | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/chroniques/${id}`, { cache: 'no-store' })
      .then(response => {
        if (!response.ok) throw new Error('Chronique introuvable');
        return response.json();
      })
      .then(setChronique)
      .catch(() => setChronique(null))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <main className="min-h-screen bg-[#f8f7f4] px-4 py-24"><div className="mx-auto h-96 max-w-5xl animate-pulse rounded-2xl bg-white" /></main>;
  }

  if (!chronique) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f8f7f4] px-4 text-center">
        <div>
          <PenLine className="mx-auto mb-5 text-brand-red" size={36} />
          <h1 className="font-serif text-4xl font-black text-brand-dark">Chronique introuvable</h1>
          <Link to="/chroniques" className="mt-6 inline-flex items-center gap-2 font-bold text-brand-red hover:underline"><ArrowLeft size={16} /> Retour aux chroniques</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f7f4] pb-20">
      <div className="mx-auto max-w-5xl px-4 pt-10 md:px-8 md:pt-16">
        <Link to="/chroniques" className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider text-brand-red hover:gap-3 transition-all">
          <ArrowLeft size={16} /> Toutes les chroniques
        </Link>

        <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-8 overflow-hidden rounded-2xl bg-white shadow-xl shadow-brand-dark/10">
          <header className="bg-brand-dark px-6 py-12 text-white md:px-16 md:py-20">
            <div className="flex items-center gap-3 text-xs font-black uppercase tracking-[0.25em] text-brand-yellow">
              <span className="flex items-center gap-2"><PenLine size={15} /> Opinion</span>
              <span className="h-1 w-1 rounded-full bg-gray-500" />
              <span className="flex items-center gap-2 text-gray-300"><Calendar size={14} /> {formatDate(chronique.date)}</span>
            </div>
            <h1 className="mt-7 max-w-4xl font-serif text-4xl font-black leading-tight md:text-7xl">{chronique.title}</h1>
            <div className="mt-10 flex items-center gap-4">
              {chronique.authorImage ? <img src={chronique.authorImage} alt={chronique.author} className="h-14 w-14 rounded-full object-cover" /> : <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-red font-serif text-2xl font-black">{chronique.author.charAt(0)}</div>}
              <div><p className="font-serif text-xl font-bold">{chronique.author}</p><p className="text-sm text-gray-300">{chronique.authorRole || 'Chroniqueur'}</p></div>
            </div>
          </header>

          <div className="px-6 py-10 md:px-16 md:py-14">
            <p className="border-l-4 border-brand-red pl-5 font-serif text-xl font-bold leading-relaxed text-gray-700 md:text-2xl">
              {chronique.excerpt || 'Une réflexion signée par la rédaction de Guinée+.'}
            </p>
            <div className="mt-12 border-t border-gray-100 pt-8 text-gray-700">
              <p className="leading-relaxed">Cette chronique présente le point de vue de son auteur. Elle relève de l’opinion et ne constitue pas nécessairement la position officielle de la rédaction de Guinée+.</p>
            </div>
          </div>
        </motion.article>

        <div className="py-10">
          <AdSpace location="article_bottom" format="horizontal" className="rounded-xl" />
        </div>
      </div>
    </main>
  );
}