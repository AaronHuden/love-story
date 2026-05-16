import { differenceInDays, differenceInYears, differenceInMonths, parseISO } from 'date-fns';

export function getDaysTogether(startDateStr) {
  const start = parseISO(startDateStr);
  const now = new Date();
  const days = differenceInDays(now, start);
  const years = differenceInYears(now, start);
  const months = differenceInMonths(now, start) % 12;

  return { days, years, months };
}

export function getFormattedDuration(startDateStr) {
  const { years, months, days } = getDaysTogether(startDateStr);
  return `${years} years, ${months} months, ${days} days`;
}
