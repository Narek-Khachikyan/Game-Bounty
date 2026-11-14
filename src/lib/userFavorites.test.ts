import { describe, expect, it, vi } from 'vitest';
import { setDoc } from 'firebase/firestore';
import { createGame } from '../test/factories';
import { upsertUserFavorite } from './userFavorites';

vi.mock('./firebase', () => ({ firebaseDb: {} }));
vi.mock('firebase/firestore', () => ({
   collection: vi.fn(() => ({})),
   doc: vi.fn(() => 'favorite-document'),
   setDoc: vi.fn().mockResolvedValue(undefined),
   serverTimestamp: vi.fn(() => 'server-timestamp'),
   Timestamp: class {},
   onSnapshot: vi.fn(),
   deleteDoc: vi.fn(),
}));

describe('favorites persistence boundary', () => {
   it('saves a full RAWG result without sending fields rejected by Firestore rules', async () => {
      const allowed = createGame();
      const rawgResult = {
         ...allowed,
         slug: 'hades',
         rating: 4.5,
         ratings_count: 1234,
         platforms: [{ platform: { id: 4, name: 'PC', slug: 'pc' }, released_at: '2020-09-17' }],
      };
      await upsertUserFavorite('player-1', rawgResult);
      expect(setDoc).toHaveBeenCalledWith('favorite-document', {
         ...allowed,
         platforms: [{ platform: { id: 4, name: 'PC' } }],
         savedAt: 'server-timestamp',
      });
   });
});
