import { CEFRLevel } from '../types';

export interface PlacementQuestion {
  id: string;
  level: CEFRLevel;
  question: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  // A1 Questions (1-4)
  {
    id: 'pq1',
    level: 'A1',
    question: 'Pilihlah arti kata yang tepat untuk: "ABOUT"',
    prompt: 'Contoh: Tell me about your new house.',
    options: ['tentang / kira-kira', 'selalu / sering', 'di bawah', 'sebelum'],
    correctIndex: 0,
    explanation: '"About" berarti tentang atau membicarakan suatu hal / perkiraan.'
  },
  {
    id: 'pq2',
    level: 'A1',
    question: 'Lengkapi kalimat: "We must take _______ to solve this issue."',
    prompt: 'Pilihlah kata yang membentuk collocation alami.',
    options: ['action', 'sleep', 'water', 'book'],
    correctIndex: 0,
    explanation: 'Frasa alami "take action" berarti mengambil tindakan nyata.'
  },
  {
    id: 'pq3',
    level: 'A1',
    question: 'Kata apa yang berarti lawan kata dari "DISAGREE"?',
    prompt: 'She and I _______ on almost every decision.',
    options: ['agree', 'doubt', 'fight', 'refuse'],
    correctIndex: 0,
    explanation: '"Agree" berarti setuju / sepakat.'
  },
  {
    id: 'pq4',
    level: 'A1',
    question: 'Kata "ACTIVITY" tergolong dalam kelas kata (Part of Speech) apa?',
    prompt: 'Swimming is a healthy outdoor activity.',
    options: ['Noun (Kata Benda)', 'Verb (Kata Kerja)', 'Adjective (Kata Sifat)', 'Adverb (Kata Keterangan)'],
    correctIndex: 0,
    explanation: '"Activity" adalah Noun (kata benda) dengan akhiran "-ity".'
  },

  // A2 Questions (5-8)
  {
    id: 'pq5',
    level: 'A2',
    question: 'Lengkapi kalimat: "I will make a _______ to confirm our table tonight."',
    prompt: 'Situasi: Memesan meja di restoran terlebih dahulu.',
    options: ['reservation', 'decision', 'conversation', 'vacation'],
    correctIndex: 0,
    explanation: '"Make a reservation" adalah ekspresi standar untuk memesan tempat.'
  },
  {
    id: 'pq6',
    level: 'A2',
    question: 'Pilih arti yang paling tepat untuk: "OPPORTUNITY"',
    prompt: 'He received an amazing opportunity to study abroad.',
    options: ['kesempatan / peluang emas', 'kegagalan', 'kewajiban', 'hukuman'],
    correctIndex: 0,
    explanation: '"Opportunity" berarti peluang atau kesempatan baik.'
  },
  {
    id: 'pq7',
    level: 'A2',
    question: 'Kata mana yang memiliki makna serupa dengan "ACCURATE"?',
    prompt: 'Please provide accurate financial information.',
    options: ['precise / exact', 'slow', 'uncertain', 'emotional'],
    correctIndex: 0,
    explanation: '"Accurate" berarti tepat, akurat, atau cermat.'
  },
  {
    id: 'pq8',
    level: 'A2',
    question: 'Manakah pasangan kata (collocation) yang PALING ALAMI?',
    prompt: 'Membuat kemajuan dalam belajar.',
    options: ['make progress', 'do progress', 'take progress', 'play progress'],
    correctIndex: 0,
    explanation: 'Dalam bahasa Inggris, kita menggunakan "make progress", bukan "do progress".'
  },

  // B1 Questions (9-12)
  {
    id: 'pq9',
    level: 'B1',
    question: 'Lengkapi kalimat: "The manager had to _______ between two qualified candidates."',
    prompt: 'Memilih atau menentukan pilihan.',
    options: ['choose', 'apply', 'pretend', 'remain'],
    correctIndex: 0,
    explanation: '"Choose between" digunakan saat menentukan pilihan di antara opsi.'
  },
  {
    id: 'pq10',
    level: 'B1',
    question: 'Pilihlah sinonim dari "BENEFICIAL":',
    prompt: 'Daily meditation is highly beneficial for mental clarity.',
    options: ['advantageous / helpful', 'harmful', 'expensive', 'complicated'],
    correctIndex: 0,
    explanation: '"Beneficial" berarti bermanfaat atau memberikan keuntungan positif.'
  },
  {
    id: 'pq11',
    level: 'B1',
    question: 'Lengkapi kalimat: "We must ensure our budget is _______ with our quarterly goals."',
    prompt: 'Kesesuaian atau keselarasan.',
    options: ['consistent', 'fragile', 'aggressive', 'guilty'],
    correctIndex: 0,
    explanation: '"Consistent with" berarti selaras atau konsisten dengan sesuatu.'
  },
  {
    id: 'pq12',
    level: 'B1',
    question: 'Apa arti idiom atau phrasal verb: "CARRY OUT"?',
    prompt: 'The team will carry out the plan next week.',
    options: ['melaksanakan / mengeksekusi', 'membatalkan', 'menunda', 'mengabaikan'],
    correctIndex: 0,
    explanation: '"Carry out" berarti mengeksekusi, melaksanakan, atau menjalankan tugas.'
  },

  // B2 Questions (13-15)
  {
    id: 'pq13',
    level: 'B2',
    question: 'Lengkapi kalimat: "The company’s decision was heavily _______ by market volatility."',
    prompt: 'Dipengaruhi oleh faktor luar.',
    options: ['influenced', 'invented', 'celebrated', 'delayed'],
    correctIndex: 0,
    explanation: '"Influenced by" berarti dipengaruhi oleh faktor tertentu.'
  },
  {
    id: 'pq14',
    level: 'B2',
    question: 'Apa arti dari kata "COMPREHENSIVE"?',
    prompt: 'She wrote a comprehensive guide to modern marketing.',
    options: ['menyeluruh / lengkap dan mendalam', 'sangat rumit', 'singkat dan padat', 'rahasia'],
    correctIndex: 0,
    explanation: '"Comprehensive" berarti menyeluruh, lengkap, dan mencakup semua aspek penting.'
  },
  {
    id: 'pq15',
    level: 'B2',
    question: 'Pilih pasangan collocation formal yang tepat: "To _______ consensus among stakeholders"',
    prompt: 'Mencapai mufakat atau kesepakatan bersama.',
    options: ['reach', 'catch', 'throw', 'grab'],
    correctIndex: 0,
    explanation: 'Dalam bahasa Inggris formal, kita mengatakan "reach consensus".'
  }
];

export function calculatePlacementLevel(correctCount: number): {
  level: CEFRLevel;
  title: string;
  summary: string;
  recommendation: string;
} {
  if (correctCount <= 4) {
    return {
      level: 'A1',
      title: 'A1 - Beginner (Pemula)',
      summary: 'Kamu cocok memulai dari kosakata fundamental sehari-hari.',
      recommendation: 'Pelajari kata kerja dasar, kata benda harian, dan cara membuat kalimat sederhana.'
    };
  }
  if (correctCount <= 8) {
    return {
      level: 'A2',
      title: 'A2 - Elementary (Dasar)',
      summary: 'Fondasi dasarmu sudah ada, sekarang saatnya memperkaya kosakata percakapan praktis.',
      recommendation: 'Kuasai ungkapan sosial, belanja, rutinitas kerja, dan frasa umum penutur asli.'
    };
  }
  if (correctCount <= 12) {
    return {
      level: 'B1',
      title: 'B1 - Intermediate (Menengah)',
      summary: 'Pemahamanmu solid! Kamu mampu mengekspresikan opini dan memahami konteks kerja.',
      recommendation: 'Perkuat kosakata profesional, istilah abstrak, dan collocations yang lebih berbobot.'
    };
  }
  return {
    level: 'B2',
    title: 'B2 - Upper Intermediate (Lanjutan)',
    summary: 'Luar biasa! Kosakatamu luas, akurat, dan bernuansa tinggi.',
    recommendation: 'Fokus pada nuansa kata formal, frasa idiomatis, dan persiapan tes kemahiran (IELTS/TOEFL).'
  };
}
