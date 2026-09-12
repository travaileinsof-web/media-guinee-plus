import { useEffect, useState } from 'react';
import { ArrowRight, Calendar, PenLine } from 'lucide-react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { AdSpace } from '../components/AdSpace';
import { Reveal } from '../components/Reveal';

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

export default function Chroniques() {
  const [chroniques, setChroniques] = useState<Chronique[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/chroniques', { cache: 'no-store' })
      .then(response => response.json())
      .then(data => setChroniques(Array.isArray(data) ? data : []))
      .catch(() => setChroniques([]))
      .finally(() => setLoading(false));
  }, []);

  const featuredChronique = chroniques[0];
  const otherChroniques = chroniques.slice(1);

  return (
    <main className="min-h-screen bg-[#f8f7f4] pb-20">
      <section className="relative overflow-hidden bg-brand-dark text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(227,6,19,0.28),transparent_38%)]" />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-20 md:px-8 md:pb-24 md:pt-28">
          <Reveal>
            <p className="mb-5 flex items-center gap-2 text-xs font-black uppercase tracking-[0.3em] text-brand-yellow">
              <PenLine size={16} /> Regards & décryptages
            </p>
            <h1 className="max-w-4xl font-serif text-5xl font-black leading-[0.95] tracking-tight md:text-8xl">
              Les voix qui font avancer le débat.
            </h1>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-gray-300 md:text-xl">
              Des analyses signées, des points de vue assumés et des regards libres sur la Guinée et le monde.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="py-8 md:py-10">
          <AdSpace location="content_top" format="horizontal" className="rounded-xl" />
        </div>

        {loading ? (
          <div className="grid gap-8 lg:grid-cols-3">
            {[1, 2, 3].map(item => (
              <div key={item} className="h-80 animate-pulse rounded-2xl bg-white" />
            ))}
          </div>
        ) : !featuredChronique ? (
          <div className="border-y border-gray-200 py-20 text-center">
            <PenLine className="mx-auto mb-5 text-brand-red" size={34} />
            <h2 className="font-serif text-3xl font-black text-brand-dark">Les chroniques arrivent bientôt</h2>
            <p className="mx-auto mt-3 max-w-md text-gray-500">La rédaction prépare de nouveaux regards à découvrir très prochainement.</p>
          </div>
        ) : (
          <>
            <Reveal className="mb-16">
              <article className="group grid overflow-hidden rounded-2xl bg-white shadow-xl shadow-brand-dark/10 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="relative min-h-90 overflow-hidden bg-brand-dark">
                  {featuredChronique.authorImage ? (
                    <img src={featuredChronique.authorImage} alt={featuredChronique.author} className="h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-brand-red text-8xl font-serif font-black text-white">{featuredChronique.author.charAt(0)}</div>
                  )}
                  <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute bottom-6 left-6 text-white md:bottom-8 md:left-8">
                    <span className="mb-3 inline-block bg-brand-yellow px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-brand-dark">À la une</span>
                    <p className="font-serif text-2xl font-bold">{featuredChronique.author}</p>
                    <p className="text-sm text-gray-300">{featuredChronique.authorRole || 'Chroniqueur'}</p>
                  </div>
                </div>
                <div className="flex flex-col justify-center p-8 md:p-12">
                  <div className="mb-6 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.2em] text-brand-red">
                    <span>Opinion</span>
                    <span className="h-1 w-1 rounded-full bg-gray-300" />
                    <span className="flex items-center gap-1 text-gray-400"><Calendar size={13} /> {formatDate(featuredChronique.date)}</span>
                  </div>
                  <h2 className="font-serif text-3xl font-black leading-tight text-brand-dark md:text-5xl">{featuredChronique.title}</h2>
                  <p className="mt-6 text-lg leading-relaxed text-gray-600">{featuredChronique.excerpt || 'Une réflexion signée par la rédaction de Guinée+.'}</p>
                  <Link to={`/chronique/${featuredChronique.id}`} className="mt-8 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-brand-red">Lire la chronique <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" /></Link>
                </div>
              </article>
            </Reveal>

            {otherChroniques.length > 0 && (
              <section>
                <div className="mb-8 flex items-end justify-between border-b border-gray-200 pb-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.25em] text-brand-red">La sélection</p>
                    <h2 className="mt-2 font-serif text-3xl font-black text-brand-dark md:text-4xl">Autres chroniques</h2>
                  </div>
                  <span className="hidden text-sm font-bold text-gray-400 md:block">{otherChroniques.length} publication{otherChroniques.length > 1 ? 's' : ''}</span>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {otherChroniques.map((chronique, index) => (
                    <Link to={`/chronique/${chronique.id}`} key={chronique.id} className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 transition duration-300 hover:-translate-y-1 hover:border-brand-red/30 hover:shadow-xl">
                      <div className="mb-6 flex items-center gap-3">
                        {chronique.authorImage ? <img src={chronique.authorImage} alt={chronique.author} className="h-12 w-12 rounded-full object-cover" /> : <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-red font-serif text-xl font-black text-white">{chronique.author.charAt(0)}</div>}
                        <div><p className="font-bold text-brand-dark">{chronique.author}</p><p className="text-xs text-gray-500">{chronique.authorRole || 'Chroniqueur'}</p></div>
                      </div>
                      <p className="mb-4 text-[10px] font-black uppercase tracking-[0.2em] text-brand-red">Opinion</p>
                      <h3 className="font-serif text-2xl font-black leading-tight text-gray-900 group-hover:text-brand-red">{chronique.title}</h3>
                      <p className="mt-4 flex-1 leading-relaxed text-gray-600">{chronique.excerpt || 'Une nouvelle chronique à découvrir.'}</p>
                      <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 text-xs font-bold text-gray-400"><span>{formatDate(chronique.date)}</span><ArrowRight size={16} className="text-brand-red transition-transform group-hover:translate-x-1" /></div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}
