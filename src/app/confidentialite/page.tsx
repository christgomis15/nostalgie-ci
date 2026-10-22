import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Politique de Confidentialité',
  description: 'Comment Nostalgie CI collecte, utilise et protège vos données personnelles sur www.nostalgie.ci.',
  alternates: { canonical: 'https://www.nostalgie.ci/confidentialite' },
  robots: { index: true, follow: true },
}

export default function ConfidentialitePage() {
  return (
    <section className="page-section legal-page">
      <p className="section-label">Vos données</p>
      <h1 className="section-title">Politique de Confidentialité</h1>
      <p className="legal-updated">Dernière mise à jour : 22 octobre 2026</p>

      <h2>1. Qui sommes-nous</h2>
      <p>
        Le site www.nostalgie.ci est édité par <strong>SORANO-CI SA</strong>, société anonyme immatriculée
        au Registre du Commerce et du Crédit Mobilier sous le numéro <strong>CI-ABJ-1993-B-170943</strong>,
        dont le siège social est situé au Plateau, avenue Chardy, 01 BP 157 Abidjan 01, représentée par
        Monsieur Ange Fabien Guei, Directeur Général, exploitant la radio Nostalgie Côte d&apos;Ivoire
        (101.1 FM Abidjan, 1<sup>ère</sup> radio commerciale privée de Côte d&apos;Ivoire).
      </p>
      <p>Contact : <a href="mailto:nostalgiecotedivoire@gmail.com">nostalgiecotedivoire@gmail.com</a></p>

      <h2>2. Quelles données nous collectons</h2>
      <p>Selon les formulaires que vous utilisez sur le site :</p>
      <ul>
        <li><strong>Dédicaces</strong> (Crazy Morning, Hits &amp; Co) : prénom, ville</li>
        <li><strong>Contact, demandes commerciales, partenariats</strong> : nom, société, email, téléphone, message</li>
        <li><strong>Réservation publicitaire</strong> : société, contact, email, téléphone, espaces choisis</li>
        <li><strong>Inscription à la newsletter</strong> : adresse email</li>
        <li><strong>Inscription « communauté auditeurs »</strong> : nom, prénom, date de naissance, téléphone, ville</li>
        <li><strong>Commentaires et réactions</strong> (page Sujets, Podcasts &amp; Replay) : prénom, message</li>
      </ul>
      <p>Nous ne collectons que les données que vous nous transmettez volontairement via ces formulaires.</p>

      <h2>3. Pourquoi nous les utilisons</h2>
      <ul>
        <li>Diffuser votre dédicace à l&apos;antenne</li>
        <li>Répondre à vos demandes commerciales, partenariats ou messages de contact</li>
        <li>Traiter vos réservations publicitaires</li>
        <li>Vous envoyer notre newsletter hebdomadaire, si vous y êtes abonné</li>
        <li>Vous contacter par SMS ou téléphone avec des offres, <strong>uniquement</strong> si vous avez coché la case de consentement prévue à cet effet</li>
        <li>Afficher les commentaires que vous publiez sur le site</li>
      </ul>

      <h2>4. Durée de conservation</h2>
      <p>Vos données sont conservées le temps nécessaire à la finalité pour laquelle elles ont été collectées :</p>
      <ul>
        <li><strong>Dédicaces, messages de contact, abonnement à la newsletter</strong> : 3 ans à compter de votre dernier contact avec nous</li>
        <li><strong>Inscription « communauté auditeurs »</strong> (y compris la date de naissance) : pendant toute la durée de validité de votre inscription</li>
        <li><strong>Données des contacts commerciaux</strong> (annonceurs, partenaires) : 3 ans après la fin de la relation commerciale, à des fins de prospection et de suivi</li>
      </ul>
      <p>Sauf obligation légale nous imposant une durée différente.</p>

      <h2>5. Avec qui nous les partageons</h2>
      <p>Vos données ne sont jamais vendues. Elles sont traitées par les prestataires techniques suivants, qui agissent comme sous-traitants :</p>
      <ul>
        <li><strong>Google</strong> (Google Sheets / Google Apps Script) — stockage des réponses aux formulaires</li>
        <li><strong>Brevo</strong> — envoi de la newsletter</li>
        <li><strong>Vercel</strong> — hébergement du site et mesure d&apos;audience anonyme</li>
      </ul>

      <h2>6. Cookies et traceurs</h2>
      <p>Le site n&apos;utilise <strong>aucun cookie publicitaire ni de pistage</strong> (pas de Google Analytics, pas de pixel Facebook ou TikTok). Nous utilisons uniquement :</p>
      <ul>
        <li>Un cookie technique de connexion pour l&apos;espace d&apos;administration du site (ne vous concerne pas si vous n&apos;êtes pas membre de l&apos;équipe Nostalgie CI)</li>
        <li>
          Des mémorisations locales dans votre navigateur (« localStorage »), à usage strictement
          fonctionnel : ne pas rejouer deux fois le message publicitaire d&apos;entrée, se souvenir
          qu&apos;une bannière a déjà été fermée, retenir qu&apos;un « J&apos;aime » a déjà été cliqué.
          Ces informations restent sur votre appareil et ne sont jamais transmises à un tiers.
        </li>
        <li>Des statistiques de fréquentation anonymes et agrégées (Vercel Analytics), calculées sans cookie ni identifiant individuel.</li>
      </ul>

      <h2>7. Mineurs</h2>
      <p>
        Le formulaire d&apos;inscription « communauté auditeurs » demande une date de naissance, conservée
        pendant toute la durée de validité de votre inscription (voir section 4). Si vous avez moins de
        18 ans, assurez-vous d&apos;avoir l&apos;accord d&apos;un parent ou tuteur avant de transmettre vos informations.
      </p>

      <h2>8. Vos droits</h2>
      <p>
        Conformément à la loi ivoirienne n°2013-450 relative à la protection des données à caractère
        personnel, vous disposez d&apos;un droit d&apos;accès, de rectification, d&apos;opposition et de
        suppression de vos données.
      </p>
      <p>Pour exercer ces droits, contactez-nous à : <a href="mailto:nostalgiecotedivoire@gmail.com">nostalgiecotedivoire@gmail.com</a></p>
      <p>
        Vous pouvez également adresser une réclamation à l&apos;<strong>ARTCI</strong> (Autorité de Régulation
        des Télécommunications/TIC de Côte d&apos;Ivoire), autorité compétente en matière de protection
        des données personnelles en Côte d&apos;Ivoire.
      </p>

      <h2>9. Sécurité</h2>
      <p>Nous mettons en œuvre des mesures raisonnables pour protéger vos données contre tout accès non autorisé, perte ou divulgation.</p>

      <h2>10. Modifications de cette politique</h2>
      <p>Cette politique peut être mise à jour. La date de dernière modification figure en haut de cette page.</p>
    </section>
  )
}
