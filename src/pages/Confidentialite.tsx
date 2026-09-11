import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Lock, FileText, Database, ShieldAlert, Mail, Activity, Eye, Globe, User } from 'lucide-react';

export default function Confidentialite() {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/pages/confidentialite')
      .then(res => res.json())
      .then(data => {
        // Only use DB content if it has actual HTML paragraphs
        if (data && data.content && data.content.length > 20) {
          setContent(data.content);
        } else {
          setContent(null);
        }
      })
      .catch(() => setContent(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <main className="flex-1 bg-gray-50 pt-24 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-2 h-full bg-brand-red"></div>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-red-50 rounded-2xl text-brand-red">
              <Lock size={32} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight text-gray-900">
                Politique de Confidentialité
              </h1>
              <p className="text-gray-500 font-medium mt-2">Dernière mise à jour : [Date à définir]</p>
            </div>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
            La présente Politique de confidentialité explique comment <strong className="text-gray-900">Guinée+</strong> collecte, utilise, conserve et protège les données personnelles des personnes qui consultent ou utilisent son site internet et ses services numériques.
            En utilisant le site, l'utilisateur reconnaît avoir pris connaissance de la présente politique.
          </p>
        </motion.div>
        
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-10 h-10 border-4 border-gray-200 border-t-brand-red rounded-full animate-spin"></div>
          </div>
        ) : content ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="bg-white rounded-3xl p-8 md:p-12 shadow-sm border border-gray-100 prose prose-lg prose-red max-w-none text-gray-800"
            dangerouslySetInnerHTML={{ __html: content }}
          />
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="space-y-8"
          >
            {/* 1. Responsable du traitement */}
            <section className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm text-gray-500">1</span>
                Responsable du traitement
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">Guinée+</div>
                      <div className="font-medium text-gray-900">Éditeur : [Nom légal]</div>
                      <div className="text-sm text-gray-600">Siège : [Adresse complète]</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">Contact</div>
                      <div className="font-medium text-gray-900">Général : [contact@...]</div>
                      <div className="text-sm text-gray-600">Privacy : [privacy@...]</div>
                      <div className="text-sm text-gray-600">Tél : [Numéro]</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Données collectées */}
            <section className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm text-gray-500">2</span>
                Données collectées
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-brand-red" />
                    Fournies directement
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>Nom et prénom</li>
                    <li>Adresse e-mail</li>
                    <li>Numéro de téléphone</li>
                    <li>Contenu du message</li>
                    <li>Fichiers transmis</li>
                  </ul>
                </div>
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-100">
                  <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Activity className="w-5 h-5 text-blue-600" />
                    Techniques et Navigation
                  </h4>
                  <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                    <li>Adresse IP & navigateur</li>
                    <li>Appareil & OS</li>
                    <li>Pages consultées</li>
                    <li>Date, heure et durée</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 3, 4. Finalités & Base légale */}
            <section className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm text-gray-500">3</span>
                Finalités et Base légale
              </h2>
              <div className="prose prose-gray max-w-none text-gray-600">
                <p>
                  Les données sont utilisées pour répondre à vos demandes, sécuriser le site, analyser l'audience et envoyer des newsletters (si applicable). 
                  Le traitement repose sur votre consentement, l'exécution d'un service, une obligation légale ou l'intérêt légitime de Guinée+.
                </p>
              </div>
            </section>

            {/* 5. Cookies */}
            <section className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm text-gray-500">4</span>
                Cookies et Technologies
              </h2>
              <div className="prose prose-gray max-w-none text-gray-600">
                <p>
                  Nous utilisons des cookies essentiels au fonctionnement du site, ainsi que des cookies analytiques pour comprendre l'audience. Vous pouvez configurer ou gérer vos préférences depuis votre navigateur.
                </p>
              </div>
            </section>

            {/* 10, 11, 12, 13. Partage & Sécurité */}
            <section className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm text-gray-500">5</span>
                Partage, Services et Sécurité
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <Database className="w-5 h-5 text-gray-400" />
                    Partage et Services
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Nous ne vendons pas vos données. Elles peuvent être partagées avec des prestataires (Vercel, PostgreSQL, Cloudinary, Gemini) strictement pour le fonctionnement technique.
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                    <ShieldAlert className="w-5 h-5 text-green-600" />
                    Sécurité
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Chiffrement HTTPS, sécurisation des accès et surveillance de l'infrastructure pour protéger vos informations contre tout accès non autorisé.
                  </p>
                </div>
              </div>
            </section>

            {/* 15, 16. Droits */}
            <section className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm text-gray-500">6</span>
                Vos Droits
              </h2>
              <div className="prose prose-gray max-w-none text-gray-600">
                <p>
                  Vous disposez d'un droit d'accès, de rectification, de suppression, et d'opposition. 
                  Pour toute demande, contactez-nous :
                </p>
                <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-4 inline-block">
                  <p className="text-blue-900 font-medium m-0">E-mail : [privacy@...]</p>
                  <p className="text-blue-800 text-sm m-0 mt-1">Adresse : [Adresse complète]</p>
                </div>
              </div>
            </section>

            <div className="text-center pt-8 pb-4">
              <p className="text-gray-400 text-sm">
                Guinée+ s'engage pour la transparence de vos données.<br/>
                © {new Date().getFullYear()} Guinée+.
              </p>
            </div>

          </motion.div>
        )}
      </div>
    </main>
  );
}
