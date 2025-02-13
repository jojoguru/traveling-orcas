'use client';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { getInitialLanguage } from './utils';

const resources = {
  en: {
    translation: {
      form: {
        name: 'Your Name',
        location: 'Your Location',
        message: 'A little Message',
        submit: 'Submit',
        uploading: 'Uploading...',
        company: 'Your Company in the group',
        email: 'Email address',
        code: 'Verification code',
        searchLocation: 'Search for a location...',
        uploadPhoto: 'Upload a photo',
        uploadDifferentPhoto: 'Upload a different photo',
        photoFormats: 'PNG, JPG, GIF up to 10MB',
      },
      welcome: {
        thanks: 'THANK YOU!',
        firstEntry: 'You are the first one to catch',
        secondEntry: 'You are the second one to catch',
        thirdEntry: 'You are the third one to catch',
        nthEntry: 'You are the {{count}}th one to catch',
        shareWorld: 'Show the ORCA your world and share it with other ORCA colleagues!'
      },
      logbook: {
        title: 'Travel Logbook',
        empty: 'This orca is at the very beginning of its journey',
        noOrcaSelected: 'Please select an orca to view its logbook entries'
      },
      map: {
        title: 'Travel Map',
        photoBy: 'Photo by {{name}}'
      },
      entry: {
        viewOnMap: 'View {{location}} on map',
        photoFrom: 'Photo from {{location}}'
      },
      errors: {
        required: 'This field is required',
        upload: 'Error uploading photo',
        submit: 'Error submitting entry',
        auth: {
          failed: 'Failed to send login link',
          unknown: 'An error occurred'
        },
        geolocation: {
          denied: 'Please allow access to your location in your browser settings to use this feature'
        }
      },
      auth: {
        signIn: 'Sign in to access',
        emailInstructions: 'Enter your email to receive a verification code',
        continue: 'Continue',
        sending: 'Sending code...',
        enterCode: 'Enter verification code',
        codeInstructions: 'Enter the 6-digit code sent to your email',
        verify: 'Verify code',
        verifying: 'Verifying...',
        errors: {
          failed: 'Authentication failed',
          unknown: 'An unexpected error occurred',
          invalidCode: 'Invalid or expired code',
          emailNotAllowed: 'Email domain not allowed',
        }
      },
      common: {
        time: "o'clock",
        close: "Close"
      },
      navigation: {
        addEntry: 'Add Entry',
        logbook: 'Logbook',
        map: 'Map'
      }
    },
  },
  de: {
    translation: {
      form: {
        name: 'Dein Name',
        location: 'Dein Standort',
        message: 'Eine kleine Nachricht',
        submit: 'Absenden',
        uploading: 'Wird hochgeladen...',
        company: 'Deine Firma in der Gruppe',
        email: 'E-Mail-Adresse',
        code: 'Verifizierungscode',
        searchLocation: 'Nach einem Ort suchen...',
        uploadPhoto: 'Foto hochladen',
        uploadDifferentPhoto: 'Anderes Foto hochladen',
        photoFormats: 'PNG, JPG, GIF bis zu 10MB',
      },
      welcome: {
        thanks: 'DANKE!',
        firstEntry: 'Du bist der Erste, der',
        secondEntry: 'Du bist der Zweite, der',
        thirdEntry: 'Du bist der Dritte, der',
        nthEntry: 'Du bist der {{count}}., der',
        shareWorld: 'Zeig\' dem ORCA deine Welt und teile es mit den anderen ORCAS-Kollegen!'
      },
      logbook: {
        title: 'Logbuch',
        empty: 'Dieser Orca steht ganz am Anfang seiner Reise',
        noOrcaSelected: 'Bitte wähle einen Orca aus, um seine Logbucheinträge zu sehen'
      },
      map: {
        title: 'Reisekarte',
        photoBy: 'Foto von {{name}}'
      },
      entry: {
        viewOnMap: '{{location}} auf der Karte anzeigen',
        photoFrom: 'Foto aus {{location}}'
      },
      errors: {
        required: 'Dieses Feld ist erforderlich',
        upload: 'Fehler beim Hochladen des Fotos',
        submit: 'Fehler beim Absenden des Eintrags',
        auth: {
          failed: 'Authentifizierung fehlgeschlagen',
          unknown: 'Ein unerwarteter Fehler ist aufgetreten'
        },
        geolocation: {
          denied: 'Bitte erlaube den Zugriff auf deinen Standort in den Browser-Einstellungen, um diese Funktion zu nutzen'
        }
      },
      auth: {
        signIn: 'Anmelden',
        emailInstructions: 'Gib deine E-Mail-Adresse ein, um einen Verifizierungscode zu erhalten',
        continue: 'Weiter',
        sending: 'Code wird gesendet...',
        enterCode: 'Verifizierungscode eingeben',
        codeInstructions: 'Gib den 6-stelligen Code ein, der an deine E-Mail-Adresse gesendet wurde',
        verify: 'Code überprüfen',
        verifying: 'Wird überprüft...',
        errors: {
          failed: 'Authentifizierung fehlgeschlagen',
          unknown: 'Ein unerwarteter Fehler ist aufgetreten',
          invalidCode: 'Ungültiger oder abgelaufener Code',
          emailNotAllowed: 'E-Mail-Domain nicht erlaubt. Bitte verwende eine E-Mail-Adresse der TimeToAct Group.',
        }
      },
      common: {
        time: "Uhr",
        close: "Schließen"
      },
      navigation: {
        addEntry: 'Neuer Sichtung',
        logbook: 'Logbuch',
        map: 'Karte'
      }
    },
  },
};

let isInitialized = false;

export async function initI18n() {
  if (isInitialized) {
    return i18next;
  }

  await i18next
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      resources,
      lng: getInitialLanguage(),
      fallbackLng: 'en',
      interpolation: {
        escapeValue: false,
      },
      detection: {
        order: ['localStorage', 'navigator'],
        lookupLocalStorage: 'preferredLanguage',
        caches: ['localStorage'],
      },
      react: {
        useSuspense: true,
      },
    });

  isInitialized = true;
  return i18next;
}

// Initialize i18next
if (typeof window !== 'undefined') {
  initI18n();
}

export default i18next; 