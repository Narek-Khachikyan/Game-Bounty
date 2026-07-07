import { describe, expect, it } from 'vitest';
import { buildAuthRedirectPath, getSafeNextPath } from './authRedirect';

describe('auth redirect helpers', () => {
   it('keeps app-local next paths', () => {
      expect(getSafeNextPath('/favorites?filter=saved#top')).toBe('/favorites?filter=saved#top');
   });

   it('falls back when next path is missing or unsafe', () => {
      expect(getSafeNextPath(null)).toBe('/');
      expect(getSafeNextPath('https://evil.example/favorites')).toBe('/');
      expect(getSafeNextPath('//evil.example/favorites')).toBe('/');
      expect(getSafeNextPath('favorites')).toBe('/');
   });

   it('supports a custom fallback for unsafe paths', () => {
      expect(getSafeNextPath('//evil.example/favorites', '/games')).toBe('/games');
   });

   it('encodes the requested return path for the auth route', () => {
      expect(buildAuthRedirectPath('/favorites?tab=saved#list')).toBe(
         '/auth?next=%2Ffavorites%3Ftab%3Dsaved%23list',
      );
   });
});
