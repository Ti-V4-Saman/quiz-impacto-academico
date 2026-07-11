export const CONFIG = {
  TYPEBOT_ID: 'Impacto Acadêmico Quiz',
  BOT_NAME: 'Impacto Acadêmico Quiz',
  ORIGEM: 'Quiz',

  ENABLE_WEBHOOKS: true,
  WEBHOOKS: {
    FINAL_RESULTS_URL: 'https://n8ops.v4saman.com/webhook/free-consultation-quiz',
    PARTIAL_RESULTS_URL: 'https://n8ops.v4saman.com/webhook/free-consultation-quiz'
  },

  REQUEST: {
    TIMEOUT_MS: 12000,
    MAX_RETRIES: 3,
    RETRY_BASE_MS: 700
  },

  REDIRECTS: {
    GUIA_DIGITAL_URL: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2kjoAO2fjncJqQ0Hw2lmAYX-wSkxEBfiBt47Sn-G8LYi5EkT-Wmsynf11FXroH3d6KudG_ugQr',
    EBOOK_URL: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2kjoAO2fjncJqQ0Hw2lmAYX-wSkxEBfiBt47Sn-G8LYi5EkT-Wmsynf11FXroH3d6KudG_ugQr',
    CALENDAR_PRIMARY_URL: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ2kjoAO2fjncJqQ0Hw2lmAYX-wSkxEBfiBt47Sn-G8LYi5EkT-Wmsynf11FXroH3d6KudG_ugQr',
    CALENDAR_SECONDARY_URL: 'https://calendar.app.google/8tqvQ4PpUev4S1Gn9'
  },

  META_PIXEL_IDS: [],
  PARTIAL_DEBOUNCE_MS: 1000,
  REDIRECT_DELAY_MS: 250,
  DEBUG: false
};
