import { MiniStory } from '../types';

export const MINI_STORIES: MiniStory[] = [
  {
    id: 'story_cafe',
    title: 'Morning at the Corner Cafe',
    titleId: 'Pagi Hari di Kafe Sudut Jalan',
    topic: 'food_dining',
    level: 'A1',
    situation: 'Dua teman memesan kopi dan sarapan sebelum memulai aktivitas kerja.',
    lines: [
      {
        id: 'c1',
        speaker: 'Barista',
        avatar: '☕',
        textEn: 'Good morning! What can I get started for you today?',
        textId: 'Selamat pagi! Mau pesan apa untuk hari ini?',
        targetWordIds: ['a1_about']
      },
      {
        id: 'c2',
        speaker: 'Sarah',
        avatar: '👩',
        textEn: 'Hi! I would like a hot coffee with a little milk and no sugar, please.',
        textId: 'Halo! Saya mau kopi panas dengan sedikit susu dan tanpa gula, tolong.',
        targetWordIds: ['a1_about']
      },
      {
        id: 'c3',
        speaker: 'Barista',
        avatar: '☕',
        textEn: 'Sure thing. Would you also like something to eat for breakfast?',
        textId: 'Tentu. Apakah Anda juga mau makan sesuatu untuk sarapan?',
        targetWordIds: ['a1_activity']
      },
      {
        id: 'c4',
        speaker: 'Sarah',
        avatar: '👩',
        textEn: 'Yes, a fresh sandwich would be great. How much does it cost in total?',
        textId: 'Ya, roti isi segar akan sangat pas. Berapa total biayanya?',
        targetWordIds: ['a1_about']
      },
      {
        id: 'c5',
        speaker: 'Barista',
        avatar: '☕',
        textEn: 'That will be five dollars. You can pay by card or cash right here.',
        textId: 'Totalnya lima dolar. Anda bisa bayar dengan kartu atau uang tunai di sini.',
        targetWordIds: ['a1_action']
      }
    ]
  },
  {
    id: 'story_meeting',
    title: 'Project Kickoff & Team Deadlines',
    titleId: 'Rapat Proyek & Tenggat Waktu Tim',
    topic: 'work_business',
    level: 'B1',
    situation: 'Tim kantor sedang mendiskusikan target baru dan pembagian tugas penting.',
    lines: [
      {
        id: 'm1',
        speaker: 'David (Manager)',
        avatar: '👨‍💼',
        textEn: 'Thanks for coming everyone. We need to take immediate action on our quarterly project.',
        textId: 'Terima kasih sudah hadir semua. Kita harus mengambil tindakan segera untuk proyek triwulan ini.',
        targetWordIds: ['a1_action']
      },
      {
        id: 'm2',
        speaker: 'Maya',
        avatar: '👩‍💻',
        textEn: 'I agree completely. Our main goal is to deliver high quality results before the deadline.',
        textId: 'Saya sangat setuju. Tujuan utama kita adalah memberikan hasil berkualitas tinggi sebelum tenggat waktu.',
        targetWordIds: ['a1_agree']
      },
      {
        id: 'm3',
        speaker: 'David (Manager)',
        avatar: '👨‍💼',
        textEn: 'Exactly. Let us discuss each specific task so that everyone has clear responsibilities.',
        textId: 'Tepat sekali. Mari kita diskusikan setiap tugas spesifik agar setiap orang memiliki tanggung jawab yang jelas.',
        targetWordIds: ['a1_about', 'a1_action']
      },
      {
        id: 'm4',
        speaker: 'Maya',
        avatar: '👩‍💻',
        textEn: 'I will prepare a brief summary and share the updated schedule with the whole team by noon.',
        textId: 'Saya akan menyiapkan ringkasan singkat dan membagikan jadwal terbaru ke seluruh tim sebelum siang.',
        targetWordIds: ['a1_activity']
      }
    ]
  },
  {
    id: 'story_weekend_trip',
    title: 'Spontaneous Weekend Road Trip',
    titleId: 'Rencana Liburan Akhir Pekan Spontan',
    topic: 'travel',
    level: 'A2',
    situation: 'Dua sahabat merencanakan liburan singkat ke danau untuk rehat dari rutinitas kota.',
    lines: [
      {
        id: 't1',
        speaker: 'Alex',
        avatar: '🧑',
        textEn: 'Do you have any plans for this upcoming weekend?',
        textId: 'Apakah kamu ada rencana untuk akhir pekan yang akan datang ini?',
        targetWordIds: ['a1_activity']
      },
      {
        id: 't2',
        speaker: 'Leo',
        avatar: '👦',
        textEn: 'Not yet! I just want to take a break from the busy city noise.',
        textId: 'Belum ada! Aku hanya ingin istirahat sejenak dari hiruk-pikuk kota yang ramai.',
        targetWordIds: ['a1_about']
      },
      {
        id: 't3',
        speaker: 'Alex',
        avatar: '🧑',
        textEn: 'How about a road trip to the mountain lake? It takes about two hours to drive there.',
        textId: 'Bagaimana kalau kita perjalanan darat ke danau pegunungan? Butuh waktu sekitar dua jam menyetir ke sana.',
        targetWordIds: ['a1_about']
      },
      {
        id: 't4',
        speaker: 'Leo',
        avatar: '👦',
        textEn: 'That sounds wonderful! Outdoor activities always give me fresh energy.',
        textId: 'Kedengarannya luar biasa! Aktivitas luar ruangan selalu memberiku energi segar.',
        targetWordIds: ['a1_activity']
      }
    ]
  },
  {
    id: 'story_interview',
    title: 'The Confident Job Interview',
    titleId: 'Wawancara Kerja yang Penuh Percaya Diri',
    topic: 'work_business',
    level: 'B2',
    situation: 'Kandidat menjelaskan pengalaman kerja serta kemampuan memecahkan masalah kepada pewawancara.',
    lines: [
      {
        id: 'i1',
        speaker: 'Interviewer',
        avatar: '👔',
        textEn: 'Welcome! Can you tell us about your experience managing fast-paced projects?',
        textId: 'Selamat datang! Bisakah Anda ceritakan tentang pengalaman Anda mengelola proyek bertempo cepat?',
        targetWordIds: ['a1_about']
      },
      {
        id: 'i2',
        speaker: 'Candidate',
        avatar: '👩‍💼',
        textEn: 'Certainly. In my previous role, I led cross-functional teams to achieve demanding targets.',
        textId: 'Tentu. Pada posisi saya sebelumnya, saya memimpin tim lintas fungsi untuk mencapai target-target yang menantang.',
        targetWordIds: ['a1_action']
      },
      {
        id: 'i3',
        speaker: 'Interviewer',
        avatar: '👔',
        textEn: 'How do you handle situations when team members disagree on a crucial strategy?',
        textId: 'Bagaimana Anda menghadapi situasi saat anggota tim tidak setuju pada strategi krusial?',
        targetWordIds: ['a1_agree']
      },
      {
        id: 'i4',
        speaker: 'Candidate',
        avatar: '👩‍💼',
        textEn: 'I encourage open communication, evaluate the data objectively, and reach a consensus that benefits the company.',
        textId: 'Saya mendorong komunikasi terbuka, mengevaluasi data secara objektif, dan mencapai mufakat yang menguntungkan perusahaan.',
        targetWordIds: ['a1_agree', 'a1_action']
      }
    ]
  }
];
