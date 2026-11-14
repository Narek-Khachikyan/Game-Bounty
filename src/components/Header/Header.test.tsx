import { describe, expect, it, vi } from 'vitest';
import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useRoutes, useLocation } from 'react-router-dom';
import Header from './Header';
import Auth from '../../page/Auth';
import { renderWithProviders } from '../../test/renderWithProviders';

const discoveryPath = '/?q=doom&genre=action&platform=4#game-17';
const Location = () => {
   const location = useLocation();
   return <p>{location.pathname + location.search + location.hash}</p>;
};
const TestRoutes = () => useRoutes([{ path: '/', element: <Location /> }, { path: '/auth', element: <Auth /> }]);
const setup = () => {
   const signInWithEmail = vi.fn().mockResolvedValue(undefined);
   renderWithProviders(<>
      <Header isAnimatedBackgroundEnabled={false} animatedBackgroundBlockedReason={null} onAnimatedBackgroundToggle={() => undefined} />
      <TestRoutes />
   </>, { route: discoveryPath, auth: { signInWithEmail } });
   return { user: userEvent.setup(), signInWithEmail };
};

describe('header sign-in discovery context', () => {
   it('restores the same search, filters and target after signing in from the header', async () => {
      const { user, signInWithEmail } = setup();
      await user.click(screen.getByRole('link', { name: 'Sign in' }));
      await user.type(screen.getByLabelText('Email', { exact: true }), 'player@example.com');
      await user.type(screen.getByLabelText('Password', { exact: true }), 'password123');
      const form = screen.getByLabelText('Password', { exact: true }).closest('form');
      if (!form) throw new Error('Password must belong to the sign-in form');
      await user.click(within(form).getByRole('button', { name: 'Sign In' }));
      expect(signInWithEmail).toHaveBeenCalledWith('player@example.com', 'password123');
      expect(await screen.findByText(discoveryPath)).toBeInTheDocument();
   });

   it('keeps the original return target when the header sign-in link is clicked again on auth', async () => {
      const { user } = setup();
      await user.click(screen.getByRole('link', { name: 'Sign in' }));
      await user.click(screen.getByRole('link', { name: 'Sign in' }));
      await user.click(screen.getByRole('link', { name: 'Return to the game catalog' }));
      expect(await screen.findByText(discoveryPath)).toBeInTheDocument();
   });
});
