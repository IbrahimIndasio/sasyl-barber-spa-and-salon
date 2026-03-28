import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Facebook, Instagram, MapPin, Menu, Phone, Scissors, User as UserIcon, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, loginWithGoogle, logout } = useAuth();
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
    } catch (error) {
      window.alert(error instanceof Error ? error.message : 'Unable to sign in right now.');
    }
  };

  const userLabel = user?.displayName?.trim()?.[0] || user?.email?.trim()?.[0] || 'S';
  const portalLinks = [
    { name: 'Admin', path: '/admin' },
    { name: 'Staff', path: '/staff' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <Link to="/" className="flex items-center space-x-2">
            <Scissors className="h-8 w-8 text-orange-500" />
            <span className="text-2xl font-bold tracking-tighter text-white">SASYL</span>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-medium tracking-widest uppercase transition-colors hover:text-orange-500 ${
                  location.pathname === link.path ? 'text-orange-500' : 'text-white/70'
                }`}
              >
                {link.name}
              </Link>
            ))}
            {portalLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium tracking-widest uppercase transition-colors hover:text-orange-500 ${
                  location.pathname === link.path ? 'text-orange-500' : 'text-white/70'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/booking"
              className="bg-orange-500 text-black px-6 py-2 rounded-full text-sm font-bold tracking-widest uppercase hover:bg-orange-400 transition-all"
            >
              Book Now
            </Link>
            {user ? (
              <div className="flex items-center space-x-4">
                {user.photoURL ? (
                  <img src={user.photoURL} alt="" className="h-8 w-8 rounded-full border border-white/20" />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-white/5 text-xs font-bold uppercase">
                    {userLabel}
                  </div>
                )}
                <button
                  onClick={() => {
                    void logout();
                  }}
                  className="text-white/50 hover:text-white text-xs uppercase tracking-widest"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogin}
                className="flex items-center space-x-2 text-white/70 hover:text-white text-sm font-medium uppercase tracking-widest"
              >
                <UserIcon className="h-4 w-4" />
                <span>Login</span>
              </button>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-white hover:text-orange-500 transition-colors"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-black border-b border-white/10"
          >
            <div className="px-4 pt-2 pb-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block text-lg font-medium text-white/70 hover:text-orange-500"
                >
                  {link.name}
                </Link>
              ))}
              {portalLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block text-lg font-medium text-white/70 hover:text-orange-500"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/booking"
                onClick={() => setIsOpen(false)}
                className="block bg-orange-500 text-black px-6 py-3 rounded-xl text-center font-bold"
              >
                Book Now
              </Link>
              {!user && (
                <button
                  onClick={async () => {
                    setIsOpen(false);
                    await handleLogin();
                  }}
                  className="w-full flex items-center justify-center space-x-2 text-white/70 py-3 border border-white/10 rounded-xl"
                >
                  <UserIcon className="h-4 w-4" />
                  <span>Login with Google</span>
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Footer = () => {
  return (
    <footer className="bg-black border-t border-white/10 pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-6">
              <Scissors className="h-8 w-8 text-orange-500" />
              <span className="text-2xl font-bold tracking-tighter text-white">SASYL</span>
            </Link>
            <p className="text-white/50 max-w-md leading-relaxed mb-8">
              All your grooming needs addressed. Experience the finest barbering, hair styling, and spa treatments in Donholm, Nairobi.
            </p>
            <div className="flex space-x-6">
              <a
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-orange-500 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-orange-500 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a
                href="https://www.tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/50 hover:text-orange-500 transition-colors"
                aria-label="TikTok"
              >
                <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Contact</h4>
            <ul className="space-y-4 text-white/50 text-sm">
              <li className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-orange-500 shrink-0" />
                <span>Lenana Road Theta Lane, Donholm, Nairobi</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-orange-500 shrink-0" />
                <a href="tel:0722226501" className="hover:text-white transition-colors">0722 226501</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Hours</h4>
            <ul className="space-y-2 text-white/50 text-sm">
              <li className="flex justify-between"><span>Mon - Sat</span> <span>7:30 AM - 8:00 PM</span></li>
              <li className="flex justify-between"><span>Sun</span> <span>8:00 AM - 12:00 AM</span></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-white/30 text-xs">
          <p>Copyright 2026 Sasyl Barber, Spa and Salon. All rights reserved.</p>
          <div className="mt-4 md:mt-0 space-x-6">
            <Link to="/staff" className="hover:text-white transition-colors">Staff Login</Link>
            <Link to="/admin" className="hover:text-white transition-colors">Admin Portal</Link>
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-orange-500 selection:text-black">
      <Navbar />
      <main className="pt-20">{children}</main>
      <Footer />
    </div>
  );
};
