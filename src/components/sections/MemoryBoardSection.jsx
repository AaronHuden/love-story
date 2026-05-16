import { useState, useRef, useCallback, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { HiPlus } from 'react-icons/hi';
import SectionWrapper from '../ui/SectionWrapper';
import MemoryPin from '../ui/MemoryPin';
import { useAuth } from '../../context/AuthContext';
import { saveImage, loadImage, removeImage, resizeImage } from '../../utils/imageStorage';
import memoriesData from '../../data/memories.json';

const STORAGE_KEY = 'love-story-memories';

function loadMemories() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return memoriesData.memories;
}

function saveMemories(memories) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
  } catch { /* quota exceeded */ }
}

function emptyForm() {
  return { image: '', caption: '', date: '', rotation: 0 };
}

/* ---- FormCard ---- */

function FormCard({ form, onChange, onSave, onCancel, fileRef, onFileChange }) {
  const imgInputRef = useRef(null);
  const previewRef = useRef(null);

  const cleanup = useCallback(() => {
    if (previewRef.current) {
      URL.revokeObjectURL(previewRef.current);
      previewRef.current = null;
    }
  }, []);

  const handlePick = useCallback(() => {
    imgInputRef.current?.click();
  }, []);

  const handleFile = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    cleanup();
    const blobUrl = URL.createObjectURL(file);
    previewRef.current = blobUrl;
    onFileChange(file);
    onChange((prev) => ({ ...prev, image: blobUrl }));
    if (imgInputRef.current) imgInputRef.current.value = '';
  }, [onChange, onFileChange, cleanup]);

  const handleCancel = useCallback(() => {
    cleanup();
    onFileChange(null);
    onCancel();
  }, [onCancel, onFileChange, cleanup]);

  // Show blob URL if available; for external URLs show the text
  const showImage = form.image;
  const showTextInput = !form.image || form.image.startsWith('blob:') ? '' : form.image;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, rotate: -1 }}
      animate={{ opacity: 1, scale: 1, rotate: -1 }}
      className="bg-cream p-3 pb-4 shadow-md border-2 border-dashed border-amber-400 rounded-sm"
    >
      <div className="space-y-3">
        <div>
          <label className="block text-xs text-sepia mb-1">Image</label>
          <div className="flex gap-1">
            <input
              type="text"
              value={showTextInput}
              onChange={(e) => onChange({ ...form, image: e.target.value })}
              placeholder="https://... or upload"
              className="flex-1 px-2 py-1 text-sm rounded border border-amber-200 bg-white focus:outline-none focus:border-amber-400"
            />
            <button type="button" onClick={handlePick}
              className="px-2 py-1 text-xs text-amber-600 bg-amber-50 border border-dashed border-amber-300 rounded hover:bg-amber-100 transition-colors"
              title="Upload image">📷</button>
            <input ref={imgInputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>
          {showImage && (
            <img src={showImage} alt="preview" className="mt-2 w-full h-32 object-cover rounded" />
          )}
        </div>
        <div>
          <label className="block text-xs text-sepia mb-1">Caption</label>
          <textarea value={form.caption}
            onChange={(e) => onChange({ ...form, caption: e.target.value })}
            placeholder="A sweet memory..." rows={2}
            className="w-full px-2 py-1 text-sm rounded border border-amber-200 bg-white focus:outline-none focus:border-amber-400 resize-none" />
        </div>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs text-sepia mb-1">Date</label>
            <input type="date" value={form.date}
              onChange={(e) => onChange({ ...form, date: e.target.value })}
              className="w-full px-2 py-1 text-sm rounded border border-amber-200 bg-white focus:outline-none focus:border-amber-400" />
          </div>
          <div className="w-20">
            <label className="block text-xs text-sepia mb-1">Tilt</label>
            <select value={form.rotation}
              onChange={(e) => onChange({ ...form, rotation: Number(e.target.value) })}
              className="w-full px-2 py-1 text-sm rounded border border-amber-200 bg-white focus:outline-none focus:border-amber-400">
              {[-3, -2, -1, 0, 1, 2, 3].map((r) => (<option key={r} value={r}>{r}°</option>))}
            </select>
          </div>
        </div>
        <div className="flex gap-2 pt-1">
          <button onClick={onSave}
            disabled={!form.image || !form.caption || !form.date}
            className="flex-1 px-3 py-1.5 text-sm font-medium bg-amber-500 text-white rounded-full hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors">
            Save
          </button>
          <button onClick={handleCancel}
            className="px-3 py-1.5 text-sm text-sepia hover:text-ink transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );
}

/* ---- Main Section ---- */

export default function MemoryBoardSection() {
  const { isAdmin } = useAuth();
  const [memories, setMemories] = useState(loadMemories);
  const [editingId, setEditingId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [form, setForm] = useState(emptyForm());
  const fileRef = useRef(null);

  // Resolve IndexedDB image IDs → blob URLs
  const [imageUrls, setImageUrls] = useState({});
  const loadingIdsRef = useRef(new Set());

  useEffect(() => {
    let cancelled = false;
    const idsToLoad = memories
      .filter((m) => m.imageId && !imageUrls[m.imageId] && !loadingIdsRef.current.has(m.imageId))
      .map((m) => m.imageId);

    if (idsToLoad.length === 0) return;

    idsToLoad.forEach((id) => loadingIdsRef.current.add(id));

    Promise.all(idsToLoad.map((id) => loadImage(id).then((url) => [id, url])))
      .then((pairs) => {
        if (cancelled) return;
        const updates = {};
        pairs.forEach(([id, url]) => {
          if (url) updates[id] = url;
          loadingIdsRef.current.delete(id);
        });
        setImageUrls((prev) => ({ ...prev, ...updates }));
      })
      .catch(() => {
        idsToLoad.forEach((id) => loadingIdsRef.current.delete(id));
      });

    return () => { cancelled = true; };
  }, [memories, imageUrls]);

  // Keep a ref to latest imageUrls for cleanup (avoid stale closure)
  const imageUrlsRef = useRef(imageUrls);
  imageUrlsRef.current = imageUrls;

  // Clean up blob URLs when memories change (removed items)
  useEffect(() => {
    const urls = imageUrlsRef.current;
    const activeIds = new Set(memories.map((m) => m.imageId).filter(Boolean));
    Object.keys(urls).forEach((id) => {
      if (!activeIds.has(id) && urls[id]) {
        URL.revokeObjectURL(urls[id]);
      }
    });
  }, [memories]);

  // Resolve each memory's image to a renderable URL
  const resolvedMemories = useMemo(
    () =>
      memories.map((m) => ({
        ...m,
        image: m.imageId && imageUrls[m.imageId] ? imageUrls[m.imageId] : m.image || '',
      })),
    [memories, imageUrls],
  );

  /* ---- Actions ---- */

  const handleFileChange = useCallback((file) => {
    fileRef.current = file;
  }, []);

  const openAdd = useCallback(() => {
    setForm(emptyForm());
    setEditingId(null);
    setIsAdding(true);
    fileRef.current = null;
  }, []);

  const openEdit = useCallback((memory) => {
    setForm({
      image: memory.image || '',
      caption: memory.caption,
      date: memory.date,
      rotation: memory.rotation ?? 0,
    });
    setEditingId(memory.id);
    setIsAdding(false);
    fileRef.current = null;
  }, []);

  const cancelForm = useCallback(() => {
    setIsAdding(false);
    setEditingId(null);
    setForm(emptyForm());
    fileRef.current = null;
  }, []);

  const handleSave = useCallback(async () => {
    if (!form.image || !form.caption || !form.date) return;

    let imageField = {};
    if (fileRef.current) {
      // Local file: resize then store blob in IndexedDB
      try {
        const resized = await resizeImage(fileRef.current);
        const imageId = await saveImage(resized);
        imageField = { imageId };
      } catch {
        return;
      }
    } else if (form.image.startsWith('blob:')) {
      // Blob URL from re-editing an existing IndexedDB image — keep existing imageId
      const existing = editingId ? memories.find((m) => m.id === editingId) : null;
      imageField = existing?.imageId ? { imageId: existing.imageId } : { image: form.image };
    } else {
      // External URL
      imageField = { image: form.image };
    }

    const savedData = {
      ...imageField,
      caption: form.caption,
      date: form.date,
      rotation: form.rotation,
    };

    if (editingId !== null) {
      const oldMemory = memories.find((m) => m.id === editingId);
      setMemories((prev) => {
        const updated = prev.map((m) => {
          if (m.id !== editingId) return m;
          // Remove old image/imageId fields, apply new
          const { image: _oldImg, imageId: _oldId, ...rest } = m;
          return { ...rest, ...savedData };
        });
        saveMemories(updated);
        return updated;
      });
      // If replacing a local file, remove old IndexedDB entry
      if (fileRef.current && oldMemory?.imageId && oldMemory.imageId !== savedData.imageId) {
        removeImage(oldMemory.imageId);
      }
    } else {
      const newMemory = { id: Date.now(), ...savedData };
      setMemories((prev) => {
        const updated = [...prev, newMemory];
        saveMemories(updated);
        return updated;
      });
    }
    cancelForm();
  }, [form, editingId, memories, cancelForm]);

  const handleRemove = useCallback((id) => {
    const memory = memories.find((m) => m.id === id);
    if (memory?.imageId) {
      removeImage(memory.imageId);
    }
    setMemories((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      saveMemories(updated);
      return updated;
    });
  }, [memories]);

  /* ---- Render ---- */

  return (
    <SectionWrapper id="memories" title="Memory Board" subtitle="Pinned moments from our story">
      <div className="relative">
        <div className="absolute inset-0 bg-amber-200/50 rounded-3xl -m-4 md:-m-8 opacity-60" />

        <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 p-4 md:p-8">
          {resolvedMemories.map((memory, i) =>
            editingId === memory.id ? (
              <FormCard
                key={`edit-${memory.id}`}
                form={form}
                onChange={setForm}
                onSave={handleSave}
                onCancel={cancelForm}
                fileRef={fileRef}
                onFileChange={handleFileChange}
              />
            ) : (
              <MemoryPin
                key={memory.id}
                memory={memory}
                index={i}
                showAdmin={isAdmin}
                onEdit={openEdit}
                onRemove={handleRemove}
              />
            ),
          )}

          {isAdding && (
            <FormCard
              key="add-form"
              form={form}
              onChange={setForm}
              onSave={handleSave}
              onCancel={cancelForm}
              fileRef={fileRef}
              onFileChange={handleFileChange}
            />
          )}

          {isAdmin && !isAdding && (
            <motion.button
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              onClick={openAdd}
              className="min-h-[280px] flex flex-col items-center justify-center gap-2 rounded-sm border-2 border-dashed border-amber-300/70 bg-amber-50/40 hover:bg-amber-100/60 hover:border-amber-400 transition-colors text-amber-500 hover:text-amber-600"
            >
              <HiPlus size={28} />
              <span className="text-sm font-medium">Pin a Memory</span>
            </motion.button>
          )}
        </div>
      </div>
    </SectionWrapper>
  );
}
