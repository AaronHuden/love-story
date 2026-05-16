import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiLockClosed } from 'react-icons/hi';
import { useAuth } from '../../context/AuthContext';

export default function LoginModal({ onClose }) {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(username, password);
    setLoading(false);

    if (result.success) {
      onClose();
    } else {
      setError(result.error);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-ink-deep/70 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 30, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="paper-texture rounded-2xl max-w-sm w-full shadow-2xl border border-amber-200/40 p-8"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <HiLockClosed className="text-amber-500" size={22} />
            </div>
            <h3 className="font-[family-name:var(--font-heading)] text-2xl text-ink-deep italic">
              Welcome Back
            </h3>
            <p className="text-xs text-sepia mt-1">Sign in to manage your story</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5 uppercase tracking-wider">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-cream border border-amber-200/60 text-ink placeholder:text-sepia/50 focus:outline-none focus:border-amber-400 transition-colors text-sm"
                placeholder="Enter username"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-cream border border-amber-200/60 text-ink placeholder:text-sepia/50 focus:outline-none focus:border-amber-400 transition-colors text-sm"
                placeholder="Enter password"
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-rust text-center"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={loading || !username || !password}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-cream font-medium text-sm hover:bg-amber-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Close */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-2 text-sepia/50 hover:text-amber-500 transition-colors"
          >
            <HiX size={18} />
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
