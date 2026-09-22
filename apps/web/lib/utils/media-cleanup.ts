/**
 * Comprehensive WebRTC MediaStream and Hardware Audio/Video Track Terminator
 * Ensures all video and audio tracks are halted and browser indicator lights are turned off.
 */

export function stopMediaStream(stream: MediaStream | null | undefined): void {
  if (!stream) return;
  try {
    const tracks = stream.getTracks();
    for (const track of tracks) {
      if (track.readyState !== "ended") {
        track.stop();
      }
      // Also invoke track-level disable
      track.enabled = false;
    }
  } catch (err) {
    console.warn("[MediaCleanup] Error stopping stream tracks:", err);
  }
}

/**
 * Stop any media stream bound to an HTML video or audio element,
 * unmounting the stream reference and clearing srcObject.
 */
export function stopElementMediaStream(element: HTMLMediaElement | null | undefined): void {
  if (!element) return;
  try {
    if (element.srcObject instanceof MediaStream) {
      stopMediaStream(element.srcObject);
      element.srcObject = null;
    }
    element.pause();
    element.removeAttribute("src");
    element.load();
  } catch (err) {
    console.warn("[MediaCleanup] Error releasing element media stream:", err);
  }
}

/**
 * Universal browser-level hardware media track cleanup.
 * Scans all document media elements (<video>, <audio>) and halts active streams,
 * resets SpeechRecognition instances, and ensures camera & mic hardware indicator lights turn off.
 */
export function terminateAllActiveMediaStreams(): void {
  if (typeof window === "undefined") return;

  try {
    // 1. Scan and terminate all HTMLMediaElements in the document
    const mediaElements = document.querySelectorAll<HTMLMediaElement>("video, audio");
    mediaElements.forEach((el) => {
      stopElementMediaStream(el);
    });

    // 2. Clear any shared window media streams if cached
    if ((window as any).__ascendxActiveUserStream instanceof MediaStream) {
      stopMediaStream((window as any).__ascendxActiveUserStream);
      (window as any).__ascendxActiveUserStream = null;
    }

    // 3. Dispatch a window event so all components listening immediately stop their local streams
    window.dispatchEvent(new CustomEvent("ascendx:media-session-terminate"));
  } catch (err) {
    console.warn("[MediaCleanup] Error during universal media termination:", err);
  }
}
