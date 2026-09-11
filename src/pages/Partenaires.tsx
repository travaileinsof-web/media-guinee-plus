import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ExternalLink, Linkedin, Twitter } from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  description: string | null;
}

export default function Partenaires() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/partners')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setPartners(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="flex-1 bg-white pt-24 pb-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-16"
        >
          <span className="text-brand-red font-bold tracking-wider uppercase text-sm mb-4 block">Notre Réseau</span>
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-900 mb-6 tracking-tight">Nos Partenaires</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Découvrez les institutions et entreprises qui accompagnent Guinée+ dans sa mission d'information.
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-brand-red rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {partners.map((partner, index) => (
              <motion.div
                key={partner.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="bg-gray-50 rounded-2xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group"
              >
                <div className="h-32 flex items-center justify-center mb-6 bg-white rounded-xl p-4 shadow-sm group-hover:scale-105 transition-transform duration-300">
                  {partner.logoUrl ? (
                    <img src={partner.logoUrl} alt={partner.name} className="max-h-full max-w-full object-contain" />
                  ) : (
                    <div className="text-2xl font-bold text-gray-300 uppercase">{partner.name[0]}</div>
                  )}
                </div>
                <h3 className="text-2xl font-serif font-bold text-gray-900 mb-3">{partner.name}</h3>
                <p className="text-gray-600 flex-1">{partner.description}</p>
                {partner.websiteUrl && (
                  <a
                    href={partner.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-brand-red font-semibold mt-6 hover:text-red-700 transition-colors"
                  >
                    Visiter le site <ExternalLink size={16} />
                  </a>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
