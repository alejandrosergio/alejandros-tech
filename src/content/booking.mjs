// Cal.com owns availability, conflict checks and reservation data. These public
// links and labels must stay aligned with the two event types in that account.
export const booking = Object.freeze({
  links: {
    es: 'https://cal.com/alejandros-tech/llamada',
    en: 'https://cal.com/alejandros-tech/discovery-call',
  },
  timeZone: 'America/Bogota',
  durationMinutes: 30,
});

export const bookingCopy = {
  es: {
    action: 'Agendar una llamada',
    short: '30 minutos · Videollamada',
    title: 'Conversemos sobre tu próximo paso.',
    hours: 'Lunes a viernes · 8:00–12:30 y 14:00–17:00 · Colombia (UTC−5)',
    language: 'Las llamadas se realizan en español. No se ofrecen citas en festivos nacionales de Colombia.',
    close: 'Cerrar agenda',
    frame: 'Agenda de Sergio Hernández: selecciona una fecha y hora',
    loading: 'Cargando los horarios disponibles…',
    slow: 'Si la agenda tarda o no aparece, puedes abrirla en otra pestaña.',
    external: 'Abrir agenda en otra pestaña',
    privacy: 'Al abrir la agenda te conectas con Cal.com. Los datos de la reserva se gestionan allí y en el calendario de Outlook. Recibirás la confirmación y el enlace de videollamada al reservar.',
    privacyLink: 'Privacidad de Cal.com',
  },
  en: {
    action: 'Book a call',
    short: '30 minutes · Video call',
    title: 'Let’s discuss your next step.',
    hours: 'Monday to Friday · 08:00–12:30 and 14:00–17:00 · Colombia (UTC−5)',
    language: 'Calls are held in Spanish. Colombian national public holidays are unavailable.',
    close: 'Close booking calendar',
    frame: 'Sergio Hernández’s booking calendar: choose a date and time',
    loading: 'Loading available times…',
    slow: 'If the calendar is slow or does not appear, you can open it in another tab.',
    external: 'Open booking calendar in another tab',
    privacy: 'Opening the calendar connects you to Cal.com. Booking details are managed there and in the Outlook calendar. When you book, you will receive the confirmation and video call link.',
    privacyLink: 'Cal.com privacy',
  },
};

export function bookingURL(lang) {
  const url = new URL(booking.links[lang]);
  if (url.origin !== 'https://cal.com' || !url.pathname.startsWith('/alejandros-tech/')) throw new Error('Unexpected booking destination');
  url.searchParams.set('locale', lang);
  return url.href;
}
