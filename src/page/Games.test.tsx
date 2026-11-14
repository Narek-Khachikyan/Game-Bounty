import { beforeEach, describe, expect, it, vi } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useLocation } from 'react-router-dom';
import Games from './Games';
import Auth from './Auth';
import { renderWithProviders } from '../test/renderWithProviders';
import {
   useGetGamesDataQuery,
   useGetGenresDataQuery,
   useGetPlatformsDataQuery,
} from '../app/redux/features/apiSlice';

vi.mock('../app/redux/features/apiSlice', async () => ({
   ...await vi.importActual<typeof import('../app/redux/features/apiSlice')>('../app/redux/features/apiSlice'),
   useGetGamesDataQuery: vi.fn(),
   useGetGenresDataQuery: vi.fn(),
   useGetPlatformsDataQuery: vi.fn(),
}));

const game = {
   id: 17,
   name: 'A game worth keeping',
   released: '2026-01-01',
   background_image: '/cover.jpg',
   metacritic: 90,
   platforms: [{ platform: { id: 4, name: 'PC' } }],
};
const retry = vi.fn();
const useCatalog = (overrides = {}) => {
   vi.mocked(useGetGamesDataQuery).mockReturnValue({
      currentData: { results: [game] },
      isFetching: false,
      isError: false,
      refetch: retry,
      ...overrides,
   } as never);
};
const Location = () => {
   const location = useLocation();
   return <span aria-label="Current route">{`${location.pathname}${location.search}${location.hash}`}</span>;
};
const renderDiscovery = (route = '/') => renderWithProviders(<><Games /><Location /></>, { route });
const currentUrl = () => new URL(screen.getByLabelText('Current route').textContent || '/', 'https://game.test');

beforeEach(() => {
   vi.clearAllMocks();
   useCatalog();
   vi.mocked(useGetGenresDataQuery).mockReturnValue({
      data: { results: [{ id: 4, name: 'Action', image_background: '' }, { id: 5, name: 'RPG', image_background: '' }] },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
   } as never);
   vi.mocked(useGetPlatformsDataQuery).mockReturnValue({
      data: { results: [{ id: 4, name: 'PC', slug: 'pc' }, { id: 187, name: 'PlayStation 5', slug: 'playstation5' }] },
      isLoading: false,
      isError: false,
      refetch: vi.fn(),
   } as never);
});

describe('game discovery context and recovery', () => {
   it('returns from sign-in to the validated discovery context without completing authentication', async () => {
      const next = '/?q=keeping&genre=rpg&platform=4#game-17';
      renderWithProviders(<><Auth /><Location /></>, { route: `/auth?next=${encodeURIComponent(next)}` });
      await userEvent.setup().click(screen.getByRole('link', { name: 'Return to the game catalog' }));
      expect(currentUrl().pathname + currentUrl().search + currentUrl().hash).toBe(next);
   });

   it('starts with unrestricted discovery rather than silently filtering title searches', () => {
      renderDiscovery();
      expect(useGetGamesDataQuery).toHaveBeenLastCalledWith({
         filterByGenres: '', debouncedQuery: '', filterByPlatforms: 0,
      });
      expect(screen.getByRole('button', { name: 'All genres' })).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByRole('combobox', { name: 'Platform' })).toHaveValue('0');
   });

   it('restores search and controlled filters from a shared or returning URL', () => {
      renderDiscovery('/?q=keeping&genre=rpg&platform=4');
      expect(screen.getByRole('searchbox', { name: 'Search games' })).toHaveValue('keeping');
      expect(screen.getByRole('button', { name: 'RPG' })).toHaveAttribute('aria-pressed', 'true');
      expect(screen.getByRole('combobox', { name: 'Platform' })).toHaveValue('4');
      expect(useGetGamesDataQuery).toHaveBeenLastCalledWith({
         filterByGenres: 'rpg', debouncedQuery: 'keeping', filterByPlatforms: 4,
      });
   });

   it('keeps changed search and filters in the URL and clears their request scope together', async () => {
      const user = userEvent.setup();
      renderDiscovery();
      await user.type(screen.getByRole('searchbox', { name: 'Search games' }), 'keeping');
      await user.click(screen.getByRole('button', { name: 'RPG' }));
      await user.selectOptions(screen.getByRole('combobox', { name: 'Platform' }), '4');
      expect(Object.fromEntries(currentUrl().searchParams)).toEqual({ q: 'keeping', genre: 'rpg', platform: '4' });
      await waitFor(() => expect(useGetGamesDataQuery).toHaveBeenLastCalledWith({
         filterByGenres: 'rpg', debouncedQuery: 'keeping', filterByPlatforms: 4,
      }));
      await user.click(screen.getByRole('button', { name: 'Clear search & filters' }));
      expect(currentUrl().search).toBe('');
      await waitFor(() => expect(useGetGamesDataQuery).toHaveBeenLastCalledWith({
         filterByGenres: '', debouncedQuery: '', filterByPlatforms: 0,
      }));
   });

   it('distinguishes unavailable data from zero matches and lets the player retry', async () => {
      useCatalog({ currentData: undefined, isError: true });
      renderDiscovery();
      expect(screen.getByRole('status')).toHaveTextContent('Catalog unavailable');
      expect(screen.queryByText('No games found.')).not.toBeInTheDocument();
      expect(screen.getByRole('alert')).toHaveTextContent('Check your connection');
      await userEvent.setup().click(screen.getByRole('button', { name: 'Try again' }));
      expect(retry).toHaveBeenCalledOnce();
   });

   it('offers a reset for an empty filtered catalog without treating it as a network failure', async () => {
      useCatalog({ currentData: { results: [] } });
      renderDiscovery('/?q=missing&genre=action');
      expect(screen.getByText('No games found.')).toBeInTheDocument();
      expect(screen.getByRole('status')).toHaveTextContent('0 games on this page');
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
      await userEvent.setup().click(screen.getAllByRole('button', { name: 'Clear search & filters' })[1]);
      expect(currentUrl().search).toBe('');
   });

   it('retains the intended card and discovery context in the signed-out save return path', async () => {
      renderDiscovery('/?q=keeping&genre=rpg&platform=4');
      await userEvent.setup().click(screen.getByRole('button', { name: `Sign in to save ${game.name}` }));
      const url = currentUrl();
      expect(url.pathname).toBe('/auth');
      expect(url.searchParams.get('next')).toBe('/?q=keeping&genre=rpg&platform=4#game-17');
   });

   it('focuses the intended game when returning to discovery after authentication', () => {
      renderDiscovery('/?q=keeping#game-17');
      expect(document.getElementById('game-17')).toHaveFocus();
   });
   it('continues the catalog and resets the page when filters change', async () => {
      useCatalog({ currentData: { results: [game], next: '/api/rawg/games?page=3' } });
      renderDiscovery('/?page=2&genre=action&platform=4');
      const user = userEvent.setup();
      await user.click(screen.getByRole('button', { name: 'Next page' }));
      expect(currentUrl().searchParams.get('page')).toBe('3');
      expect(currentUrl().searchParams.get('genre')).toBe('action');
      expect(useGetGamesDataQuery).toHaveBeenLastCalledWith({
         filterByGenres: 'action', debouncedQuery: '', filterByPlatforms: 4, page: 3,
      });
      await user.click(screen.getByRole('button', { name: 'RPG' }));
      expect(currentUrl().searchParams.has('page')).toBe(false);
      expect(currentUrl().searchParams.get('genre')).toBe('rpg');
   });

   it('does not repeat the spotlight game in the results grid', () => {
      renderDiscovery();
      expect(screen.getByRole('heading', { name: game.name })).toBeInTheDocument();
      expect(screen.queryByRole('article')).not.toBeInTheDocument();
   });

   it('names and removes a platform filter while retaining the search', async () => {
      renderDiscovery('/?q=keeping&platform=187');
      await userEvent.setup().click(screen.getByRole('button', { name: 'Remove platform PlayStation 5' }));
      expect(currentUrl().searchParams.get('q')).toBe('keeping');
      expect(currentUrl().searchParams.has('platform')).toBe(false);
   });

   it('retains a save action and focus target for the spotlight game', async () => {
      renderDiscovery();
      expect(document.getElementById(`game-${game.id}`)).toHaveAttribute('tabindex', '-1');
      await userEvent.setup().click(screen.getByRole('button', { name: `Sign in to save ${game.name}` }));
      expect(currentUrl().searchParams.get('next')).toBe('/#game-17');
   });

});
