import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export default function Confidentialite() {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/pages/confidentialite')
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
            Politique de Confidentialité
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
            <h2>Collecte des données personnelles</h2>
            <p>Dans le cadre de l'utilisation du site <strong>médiaGuinéeplus.com</strong>, nous pouvons être amenés à collecter certaines données (nom, adresse email) uniquement lorsque vous utilisez nos formulaires de contact ou d'inscription à notre newsletter.</p>
            <h2>Utilisation des données</h2>
            <p>Les informations collectées sont strictement confidentielles et sont utilisées exclusivement pour vous répondre ou vous envoyer notre actualité. Elles ne seront en aucun cas cédées, vendues ou louées à des tiers.</p>
            <h2>Cookies</h2>
            <p>Le site utilise des cookies à des fins statistiques (mesure d'audience) et pour améliorer votre expérience utilisateur. Vous pouvez configurer votre navigateur pour refuser ces cookies.</p>
            <h2>Vos droits</h2>
            <p>Conformément à la réglementation en vigueur, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ce droit, contactez-nous à l'adresse email : contact@mediaguineeplus.com.</p>
          </motion.div>
        )}
      </div>
    </main>
  );
}
