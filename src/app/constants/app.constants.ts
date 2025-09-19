export const APP_CONSTANTS = {
  STORAGE_KEYS: {
    TRAININGS: 'trainings',
    SETTINGS: 'app_settings'
  },
  
  VALIDATION: {
    MIN_NAME_LENGTH: 1,
    MIN_TIME_VALUE: 0,
    MAX_TIME_VALUE: 3600, // 1 hour
    MIN_SERIES: 1,
    MAX_SERIES: 100
  },
  
  TIMING: {
    TOAST_DURATION: 2000,
    TOAST_POSITION: 'middle' as const,
    PAUSE_RESET_DELAY: 1000
  },
  
  ROUTES: {
    TRAININGS: '/trainings',
    PLAY_TRAINING: '/play-training',
    HOME: '/'
  },
  
  MESSAGES: {
    SUCCESS: {
      TRAINING_SAVED: 'Trening je uspešno sačuvan!',
      TRAINING_UPDATED: 'Trening je uspešno ažuriran!',
      TRAINING_DELETED: 'Trening je uspešno obrisan!',
      TRAINING_IMPORTED: 'Trening je uspešno uvezen!'
    },
    ERROR: {
      TRAINING_SAVE_FAILED: 'Greška pri čuvanju treninga. Pokušajte ponovo.',
      TRAINING_LOAD_FAILED: 'Greška pri učitavanju treninga.',
      INVALID_JSON: 'Neispravan JSON format!',
      REQUIRED_FIELD: 'Ovo polje je obavezno',
      INVALID_TIME: 'Vreme mora biti veće od 0',
      INVALID_SERIES: 'Broj ponavljanja mora biti veći od 0'
    },
    CONFIRMATION: {
      DELETE_TRAINING: 'Da li si siguran da želiš da obrišeš trening?',
      EXIT_APP: 'Da li stvarno želiš da izađeš iz aplikacije?',
      CANCEL_TRAINING: 'Da li si siguran da želiš da odustaneš?'
    }
  },
  
  CSS: {
    BUDGET_WARNING: 2 * 1024, // 2KB
    BUDGET_ERROR: 4 * 1024     // 4KB
  }
} as const;
