import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiX, HiPencil } from 'react-icons/hi';
import SectionWrapper from '../ui/SectionWrapper';
import BucketItem from '../ui/BucketItem';
import ProgressBar from '../ui/ProgressBar';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useAuth } from '../../context/AuthContext';
import bucketListData from '../../data/bucketList.json';

export default function BucketListSection() {
  const { isAdmin } = useAuth();

  const [categories, setCategories] = useLocalStorage(
    'love-story-bucket-data',
    bucketListData.categories,
  );

  const [checkedIds, setCheckedIds] = useLocalStorage(
    'love-story-bucket-checked',
    bucketListData.categories.flatMap((c) =>
      c.items.filter((i) => i.checked).map((i) => i.id),
    ),
  );

  // Add item form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemText, setNewItemText] = useState('');
  const [newItemCategory, setNewItemCategory] = useState(
    categories[0]?.name || '',
  );

  // Edit item state
  const [editingItem, setEditingItem] = useState(null); // { id, categoryName }
  const [editText, setEditText] = useState('');

  const allItems = useMemo(
    () => categories.flatMap((c) => c.items),
    [categories],
  );

  const totalItems = allItems.length;
  const doneItems = allItems.filter((i) => checkedIds.includes(i.id)).length;
  const percent = totalItems > 0 ? Math.round((doneItems / totalItems) * 100) : 0;

  const handleToggle = (id) => {
    if (!isAdmin) return;
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    const newId = `item-${Date.now()}`;
    setCategories((prev) =>
      prev.map((cat) =>
        cat.name === newItemCategory
          ? {
              ...cat,
              items: [
                ...cat.items,
                { id: newId, text: newItemText.trim(), checked: false },
              ],
            }
          : cat,
      ),
    );
    setNewItemText('');
    setShowAddForm(false);
  };

  const handleDeleteItem = (itemId, categoryName) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.name === categoryName
          ? { ...cat, items: cat.items.filter((i) => i.id !== itemId) }
          : cat,
      ),
    );
    setCheckedIds((prev) => prev.filter((id) => id !== itemId));
  };

  const handleStartEdit = (item) => {
    setEditingItem(item);
    setEditText(item.text);
  };

  const handleSaveEdit = () => {
    if (!editText.trim() || !editingItem) return;
    setCategories((prev) =>
      prev.map((cat) =>
        cat.name === editingItem.categoryName
          ? {
              ...cat,
              items: cat.items.map((i) =>
                i.id === editingItem.id ? { ...i, text: editText.trim() } : i,
              ),
            }
          : cat,
      ),
    );
    setEditingItem(null);
    setEditText('');
  };

  return (
    <SectionWrapper
      id="bucket"
      title="Bucket List"
      subtitle={isAdmin ? "Dreams we'll chase together ✦" : "Dreams we'll chase together"}
      dark
    >
      {/* Progress */}
      <div className="max-w-md mx-auto mb-6">
        <ProgressBar
          percent={percent}
          label={`${doneItems} of ${totalItems} completed`}
        />
      </div>

      {/* Admin: Add Item button */}
      {isAdmin && (
        <div className="text-center mb-8">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium bg-amber-500 text-cream hover:bg-amber-600 transition-colors"
          >
            <HiPlus size={16} />
            Add Item
          </button>

          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-4 max-w-sm mx-auto flex flex-col gap-2">
                  <input
                    type="text"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    placeholder="What's your next dream?"
                    className="w-full px-4 py-2 rounded-xl bg-cream border border-amber-200/60 text-ink text-sm placeholder:text-sepia/50 focus:outline-none focus:border-amber-400 transition-colors"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                  />
                  <div className="flex gap-2">
                    <select
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl bg-cream border border-amber-200/60 text-ink text-sm focus:outline-none focus:border-amber-400"
                    >
                      {categories.map((cat) => (
                        <option key={cat.name} value={cat.name}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleAddItem}
                      disabled={!newItemText.trim()}
                      className="px-4 py-2 rounded-xl bg-amber-500 text-cream text-sm font-medium hover:bg-amber-600 transition-colors disabled:opacity-40"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {categories.map((category) => (
          <div key={category.name}>
            <h3 className="font-[family-name:var(--font-heading)] text-xl text-ink-deep mb-4 italic">
              {category.icon} {category.name}
            </h3>
            <div className="space-y-2">
              <AnimatePresence>
                {category.items.map((item) => {
                  const isEditing =
                    editingItem?.id === item.id &&
                    editingItem?.categoryName === category.name;

                  return (
                    <div key={item.id} className="relative group flex items-center gap-2">
                      {/* Item or edit form */}
                      <div className="flex-1">
                        {isEditing ? (
                          <div className="flex gap-1">
                            <input
                              type="text"
                              value={editText}
                              onChange={(e) => setEditText(e.target.value)}
                              className="flex-1 px-3 py-2 rounded-lg bg-cream border border-amber-400 text-ink text-sm focus:outline-none"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSaveEdit();
                                if (e.key === 'Escape') setEditingItem(null);
                              }}
                              autoFocus
                            />
                            <button
                              onClick={handleSaveEdit}
                              className="px-3 py-2 rounded-lg bg-amber-500 text-cream text-xs font-medium"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <BucketItem
                            item={{
                              ...item,
                              checked: checkedIds.includes(item.id),
                            }}
                            onToggle={handleToggle}
                            readOnly={!isAdmin}
                          />
                        )}
                      </div>

                      {/* Admin action buttons */}
                      {isAdmin && !isEditing && (
                        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() =>
                              handleStartEdit({
                                id: item.id,
                                categoryName: category.name,
                                text: item.text,
                              })
                            }
                            className="p-1.5 rounded-lg text-sepia hover:text-amber-500 hover:bg-amber-100/50 transition-colors"
                            title="Edit"
                          >
                            <HiPencil size={14} />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteItem(item.id, category.name)
                            }
                            className="p-1.5 rounded-lg text-sepia hover:text-rust hover:bg-rust/10 transition-colors"
                            title="Delete"
                          >
                            <HiX size={14} />
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
