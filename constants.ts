import { CakeFlavor } from './types';

export const CONFIG = {
  FRIEND_NAME: "Buubaa",
  // Format: YYYY-MM-DDTHH:mm:ss
  BIRTH_DATE: "2000-12-01T00:00:00", 
  FINAL_WISH_TEXT: "I hope your 25th year is absolutely incredible. You've grown so much and achieved amazing things. Can't wait to see what you do next. Eat lots of cake! 🎉"
};

export const CAKE_FLAVORS: CakeFlavor[] = [
  { id: 'chocolate', name: 'Chocolate', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=600&q=80' },
  { id: 'blackforest', name: 'Black Forest', image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?auto=format&fit=crop&w=600&q=80' },
  { id: 'redvelvet', name: 'Red Velvet', image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?auto=format&fit=crop&w=600&q=80' },
  { id: 'blueberry', name: 'Blueberry', image: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?auto=format&fit=crop&w=600&q=80' },
  { id: 'lotus', name: 'Lotus Biscoff Cheesecake', image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?auto=format&fit=crop&w=600&q=80' },
];

export const AUDIO_URLS = {
  CHEER: "https://actions.google.com/sounds/v1/crowds/cheering_and_clapping.ogg",
  PIANO: "https://upload.wikimedia.org/wikipedia/commons/6/6e/Happy_Birthday_to_You_-_piano.ogg"
};