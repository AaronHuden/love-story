import { useState } from 'react';
import { HiPlus } from 'react-icons/hi';
import SectionWrapper from '../ui/SectionWrapper';
import Envelope from '../ui/Envelope';
import LoveLetterModal from '../ui/LoveLetterModal';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { useAuth } from '../../context/AuthContext';
import lettersData from '../../data/letters.json';

const LETTERS_KEY = 'love-story-letters';

function loadLetters() {
  try {
    const stored = localStorage.getItem(LETTERS_KEY);
    if (stored) return JSON.parse(stored);
  } catch { /* ignore */ }
  return lettersData.letters;
}

function saveLetters(letters) {
  localStorage.setItem(LETTERS_KEY, JSON.stringify(letters));
}

function emptyForm() {
  return { from: '', to: '', date: '', title: '', content: '' };
}

export default function LoveLettersSection() {
  const { isAdmin } = useAuth();
  const [letters, setLetters] = useState(loadLetters);
  const [activeLetter, setActiveLetter] = useState(null);
  const [mode, setMode] = useState(null);
  const [form, setForm] = useState(emptyForm());
  const [readIds, setReadIds] = useLocalStorage('love-story-read-letters', []);

  const handleOpen = (letter) => {
    if (!readIds.includes(letter.id)) {
      setReadIds([...readIds, letter.id]);
    }
    setActiveLetter(letter);
    setMode('view');
  };

  const handleClose = () => {
    setActiveLetter(null);
    setMode(null);
    setForm(emptyForm());
  };

  const openAdd = () => {
    setForm(emptyForm());
    setActiveLetter(null);
    setMode('add');
  };

  const openEdit = (letter) => {
    setForm({
      from: letter.from,
      to: letter.to,
      date: letter.date,
      title: letter.title,
      content: letter.content,
    });
    setActiveLetter(letter);
    setMode('edit');
  };

  const handleSave = () => {
    if (!form.from || !form.to || !form.title || !form.content) return;

    if (mode === 'edit' && activeLetter) {
      setLetters((prev) => {
        const updated = prev.map((l) =>
          l.id === activeLetter.id ? { ...l, ...form } : l,
        );
        saveLetters(updated);
        return updated;
      });
    } else if (mode === 'add') {
      const newLetter = {
        id: Date.now(),
        ...form,
      };
      setLetters((prev) => {
        const updated = [...prev, newLetter];
        saveLetters(updated);
        return updated;
      });
    }
    handleClose();
  };

  const handleRemove = (id) => {
    setLetters((prev) => {
      const updated = prev.filter((l) => l.id !== id);
      saveLetters(updated);
      return updated;
    });
  };

  return (
    <SectionWrapper
      id="letters"
      title="Love Letters"
      subtitle="Words from the heart, sealed in time"
      dark
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {letters.map((letter) => (
          <Envelope
            key={letter.id}
            letter={letter}
            isRead={readIds.includes(letter.id)}
            onClick={() => handleOpen(letter)}
            showAdmin={isAdmin}
            onEdit={openEdit}
            onRemove={handleRemove}
          />
        ))}

        {isAdmin && (
          <button
            onClick={openAdd}
            className="flex flex-col items-center justify-center gap-2 rounded-2xl p-6 border-2 border-dashed border-amber-400/50 bg-amber-50/10 hover:bg-amber-50/20 hover:border-amber-400/80 transition-colors text-amber-400 hover:text-amber-300 min-h-[180px]"
          >
            <HiPlus size={28} />
            <span className="text-sm font-medium">Write a Letter</span>
          </button>
        )}
      </div>

      {mode && (mode === 'edit' || mode === 'add' ? (
        <LoveLetterModal
          mode={mode}
          form={form}
          onChange={setForm}
          onSave={handleSave}
          onClose={handleClose}
        />
      ) : (
        activeLetter && (
          <LoveLetterModal
            letter={activeLetter}
            onClose={handleClose}
          />
        )
      ))}
    </SectionWrapper>
  );
}
