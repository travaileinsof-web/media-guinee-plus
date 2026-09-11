import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { FileText, Shield, User, MapPin, Mail, Phone, Link as LinkIcon, AlertCircle } from 'lucide-react';

export default function MentionsLegales() {
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/pages/mentions-legales')
      .then(res => res.json())
      .then(data => {
        // Only use DB content if it has actual HTML paragraphs (more than just empty tags)
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
              <Shield size={32} />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-serif font-black tracking-tight text-gray-900">
                Mentions Légales
              </h1>
              <p className="text-gray-500 font-medium mt-2">Dernière mise à jour : [Date à définir]</p>
            </div>
          </div>
          <p className="text-lg text-gray-600 leading-relaxed max-w-3xl">
            Bienvenue sur <strong className="text-gray-900">Guinée+</strong>, plateforme éditoriale consacrée à l’information guinéenne et à l’actualité nationale, régionale et internationale.
            Les présentes mentions légales définissent les conditions d’identification, d’utilisation et de responsabilité applicables au site et à l'ensemble de ses contenus et services.
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
            {/* 1. Identification */}
            <section className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm text-gray-500">1</span>
                Identification du média
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <FileText className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">Éditeur</div>
                      <div className="font-medium text-gray-900">[Nom de l'éditeur / Entreprise]</div>
                      <div className="text-sm text-gray-600">Service de presse en ligne</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">Siège social</div>
                      <div className="font-medium text-gray-900">[Adresse complète]</div>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <User className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">Direction</div>
                      <div className="font-medium text-gray-900">Directeur de publication : [Nom]</div>
                      <div className="text-sm text-gray-600">Rédacteur en chef : [Nom]</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-1" />
                    <div>
                      <div className="text-sm font-bold text-gray-500 uppercase tracking-wide">Contact</div>
                      <div className="font-medium text-gray-900">[contact@...]</div>
                      <div className="text-sm text-gray-600">[redaction@...]</div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* 2 & 3. Statut & Direction */}
            <section className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm text-gray-500">2</span>
                Statut et Ligne éditoriale
              </h2>
              <div className="prose prose-gray max-w-none text-gray-600">
                <p>
                  <strong>Guinée+</strong> est un service de presse en ligne destiné à produire, publier et diffuser des contenus d'information portant notamment sur l'actualité guinéenne, la vie publique, l'économie, la société, la culture, le sport, l'environnement et les initiatives locales.
                </p>
                <p>
                  La plateforme s'inscrit dans le respect des principes de liberté de la presse, de pluralisme de l'information, de responsabilité éditoriale et des règles applicables aux médias en République de Guinée. La rédaction s'efforce de distinguer les faits, les analyses, les opinions, les chroniques et les contenus sponsorisés.
                </p>
                <p>
                  Les opinions exprimées dans les tribunes, chroniques ou contributions externes n'engagent pas nécessairement la rédaction ou l'éditeur de Guinée+.
                </p>
              </div>
            </section>

            {/* 5, 6, 7. Responsabilité & Sources */}
            <section className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm text-gray-500">3</span>
                Responsabilité et Droit de réponse
              </h2>
              <div className="prose prose-gray max-w-none text-gray-600">
                <p>
                  L'éditeur met en œuvre des moyens raisonnables pour assurer l'exactitude des informations publiées, mais ne peut garantir l'absence totale d'erreurs. Les informations sont fournies à titre informatif.
                </p>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 my-6">
                  <h4 className="text-gray-900 font-bold mb-2 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-brand-red" />
                    Signalement et Droit de réponse
                  </h4>
                  <p className="text-sm m-0">
                    Toute personne estimant qu'une publication contient une erreur factuelle ou porte atteinte à ses droits peut contacter la rédaction : <strong>[redaction@...]</strong>. La demande doit préciser l'article concerné, le passage contesté et les motifs.
                  </p>
                </div>
              </div>
            </section>

            {/* 8, 9, 10. Propriété Intellectuelle */}
            <section className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm text-gray-500">4</span>
                Propriété Intellectuelle
              </h2>
              <div className="prose prose-gray max-w-none text-gray-600">
                <p>
                  Sauf indication contraire, l'ensemble des éléments composant le site Guinée+ — notamment le nom, la marque, le logo, l'identité visuelle, les textes, articles, photographies, illustrations et vidéos — est protégé par les règles applicables en matière de propriété intellectuelle.
                </p>
                <p>
                  Toute reproduction, représentation, modification ou republication d'un contenu appartenant à Guinée+ est <strong>strictement interdite sans autorisation préalable</strong>. La reproduction courte d'un extrait à des fins de citation doit mentionner clairement la source.
                </p>
              </div>
            </section>

            {/* Hébergement & Données */}
            <section className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 text-sm text-gray-500">5</span>
                Hébergement et Données Personnelles
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Hébergement</h4>
                  <p className="text-gray-600 text-sm">
                    <strong>Hébergeur :</strong> [Nom de l'hébergeur]<br/>
                    <strong>Adresse :</strong> [Adresse de l'hébergeur]<br/>
                    <strong>Pays :</strong> [Pays]
                  </p>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 mb-2">Données Personnelles</h4>
                  <p className="text-gray-600 text-sm">
                    Guinée+ collecte des données dans le cadre du respect de la réglementation applicable. Pour en savoir plus sur l'utilisation des cookies et vos droits, consultez notre Politique de confidentialité.
                  </p>
                </div>
              </div>
            </section>

            <div className="text-center pt-8 pb-4">
              <p className="text-gray-400 text-sm">
                Les présentes mentions légales sont soumises au droit applicable en République de Guinée.<br/>
                © {new Date().getFullYear()} Guinée+. Tous droits réservés.
              </p>
            </div>

          </motion.div>
        )}
      </div>
    </main>
  );
}
