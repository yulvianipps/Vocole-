import { TopicCategory, TopicInfo, OxfordWord } from '../types';

export const TOPICS: TopicInfo[] = [
  {
    id: 'daily_life',
    name: 'Daily Life & Home',
    nameId: 'Rutinitas & Rumah',
    icon: '🏠',
    description: 'Kosakata seputar kegiatan harian, kebiasaan, waktu, dan rumah tangga.',
    color: 'emerald',
    keywords: [
      'about', 'activity', 'address', 'after', 'afternoon', 'again', 'age', 'all',
      'already', 'always', 'and', 'another', 'any', 'anyone', 'anything', 'around',
      'back', 'bed', 'before', 'begin', 'book', 'both', 'boy', 'break', 'brother',
      'call', 'change', 'clean', 'clock', 'close', 'clothes', 'come', 'day', 'do',
      'door', 'early', 'end', 'every', 'family', 'father', 'get', 'give', 'go',
      'habit', 'happen', 'have', 'help', 'home', 'house', 'late', 'leave', 'life',
      'live', 'look', 'make', 'minute', 'morning', 'mother', 'night', 'open', 'put',
      'ready', 'routine', 'see', 'sleep', 'start', 'take', 'time', 'today', 'wake',
      'wash', 'watch', 'water', 'weekend', 'window', 'year'
    ]
  },
  {
    id: 'work_business',
    name: 'Work, Career & Tech',
    nameId: 'Pekerjaan, Karir & Bisnis',
    icon: '💼',
    description: 'Istilah esensial dalam lingkungan kantor, rapat, proyek, dan karier modern.',
    color: 'indigo',
    keywords: [
      'action', 'agree', 'aim', 'apply', 'available', 'balance', 'benefit', 'boss',
      'brief', 'budget', 'business', 'career', 'choice', 'colleague', 'company',
      'complete', 'computer', 'contact', 'create', 'deadline', 'deal', 'decision',
      'demand', 'detail', 'develop', 'document', 'effort', 'email', 'employ',
      'employee', 'experience', 'expert', 'focus', 'goal', 'grow', 'improve',
      'income', 'industry', 'information', 'interview', 'job', 'leader', 'manage',
      'manager', 'meeting', 'message', 'office', 'opportunity', 'organize', 'plan',
      'prepare', 'presentation', 'problem', 'project', 'report', 'salary', 'schedule',
      'skill', 'staff', 'success', 'target', 'task', 'team', 'work'
    ]
  },
  {
    id: 'food_dining',
    name: 'Food, Dining & Shopping',
    nameId: 'Makanan, Restoran & Belanja',
    icon: '☕',
    description: 'Percakapan memesan makanan, cita rasa, belanja kebutuhan, dan harga.',
    color: 'amber',
    keywords: [
      'apple', 'bake', 'bill', 'bread', 'breakfast', 'buy', 'cafe', 'cash', 'cheap',
      'cheese', 'chicken', 'choose', 'coffee', 'cook', 'cost', 'cup', 'customer',
      'delicious', 'diet', 'dinner', 'dish', 'drink', 'eat', 'expensive', 'flavor',
      'food', 'fresh', 'fruit', 'grocery', 'hungry', 'lunch', 'market', 'meal',
      'meat', 'menu', 'milk', 'order', 'pay', 'price', 'product', 'quality',
      'receipt', 'recipe', 'restaurant', 'rice', 'sale', 'shop', 'snack', 'spend',
      'store', 'sugar', 'supermarket', 'sweet', 'taste', 'tea', 'vegetable', 'water'
    ]
  },
  {
    id: 'travel',
    name: 'Travel & Navigation',
    nameId: 'Perjalanan & Transportasi',
    icon: '✈️',
    description: 'Menanyakan arah, memesan tiket, bandara, hotel, dan menjelajahi tempat baru.',
    color: 'sky',
    keywords: [
      'abroad', 'airport', 'arrive', 'beach', 'bicycle', 'bus', 'car', 'city',
      'country', 'depart', 'direction', 'distance', 'drive', 'flight', 'guide',
      'hotel', 'island', 'journey', 'lake', 'left', 'luggage', 'map', 'mountain',
      'move', 'nature', 'near', 'ocean', 'pack', 'park', 'passenger', 'passport',
      'place', 'plane', 'reach', 'reservation', 'right', 'road', 'route', 'sea',
      'station', 'stop', 'street', 'ticket', 'tour', 'tourist', 'traffic', 'train',
      'travel', 'trip', 'vacation', 'visit', 'walk', 'way'
    ]
  },
  {
    id: 'feelings_social',
    name: 'Feelings & Socializing',
    nameId: 'Perasaan, Opini & Hubungan',
    icon: '💬',
    description: 'Mengekspresikan emosi, pendapat, pertemanan, dan diskusi sosial santai.',
    color: 'rose',
    keywords: [
      'accept', 'admire', 'afraid', 'agree', 'angry', 'apology', 'argue', 'attitude',
      'believe', 'care', 'comfort', 'confidence', 'connect', 'disagree', 'discuss',
      'doubt', 'emotion', 'encourage', 'enjoy', 'excited', 'fear', 'feel', 'feeling',
      'forgive', 'friend', 'friendly', 'glad', 'grateful', 'happy', 'hate', 'honest',
      'hope', 'humor', 'impress', 'interest', 'kind', 'laugh', 'lonely', 'love',
      'mood', 'nervous', 'opinion', 'patience', 'peace', 'pleasure', 'polite',
      'proud', 'relationship', 'respect', 'sad', 'share', 'smile', 'sorry', 'surprise',
      'sympathy', 'trust', 'upset', 'worry'
    ]
  },
  {
    id: 'health_nature',
    name: 'Health, Wellness & Body',
    nameId: 'Kesehatan, Tubuh & Alam',
    icon: '🏃',
    description: 'Istilah kesehatan jasmani, olahraga, kondisi fisik, dan lingkungan sekitar.',
    color: 'teal',
    keywords: [
      'active', 'air', 'body', 'breath', 'calm', 'checkup', 'clean', 'clinic',
      'cold', 'cure', 'disease', 'doctor', 'energy', 'exercise', 'fit', 'fitness',
      'gym', 'habit', 'headache', 'heal', 'health', 'healthy', 'hospital', 'hurt',
      'ill', 'illness', 'injury', 'medicine', 'muscle', 'natural', 'nature',
      'nurse', 'pain', 'patient', 'physical', 'protect', 'recover', 'rest', 'run',
      'safe', 'sick', 'sport', 'strength', 'strong', 'sun', 'symptom', 'tired',
      'treat', 'treatment', 'virus', 'walk', 'warm', 'weak', 'well'
    ]
  }
];

/**
 * Returns matching topics for a given word.
 * If word or wordFamily matches topic keywords, returns that topic.
 */
export function getTopicsForWord(word: OxfordWord): TopicCategory[] {
  const matched: TopicCategory[] = [];
  const cleanWord = word.word.toLowerCase();
  const families = (word.wordFamily || []).map((f) => f.toLowerCase());
  const allRelated = [cleanWord, ...families];

  for (const topic of TOPICS) {
    const isMatched = allRelated.some((w) => topic.keywords.includes(w));
    if (isMatched) {
      matched.push(topic.id);
    }
  }

  // Default fallback if no explicit match
  if (matched.length === 0) {
    if (word.level === 'A1') return ['daily_life'];
    if (word.level === 'A2') return ['food_dining', 'daily_life'];
    if (word.level === 'B1') return ['work_business', 'feelings_social'];
    return ['work_business', 'health_nature'];
  }

  return matched;
}
