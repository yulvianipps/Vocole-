import { OxfordWord, CEFRLevel } from '../types';
import { OXFORD_EXPANDED_WORDS } from './oxfordExpandedWords';

/**
 * Authentic Oxford 3000™ (American English) vocabulary database.
 * Directly sourced from the official Oxford 3000 reference.
 */
const CORE_OXFORD_WORDS: OxfordWord[] = [
  // ===================== LEVEL A1 (Beginner) =====================
  {
    id: 'a1_about',
    word: 'about',
    pos: 'prep., adv.',
    level: 'A1',
    meaningId: 'tentang / kira-kira',
    phonetic: '/əˈbaʊt/',
    phoneticSimple: 'uh-BAWT',
    simpleExplanation: 'Membicarakan suatu topik atau perkiraan jumlah/waktu.',
    example: 'Tell me about your favorite hobbies.',
    exampleId: 'Ceritakan padaku tentang hobi favoritmu.',
    moreExamples: [
      { sentence: 'The meeting starts in about ten minutes.', translation: 'Rapat dimulai sekitar sepuluh menit lagi.' }
    ],
    speakingPrompt: 'Tell me about your morning routine.',
    wordFamily: ['about']
  },
  {
    id: 'a1_action',
    word: 'action',
    pos: 'n.',
    level: 'A1',
    meaningId: 'tindakan / aksi',
    phonetic: '/ˈæk.ʃən/',
    phoneticSimple: 'AK-shun',
    simpleExplanation: 'Sesuatu yang nyata kamu perbuat untuk mencapai hasil.',
    example: 'We must take action before it gets worse.',
    exampleId: 'Kita harus mengambil tindakan sebelum semakin memburuk.',
    moreExamples: [
      { sentence: 'Actions speak louder than words.', translation: 'Tindakan berbicara lebih keras daripada kata-kata.' }
    ],
    collocations: [
      { phrase: 'take action', meaningId: 'mengambil tindakan nyata' },
      { phrase: 'call to action', meaningId: 'ajakan untuk bertindak' },
      { phrase: 'in action', meaningId: 'sedang beraksi / beroperasi' }
    ],
    speakingPrompt: 'We need to take immediate action.',
    wordFamily: ['act', 'action', 'active', 'activity', 'actor']
  },
  {
    id: 'a1_activity',
    word: 'activity',
    pos: 'n.',
    level: 'A1',
    meaningId: 'aktivitas / kegiatan',
    phonetic: '/ækˈtɪv.ə.t̬i/',
    phoneticSimple: 'ak-TIV-uh-tee',
    simpleExplanation: 'Kegiatan yang dilakukan untuk belajar atau rekreasi.',
    example: 'Swimming is a great weekend activity.',
    exampleId: 'Berenang adalah aktivitas akhir pekan yang menyenangkan.',
    collocations: [
      { phrase: 'daily activity', meaningId: 'kegiatan sehari-hari' },
      { phrase: 'physical activity', meaningId: 'aktivitas fisik / olahraga' },
      { phrase: 'outdoor activity', meaningId: 'kegiatan luar ruangan' }
    ],
    speakingPrompt: 'My favorite activity is reading English books.',
    wordFamily: ['act', 'action', 'active', 'activity', 'actor']
  },
  {
    id: 'a1_actor',
    word: 'actor',
    pos: 'n.',
    level: 'A1',
    meaningId: 'aktor / pemeran',
    phonetic: '/ˈæk.tɚ/',
    phoneticSimple: 'AK-ter',
    simpleExplanation: 'Orang yang memerankan tokoh dalam film atau drama.',
    example: 'He is a very famous Hollywood actor.',
    exampleId: 'Dia adalah aktor Hollywood yang sangat terkenal.',
    collocations: [
      { phrase: 'famous actor', meaningId: 'aktor terkenal' },
      { phrase: 'lead actor', meaningId: 'aktor / pemeran utama' }
    ],
    speakingPrompt: 'She wants to be a professional actor.',
    wordFamily: ['act', 'action', 'active', 'activity', 'actor']
  },
  {
    id: 'a1_advice',
    word: 'advice',
    pos: 'n.',
    level: 'A1',
    meaningId: 'nasihat / anjuran baik',
    phonetic: '/ədˈvaɪs/',
    phoneticSimple: 'ud-VYS',
    simpleExplanation: 'Saran baik yang diberikan seseorang untuk membantu kita (kata benda).',
    example: 'Can you give me some advice on learning English?',
    exampleId: 'Bisakah kamu memberiku nasihat tentang belajar bahasa Inggris?',
    moreExamples: [
      { sentence: 'My teacher gave me helpful advice.', translation: 'Guru saya memberi saya nasihat yang sangat membantu.' }
    ],
    collocations: [
      { phrase: 'give advice', meaningId: 'memberikan nasihat' },
      { phrase: 'take someone\'s advice', meaningId: 'mengikuti nasihat seseorang' },
      { phrase: 'a piece of advice', meaningId: 'sepatah / sebuah nasihat' }
    ],
    confusingPair: {
      targetWord: 'advice',
      confusedWith: 'advise',
      targetMeaning: 'nasihat / saran (kata benda / noun)',
      confusedMeaning: 'menasihati (kata kerja / verb, B1)',
      explanation: 'ADVICE dengan C = kata benda (noun). ADVISE dengan S = kata kerja (verb).',
      tip: 'Contoh: Thank you for your advice (noun). Please advise me (verb).'
    },
    speakingPrompt: 'Thank you for your valuable advice.',
    wordFamily: ['advice', 'advise']
  },
  {
    id: 'a1_afraid',
    word: 'afraid',
    pos: 'adj.',
    level: 'A1',
    meaningId: 'takut / khawatir',
    phonetic: '/əˈfreɪd/',
    phoneticSimple: 'uh-FRAYD',
    simpleExplanation: 'Merasa cemas atau gentar terhadap sesuatu.',
    example: 'Do not be afraid of speaking English.',
    exampleId: 'Jangan takut berbicara bahasa Inggris.',
    speakingPrompt: 'I am not afraid to make mistakes.',
    wordFamily: ['afraid']
  },
  {
    id: 'a1_agree',
    word: 'agree',
    pos: 'v.',
    level: 'A1',
    meaningId: 'setuju / sependapat',
    phonetic: '/əˈɡriː/',
    phoneticSimple: 'uh-GREE',
    simpleExplanation: 'Memiliki pemikiran yang sejalan dengan orang lain.',
    example: 'I completely agree with your suggestion.',
    exampleId: 'Saya sepenuhnya setuju dengan usulanmu.',
    speakingPrompt: 'I agree with your plan.',
    wordFamily: ['agree', 'agreement', 'disagree']
  },
  {
    id: 'a1_always',
    word: 'always',
    pos: 'adv.',
    level: 'A1',
    meaningId: 'selalu',
    phonetic: '/ˈɔːl.weɪz/',
    phoneticSimple: 'AWL-wayz',
    simpleExplanation: 'Terjadi setiap saat atau secara berulang tanpa putus.',
    example: 'She always practices vocabulary every single morning.',
    exampleId: 'Dia selalu melatih kosakata setiap pagi.',
    speakingPrompt: 'Always stay curious and positive.',
    wordFamily: ['always']
  },
  {
    id: 'a1_amazing',
    word: 'amazing',
    pos: 'adj.',
    level: 'A1',
    meaningId: 'menakjubkan / luar biasa',
    phonetic: '/əˈmeɪ.zɪŋ/',
    phoneticSimple: 'uh-MAY-zing',
    simpleExplanation: 'Sangat bagus dan membuat orang merasa kagum.',
    example: 'You have made amazing progress this week!',
    exampleId: 'Kamu telah membuat kemajuan luar biasa minggu ini!',
    speakingPrompt: 'This view is absolutely amazing.',
    wordFamily: ['amazed', 'amazing']
  },
  {
    id: 'a1_answer',
    word: 'answer',
    pos: 'n., v.',
    level: 'A1',
    meaningId: 'jawaban / menjawab',
    phonetic: '/ˈæn.sɚ/',
    phoneticSimple: 'AN-ser',
    simpleExplanation: 'Memberikan tanggapan atas sebuah pertanyaan.',
    example: 'Please answer the quiz question carefully.',
    exampleId: 'Tolong jawab pertanyaan kuis dengan teliti.',
    speakingPrompt: 'I know the correct answer.',
    wordFamily: ['answer']
  },
  {
    id: 'a1_arrive',
    word: 'arrive',
    pos: 'v.',
    level: 'A1',
    meaningId: 'tiba / sampai',
    phonetic: '/əˈraɪv/',
    phoneticSimple: 'uh-RYV',
    simpleExplanation: 'Mencapai tujuan setelah melakukan perjalanan.',
    example: 'We will arrive at the airport around noon.',
    exampleId: 'Kita akan tiba di bandara sekitar tengah hari.',
    speakingPrompt: 'When will your flight arrive?',
    wordFamily: ['arrive', 'arrival']
  },
  {
    id: 'a1_ask',
    word: 'ask',
    pos: 'v.',
    level: 'A1',
    meaningId: 'bertanya / meminta',
    phonetic: '/æsk/',
    phoneticSimple: 'ASK',
    simpleExplanation: 'Mengajukan pertanyaan atau memohon bantuan.',
    example: 'Feel free to ask whenever you feel confused.',
    exampleId: 'Jangan sungkan untuk bertanya kapan pun kamu merasa bingung.',
    speakingPrompt: 'Can I ask you a quick question?',
    wordFamily: ['ask']
  },
  {
    id: 'a1_beautiful',
    word: 'beautiful',
    pos: 'adj.',
    level: 'A1',
    meaningId: 'cantik / indah',
    phonetic: '/ˈbjuː.t̬ə.fəl/',
    phoneticSimple: 'BYOO-tuh-fuhl',
    simpleExplanation: 'Sangat enak dipandang mata atau memikat hati.',
    example: 'The sunset over the beach was beautiful.',
    exampleId: 'Matahari terbenam di atas pantai sangat indah.',
    speakingPrompt: 'What a beautiful morning today.',
    wordFamily: ['beauty', 'beautiful']
  },
  {
    id: 'a1_become',
    word: 'become',
    pos: 'v.',
    level: 'A1',
    meaningId: 'menjadi',
    phonetic: '/bɪˈkʌm/',
    phoneticSimple: 'bih-KUM',
    simpleExplanation: 'Mulai tumbuh atau beralih ke kondisi atau profesi baru.',
    example: 'Daily practice helps you become fluent in English.',
    exampleId: 'Latihan harian membantumu menjadi fasih berbahasa Inggris.',
    speakingPrompt: 'I want to become fluent in English.',
    wordFamily: ['become']
  },
  {
    id: 'a1_begin',
    word: 'begin',
    pos: 'v.',
    level: 'A1',
    meaningId: 'memulai / bermula',
    phonetic: '/bɪˈɡɪn/',
    phoneticSimple: 'bih-GIN',
    simpleExplanation: 'Mengawali pekerjaan, sesi belajar, atau kegiatan.',
    example: 'Let us begin today with ten new words.',
    exampleId: 'Mari kita mulai hari ini dengan sepuluh kata baru.',
    speakingPrompt: 'Let us begin our daily lesson.',
    wordFamily: ['begin', 'beginning']
  },
  {
    id: 'a1_believe',
    word: 'believe',
    pos: 'v.',
    level: 'A1',
    meaningId: 'percaya / yakin',
    phonetic: '/bɪˈliːv/',
    phoneticSimple: 'bih-LEEV',
    simpleExplanation: 'Yakin bahwa sesuatu itu benar atau seseorang mampu melakukannya.',
    example: 'I truly believe you can master these words.',
    exampleId: 'Saya benar-benar percaya kamu bisa menguasai kata-kata ini.',
    speakingPrompt: 'I believe in my own ability.',
    wordFamily: ['believe', 'belief']
  },
  {
    id: 'a1_build',
    word: 'build',
    pos: 'v.',
    level: 'A1',
    meaningId: 'membangun / membuat',
    phonetic: '/bɪld/',
    phoneticSimple: 'BILD',
    simpleExplanation: 'Mendirikan atau membentuk sesuatu langkah demi langkah.',
    example: 'Build your vocabulary one day at a time.',
    exampleId: 'Bangun kosakatamu sedikit demi sedikit setiap hari.',
    speakingPrompt: 'We can build strong habits together.',
    wordFamily: ['build', 'building']
  },
  {
    id: 'a1_choose',
    word: 'choose',
    pos: 'v.',
    level: 'A1',
    meaningId: 'memilih',
    phonetic: '/tʃuːz/',
    phoneticSimple: 'CHOOZ',
    simpleExplanation: 'Menentukan pilihan yang kamu sukai di antara beberapa opsi.',
    example: 'Choose the correct answer from the list below.',
    exampleId: 'Pilihlah jawaban yang benar dari daftar di bawah ini.',
    speakingPrompt: 'I choose to practice every day.',
    wordFamily: ['choose', 'choice']
  },
  {
    id: 'a1_clean',
    word: 'clean',
    pos: 'adj., v.',
    level: 'A1',
    meaningId: 'bersih / membersihkan',
    phonetic: '/kliːn/',
    phoneticSimple: 'KLEEN',
    simpleExplanation: 'Bebas dari kotoran atau tindakan menghilangkan kotoran.',
    example: 'Keep your study desk clean and organized.',
    exampleId: 'Jaga meja belajarmu tetap bersih dan teratur.',
    speakingPrompt: 'Drink clean fresh water every day.',
    wordFamily: ['clean']
  },
  {
    id: 'a1_common',
    word: 'common',
    pos: 'adj.',
    level: 'A1',
    meaningId: 'umum / lazim ditemui',
    phonetic: '/ˈkɑː.mən/',
    phoneticSimple: 'KAH-muhn',
    simpleExplanation: 'Sering dijumpai atau dialami oleh banyak orang.',
    example: 'Mistakes are common when learning a new language.',
    exampleId: 'Kesalahan adalah hal yang lumrah saat belajar bahasa baru.',
    speakingPrompt: 'These are the most common English words.',
    wordFamily: ['common', 'commonly']
  },

  // ===================== LEVEL A2 (Elementary) =====================
  {
    id: 'a2_ability',
    word: 'ability',
    pos: 'n.',
    level: 'A2',
    meaningId: 'kemampuan / keahlian',
    phonetic: '/əˈbɪl.ə.t̬i/',
    phoneticSimple: 'uh-BIL-uh-tee',
    simpleExplanation: 'Daya atau keterampilan untuk menyelesaikan sesuatu dengan baik.',
    example: 'She has great ability in public speaking.',
    exampleId: 'Dia memiliki kemampuan hebat dalam berbicara di depan umum.',
    speakingPrompt: 'Practice improves your speaking ability.',
    wordFamily: ['able', 'ability', 'unable']
  },
  {
    id: 'a2_able',
    word: 'able',
    pos: 'adj.',
    level: 'A2',
    meaningId: 'mampu / sanggup',
    phonetic: '/ˈeɪ.bəl/',
    phoneticSimple: 'AY-buhl',
    simpleExplanation: 'Mempunyai waktu, tenaga, atau keahlian untuk melakukan sesuatu.',
    example: 'Will you be able to come to the class tonight?',
    exampleId: 'Apakah kamu akan mampu datang ke kelas malam ini?',
    speakingPrompt: 'I am able to understand this sentence.',
    wordFamily: ['able', 'ability', 'unable']
  },
  {
    id: 'a2_accept',
    word: 'accept',
    pos: 'v.',
    level: 'A2',
    meaningId: 'menerima / menyetujui',
    phonetic: '/əkˈsept/',
    phoneticSimple: 'uk-SEPT',
    simpleExplanation: 'Bersedia menerima pemberian atau tawaran dari orang lain.',
    example: 'I happily accept your invitation.',
    exampleId: 'Saya dengan senang hati menerima undanganmu.',
    confusingPair: {
      targetWord: 'accept',
      confusedWith: 'except',
      targetMeaning: 'menerima (kata kerja)',
      confusedMeaning: 'kecuali / selain (preposisi)',
      explanation: 'ACCEPT adalah kata kerja untuk menerima. EXCEPT berarti selain dari / mengecualikan.',
      tip: 'Contoh: I accept the offer (menerima). Everyone agreed except John (kecuali).'
    },
    speakingPrompt: 'Please accept my apology.',
    wordFamily: ['accept', 'acceptable']
  },
  {
    id: 'a2_accident',
    word: 'accident',
    pos: 'n.',
    level: 'A2',
    meaningId: 'kecelakaan / musibah tak terduga',
    phonetic: '/ˈæk.sə.dənt/',
    phoneticSimple: 'AK-suh-duhnt',
    simpleExplanation: 'Peristiwa mendadak yang tidak disengaja dan menyebabkan cedera atau kerusakan.',
    example: 'He broke his arm in a bicycle accident.',
    exampleId: 'Lengannya patah karena kecelakaan sepeda.',
    speakingPrompt: 'It was just an unexpected accident.',
    wordFamily: ['accident']
  },
  {
    id: 'a2_achieve',
    word: 'achieve',
    pos: 'v.',
    level: 'A2',
    meaningId: 'mencapai / meraih hasil',
    phonetic: '/əˈtʃiːv/',
    phoneticSimple: 'uh-CHEEV',
    simpleExplanation: 'Berhasil menggapai cita-cita atau hasil positif setelah kerja keras.',
    example: 'I worked hard to achieve my goals.',
    exampleId: 'Saya bekerja keras untuk mencapai tujuan saya.',
    moreExamples: [
      { sentence: 'You can achieve anything if you stay consistent.', translation: 'Kamu bisa meraih apa pun jika tetap konsisten.' }
    ],
    speakingPrompt: 'I want to achieve my goals.',
    wordFamily: ['achieve', 'achievement']
  },
  {
    id: 'a2_act',
    word: 'act',
    pos: 'v. A2, n. B1',
    level: 'A2',
    meaningId: 'bertindak / bersikap',
    phonetic: '/ækt/',
    phoneticSimple: 'AKT',
    simpleExplanation: 'Mengambil langkah konkrit daripada sekadar berbicara.',
    example: 'We must act quickly to solve this problem.',
    exampleId: 'Kita harus bertindak cepat untuk menyelesaikan masalah ini.',
    speakingPrompt: 'It is time to act right now.',
    wordFamily: ['act', 'action', 'active', 'activity', 'actor']
  },
  {
    id: 'a2_active',
    word: 'active',
    pos: 'adj.',
    level: 'A2',
    meaningId: 'aktif / giat bergerak',
    phonetic: '/ˈæk.tɪv/',
    phoneticSimple: 'AK-tiv',
    simpleExplanation: 'Rajin berpartisipasi dan tidak bermalas-malasan.',
    example: 'She takes an active role in English discussions.',
    exampleId: 'Dia mengambil peran aktif dalam diskusi bahasa Inggris.',
    speakingPrompt: 'I enjoy living an active lifestyle.',
    wordFamily: ['act', 'action', 'active', 'activity', 'actor']
  },
  {
    id: 'a2_advantage',
    word: 'advantage',
    pos: 'n.',
    level: 'A2',
    meaningId: 'keuntungan / nilai lebih',
    phonetic: '/ədˈvæn.t̬ɪdʒ/',
    phoneticSimple: 'ud-VAN-tij',
    simpleExplanation: 'Kelebihan yang membuat posisi kita lebih unggul atau beruntung.',
    example: 'Speaking fluent English gives you a big career advantage.',
    exampleId: 'Fasih berbahasa Inggris memberi keuntungan karir yang besar bagimu.',
    speakingPrompt: 'Good knowledge is a strong advantage.',
    wordFamily: ['advantage', 'disadvantage']
  },
  {
    id: 'a2_although',
    word: 'although',
    pos: 'conj.',
    level: 'A2',
    meaningId: 'meskipun / walaupun',
    phonetic: '/ɔːlˈðoʊ/',
    phoneticSimple: 'awl-THOH',
    simpleExplanation: 'Kata hubung untuk menghubungkan dua pernyataan yang bertolak belakang.',
    example: 'Although it was raining, we enjoyed our morning jog.',
    exampleId: 'Meskipun hari hujan, kami tetap menikmati lari pagi kami.',
    speakingPrompt: 'Although it is challenging, I will not quit.',
    wordFamily: ['although']
  },
  {
    id: 'a2_borrow',
    word: 'borrow',
    pos: 'v.',
    level: 'A2',
    meaningId: 'meminjam (menerima pinjaman)',
    phonetic: '/ˈbɑːr.oʊ/',
    phoneticSimple: 'BAHR-oh',
    simpleExplanation: 'Mengambil barang milik orang lain untuk sementara waktu dengan izin.',
    example: 'May I borrow your dictionary for five minutes?',
    exampleId: 'Bolehkah saya meminjam kamusmu selama lima menit?',
    confusingPair: {
      targetWord: 'borrow',
      confusedWith: 'lend',
      targetMeaning: 'meminjam (dari orang lain / take in)',
      confusedMeaning: 'meminjamkan (ke orang lain / give out, A2)',
      explanation: 'Ingat arahnya: Kamu BORROW dari temanmu (menerima). Temanmu LEND kepadamu (memberikan).',
      tip: 'Contoh: Can I borrow your umbrella? (Bolehkah aku pinjam payungmu?)'
    },
    speakingPrompt: 'Can I borrow your pen for a moment?',
    wordFamily: ['borrow']
  },
  {
    id: 'a2_lend',
    word: 'lend',
    pos: 'v.',
    level: 'A2',
    meaningId: 'meminjamkan (memberi pinjaman)',
    phonetic: '/lend/',
    phoneticSimple: 'LEND',
    simpleExplanation: 'Memberikan sesuatu milikmu kepada orang lain untuk dipakai sementara.',
    example: 'She agreed to lend me her car for the weekend.',
    exampleId: 'Dia setuju meminjamkan mobilnya padaku untuk akhir pekan.',
    confusingPair: {
      targetWord: 'lend',
      confusedWith: 'borrow',
      targetMeaning: 'meminjamkan (memberikan barang)',
      confusedMeaning: 'meminjam (menerima barang, A2)',
      explanation: 'LEND berarti meminjamkan barang milikmu kepada orang lain.',
      tip: 'Contoh: I can lend you my notes (Saya bisa meminjamkan catatan saya padamu).'
    },
    speakingPrompt: 'I can lend you my favorite book.',
    wordFamily: ['lend']
  },
  {
    id: 'a2_avoid',
    word: 'avoid',
    pos: 'v.',
    level: 'A2',
    meaningId: 'menghindari / menjauhi',
    phonetic: '/əˈvɔɪd/',
    phoneticSimple: 'uh-VOYD',
    simpleExplanation: 'Berupaya agar tidak terkena atau tidak melakukan hal yang berisiko.',
    example: 'You should avoid procrastinating on your studies.',
    exampleId: 'Kamu sebaiknya menghindari menunda-nunda belajarmu.',
    speakingPrompt: 'I avoid drinking cold water at night.',
    wordFamily: ['avoid']
  },
  {
    id: 'a2_careful',
    word: 'careful',
    pos: 'adj.',
    level: 'A2',
    meaningId: 'hati-hati / waspada',
    phonetic: '/ˈker.fəl/',
    phoneticSimple: 'KAIR-fuhl',
    simpleExplanation: 'Penuh perhatian agar tidak celaka atau membuat kesalahan.',
    example: 'Please be careful when driving in the dark.',
    exampleId: 'Harap berhati-hati saat menyetir dalam kegelapan.',
    speakingPrompt: 'Be careful with what you say.',
    wordFamily: ['care', 'careful', 'carefully', 'careless']
  },
  {
    id: 'a2_choice',
    word: 'choice',
    pos: 'n.',
    level: 'A2',
    meaningId: 'pilihan / opsi',
    phonetic: '/tʃɔɪs/',
    phoneticSimple: 'CHOYS',
    simpleExplanation: 'Kesempatan atau hak untuk memilih salah satu opsi.',
    example: 'Learning English was the best choice I ever made.',
    exampleId: 'Belajar bahasa Inggris adalah pilihan terbaik yang pernah saya buat.',
    speakingPrompt: 'You always have a choice.',
    wordFamily: ['choose', 'choice']
  },
  {
    id: 'a2_decision',
    word: 'decision',
    pos: 'n.',
    level: 'A2',
    meaningId: 'keputusan',
    phonetic: '/dɪˈsɪʒ.ən/',
    phoneticSimple: 'dih-SIZH-uhn',
    simpleExplanation: 'Pilihan akhir yang diputuskan setelah mempertimbangkannya.',
    example: 'It was a difficult decision, but it was right.',
    exampleId: 'Itu keputusan yang sulit, tapi keputusan itu tepat.',
    speakingPrompt: 'I have made my final decision.',
    wordFamily: ['decide', 'decision']
  },
  {
    id: 'a2_develop',
    word: 'develop',
    pos: 'v.',
    level: 'A2',
    meaningId: 'mengembangkan / memajukan',
    phonetic: '/dɪˈvel.əp/',
    phoneticSimple: 'dih-VEL-uhp',
    simpleExplanation: 'Menumbuhkan atau meningkatkan sesuatu agar lebih baik dan matang.',
    example: 'Daily speaking helps develop your confidence.',
    exampleId: 'Berbicara setiap hari membantu mengembangkan rasa percaya dirimu.',
    speakingPrompt: 'We need to develop new skills.',
    wordFamily: ['develop', 'development']
  },
  {
    id: 'a2_improve',
    word: 'improve',
    pos: 'v.',
    level: 'A1',
    meaningId: 'meningkatkan / memperbaiki',
    phonetic: '/ɪmˈpruːv/',
    phoneticSimple: 'im-PROOV',
    simpleExplanation: 'Membuat mutu atau kemampuan menjadi lebih hebat dari sebelumnya.',
    example: 'I want to improve my English vocabulary score.',
    exampleId: 'Saya ingin meningkatkan skor kosakata bahasa Inggris saya.',
    speakingPrompt: 'Every day I improve a little bit.',
    wordFamily: ['improve', 'improvement']
  },
  {
    id: 'a2_manage',
    word: 'manage',
    pos: 'v.',
    level: 'A2',
    meaningId: 'mengelola / berhasil mengatasi',
    phonetic: '/ˈmæn.ədʒ/',
    phoneticSimple: 'MAN-ij',
    simpleExplanation: 'Mengatur sumber daya atau berhasil menyelesaikan tugas berat.',
    example: 'How do you manage your study time effectively?',
    exampleId: 'Bagaimana caramu mengelola waktu belajar secara efektif?',
    speakingPrompt: 'I can manage this task easily.',
    wordFamily: ['manage', 'manager', 'management']
  },

  // ===================== LEVEL B1 (Intermediate) =====================
  {
    id: 'b1_achievement',
    word: 'achievement',
    pos: 'n.',
    level: 'B1',
    meaningId: 'pencapaian / prestasi',
    phonetic: '/əˈtʃiːv.mənt/',
    phoneticSimple: 'uh-CHEEV-muhnt',
    simpleExplanation: 'Sesuatu yang membanggakan yang berhasil diraih dengan jerih payah.',
    example: 'Finishing the Oxford 3000 is a huge achievement.',
    exampleId: 'Menyelesaikan Oxford 3000 adalah pencapaian yang sangat besar.',
    collocations: [
      { phrase: 'great achievement', meaningId: 'pencapaian besar / luar biasa' },
      { phrase: 'sense of achievement', meaningId: 'rasa bangga atas pencapaian' },
      { phrase: 'academic achievement', meaningId: 'prestasi akademik' }
    ],
    speakingPrompt: 'This is a proud achievement for our team.',
    wordFamily: ['achieve', 'achievement']
  },
  {
    id: 'b1_afford',
    word: 'afford',
    pos: 'v.',
    level: 'B1',
    meaningId: 'mampu membeli / menyanggupi biaya',
    phonetic: '/əˈfɔːrd/',
    phoneticSimple: 'uh-FORD',
    simpleExplanation: 'Memiliki anggaran uang atau waktu yang cukup untuk sesuatu.',
    example: "I can't afford a new laptop this month.",
    exampleId: 'Saya belum mampu membeli laptop baru bulan ini.',
    moreExamples: [
      { sentence: 'We cannot afford to waste any more time.', translation: 'Kita tidak bisa menyia-nyiakan waktu lagi.' }
    ],
    collocations: [
      { phrase: 'can afford to', meaningId: 'mampu / sanggup untuk' },
      { phrase: 'cannot afford to lose', meaningId: 'tidak boleh sampai kehilangan / rugi' }
    ],
    speakingPrompt: "I can't afford a new laptop right now.",
    wordFamily: ['afford']
  },
  {
    id: 'b1_aware',
    word: 'aware',
    pos: 'adj.',
    level: 'B1',
    meaningId: 'sadar / waspada / mengetahui',
    phonetic: '/əˈwer/',
    phoneticSimple: 'uh-WAIR',
    simpleExplanation: 'Memiliki kesadaran atau tahu persis tentang situasi yang sedang terjadi.',
    example: 'Learners are aware of the importance of consistency.',
    exampleId: 'Para pelajar menyadari pentingnya konsistensi.',
    collocations: [
      { phrase: 'fully aware', meaningId: 'sadar / paham sepenuhnya' },
      { phrase: 'aware of the risk', meaningId: 'menyadari risiko yang ada' },
      { phrase: 'make someone aware', meaningId: 'menyadarkan / memberi tahu seseorang' }
    ],
    speakingPrompt: 'I am fully aware of my responsibilities.',
    wordFamily: ['aware']
  },
  {
    id: 'b1_benefit',
    word: 'benefit',
    pos: 'n. A2, v. B1',
    level: 'B1',
    meaningId: 'manfaat / menguntungkan',
    phonetic: '/ˈben.ə.fɪt/',
    phoneticSimple: 'BEN-uh-fit',
    simpleExplanation: 'Dampak positif yang didapat dari suatu kebiasaan atau perbuatan.',
    example: 'Daily reading will benefit your language comprehension.',
    exampleId: 'Membaca setiap hari akan bermanfaat bagi pemahaman bahasamu.',
    speakingPrompt: 'Learning English brings lifelong benefits.',
    wordFamily: ['benefit']
  },
  {
    id: 'b1_challenge',
    word: 'challenge',
    pos: 'n. B1, v. B2',
    level: 'B1',
    meaningId: 'tantangan / menantang',
    phonetic: '/ˈtʃæl.ɪndʒ/',
    phoneticSimple: 'CHAL-inj',
    simpleExplanation: 'Tugas yang baru dan sulit yang menguji kemampuan kita.',
    example: 'I am ready to accept this vocabulary challenge.',
    exampleId: 'Saya siap menerima tantangan kosakata ini.',
    speakingPrompt: 'I enjoy taking on a new challenge.',
    wordFamily: ['challenge']
  },
  {
    id: 'b1_compete',
    word: 'compete',
    pos: 'v.',
    level: 'A2',
    meaningId: 'bersaing / berlomba',
    phonetic: '/kəmˈpiːt/',
    phoneticSimple: 'kuhm-PEET',
    simpleExplanation: 'Berusaha keras mengalahkan lawan dalam sebuah ajang.',
    example: 'Athletes from all over the country compete here.',
    exampleId: 'Atlet dari seluruh penjuru negeri berkompetisi di sini.',
    speakingPrompt: 'They compete with true sportsmanship.',
    wordFamily: ['compete', 'competition', 'competitive', 'competitor']
  },
  {
    id: 'b1_competition',
    word: 'competition',
    pos: 'n.',
    level: 'A2',
    meaningId: 'kompetisi / persaingan',
    phonetic: '/ˌkɑːm.pəˈtɪʃ.ən/',
    phoneticSimple: 'kahm-puh-TISH-uhn',
    simpleExplanation: 'Peristiwa perlombaan untuk memperebutkan kemenangan.',
    example: 'She won the English speech competition.',
    exampleId: 'Dia memenangkan kompetisi pidato bahasa Inggris.',
    speakingPrompt: 'The competition was intense but exciting.',
    wordFamily: ['compete', 'competition', 'competitive', 'competitor']
  },
  {
    id: 'b1_despite',
    word: 'despite',
    pos: 'prep.',
    level: 'B1',
    meaningId: 'meskipun / terlepas dari',
    phonetic: '/dɪˈspaɪt/',
    phoneticSimple: 'dih-SPYT',
    simpleExplanation: 'Terjadi walau ada kendala (diikuti kata benda/frasa benda, tanpa kata kerja).',
    example: 'Despite feeling tired, she finished her daily practice.',
    exampleId: 'Meskipun merasa lelah, dia menyelesaikan latihan hariannya.',
    confusingPair: {
      targetWord: 'despite',
      confusedWith: 'although',
      targetMeaning: 'meskipun (preposisi + kata benda)',
      confusedMeaning: 'meskipun (konjungsi + kalimat lengkap S+V, A2)',
      explanation: 'Gunakan DESPITE + Noun (contoh: despite the rain). Gunakan ALTHOUGH + Subjek + Verb (contoh: although it rained). Jangan pernah menulis "despite of"!',
      tip: 'Benar: despite the noise. Salah: despite of the noise.'
    },
    speakingPrompt: 'He succeeded despite many obstacles.',
    wordFamily: ['despite']
  },
  {
    id: 'b1_education',
    word: 'education',
    pos: 'n.',
    level: 'A2',
    meaningId: 'pendidikan',
    phonetic: '/ˌedʒ.ʊˈkeɪ.ʃən/',
    phoneticSimple: 'ej-oo-KAY-shun',
    simpleExplanation: 'Pemberian ilmu, pengajaran, dan latihan sistematis.',
    example: 'Higher education opens global opportunities.',
    exampleId: 'Pendidikan tinggi membuka peluang-peluang global.',
    speakingPrompt: 'Quality education is a right for all.',
    wordFamily: ['educate', 'educated', 'education', 'educational']
  },
  {
    id: 'b1_encourage',
    word: 'encourage',
    pos: 'v.',
    level: 'B1',
    meaningId: 'mendorong / menyemangati',
    phonetic: '/ɪnˈkɝː.ɪdʒ/',
    phoneticSimple: 'in-KUR-ij',
    simpleExplanation: 'Memberi rasa percaya diri dan dukungan moral kepada seseorang.',
    example: 'A good tutor will always encourage you to speak up.',
    exampleId: 'Tutor yang baik akan selalu menyemangatimu untuk berani berbicara.',
    speakingPrompt: 'My friends encourage me to keep going.',
    wordFamily: ['courage', 'encourage']
  },
  {
    id: 'b1_essential',
    word: 'essential',
    pos: 'adj.',
    level: 'B1',
    meaningId: 'sangat penting / esensial',
    phonetic: '/ɪˈsen.ʃəl/',
    phoneticSimple: 'ih-SEN-shuhl',
    simpleExplanation: 'Sesuatu yang mutlak diperlukan dan tidak bisa diabaikan.',
    example: 'Vocabulary is essential for clear communication.',
    exampleId: 'Kosakata sangat penting untuk komunikasi yang jelas.',
    speakingPrompt: 'Good sleep is essential for memory retention.',
    wordFamily: ['essential']
  },
  {
    id: 'b1_reliable',
    word: 'reliable',
    pos: 'adj.',
    level: 'B1',
    meaningId: 'dapat diandalkan / terpercaya',
    phonetic: '/rɪˈlaɪ.ə.bəl/',
    phoneticSimple: 'rih-LY-uh-buhl',
    simpleExplanation: 'Bisa dipercaya karena selalu memberikan hasil yang konsisten baik.',
    example: 'The Oxford 3000 is a reliable list for English learners.',
    exampleId: 'Oxford 3000 adalah daftar terpercaya bagi pembelajar bahasa Inggris.',
    speakingPrompt: 'He is a very reliable coworker.',
    wordFamily: ['rely', 'reliable']
  },

  // ===================== LEVEL B2 (Upper Intermediate) =====================
  {
    id: 'b2_abandon',
    word: 'abandon',
    pos: 'v.',
    level: 'B2',
    meaningId: 'meninggalkan / membatalkan',
    phonetic: '/əˈbæn.dən/',
    phoneticSimple: 'uh-BAN-duhn',
    simpleExplanation: 'Meninggalkan seseorang atau rencana sebelum selesai karena situasi genting.',
    example: 'Never abandon your learning journey when things get tough.',
    exampleId: 'Jangan pernah meninggalkan perjalanan belajarmu saat keadaan terasa sulit.',
    speakingPrompt: 'Never abandon your long-term dreams.',
    wordFamily: ['abandon']
  },
  {
    id: 'b2_acquire',
    word: 'acquire',
    pos: 'v.',
    level: 'B2',
    meaningId: 'memperoleh / menguasai ilmu',
    phonetic: '/əˈkwaɪ.ɚ/',
    phoneticSimple: 'uh-KWY-er',
    simpleExplanation: 'Mendapatkan keahlian atau pemahaman baru melalui proses belajar panjang.',
    example: 'It takes time and steady practice to acquire a new language.',
    exampleId: 'Dibutuhkan waktu dan latihan konsisten untuk menguasai bahasa baru.',
    speakingPrompt: 'We acquire knowledge through experience.',
    wordFamily: ['acquire']
  },
  {
    id: 'b2_capable',
    word: 'capable',
    pos: 'adj.',
    level: 'B2',
    meaningId: 'mampu / cakap kompeten',
    phonetic: '/ˈkeɪ.pə.bəl/',
    phoneticSimple: 'KAY-puh-buhl',
    simpleExplanation: 'Mempunyai kesiapan mental atau kecakapan teknis untuk tugas berat.',
    example: 'You are capable of mastering advanced English with practice.',
    exampleId: 'Kamu mampu menguasai bahasa Inggris tingkat lanjut dengan latihan.',
    speakingPrompt: 'I am capable of overcoming this difficulty.',
    wordFamily: ['capable', 'capacity']
  },
  {
    id: 'b2_crucial',
    word: 'crucial',
    pos: 'adj.',
    level: 'B2',
    meaningId: 'sangat menentukan / krusial',
    phonetic: '/ˈkruː.ʃəl/',
    phoneticSimple: 'KROO-shuhl',
    simpleExplanation: 'Sangat vital sehingga keberhasilan bergantung pada hal tersebut.',
    example: 'Spaced repetition is crucial for long-term memory.',
    exampleId: 'Pengulangan berjarak (spaced repetition) sangat menentukan ingatan jangka panjang.',
    speakingPrompt: 'Daily review is crucial for vocabulary growth.',
    wordFamily: ['crucial']
  },
  {
    id: 'b2_determine',
    word: 'determine',
    pos: 'v.',
    level: 'B1',
    meaningId: 'menentukan / memastikan arah',
    phonetic: '/dɪˈtɝː.mɪn/',
    phoneticSimple: 'dih-TUR-min',
    simpleExplanation: 'Menjadi faktor kunci yang menetapkan hasil akhir.',
    example: 'Your persistence will determine how fast you improve.',
    exampleId: 'Ketekunanmu akan menentukan seberapa cepat kamu meningkat.',
    speakingPrompt: 'Your choices determine your destiny.',
    wordFamily: ['determine', 'determined']
  },
  {
    id: 'b2_dominate',
    word: 'dominate',
    pos: 'v.',
    level: 'B2',
    meaningId: 'mendominasi / menguasai',
    phonetic: '/ˈdɑː.mə.neɪt/',
    phoneticSimple: 'DAH-muh-nayt',
    simpleExplanation: 'Menjadi pengaruh terkuat atau yang paling menonjol.',
    example: 'English continues to dominate global communication.',
    exampleId: 'Bahasa Inggris terus mendominasi komunikasi global.',
    speakingPrompt: 'They dominated the entire discussion.',
    wordFamily: ['dominate']
  },
  {
    id: 'b2_enhance',
    word: 'enhance',
    pos: 'v.',
    level: 'B2',
    meaningId: 'meningkatkan mutu / memperbagus',
    phonetic: '/ɪnˈhæns/',
    phoneticSimple: 'in-HANS',
    simpleExplanation: 'Menambah nilai lebih atau menyempurnakan kualitas.',
    example: 'Reading authentic articles will enhance your vocabulary.',
    exampleId: 'Membaca artikel asli akan memperbagus kosakatamu.',
    speakingPrompt: 'This method will enhance your pronunciation.',
    wordFamily: ['enhance']
  },
  {
    id: 'b2_evaluate',
    word: 'evaluate',
    pos: 'v.',
    level: 'B2',
    meaningId: 'mengevaluasi / menilai hasil',
    phonetic: '/ɪˈvæl.ju.eɪt/',
    phoneticSimple: 'ih-VAL-yoo-ayt',
    simpleExplanation: 'Mengamati dan menilai kemajuan secara kritis dan objektif.',
    example: 'Take a quiz to evaluate your vocabulary retention.',
    exampleId: 'Ikuti kuis untuk mengevaluasi daya ingat kosakatamu.',
    speakingPrompt: 'We must evaluate each option carefully.',
    wordFamily: ['evaluate']
  },
  {
    id: 'b2_maintain',
    word: 'maintain',
    pos: 'v.',
    level: 'B2',
    meaningId: 'mempertahankan / memelihara',
    phonetic: '/meɪnˈteɪn/',
    phoneticSimple: 'mayn-TAYN',
    simpleExplanation: 'Menjaga agar kebiasaan baik atau standar tetap berjalan stabil.',
    example: 'It is vital to maintain your daily study streak.',
    exampleId: 'Sangat penting untuk mempertahankan rekor belajar harianmu.',
    speakingPrompt: 'Try to maintain your daily focus.',
    wordFamily: ['maintain']
  },
  {
    id: 'b2_pursue',
    word: 'pursue',
    pos: 'v.',
    level: 'B2',
    meaningId: 'mengejar / menekuni (karir/cita-cita)',
    phonetic: '/pɚˈsuː/',
    phoneticSimple: 'per-SOO',
    simpleExplanation: 'Terus berusaha tanpa henti demi meraih target besar masa depan.',
    example: 'She moved abroad to pursue her master degree.',
    exampleId: 'Dia pindah ke luar negeri untuk mengejar gelar masternya.',
    speakingPrompt: 'Always pursue your deepest passion.',
    wordFamily: ['pursue']
  },
  {
    id: 'b2_struggle',
    word: 'struggle',
    pos: 'v., n.',
    level: 'B2',
    meaningId: 'berjuang / mengalami kesulitan',
    phonetic: '/ˈstrʌɡ.əl/',
    phoneticSimple: 'STRUHG-uhl',
    simpleExplanation: 'Berupaya sekuat tenaga saat menghadapi materi atau situasi yang berat.',
    example: 'Do not be discouraged when you struggle with new words.',
    exampleId: 'Jangan berkecil hati saat kamu kesulitan dengan kata-kata baru.',
    speakingPrompt: 'Every master once had to struggle.',
    wordFamily: ['struggle']
  }
];

export const CONFUSING_PAIRS = [
  {
    targetWord: 'borrow',
    confusedWith: 'lend',
    targetMeaning: 'meminjam (menerima dari orang lain)',
    confusedMeaning: 'meminjamkan (memberi ke orang lain)',
    explanation: 'Borrow = take in (kamu meminjam). Lend = give out (kamu yang meminjamkan).',
    tip: 'Bolehkah saya meminjam? -> Can I borrow...? / Bisakah kamu meminjamkanku? -> Can you lend me...?'
  },
  {
    targetWord: 'advice',
    confusedWith: 'advise',
    targetMeaning: 'nasihat / saran (kata benda / noun)',
    confusedMeaning: 'menasihati (kata kerja / verb)',
    explanation: 'Advice dengan huruf C adalah kata benda (noun). Advise dengan huruf S adalah kata kerja (verb).',
    tip: 'I need your advice (noun). She advised me to stay calm (verb).'
  },
  {
    targetWord: 'accept',
    confusedWith: 'except',
    targetMeaning: 'menerima (kata kerja)',
    confusedMeaning: 'kecuali / selain dari (preposisi)',
    explanation: 'Accept berarti menerima sesuatu dengan tangan terbuka. Except berarti mengecualikan sesuatu.',
    tip: 'I accept your gift. All students passed except two.'
  },
  {
    targetWord: 'despite',
    confusedWith: 'although',
    targetMeaning: 'meskipun (preposisi + kata benda)',
    confusedMeaning: 'meskipun (konjungsi + subjek + kata kerja)',
    explanation: 'Despite diikuti noun/gerund (contoh: despite the rain). Meskipun diikuti klausa lengkap (contoh: although it rained).',
    tip: 'Jangan pernah gunakan "despite of" — itu salah! Cukup tulis "despite".'
  }
];

export const OXFORD_WORDS: OxfordWord[] = [
  ...CORE_OXFORD_WORDS,
  ...OXFORD_EXPANDED_WORDS.filter(
    (w) => !CORE_OXFORD_WORDS.some((c) => c.word.toLowerCase() === w.word.toLowerCase())
  )
];

export const WORD_FAMILIES = [
  {
    root: 'act',
    words: [
      { word: 'act', pos: 'v. A2, n. B1', level: 'A2' as const },
      { word: 'action', pos: 'n.', level: 'A1' as const },
      { word: 'active', pos: 'adj.', level: 'A2' as const },
      { word: 'activity', pos: 'n.', level: 'A1' as const },
      { word: 'actor', pos: 'n.', level: 'A1' as const }
    ]
  },
  {
    root: 'achieve',
    words: [
      { word: 'achieve', pos: 'v.', level: 'A2' as const },
      { word: 'achievement', pos: 'n.', level: 'B1' as const }
    ]
  },
  {
    root: 'compete',
    words: [
      { word: 'compete', pos: 'v.', level: 'A2' as const },
      { word: 'competition', pos: 'n.', level: 'A2' as const },
      { word: 'competitive', pos: 'adj.', level: 'B1' as const },
      { word: 'competitor', pos: 'n.', level: 'B1' as const }
    ]
  },
  {
    root: 'educate',
    words: [
      { word: 'educate', pos: 'v.', level: 'B1' as const },
      { word: 'educated', pos: 'adj.', level: 'B1' as const },
      { word: 'education', pos: 'n.', level: 'A2' as const },
      { word: 'educational', pos: 'adj.', level: 'B1' as const }
    ]
  },
  {
    root: 'care',
    words: [
      { word: 'care', pos: 'n., v.', level: 'A2' as const },
      { word: 'careful', pos: 'adj.', level: 'A2' as const },
      { word: 'carefully', pos: 'adv.', level: 'A2' as const },
      { word: 'careless', pos: 'adj.', level: 'B1' as const }
    ]
  }
];

export const CEFR_LEVEL_METADATA: Record<
  CEFRLevel,
  { name: string; icon: string; description: string; badgeBg: string; color: string }
> = {
  A1: {
    name: 'Beginner',
    icon: '🌱',
    description: 'Kosakata dasar sehari-hari untuk pemula',
    badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    color: 'emerald'
  },
  A2: {
    name: 'Elementary',
    icon: '🌿',
    description: 'Kosakata praktis untuk percakapan umum',
    badgeBg: 'bg-teal-50 text-teal-700 border-teal-200',
    color: 'teal'
  },
  B1: {
    name: 'Intermediate',
    icon: '🌳',
    description: 'Kosakata mandiri untuk opini & pengalaman kerja',
    badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
    color: 'sky'
  },
  B2: {
    name: 'Upper Intermediate',
    icon: '🚀',
    description: 'Kosakata tingkat lanjut & argumen mendalam',
    badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    color: 'indigo'
  }
};
