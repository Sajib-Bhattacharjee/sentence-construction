/**
 * Audio Context Management
 * Handles initialization and unlocking of audio context across browsers
 */

// Store the audio context instance for reuse
let audioContextInstance: AudioContext | null = null;

// Track whether audio has been unlocked
let audioUnlocked = false;

/**
 * Get or create an AudioContext instance
 * Uses a singleton pattern to prevent multiple context creation
 */
export const initAudioContext = (): AudioContext => {
  // Return existing instance if available
  if (audioContextInstance) {
    // Try to resume it if suspended
    if (audioContextInstance.state === "suspended") {
      audioContextInstance.resume().catch((error) => {
        console.warn("Failed to resume audio context:", error);
      });
    }
    return audioContextInstance;
  }

  // Create a new instance if none exists
  try {
    // Use standard or prefixed implementation depending on browser
    const AudioContextClass =
      window.AudioContext ||
      ((window as any).webkitAudioContext as typeof AudioContext);

    if (!AudioContextClass) {
      console.warn("AudioContext not supported in this browser");
      throw new Error("AudioContext not supported");
    }

    audioContextInstance = new AudioContextClass();

    // Attempt to start it in response to user interaction
    if (audioContextInstance.state === "suspended") {
      audioContextInstance.resume().catch((error) => {
        console.warn("Failed to resume newly created audio context:", error);
      });
    }

    return audioContextInstance;
  } catch (error) {
    console.error("Failed to create AudioContext:", error);
    // Create a dummy implementation for browsers that don't support AudioContext
    const dummyContext = {
      state: "running",
      resume: () => Promise.resolve(),
      suspend: () => Promise.resolve(),
      close: () => Promise.resolve(),
    } as unknown as AudioContext;

    audioContextInstance = dummyContext;
    return dummyContext;
  }
};

/**
 * Unlock audio on iOS and other restrictive browsers
 * Must be called during a user interaction event (click/touch)
 */
export const unlockAudioContext = (): Promise<void> => {
  if (!audioContextInstance) {
    audioContextInstance = initAudioContext();
  }

  // If already running, nothing to do
  if (audioContextInstance.state === "running") {
    audioUnlocked = true;
    return Promise.resolve();
  }

  // Create a short sound and play it to unlock
  // This approach works on iOS and other restricted platforms
  return new Promise((resolve, reject) => {
    try {
      if (!audioContextInstance) {
        reject(new Error("Audio context not available"));
        return;
      }

      // Create an empty buffer
      const buffer = audioContextInstance.createBuffer(1, 1, 22050);
      const source = audioContextInstance.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextInstance.destination);

      // Play the empty sound
      source.start(0);

      // Resume the context
      audioContextInstance
        .resume()
        .then(() => {
          audioUnlocked = true;
          resolve();
        })
        .catch((error) => {
          console.warn("Failed to resume audio context during unlock:", error);
          reject(error);
        });

      // Also set a timeout in case the promises don't resolve
      setTimeout(() => {
        if (audioContextInstance?.state === "running") {
          audioUnlocked = true;
          resolve();
        }
      }, 500);
    } catch (error) {
      console.error("Error unlocking audio:", error);
      reject(error);
    }
  });
};

/**
 * Check if audio has been unlocked
 */
export const isAudioContextUnlocked = (): boolean => {
  return audioUnlocked && audioContextInstance?.state === "running";
};

/**
 * Get the current AudioContext instance
 */
export const getAudioContext = (): AudioContext | null => {
  if (!audioContextInstance) {
    audioContextInstance = initAudioContext();
  }
  return audioContextInstance;
};

/**
 * Get the current audio context state
 */
export const getAudioContextState = (): string => {
  return audioContextInstance?.state || "unavailable";
};

/**
 * Suspend the AudioContext when app loses focus
 */
export const suspendAudioContext = (): Promise<void> => {
  if (!audioContextInstance || audioContextInstance.state !== "running") {
    return Promise.resolve();
  }

  return audioContextInstance.suspend().catch((error) => {
    console.warn("Failed to suspend audio context:", error);
    return Promise.reject(error);
  });
};

/**
 * Resume the AudioContext when app gets focus
 */
export const resumeAudioContext = (): Promise<void> => {
  if (!audioContextInstance) {
    audioContextInstance = initAudioContext();
  }

  if (audioContextInstance.state === "suspended") {
    return audioContextInstance.resume().catch((error) => {
      console.warn("Failed to resume audio context:", error);
      return Promise.reject(error);
    });
  }
  return Promise.resolve();
};

// Initialize the audio context on module load when in browser environment
if (typeof window !== "undefined") {
  // Defer initialization to avoid immediate creation
  setTimeout(() => {
    try {
      initAudioContext();
    } catch (error) {
      console.warn("Deferred audio context initialization failed:", error);
    }
  }, 100);
}
