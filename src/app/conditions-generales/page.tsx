import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Conditions Générales d’Utilisation',
  description: 'Règles d’utilisation du site www.nostalgie.ci — Nostalgie Côte d’Ivoire, 101.1 FM.',
  alternates: { canonical: 'https://www.nostalgie.ci/conditions-generales' },
  robots: { index: true, follow: true },
}

export default function ConditionsGeneralesPage() {
  return (
    <section className="page-section legal-page">
      <p className="section-label">Règles d&apos;utilisation</p>
      <h1 className="section-title">Conditions Générales d&apos;Utilisation</h1>
      <p className="legal-updated">Dernière mise à jour : 22 octobre 2026</p>

      <h2>1. Objet</h2>
      <p>
        Les présentes conditions générales d&apos;utilisation (CGU) encadrent l&apos;utilisation du site
        www.nostalgie.ci, édité par <strong>SORANO-CI SA</strong>, société anonyme immatriculée au Registre
        du Commerce et du Crédit Mobilier sous le numéro <strong>CI-ABJ-1993-B-170943</strong>, dont le
        siège social est situé au Plateau, avenue Chardy, 01 BP 157 Abidjan 01, représentée par Monsieur
        Ange Fabien Guei, Directeur Général, exploitant la radio Nostalgie Côte d&apos;Ivoire (101.1 FM
        Abidjan). En utilisant le site, vous acceptez ces conditions.
      </p>

      <h2>2. Hébergement</h2>
      <p>Le site est hébergé par Vercel Inc.</p>

      <h2>3. Accès au site</h2>
      <p>
        Le site est accessible gratuitement, 24h/24. Nostalgie CI ne garantit pas une disponibilité
        continue et peut interrompre l&apos;accès pour maintenance, sans préavis.
      </p>

      <h2>4. Le direct radio</h2>
      <p>
        Le flux audio en direct (101.1 FM) est fourni par notre partenaire technique Orange Côte
        d&apos;Ivoire. Sa disponibilité dépend de l&apos;infrastructure de ce partenaire et peut
        occasionnellement être interrompue, indépendamment de notre volonté.
      </p>

      <h2>5. Propriété intellectuelle</h2>
      <p>
        L&apos;ensemble des contenus du site (textes, logo, identité visuelle, charte graphique,
        enregistrements audio et vidéo) est la propriété de Nostalgie CI ou de ses partenaires, sauf
        mention contraire. Toute reproduction sans autorisation préalable est interdite.
      </p>

      <h2>6. Contenus publiés par les utilisateurs</h2>
      <p>En soumettant une dédicace, un sujet, un commentaire ou une réaction sur le site, vous vous engagez à :</p>
      <ul>
        <li>Ne publier aucun contenu injurieux, diffamatoire, discriminatoire ou contraire à la loi ivoirienne</li>
        <li>Ne pas usurper l&apos;identité d&apos;un tiers</li>
      </ul>
      <p>Nostalgie CI se réserve le droit de modérer, refuser ou retirer tout contenu publié sur le site, sans justification préalable.</p>

      <h2>7. Réservation publicitaire</h2>
      <p>
        Les réservations d&apos;espaces publicitaires effectuées via le site constituent une demande,
        confirmée sous 24h par notre équipe commerciale. Les tarifs affichés sont indicatifs et peuvent
        être ajustés avant confirmation définitive.
      </p>

      <h2>8. Liens externes</h2>
      <p>
        Le site peut contenir des liens vers des réseaux sociaux ou sites tiers (YouTube, Facebook,
        Instagram, TikTok…). Nostalgie CI n&apos;est pas responsable du contenu de ces sites tiers.
      </p>

      <h2>9. Responsabilité</h2>
      <p>
        Nostalgie CI met tout en œuvre pour assurer l&apos;exactitude des informations publiées, sans
        garantie absolue. L&apos;utilisation du site se fait sous votre responsabilité.
      </p>

      <h2>10. Droit applicable</h2>
      <p>Les présentes CGU sont soumises au droit ivoirien. Tout litige relève des tribunaux compétents de Côte d&apos;Ivoire.</p>

      <h2>11. Contact</h2>
      <p><a href="mailto:nostalgiecotedivoire@gmail.com">nostalgiecotedivoire@gmail.com</a></p>
    </section>
  )
}
