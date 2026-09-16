/**
 * Speech synthesis (American US & British UK English TTS) and Speech Recognition helper.
 */

let selectedUsVoice: SpeechSynthesisVoice | null = null;
let selectedUkVoice: SpeechSynthesisVoice | null = null;
let currentGlobalAccent: 'us' | 'uk' = 'us';

export function setGlobalSpeechAccent(accent: 'us' | 'uk') {
  currentGlobalAccent = accent;
}

function loadVoices(): void {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  const voices = window.speechSynthesis.getVoices();

  // Find en-US voice
  selectedUsVoice = voices.find(
    (v) => (v.lang === 'en-US' || v.lang === 'en_US') && (v.name.toLowerCase().includes('united states') || v.name.toLowerCase().includes('american') || v.name.toLowerCase().includes('samantha') || v.name.toLowerCase().includes('google'))
  ) || voices.find((v) => v.lang === 'en-US' || v.lang === 'en_US') || voices.find((v) => v.lang.startsWith('en')) || null;

  // Find en-GB voice
  selectedUkVoice = voices.find(
    (v) => (v.lang === 'en-GB' || v.lang === 'en_GB') && (v.name.toLowerCase().includes('united kingdom') || v.name.toLowerCase().includes('british') || v.name.toLowerCase().includes('daniel') || v.name.toLowerCase().includes('george') || v.name.toLowerCase().includes('google uk'))
  ) || voices.find((v) => v.lang === 'en-GB' || v.lang === 'en_GB') || selectedUsVoice;
}

if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    loadVoices();
  };
  loadVoices();
}

/**
 * Play English pronunciation (American or British) using Web Speech API
 */
export function playPronunciation(
  text: string, 
  speed: number = 0.9, 
  accent?: 'us' | 'uk'
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      resolve();
      return;
    }

    // Cancel current speaking
    window.speechSynthesis.cancel();

    const targetAccent = accent || currentGlobalAccent;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = targetAccent === 'uk' ? 'en-GB' : 'en-US';
    utterance.rate = Math.max(0.6, Math.min(1.4, speed));
    utterance.pitch = 1.0;

    if (!selectedUsVoice && !selectedUkVoice) {
      loadVoices();
    }

    const voice = targetAccent === 'uk' ? (selectedUkVoice || selectedUsVoice) : (selectedUsVoice || selectedUkVoice);
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    window.speechSynthesis.speak(utterance);
  });
}

/**
 * Check if Web Speech Recognition is supported
 */
export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;
}

export interface SpeechRecognitionResult {
  transcript: string;
  accuracyScore: number; // 0 to 100
  matchedWords: string[];
  feedback: string;
}

/**
 * Compare spoken transcript with target sentence
 */
export function evaluatePronunciation(target: string, spoken: string): { accuracyScore: number; feedback: string; matchedWords: string[] } {
  const cleanTarget = target.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/);
  const cleanSpoken = spoken.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim().split(/\s+/);

  if (cleanSpoken.length === 0 || spoken.trim() === '') {
    return {
      accuracyScore: 0,
      feedback: 'Belum terdengar suara. Silakan coba tekan mikrofon dan bicara lagi.',
      matchedWords: []
    };
  }

  const matchedWords: string[] = [];
  let matches = 0;

  cleanTarget.forEach((word) => {
    if (cleanSpoken.includes(word)) {
      matches++;
      matchedWords.push(word);
    }
  });

  const accuracyScore = Math.round((matches / cleanTarget.length) * 100);

  let feedback = '';
  if (accuracyScore >= 90) {
    feedback = '🔥 Luar biasa! Pengucapan American English kamu sangat jelas dan akurat!';
  } else if (accuracyScore >= 70) {
    feedback = '👍 Bagus sekali! Sebagian besar kata terucap dengan tepat.';
  } else if (accuracyScore >= 40) {
    feedback = '🙂 Sudah lumayan! Dengarkan audio sekali lagi dan perhatikan penekanan intonasinya.';
  } else {
    feedback = '💪 Tetap semangat! Coba dengarkan audio lambat (0.8x) lalu ulangi kata per kata.';
  }

  return { accuracyScore, feedback, matchedWords };
}

/**
 * Listen using SpeechRecognition
 */
export function startVoiceRecognition(
  onResult: (result: SpeechRecognitionResult) => void,
  onError: (errorMsg: string) => void
): () => void {
  if (typeof window === 'undefined') {
    onError('Browser tidak mendukung audio.');
    return () => {};
  }

  const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  if (!SpeechRecognitionConstructor) {
    onError('Browser ini belum mendukung Web Speech Recognition. Tetap gunakan audio 🔊 untuk menyimak.');
    return () => {};
  }

  try {
    const recognition = new SpeechRecognitionConstructor();
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript || '';
      onResult({
        transcript,
        accuracyScore: 0, // will be evaluated against target by caller
        matchedWords: [],
        feedback: ''
      });
    };

    recognition.onerror = (event: any) => {
      let msg = 'Gagal mendengarkan.';
      if (event.error === 'not-allowed') {
        msg = 'Izin mikrofon belum diberikan. Silakan izinkan akses mikrofon di browsermu.';
      } else if (event.error === 'no-speech') {
        msg = 'Tidak ada suara yang terdeteksi. Silakan coba lagi.';
      } else {
        msg = `Koneksi suara: ${event.error}`;
      }
      onError(msg);
    };

    recognition.start();

    return () => {
      try {
        recognition.stop();
      } catch (e) {
        // ignore
      }
    };
  } catch (err: any) {
    onError(err?.message || 'Tidak dapat memulai mikrofon.');
    return () => {};
  }
}
