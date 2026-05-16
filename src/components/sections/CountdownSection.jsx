import { useMemo } from 'react';
import SectionWrapper from '../ui/SectionWrapper';
import CountdownTimer from '../ui/CountdownTimer';
import countdownData from '../../data/countdown.json';

function getNextLunarSolar(lunarMonth, lunarDay) {
  const now = new Date();
  const thisYear = now.getFullYear();
  const years = [thisYear - 1, thisYear, thisYear + 1, thisYear + 2];

  for (const y of years) {
    try {
      // Use dynamic import for lunar-calendar (ESM compatible)
      const lunar = calculateLunarSolar(y, lunarMonth, lunarDay);
      if (lunar) {
        const date = new Date(lunar.year, lunar.month - 1, lunar.day);
        if (date > now) return `${lunar.year}-${String(lunar.month).padStart(2, '0')}-${String(lunar.day).padStart(2, '0')}`;
      }
    } catch {
      // skip invalid lunar dates
    }
  }
  return null;
}

// Simple lunar→solar conversion using pre-computed lookup
//腊月二十四 = lunar month 12, day 24
const LUNAR_PRE_COMPUTED = {
  '12-24': {
    2026: { year: 2027, month: 1, day: 31 },
    2027: { year: 2028, month: 1, day: 20 },
    2028: { year: 2029, month: 1, day: 8 },
    2029: { year: 2030, month: 1, day: 18 },
  },
};

function calculateLunarSolar(lunarYear, lunarMonth, lunarDay) {
  const key = `${lunarMonth}-${lunarDay}`;
  return LUNAR_PRE_COMPUTED[key]?.[lunarYear] || null;
}

export default function CountdownSection() {
  // Resolve dates — handle lunar entries
  const resolvedDates = useMemo(() => {
    return countdownData.dates.map((d) => {
      if (d.lunar) {
        const solarDate = getNextLunarSolar(d.lunar.month, d.lunar.day);
        return { ...d, date: solarDate, isLunar: true };
      }
      return d;
    });
  }, []);

  const now = new Date();
  const futureDates = resolvedDates
    .filter((d) => d.date && new Date(d.date) > now)
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  const nextDate = futureDates[0] || resolvedDates.find((d) => d.date) || resolvedDates[0];

  return (
    <SectionWrapper
      id="countdown"
      title="Anniversaries"
      subtitle="Counting every special moment"
      dark
    >
      <div className="mb-16">
        {nextDate.date ? (
          <CountdownTimer
            targetDate={nextDate.date}
            label={`Next: ${nextDate.label}`}
          />
        ) : (
          <p className="text-center text-ink">Loading upcoming dates...</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {resolvedDates.map((date) => (
          <div
            key={date.label}
            className="bg-cream rounded-2xl p-6 text-center shadow-sm border border-amber-200/60"
          >
            <span className="text-2xl mb-2 block">
              {date.icon === 'ring' && '💍'}
              {date.icon === 'heart' && '💕'}
              {date.icon === 'diamond' && '💎'}
              {date.icon === 'paw' && '🐾'}
              {date.icon === 'airplane' && '✈️'}
              {date.icon === 'calendar' && '📅'}
              {date.icon === 'cake' && '🎂'}
            </span>
            <p className="font-[family-name:var(--font-heading)] text-sm text-ink-deep italic">
              {date.label}
            </p>
            <p className="text-xs text-sepia mt-1">
              {date.date || '—'}
            </p>
            {date.isLunar && (
              <p className="text-[10px] text-sepia/50 mt-0.5">
                腊月二十四 · Lunar Calendar
              </p>
            )}
          </div>
        ))}
      </div>
    </SectionWrapper>
  );
}
