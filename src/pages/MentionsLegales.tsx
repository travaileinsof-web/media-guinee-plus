import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export default function MentionsLegales() {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/pages/mentions-legales')
      .then(res => res.json())
      .then(data => {
        if (data && data.content) {
          setContent(data.content);
        } else {
          setContent(null);
        }
      })
      .catch(() => setContent(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="flex-1 bg-white pt-24 pb-16 min-h-[70vh]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight text-gray-900 border-l-8 border-brand-red pl-4">
            Mentions Légales
          </h1>
        </motion.div>
        
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="w-8 h-8 border-4 border-gray-200 border-t-brand-red rounded-full animate-spin"></div>
          </div>
        ) : content ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="prose prose-lg prose-red max-w-none text-gray-800"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="prose prose-lg prose-red max-w-none text-gray-800"
          >
            <h2>Éditeur du site</h2>
            <p>Le site <strong>médiaGuinéeplus.com</strong> est édité par la rédaction de Guinée+.</p>
            <p>Adresse : Bonfi Niger, Matam, Conakry, Guinée.</p>
            <p>Téléphone : +224 625 37 54 09</p>
            <p>Email : contact@mediaguineeplus.com</p>
            <h2>Directeur de la publication</h2>
            <p>Mohamed Fofana</p>
            <h2>Hébergement</h2>
            <p>Ce site est hébergé par Vercel Inc.<br/>340 S Lemon Ave #4133<br/>Walnut, CA 91789, USA.</p>
            <h2>Propriété intellectuelle</h2>
            <p>L'ensemble de ce site relève de la législation guinéenne et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés.</p>
          </motion.div>
        )}
      </div>
    </main>
  );
}
