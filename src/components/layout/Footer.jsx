import React from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Globe, Share2, MessageCircle, Mail, MapPin, Phone } from 'lucide-react';

const PRODUCT_LINKS = [
  { label: 'Browse Equipment', href: '/equipment' },
  { label: 'How It Works', href: '/#how-it-works' },
  { label: 'List Your Equipment', href: '/signup' },
  { label: 'Farm Management', href: '/#farm-management' },
  { label: 'Request Assistance', href: '/assisted-booking' },
];

const COMPANY_LINKS = [
  { label: 'About AgroShare', href: '/#about' },
  { label: 'Contact Us', href: '/#contact' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Privacy Policy', href: '/privacy' },
];

const COUNTRIES = ['Nigeria', 'Ghana', 'Kenya', 'Ethiopia', 'Uganda'];

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-neutral-300" aria-label="Site footer">
      <div className="container-custom pt-14 pb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4 group" aria-label="AgroShare home">
              <div className="w-9 h-9 rounded-xl bg-primary-700 flex items-center justify-center">
                <Leaf size={20} className="text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">Agro</span>
                <span className="text-xl font-bold text-secondary-400">Share</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-neutral-400 mb-4">
              Share Equipment. Grow More.
            </p>
            <p className="text-xs text-neutral-500 mb-5 leading-relaxed">
              Connecting farmers with affordable machinery across Africa, starting with Nigeria.
            </p>
            <p className="text-xs font-medium text-neutral-400 mb-2">Available in:</p>
            <div className="flex flex-wrap gap-1.5">
              {COUNTRIES.map((c) => (
                <span key={c} className="text-xs bg-neutral-800 text-neutral-300 px-2 py-0.5 rounded-full">
                  {c}
                </span>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Platform</h3>
            <ul className="flex flex-col gap-2" role="list">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Company</h3>
            <ul className="flex flex-col gap-2" role="list">
              {COMPANY_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.href}
                    className="text-sm text-neutral-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Contact</h3>
            <ul className="flex flex-col gap-3" role="list">
              <li className="flex items-start gap-2.5 text-sm text-neutral-400">
                <MapPin size={16} className="text-primary-500 flex-shrink-0 mt-0.5" />
                <span>Lagos & Ibadan, Nigeria (Demo)</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-neutral-400">
                <Mail size={16} className="text-primary-500 flex-shrink-0" />
                <span>hello@agroshare.demo</span>
              </li>
              <li className="flex items-center gap-2.5 text-sm text-neutral-400">
                <Phone size={16} className="text-primary-500 flex-shrink-0" />
                <span>+234 800 000 0000 (Demo)</span>
              </li>
            </ul>
            {/* Social */}
            <div className="flex items-center gap-3 mt-6">
              {[
                { icon: Globe, label: 'Website' },
                { icon: Share2, label: 'Network' },
                { icon: MessageCircle, label: 'Community' },
              ].map(({ icon: Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={`${label} (placeholder)`}
                  className="w-9 h-9 rounded-xl bg-neutral-800 flex items-center justify-center text-neutral-400 hover:bg-primary-700 hover:text-white transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-neutral-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-neutral-500">
            © {new Date().getFullYear()} AgroShare. Built for the African farming community.
          </p>
          <p className="text-xs text-neutral-600">
            Demo application — All equipment listings are sample data only.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
