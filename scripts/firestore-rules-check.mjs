import { readFileSync } from 'node:fs';
import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
import {
   assertFails,
   assertSucceeds,
   initializeTestEnvironment,
} from '@firebase/rules-unit-testing';

const projectId = 'demo-game-bounty';
const firestoreRules = readFileSync(new URL('../firestore.rules', import.meta.url), 'utf8');

const getFirestoreEmulatorConnection = () => {
   const emulatorHost = process.env.FIRESTORE_EMULATOR_HOST ?? '127.0.0.1:8080';

   try {
      const emulatorUrl = new URL(`http://${emulatorHost}`);
      const port = Number(emulatorUrl.port);

      if (!Number.isInteger(port) || port <= 0) {
         throw new Error('missing port');
      }

      return {
         host: emulatorUrl.hostname,
         port,
      };
   } catch {
      throw new Error(
         `FIRESTORE_EMULATOR_HOST must be set as "<host>:<port>". Received "${emulatorHost}".`,
      );
   }
};

const { host: firestoreHost, port: firestorePort } = getFirestoreEmulatorConnection();

const buildFavoritePath = (userId, favoriteId) => `users/${userId}/favorites/${favoriteId}`;

const createFavoritePayload = (overrides = {}) => ({
   id: 42,
   name: 'Hades',
   released: '2020-09-17',
   background_image: 'https://images.example/hades.jpg',
   metacritic: 93,
   platforms: [{ platform: { id: 4, name: 'PC' } }],
   savedAt: firebase.firestore.FieldValue.serverTimestamp(),
   ...overrides,
});

const createStoredFavorite = (overrides = {}) => ({
   ...createFavoritePayload(overrides),
   savedAt: firebase.firestore.Timestamp.fromMillis(1_700_000_000_000),
});

const testEnv = await initializeTestEnvironment({
   projectId,
   firestore: {
      host: firestoreHost,
      port: firestorePort,
      rules: firestoreRules,
   },
});

const runCase = async (name, callback) => {
   await testEnv.clearFirestore();
   await callback();
   console.log(`PASS ${name}`);
};

try {
   await runCase('owner can create a valid favorite', async () => {
      const ownerDb = testEnv.authenticatedContext('alice').firestore();
      await assertSucceeds(
         ownerDb.doc(buildFavoritePath('alice', '42')).set(createFavoritePayload()),
      );
   });

   await runCase('owner can read a seeded favorite', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
         await context
            .firestore()
            .doc(buildFavoritePath('alice', '42'))
            .set(createStoredFavorite());
      });

      const ownerDb = testEnv.authenticatedContext('alice').firestore();
      await assertSucceeds(ownerDb.doc(buildFavoritePath('alice', '42')).get());
   });

   await runCase('extra keys are rejected', async () => {
      const ownerDb = testEnv.authenticatedContext('alice').firestore();
      await assertFails(
         ownerDb
            .doc(buildFavoritePath('alice', '42'))
            .set(createFavoritePayload({ unexpected: true })),
      );
   });

   await runCase('invalid field types are rejected', async () => {
      const ownerDb = testEnv.authenticatedContext('alice').firestore();
      await assertFails(
         ownerDb
            .doc(buildFavoritePath('alice', '42'))
            .set(createFavoritePayload({ metacritic: '93' })),
      );
   });

   await runCase('platforms must stay a list', async () => {
      const ownerDb = testEnv.authenticatedContext('alice').firestore();
      await assertFails(
         ownerDb.doc(buildFavoritePath('alice', '42')).set(
            createFavoritePayload({
               platforms: 'PC',
            }),
         ),
      );
   });

   await runCase('platform entries can only be sanitized client-side', async () => {
      const ownerDb = testEnv.authenticatedContext('alice').firestore();
      await assertSucceeds(
         ownerDb.doc(buildFavoritePath('alice', '42')).set(
            createFavoritePayload({
               platforms: [{ platform: { id: 4, name: 'PC', slug: 'pc' } }, {}],
            }),
         ),
      );
   });

   await runCase('favorite id must match the document id', async () => {
      const ownerDb = testEnv.authenticatedContext('alice').firestore();
      await assertFails(
         ownerDb.doc(buildFavoritePath('alice', '99')).set(createFavoritePayload()),
      );
   });

   await runCase('client timestamps are rejected', async () => {
      const ownerDb = testEnv.authenticatedContext('alice').firestore();
      await assertFails(
         ownerDb.doc(buildFavoritePath('alice', '42')).set(
            createFavoritePayload({
               savedAt: firebase.firestore.Timestamp.fromMillis(1_700_000_000_000),
            }),
         ),
      );
   });

   await runCase('non-owners cannot read write or delete favorites', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
         await context
            .firestore()
            .doc(buildFavoritePath('alice', '42'))
            .set(createStoredFavorite());
      });

      const otherDb = testEnv.authenticatedContext('bob').firestore();
      await assertFails(otherDb.doc(buildFavoritePath('alice', '42')).get());
      await assertFails(
         otherDb.doc(buildFavoritePath('alice', '42')).set(createFavoritePayload()),
      );
      await assertFails(otherDb.doc(buildFavoritePath('alice', '42')).delete());
   });

   await runCase('owners can delete their favorites', async () => {
      const ownerDb = testEnv.authenticatedContext('alice').firestore();
      const favoriteRef = ownerDb.doc(buildFavoritePath('alice', '42'));

      await assertSucceeds(favoriteRef.set(createFavoritePayload()));
      await assertSucceeds(favoriteRef.delete());
   });

   await runCase('invalid updates are rejected', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
         await context
            .firestore()
            .doc(buildFavoritePath('alice', '42'))
            .set(createStoredFavorite());
      });

      const ownerDb = testEnv.authenticatedContext('alice').firestore();
      await assertFails(
         ownerDb.doc(buildFavoritePath('alice', '42')).update({
            metacritic: 'broken',
            savedAt: firebase.firestore.FieldValue.serverTimestamp(),
         }),
      );
   });

   await runCase('valid updates are allowed when they keep the shape intact', async () => {
      await testEnv.withSecurityRulesDisabled(async (context) => {
         await context
            .firestore()
            .doc(buildFavoritePath('alice', '42'))
            .set(createStoredFavorite());
      });

      const ownerDb = testEnv.authenticatedContext('alice').firestore();
      await assertSucceeds(
         ownerDb.doc(buildFavoritePath('alice', '42')).update({
            metacritic: null,
            savedAt: firebase.firestore.FieldValue.serverTimestamp(),
         }),
      );
   });

   console.log('Firestore rules check passed.');
} finally {
   await testEnv.cleanup();
}
