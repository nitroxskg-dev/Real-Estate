import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Footer = () => {
  return (
    <footer className="bg-charcoal border-t border-stone/10" data-testid="footer">
      <div className="max-w-[1800px] mx-auto px-6 md:px-12 py-24 md:py-32">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8">
          {/* Brand */}
          <div className="md:col-span-4">
            <Link to="/" className="font-serif text-2xl md:text-3xl text-ivory tracking-tight">
              <span className="italic">Quiet</span> Wealth
            </Link>
            <p className="mt-6 font-sans text-sm text-stone leading-relaxed max-w-xs">
              Residences of quiet distinction. Selected properties, privately presented.
            </p>
          </div>

          {/* Navigation */}
          <div className="md:col-span-2 md:col-start-7">
            <h4 className="font-sans text-xs tracking-[0.2em] uppercase text-stone mb-6">Navigate</h4>
            <ul className="space-y-4">
              <li>
                <Link to="/" className="font-sans text-sm text-ivory/70 hover:text-ivory transition-colors duration-300" data-testid="footer-link-home">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/properties" className="font-sans text-sm text-ivory/70 hover:text-ivory transition-colors duration-300" data-testid="footer-link-properties">
                  Properties
                </Link>
              </li>
              <li>
                <Link to="/contact" className="font-sans text-sm text-ivory/70 hover:text-ivory transition-colors duration-300" data-testid="footer-link-contact">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="font-sans text-xs tracking-[0.2em] uppercase text-stone mb-6">Contact</h4>
            <ul className="space-y-4">
              <li className="font-sans text-sm text-ivory/70">
                inquiries@quietwealth.com
              </li>
              <li className="font-sans text-sm text-ivory/70">
                By appointment only
              </li>
            </ul>
          </div>

          {/* CTA */}
          <div className="md:col-span-3">
            <h4 className="font-sans text-xs tracking-[0.2em] uppercase text-stone mb-6">Private Viewings</h4>
            <p className="font-sans text-sm text-ivory/70 mb-6">
              Schedule a confidential consultation.
            </p>
            <Link
              to="/contact"
              className="btn-luxury inline-block"
              data-testid="footer-cta-button"
            >
              Request Access
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-24 pt-8 border-t border-stone/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="font-sans text-xs text-stone/50">
            © {new Date().getFullYear()} Quiet Wealth. All rights reserved.
          </p>
          <p className="font-sans text-xs text-stone/50">
            Discretion guaranteed.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
