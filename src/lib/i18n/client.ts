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
        message: 'Write something nice',
        submit: 'Submit',
        uploading: 'Uploading...',
        company: 'Your Company in the Group',
        email: 'Email Address',
        code: 'Verification Code',
        searchLocation: 'Search for a location...',
        uploadPhoto: 'Upload a photo of {{name}} and you!',
        uploadDifferentPhoto: 'Upload a different photo',
        photoFormats: 'PNG, JPG, GIF, WebP up to 10MB',
        invalidOrcaTitle: 'Invalid ORCA ID',
        invalidOrcaMessage: 'No ORCA ID provided. Please scan the QR code on your ORCA figure.',
        gallery: 'Gallery',
        camera: 'Camera',
        removePhoto: 'Remove photo'
      },
      welcome: {
        thanks: 'THANK YOU!',
        firstEntry: 'You are the first one to catch',
        secondEntry: 'You are the second one to catch',
        thirdEntry: 'You are the third one to catch',
        nthEntry: 'You are the {{count}}th one to catch',
        caught: '',
        shareWorld: 'Show the ORCA your world and share it with other ORCA colleagues!'
      },
      logbook: {
        title: 'Logbook',
        noEntries: 'This orca is at the very beginning of its journey',
        noOrcaSelected: 'Please select an orca to view its logbook entries',
        selectOrca: 'Select an orca'
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
          failed: 'Authentication failed',
          unknown: 'An unexpected error occurred'
        },
        geolocation: {
          denied: 'Please allow access to your location in your browser settings to use this feature'
        }
      },
      auth: {
        signIn: 'Sign In',
        signOut: 'Sign Out',
        emailInstructions: 'Enter your email to receive a verification code',
        continue: 'Continue',
        sending: 'Sending code...',
        enterCode: 'Enter Verification Code',
        codeInstructions: 'Enter the 6-digit code sent to your email',
        verify: 'Verify Code',
        verifying: 'Verifying...',
        errors: {
          failed: 'Authentication failed',
          unknown: 'An unexpected error occurred',
          invalidCode: 'Invalid or expired code',
          emailNotAllowed: 'Email domain not allowed. Please use a TimeToAct Group email address.',
        }
      },
      common: {
        language: "Language",
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
        message: 'Schreib noch was nettes',
        submit: 'Absenden',
        uploading: 'Wird hochgeladen...',
        company: 'Deine Firma in der Gruppe',
        email: 'E-Mail-Adresse',
        code: 'Verifizierungscode',
        searchLocation: 'Nach einem Ort suchen...',
        uploadPhoto: 'Lad ein Foto von {{name}} und dir hoch!',
        uploadDifferentPhoto: 'Anderes Foto hochladen',
        photoFormats: 'PNG, JPG, GIF, WebP bis zu 10MB',
        invalidOrcaTitle: 'Ungültige ORCA ID',
        invalidOrcaMessage: 'Keine ORCA ID angegeben. Bitte scanne den QR-Code auf deiner ORCA-Figur.',
        gallery: 'Galerie',
        camera: 'Kamera',
        removePhoto: 'Foto entfernen'
      },
      welcome: {
        thanks: 'DANKE!',
        firstEntry: 'Du bist der Erste, der',
        secondEntry: 'Du bist der Zweite, der',
        thirdEntry: 'Du bist der Dritte, der',
        nthEntry: 'Du bist der {{count}}., der',
        caught: 'eingefangen hat!',
        shareWorld: 'Zeig\' dem ORCA deine Welt und teile es mit den anderen ORCAS-Kollegen!'
      },
      logbook: {
        title: 'Logbuch',
        noEntries: 'Dieser Orca steht ganz am Anfang seiner Reise',
        noOrcaSelected: 'Bitte wähle einen Orca aus, um seine Logbucheinträge zu sehen',
        selectOrca: 'Wähle einen Orca aus'
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
        signOut: 'Abmelden',
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
        language: "Sprache",
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
  kk: {
    translation: {
      form: {
        name: 'Dinge Name',
        location: 'Wo bis de?',
        message: 'Schriev jet Nettes',
        submit: 'Avschicke',
        uploading: 'Wird huhjelade...',
        company: 'Ding Firma en d\'r Jrupp',
        email: 'E-Mail-Adress',
        code: 'Prööfzahl',
        searchLocation: 'Söök noh enem Oot...',
        uploadPhoto: 'Lad e Foto vun {{name}} un dir huh!',
        uploadDifferentPhoto: 'Ander Foto huhlade',
        photoFormats: 'PNG, JPG, GIF, WebP bes 10MB',
        invalidOrcaTitle: 'ORCA ID es nit jöltich',
        invalidOrcaMessage: 'Kein ORCA ID enjejovve. Scan dä QR-Code op dingem ORCA-Figürche.',
        gallery: 'Jalerie',
        camera: 'Kamera',
        removePhoto: 'Foto fottschmieße'
      },
      welcome: {
        thanks: 'DANKE SCHÖN!',
        firstEntry: 'Do bes d\'r Eetste, dä',
        secondEntry: 'Do bes d\'r Zweite, dä',
        thirdEntry: 'Do bes d\'r Drette, dä',
        nthEntry: 'Do bes d\'r {{count}}te, dä',
        caught: 'eingefange hät!',
        shareWorld: 'Zeich dem ORCA ding Welt un deil se met andere ORCA-Kolleje!'
      },
      logbook: {
        title: 'Logboch',
        noEntries: 'Dä ORCA es jrad eets am Aanfang vun singer Reis',
        noOrcaSelected: 'Wähl ene ORCA us, öm sing Logboch ze sinn',
        selectOrca: 'Wähl ene ORCA us'
      },
      map: {
        title: 'Reisskaat',
        photoBy: 'Foto vun {{name}}'
      },
      entry: {
        viewOnMap: '{{location}} op d\'r Kaat aanzeije',
        photoFrom: 'Foto us {{location}}'
      },
      errors: {
        required: 'Dat moss de usfölle',
        upload: 'Foto kunnt nit huhjelade wääde',
        submit: 'Dat kunnt nit avjeschick wääde',
        auth: {
          failed: 'Aanmeldung hät nit jeklappt',
          unknown: 'Do es jet schief jejange'
        },
        geolocation: {
          denied: 'Erlaub d\'r Zogriff op dinge Standort en dinge Browser-Enstellunge'
        }
      },
      auth: {
        signIn: 'Aanmelde',
        signOut: 'Abmelde',
        emailInstructions: 'Jiv ding E-Mail-Adress en för ne Prööfzahl ze krijje',
        continue: 'Wigger',
        sending: 'Prööfzahl kütt...',
        enterCode: 'Prööfzahl enjävve',
        codeInstructions: 'Jiv de 6-stellije Prööfzahl en, die an ding E-Mail jeschick wood',
        verify: 'Prööfzahl pröfe',
        verifying: 'Am pröfe...',
        errors: {
          failed: 'Aanmeldung hät nit jeklappt',
          unknown: 'Do es jet schief jejange',
          invalidCode: 'Prööfzahl es nit richtich oder afjelaufe',
          emailNotAllowed: 'E-Mail-Domain es nit zojelajje. Nemm en TimeToAct Group E-Mail-Adress.',
        }
      },
      common: {
        language: "Sproch",
        time: "Uhr",
        close: "Zomache"
      },
      navigation: {
        addEntry: 'Neu Sichtung',
        logbook: 'Logboch',
        map: 'Kaat'
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