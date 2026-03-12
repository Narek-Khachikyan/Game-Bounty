const isSafeNextPath = (value: string | null): value is string =>
   typeof value === 'string' && value.startsWith('/') && !value.startsWith('//');

export const getSafeNextPath = (rawNextPath: string | null, fallback = '/') =>
   isSafeNextPath(rawNextPath) ? rawNextPath : fallback;

export const buildAuthRedirectPath = (nextPath: string) =>
   `/auth?next=${encodeURIComponent(nextPath)}`;
