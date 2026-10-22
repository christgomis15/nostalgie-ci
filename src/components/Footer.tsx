import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div>
          <div className="site-footer-brand">NOSTALGIE CI</div>
          <div className="site-footer-sub">101.1 FM Abidjan · © {new Date().getFullYear()} SORANO-CI SA</div>
        </div>
        <div className="site-footer-links">
          <Link href="/confidentialite">Politique de confidentialité</Link>
          <Link href="/conditions-generales">Conditions générales d&apos;utilisation</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </footer>
  )
}
