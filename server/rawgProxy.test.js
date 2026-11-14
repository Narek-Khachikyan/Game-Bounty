// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';
import { createRawgProxy } from './rawgProxy.js';

const request = (overrides = {}) => ({
   pathname: '/api/rawg/games',
   env: { RAWG_API_KEY: 'test-key' },
   ...overrides,
});
const json = (body = { results: [] }, status = 200) => new Response(JSON.stringify(body), {
   status,
   headers: { 'content-type': 'application/json' },
});

afterEach(() => vi.unstubAllGlobals());

describe('RAWG proxy request budget', () => {
   it('serves ten concurrent and ten repeated GETs with one upstream request', async () => {
      const fetch = vi.fn(async () => json({ results: [{ id: 1 }] }));
      vi.stubGlobal('fetch', fetch);
      const proxy = createRawgProxy();
      const responses = await Promise.all(Array.from({ length: 10 }, () => proxy(request())));
      for (const response of responses) expect(await response.json()).toEqual({ results: [{ id: 1 }] });
      for (let i = 0; i < 10; i++) expect(await (await proxy(request())).json()).toEqual({ results: [{ id: 1 }] });
      expect(fetch).toHaveBeenCalledTimes(1);
   });

   it('normalizes query ordering and proxy aliases but separates filters, keys and Accept', async () => {
      const fetch = vi.fn(async () => json());
      vi.stubGlobal('fetch', fetch);
      const proxy = createRawgProxy();
      await proxy(request({ search: '?page=1&search=doom' }));
      await proxy(request({ pathname: '/.netlify/functions/rawg/games', search: '?search=doom&page=1' }));
      expect(fetch).toHaveBeenCalledTimes(1);
      await proxy(request({ search: '?page=2&search=doom' }));
      await proxy(request({ search: '?page=1&search=doom', env: { RAWG_API_KEY: 'other' } }));
      await proxy(request({ search: '?page=1&search=doom', headers: { accept: 'application/json' } }));
      expect(fetch).toHaveBeenCalledTimes(4);
   });

   it('expires game data after one minute and catalog data after one hour', async () => {
      let time = 0;
      const fetch = vi.fn(async () => json());
      vi.stubGlobal('fetch', fetch);
      const proxy = createRawgProxy({ now: () => time });
      await proxy(request());
      await proxy(request({ pathname: '/api/rawg/genres' }));
      time = 59_999;
      await proxy(request());
      expect(fetch).toHaveBeenCalledTimes(2);
      time = 60_000;
      await proxy(request());
      await proxy(request({ pathname: '/api/rawg/genres' }));
      expect(fetch).toHaveBeenCalledTimes(3);
      time = 3_600_000;
      await proxy(request({ pathname: '/api/rawg/genres' }));
      expect(fetch).toHaveBeenCalledTimes(4);
   });

   it('bounds completed cache entries', async () => {
      const fetch = vi.fn(async () => json());
      vi.stubGlobal('fetch', fetch);
      const proxy = createRawgProxy({ maxEntries: 2 });
      await proxy(request({ search: '?page=1' }));
      await proxy(request({ search: '?page=2' }));
      await proxy(request({ search: '?page=3' }));
      await proxy(request({ search: '?page=2' }));
      expect(fetch).toHaveBeenCalledTimes(3);
      await proxy(request({ search: '?page=1' }));
      expect(fetch).toHaveBeenCalledTimes(4);
   });

   it('does not cache errors, non-JSON or non-GET responses', async () => {
      const fetch = vi.fn()
         .mockResolvedValueOnce(json({ error: 'limited' }, 429))
         .mockResolvedValueOnce(json())
         .mockResolvedValueOnce(new Response('plain text'))
         .mockResolvedValueOnce(new Response('plain text'))
         .mockImplementation(async () => json());
      vi.stubGlobal('fetch', fetch);
      const proxy = createRawgProxy();
      expect((await proxy(request())).status).toBe(429);
      expect((await proxy(request())).status).toBe(200);
      await proxy(request({ pathname: '/api/rawg/plain' }));
      await proxy(request({ pathname: '/api/rawg/plain' }));
      await proxy(request({ method: 'POST', body: '{}' }));
      await proxy(request({ method: 'POST', body: '{}' }));
      expect(fetch).toHaveBeenCalledTimes(6);
   });

   it('returns 502 to every waiter after a body-read failure and allows retry', async () => {
      const brokenBody = new ReadableStream({
         start(controller) { controller.error(new Error('body interrupted')); },
      });
      const fetch = vi.fn()
         .mockResolvedValueOnce(new Response(brokenBody, { headers: { 'content-type': 'application/json' } }))
         .mockImplementation(async () => json());
      vi.stubGlobal('fetch', fetch);
      const proxy = createRawgProxy();
      const responses = await Promise.all([proxy(request()), proxy(request())]);
      expect(responses.map((response) => response.status)).toEqual([502, 502]);
      expect((await proxy(request())).status).toBe(200);
      expect(fetch).toHaveBeenCalledTimes(2);
   });

   it('does not retain malformed JSON and lets the next request recover', async () => {
      const fetch = vi.fn()
         .mockResolvedValueOnce(new Response('{broken', { headers: { 'content-type': 'application/json' } }))
         .mockImplementation(async () => json());
      vi.stubGlobal('fetch', fetch);
      const proxy = createRawgProxy();
      expect((await proxy(request())).status).toBe(502);
      expect(await (await proxy(request())).json()).toEqual({ results: [] });
      expect(fetch).toHaveBeenCalledTimes(2);
   });

   it('recovers after a network error and rejects missing keys even with warm data', async () => {
      const fetch = vi.fn().mockRejectedValueOnce(new Error('offline')).mockImplementation(async () => json());
      vi.stubGlobal('fetch', fetch);
      const proxy = createRawgProxy();
      expect((await proxy(request())).status).toBe(502);
      expect((await proxy(request())).status).toBe(200);
      expect((await proxy(request({ env: {} }))).status).toBe(500);
      expect(fetch).toHaveBeenCalledTimes(2);
   });
});
