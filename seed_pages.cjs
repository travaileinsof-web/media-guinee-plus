const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.pageContent.upsert({
    where: { slug: 'mentions-legales' },
    update: {},
    create: {
      slug: 'mentions-legales',
      title: 'Mentions Légales',
      content: `<h2>Éditeur du site</h2>
<p>Le site <strong>médiaGuinéeplus.com</strong> est édité par la rédaction de Guinée+.</p>
<p>Adresse : Bonfi Niger, Matam, Conakry, Guinée.</p>
<p>Téléphone : +224 625 37 54 09</p>
<p>Email : contact@mediaguineeplus.com</p>
<h2>Directeur de la publication</h2>
<p>Mohamed Fofana</p>
<h2>Hébergement</h2>
<p>Ce site est hébergé par Vercel Inc.<br>340 S Lemon Ave #4133<br>Walnut, CA 91789, USA.</p>
<h2>Propriété intellectuelle</h2>
<p>L'ensemble de ce site relève de la législation guinéenne et internationale sur le droit d'auteur et la propriété intellectuelle. Tous les droits de reproduction sont réservés.</p>`
    }
  });

  await prisma.pageContent.upsert({
    where: { slug: 'confidentialite' },
    update: {},
    create: {
      slug: 'confidentialite',
      title: 'Politique de Confidentialité',
      content: `<h2>Collecte des données personnelles</h2>
<p>Dans le cadre de l'utilisation du site <strong>médiaGuinéeplus.com</strong>, nous pouvons être amenés à collecter certaines données (nom, adresse email) uniquement lorsque vous utilisez nos formulaires de contact ou d'inscription à notre newsletter.</p>
<h2>Utilisation des données</h2>
<p>Les informations collectées sont strictement confidentielles et sont utilisées exclusivement pour vous répondre ou vous envoyer notre actualité. Elles ne seront en aucun cas cédées, vendues ou louées à des tiers.</p>
<h2>Cookies</h2>
<p>Le site utilise des cookies à des fins statistiques (mesure d'audience) et pour améliorer votre expérience utilisateur. Vous pouvez configurer votre navigateur pour refuser ces cookies.</p>
<h2>Vos droits</h2>
<p>Conformément à la réglementation en vigueur, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ce droit, contactez-nous à l'adresse email : contact@mediaguineeplus.com.</p>`
    }
  });
  console.log("Pages remplies avec succès.");
}

main()
  .catch(e => {
    console.error("Erreur de connexion à la base de données :", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
