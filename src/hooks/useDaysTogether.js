import { useMemo } from 'react';
import { getDaysTogether } from '../utils/calculateDays';

export function useDaysTogether(startDateStr) {
  return useMemo(() => getDaysTogether(startDateStr), [startDateStr]);
}
