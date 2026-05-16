import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus } from 'react-icons/hi';
import SectionWrapper from '../ui/SectionWrapper';
import PhotoCard from '../ui/PhotoCard';
import Lightbox from '../ui/Lightbox';
import { useAuth } from '../../context/AuthContext';
import galleryData from '../../data/gallery.json';

const STORAGE_KEY = 'love-story-gallery-photos';

function loadPhotos() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return galleryData.photos;
}

function savePhotos(photos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(photos));
}

export default function GallerySection() {
  const { isAdmin } = useAuth();
  const fileInputRef = useRef(null);
  const [photos, setPhotos] = useState(loadPhotos);
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filteredPhotos = useMemo(
    () =>
      activeCategory === 'All'
        ? photos
        : photos.filter((p) => p.category === activeCategory),
    [photos, activeCategory],
  );

  const handleOpen = (photo) => {
    const idx = filteredPhotos.findIndex((p) => p.id === photo.id);
    setLightboxIndex(idx);
  };

  const handlePrev = () => {
    setLightboxIndex((i) => (i <= 0 ? filteredPhotos.length - 1 : i - 1));
  };

  const handleNext = () => {
    setLightboxIndex((i) => (i >= filteredPhotos.length - 1 ? 0 : i + 1));
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const category = activeCategory !== 'All' ? activeCategory : 'Everyday';
        const newPhoto = {
          id: Date.now(),
          src: ev.target.result,
          alt: file.name.replace(/\.[^/.]+$/, ''),
          category,
          width: img.naturalWidth,
          height: img.naturalHeight,
        };
        setPhotos((prev) => {
          const updated = [newPhoto, ...prev];
          savePhotos(updated);
          return updated;
        });
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
    // Reset so the same file can be re-selected
    e.target.value = '';
  };

  const handleRemove = (id) => {
    setPhotos((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      savePhotos(updated);
      return updated;
    });
  };

  return (
    <SectionWrapper id="gallery" title="Our Gallery" subtitle="Moments captured on film">
      {/* Filters + Upload */}
      <div className="flex flex-wrap justify-center items-center gap-2 mb-12">
        {galleryData.categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`relative px-5 py-2 rounded-full text-sm font-medium transition-colors ${
              activeCategory === cat
                ? 'text-cream'
                : 'text-ink hover:text-amber-500 bg-cream hover:bg-amber-100/50 border border-amber-200/50'
            }`}
          >
            {activeCategory === cat && (
              <motion.div
                layoutId="filter-bg"
                className="absolute inset-0 bg-amber-500 rounded-full"
                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{cat}</span>
          </button>
        ))}

        {isAdmin && (
          <>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="relative ml-2 px-4 py-2 rounded-full text-sm font-medium text-amber-600 bg-amber-50 border border-dashed border-amber-300 hover:bg-amber-100 hover:border-amber-400 transition-colors flex items-center gap-1.5"
            >
              <HiPlus size={16} />
              Add Photo
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </>
        )}
      </div>

      {/* Masonry grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredPhotos.map((photo) => (
            <PhotoCard
              key={photo.id}
              photo={photo}
              onClick={handleOpen}
              showRemove={isAdmin}
              onRemove={handleRemove}
            />
          ))}
        </AnimatePresence>
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          photos={filteredPhotos}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </SectionWrapper>
  );
}
