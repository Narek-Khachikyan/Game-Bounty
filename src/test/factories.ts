import type { GameData } from '../@types/types';

export const createGame = (overrides: Partial<GameData> = {}): GameData => ({
   id: 42,
   name: 'Hades',
   released: '2020-09-17',
   background_image: 'https://images.example/hades.jpg',
   metacritic: 93,
   platforms: [
      {
         platform: {
            id: 4,
            name: 'PC',
         },
      },
   ],
   ...overrides,
});
