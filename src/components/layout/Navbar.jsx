import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX, HiUser, HiLogout } from 'react-icons/hi';
import { useActiveSection } from '../../hooks/useActiveSection';
import { useAuth } from '../../context/AuthContext';
import { SECTIONS } from '../../utils/constants';
import LoginModal from '../ui/LoginModal';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const activeSection = useActiveSection();
  const { user, logout, isAdmin } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id) => {
    setIsMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      window.location.hash = id;
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const logoColor = isScrolled
    ? 'text-amber-500 hover:text-amber-400'
    : 'text-cream hover:text-amber-300 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]';

  const linkBase = isScrolled
    ? 'text-ink hover:text-amber-500'
    : 'text-amber-100/90 hover:text-cream drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]';

  const linkActive = isScrolled
    ? 'text-amber-500'
    : 'text-cream';

  const indicatorBg = isScrolled
    ? 'bg-amber-100'
    : 'bg-amber-300/20';

  const hamburgerColor = isScrolled
    ? 'text-ink hover:text-amber-500'
    : 'text-cream hover:text-amber-300 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]';

  const navBg = isScrolled
    ? 'bg-cream/90 backdrop-blur-lg shadow-sm'
    : 'bg-transparent';

  const btnColor = isScrolled
    ? 'text-ink hover:text-amber-500'
    : 'text-cream hover:text-amber-300 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]';

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${navBg}`}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <button
              onClick={() => scrollTo('hero')}
              className={`font-[family-name:var(--font-heading)] text-xl md:text-2xl transition-colors duration-300 ${logoColor}`}
            >
              A &amp; B
            </button>

            <div className="hidden md:flex items-center gap-1">
              {SECTIONS.filter((s) => s.id !== 'hero').map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollTo(section.id)}
                  className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-300 ${
                    activeSection === section.id ? linkActive : linkBase
                  }`}
                >
                  {section.label}
                  {activeSection === section.id && (
                    <motion.div
                      layoutId="nav-indicator"
                      className={`absolute inset-0 rounded-lg -z-10 ${indicatorBg}`}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              ))}

              {/* Auth button */}
              {user ? (
                <div className="flex items-center gap-2 ml-2 pl-2 border-l border-amber-200/40">
                  <span className={`text-xs ${isScrolled ? 'text-sepia' : 'text-amber-200/80'}`}>
                    {isAdmin && '✦ '}{user.displayName}
                  </span>
                  <button
                    onClick={logout}
                    className={`p-1.5 rounded-lg transition-colors duration-300 ${btnColor}`}
                    title="Sign out"
                  >
                    <HiLogout size={16} />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className={`ml-2 p-1.5 rounded-lg transition-colors duration-300 ${btnColor}`}
                  title="Sign in"
                >
                  <HiUser size={16} />
                </button>
              )}
            </div>

            {/* Mobile: hamburger + auth */}
            <div className="flex items-center gap-2 md:hidden">
              {user ? (
                <button
                  onClick={logout}
                  className={`p-2 transition-colors duration-300 ${btnColor}`}
                >
                  <HiLogout size={18} />
                </button>
              ) : (
                <button
                  onClick={() => setShowLogin(true)}
                  className={`p-2 transition-colors duration-300 ${btnColor}`}
                >
                  <HiUser size={18} />
                </button>
              )}
              <button
                className={`p-2 transition-colors duration-300 ${hamburgerColor}`}
                onClick={() => setIsMobileOpen(!isMobileOpen)}
              >
                {isMobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-cream/98 backdrop-blur-lg border-t border-amber-200 overflow-hidden"
            >
              <div className="px-4 py-3 space-y-1">
                {user && (
                  <div className="px-4 py-2 text-xs text-sepia border-b border-amber-100 mb-1">
                    {isAdmin && '✦ '}Signed in as <span className="font-medium text-ink">{user.displayName}</span>
                  </div>
                )}
                {SECTIONS.filter((s) => s.id !== 'hero').map((section) => (
                  <button
                    key={section.id}
                    onClick={() => scrollTo(section.id)}
                    className={`block w-full text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                      activeSection === section.id
                        ? 'text-amber-500 bg-amber-100'
                        : 'text-ink hover:text-amber-500 hover:bg-amber-100/50'
                    }`}
                  >
                    {section.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
    </>
  );
}
