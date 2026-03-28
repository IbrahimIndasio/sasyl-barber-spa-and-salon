export interface BookingDraftState {
  serviceId: string | null;
  date: string | null;
  time: string | null;
  step: number;
}

const STORAGE_KEY = 'sasyl-booking-draft';

export function loadBookingDraft(): BookingDraftState | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const rawDraft = window.sessionStorage.getItem(STORAGE_KEY);
  if (!rawDraft) {
    return null;
  }

  try {
    const parsedDraft = JSON.parse(rawDraft) as BookingDraftState;
    if (
      typeof parsedDraft.step === 'number'
    ) {
      return parsedDraft;
    }
  } catch (error) {
    console.error('Unable to parse booking draft:', error);
  }

  return null;
}

export function saveBookingDraft(draft: BookingDraftState) {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
}

export function clearBookingDraft() {
  if (typeof window === 'undefined') {
    return;
  }

  window.sessionStorage.removeItem(STORAGE_KEY);
}
