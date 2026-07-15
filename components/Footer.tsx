import Logo from "./Logo";

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <a href="/" className="logo">
              <Logo />
              <span className="logo-text">
                <b>Assemblée</b>
                <span>Mont Garizim</span>
              </span>
            </a>
            <p>
              Une communauté qui grandit dans la foi, l&apos;amour et
              l&apos;espérance en Jésus-Christ.
            </p>
            <div className="footer-social">
              <a href="#" aria-label="Facebook">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M15 8h2V5h-2c-2 0-3.5 1.5-3.5 3.5V10H9v3h2.5v6h3v-6H17l.5-3h-3V8.7c0-.4.3-.7.5-.7z"
                    fill="#fff"
                  />
                </svg>
              </a>
              <a href="#" aria-label="YouTube">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="6" width="18" height="12" rx="3" stroke="#fff" strokeWidth="1.5" />
                  <path d="M11 10l4 2-4 2z" fill="#fff" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="4" width="16" height="16" rx="4" stroke="#fff" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="3.2" stroke="#fff" strokeWidth="1.5" />
                  <circle cx="16.6" cy="7.4" r="0.9" fill="#fff" />
                </svg>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Navigation</h4>
            <ul>
              <li><a href="/">Accueil</a></li>
              <li><a href="/a-propos">À propos</a></li>
              <li><a href="/evenements">Événements</a></li>
              <li><a href="/predications">Prédications</a></li>
              <li><a href="/galerie">Galerie</a></li>
              <li><a href="/temoignages">Témoignages</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/admin/login">Admin</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Nos ministères</h4>
            <ul>
              <li><a href="/ministeres">Jeunesse</a></li>
              <li><a href="/ministeres">Enfants</a></li>
              <li><a href="/ministeres">Louange</a></li>
              <li><a href="/ministeres">Évangélisation</a></li>
              <li><a href="/ministeres">Familles</a></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Restons en contact</h4>
            <p style={{ fontSize: 13.5, marginBottom: 14, color: "rgba(255,255,255,0.55)" }}>
              Recevez nos actualités et le programme des cultes.
            </p>
            <div className="newsletter-form">
              <input type="email" placeholder="Votre email" />
              <button aria-label="S'abonner">→</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="links">
            <a href="#">Mentions légales</a>
            <a href="#">Politique de confidentialité</a>
            <a href="#">Plan du site</a>
          </div>
          <span>© 2026 Assemblée Mont Garizim. Tous droits réservés.</span>
        </div>
      </div>
    </footer>
  );
}
