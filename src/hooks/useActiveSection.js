import { useState, useEffect } from 'react';
import { SECTIONS } from '../utils/constants';

export function useActiveSection() {
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    const sectionIds = SECTIONS.map((s) => s.id);
    const els = sectionIds.map((id) => document.getElementById(id)).filter(Boolean);

    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id);
        }
      },
      { threshold: 0.2, rootMargin: '-80px 0px -50% 0px' },
    );

    els.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return activeSection;
}
