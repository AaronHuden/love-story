import { format, parseISO } from 'date-fns';

export function formatDate(dateStr, fmt = 'MMMM d, yyyy') {
  return format(parseISO(dateStr), fmt);
}

export function formatDateShort(dateStr) {
  return format(parseISO(dateStr), 'MMM d, yyyy');
}
