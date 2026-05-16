import { HiHeart } from 'react-icons/hi';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-deep text-amber-200 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="font-[family-name:var(--font-heading)] text-2xl text-amber-300 mb-2">
          Aaron &amp; Bluu
        </p>
        <p className="flex items-center justify-center gap-1.5 text-sm text-amber-200/60">
          Made with <HiHeart className="text-amber-400 inline" /> &middot;{' '}
          {year}
        </p>
        <p className="mt-4 text-xs text-amber-200/30 font-[family-name:var(--font-body)] italic">
          Every love story is beautiful, but ours is my favorite.
        </p>
      </div>
    </footer>
  );
}
