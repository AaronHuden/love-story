import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiX, HiHeart } from 'react-icons/hi';

function emptyForm() {
  return { from: '', to: '', date: '', title: '', content: '' };
}

export default function LoveLetterModal({ letter, onClose, mode, form, onChange, onSave }) {
  const isEditing = mode === 'edit';
  const isAdding = mode === 'add';

  useEffect(() => {
    if (!isEditing && !isAdding) {
      const handleKey = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKey);
      document.body.style.overflow = 'hidden';
      return () => {
        window.removeEventListener('keydown', handleKey);
        document.body.style.overflow = '';
      };
    }
  }, [onClose, isEditing, isAdding]);

  // For edit/add mode, still handle escape
  useEffect(() => {
    if (isEditing || isAdding) {
      const handleKey = (e) => {
        if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleKey);
      return () => window.removeEventListener('keydown', handleKey);
    }
  }, [onClose, isEditing, isAdding]);

  const displayData = isEditing || isAdding ? form : letter;

  const inputClass = "w-full px-3 py-2 text-sm rounded-lg border border-amber-200 bg-white/90 focus:outline-none focus:border-amber-400 font-[family-name:var(--font-body)]";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-ink-deep/85 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, y: 40, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: 40, opacity: 0 }}
          transition={{ type: 'spring', damping: 25 }}
          onClick={(e) => e.stopPropagation()}
          className="paper-texture rounded-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto shadow-2xl relative border border-amber-200/40"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 text-sepia hover:text-amber-600 transition-colors rounded-full hover:bg-amber-100/50"
          >
            <HiX size={20} />
          </button>

          <div className="p-8 md:p-12">
            <div className="text-center mb-8 pb-8 border-b border-amber-200/60">
              <HiHeart className="text-amber-400 mx-auto mb-3" size={24} />
              {isEditing || isAdding ? (
                <input
                  type="text"
                  value={displayData.title}
                  onChange={(e) => onChange({ ...form, title: e.target.value })}
                  placeholder="Letter title..."
                  className={`${inputClass} text-2xl text-center font-[family-name:var(--font-heading)] italic mb-2`}
                />
              ) : (
                <h3 className="font-[family-name:var(--font-heading)] text-2xl text-ink-deep mb-2 italic">
                  {letter.title}
                </h3>
              )}
              {isEditing || isAdding ? (
                <div className="flex gap-2 justify-center items-center mt-2">
                  <input
                    type="text"
                    value={displayData.from}
                    onChange={(e) => onChange({ ...form, from: e.target.value })}
                    placeholder="From"
                    className={`${inputClass} w-24 text-center text-xs`}
                  />
                  <span className="text-sepia text-xs">to</span>
                  <input
                    type="text"
                    value={displayData.to}
                    onChange={(e) => onChange({ ...form, to: e.target.value })}
                    placeholder="To"
                    className={`${inputClass} w-24 text-center text-xs`}
                  />
                  <input
                    type="date"
                    value={displayData.date}
                    onChange={(e) => onChange({ ...form, date: e.target.value })}
                    className={`${inputClass} w-28 text-xs`}
                  />
                </div>
              ) : (
                <>
                  <p className="text-sm text-sepia">
                    From{' '}
                    <span className="font-medium text-ink">{letter.from}</span>{' '}
                    to{' '}
                    <span className="font-medium text-ink">{letter.to}</span>
                  </p>
                  <p className="text-xs text-sepia/70 mt-1">{letter.date}</p>
                </>
              )}
            </div>

            {isEditing || isAdding ? (
              <textarea
                value={displayData.content}
                onChange={(e) => onChange({ ...form, content: e.target.value })}
                placeholder="Write your letter..."
                rows={10}
                className={`${inputClass} resize-none`}
              />
            ) : (
              <div className="font-[family-name:var(--font-body)] text-base md:text-lg text-ink leading-relaxed whitespace-pre-line">
                {letter.content}
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-amber-200/60 text-center">
              {(isEditing || isAdding) ? (
                <div className="flex gap-3 justify-center">
                  <button
                    onClick={onSave}
                    disabled={!displayData.from || !displayData.to || !displayData.title || !displayData.content}
                    className="px-6 py-2 text-sm font-medium bg-amber-500 text-white rounded-full hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Save Letter
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-2 text-sm text-sepia hover:text-ink transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <HiHeart className="text-amber-300 mx-auto" size={16} />
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
