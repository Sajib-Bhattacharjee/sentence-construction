import { initAudioContext, isAudioContextUnlocked } from "./audioContext";

// Sound effect URLs - using CDN hosted sounds for reliability
const SOUNDS = {
  correct:
    "https://assets.mixkit.co/sfx/preview/mixkit-correct-answer-tone-2870.mp3",
  incorrect:
    "https://assets.mixkit.co/sfx/preview/mixkit-wrong-answer-fail-notification-946.mp3",
  buttonClick:
    "https://assets.mixkit.co/sfx/preview/mixkit-select-click-1109.mp3",
  complete:
    "https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3",
  timerWarning:
    "https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3",
};

// Additional sound sources if primary fails (using different CDNs)
const FALLBACK_SOUNDS = {
  correct: "https://soundbible.com/mp3/ding-sound-effect_2-mp3cut.mp3",
  incorrect: "https://soundbible.com/mp3/buzz-sound-effect.mp3",
  buttonClick: "https://soundbible.com/mp3/Click-SoundBible.com-1387633738.mp3",
  complete: "https://soundbible.com/mp3/service-bell_daniel_simion.mp3",
  timerWarning: "https://soundbible.com/mp3/sms-alert-5-daniel_simon.mp3",
};

// Initialize sound preference from localStorage with a fallback
let soundEnabled = true;
try {
  const storedValue = localStorage.getItem("soundEnabled");
  soundEnabled = storedValue === null ? true : storedValue !== "false";
} catch (error) {
  console.warn("Could not access localStorage for sound preferences", error);
}

// Cache for audio instances to prevent reloading
const audioCache: Record<string, HTMLAudioElement> = {};

/**
 * Attempt to unlock audio playback on mobile devices
 * This should be called during a user interaction event
 */
export const unlockAudio = (): void => {
  // First initialize the audio context
  initAudioContext();

  if (typeof window === "undefined") return;

  // Create and play a silent audio element
  const silentAudio = new Audio();
  silentAudio.autoplay = true;
  silentAudio.src =
    "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjIwLjEwMAAAAAAAAAAAAAAA//uQwAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAADAAADQgD///////////////////////////////////////////////8AAAA5TEFNRTMuMTAwAc8AAAAALgkAABRAJAHwQgAAgIAAAkIDYS48AAAAAAAAAAAAAAAA//uQRAAAAnkIUm0KQAjtPddj2mgidDGFNv///M80AAAAAAAcAlgAA8gAJwbZyAAAAAAdVNUVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV//uSZAAABF1HYZt5YAI5hJyPxhigDFkVjG3wAAGMHOQP2AAAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUQQAA";
  silentAudio.volume = 0.01;

  // Try to play it
  const promise = silentAudio.play();
  if (promise !== undefined) {
    promise.catch((error) => {
      console.warn("Audio unlock failed on first attempt:", error);
      // We will rely on user interaction events below
    });
  }

  // Also preload a sound to ensure audio can play later
  preloadSound("buttonClick");
};

// Add event listeners to unlock audio on user interaction
if (typeof window !== "undefined") {
  const unlockEvents = ["touchstart", "touchend", "mousedown", "keydown"];
  const unlockAudioOnUserInteraction = () => {
    unlockAudio();
    initAudioContext();

    // Try to play a sound to fully unlock audio
    const testAudio = getSoundInstance("buttonClick");
    if (testAudio) {
      testAudio.volume = 0.01;
      testAudio
        .play()
        .then(() => {
          testAudio.pause();
          testAudio.currentTime = 0;
        })
        .catch(() => console.warn("Audio still locked after user interaction"));
    }

    // Remove the event listeners once we've successfully unlocked audio
    unlockEvents.forEach((event) => {
      document.removeEventListener(event, unlockAudioOnUserInteraction);
    });
  };

  // Add all the unlock events
  unlockEvents.forEach((event) => {
    document.addEventListener(event, unlockAudioOnUserInteraction, {
      once: false,
    });
  });
}

/**
 * Preloads a sound to ensure faster playback
 */
export const preloadSound = (sound: keyof typeof SOUNDS): void => {
  if (!sound || !SOUNDS[sound]) return;

  if (!audioCache[sound]) {
    const audio = new Audio();
    audio.src = SOUNDS[sound];
    audio.load();
    audioCache[sound] = audio;

    // Also preload fallback if available
    if (FALLBACK_SOUNDS[sound]) {
      const fallbackAudio = new Audio();
      fallbackAudio.src = FALLBACK_SOUNDS[sound];
      fallbackAudio.load();
      audioCache[`${sound}_fallback`] = fallbackAudio;
    }
  }
};

/**
 * Gets an audio instance for the specified sound
 */
export const getSoundInstance = (
  sound: keyof typeof SOUNDS
): HTMLAudioElement | null => {
  if (!sound || !SOUNDS[sound]) return null;

  // Create or retrieve the audio instance
  if (!audioCache[sound]) {
    const audio = new Audio();
    audio.src = SOUNDS[sound];
    audioCache[sound] = audio;
  }

  return audioCache[sound];
};

/**
 * Toggle sound on/off
 */
export const toggleSound = (): boolean => {
  soundEnabled = !soundEnabled;

  // Save to localStorage for persistence
  try {
    localStorage.setItem("soundEnabled", soundEnabled.toString());
  } catch (error) {
    console.warn("Could not save sound preference to localStorage", error);
  }

  return soundEnabled;
};

/**
 * Get current sound enabled status
 */
export const isSoundEnabled = (): boolean => {
  return soundEnabled;
};

/**
 * Play a sound with fallback option
 */
export const playSound = (sound: keyof typeof SOUNDS): void => {
  if (!soundEnabled) return;

  // Try to use the audio context if available
  if (isAudioContextUnlocked()) {
    initAudioContext();
  }

  // Get or create the audio instance
  const audio = getSoundInstance(sound);
  if (!audio) return;

  // Reset and play
  audio.currentTime = 0;

  const promise = audio.play();
  if (promise !== undefined) {
    promise.catch((error) => {
      console.warn(`Error playing sound '${sound}':`, error);

      // Try fallback sound if available
      if (FALLBACK_SOUNDS[sound]) {
        let fallbackAudio = audioCache[`${sound}_fallback`];

        if (!fallbackAudio) {
          fallbackAudio = new Audio(FALLBACK_SOUNDS[sound]);
          audioCache[`${sound}_fallback`] = fallbackAudio;
        }

        fallbackAudio.currentTime = 0;
        fallbackAudio.play().catch((fallbackError) => {
          console.warn(`Fallback sound '${sound}' also failed:`, fallbackError);
        });
      }
    });
  }
};

// Preload all sounds
export const preloadAllSounds = (): void => {
  Object.keys(SOUNDS).forEach((sound) => {
    preloadSound(sound as keyof typeof SOUNDS);
  });
};

// Initialize by preloading the most critical sounds
preloadSound("buttonClick");
preloadSound("correct");
