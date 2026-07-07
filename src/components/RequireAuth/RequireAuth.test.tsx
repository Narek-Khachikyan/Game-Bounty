import { Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { screen } from '@testing-library/react';
import RequireAuth from './RequireAuth';
import { renderWithProviders } from '../../test/renderWithProviders';

const ProtectedRoutes = () => (
   <Routes>
      <Route
         path="/favorites"
         element={
            <RequireAuth>
               <h1>Protected favorites</h1>
            </RequireAuth>
         }
      />
      <Route path="/auth" element={<h1>Auth route</h1>} />
   </Routes>
);

describe('RequireAuth', () => {
   it('shows a polite loading checkpoint while auth is restoring', () => {
      renderWithProviders(<ProtectedRoutes />, {
         auth: {
            isAuthReady: false,
         },
         route: '/favorites',
      });

      expect(screen.getByText('Checking your session...')).toBeInTheDocument();
      expect(screen.getByText('Checking your session...').closest('section')).toHaveAttribute(
         'aria-live',
         'polite',
      );
   });

   it('redirects unauthenticated users to the auth route with a safe return path', () => {
      renderWithProviders(<ProtectedRoutes />, {
         route: '/favorites?filter=saved#list',
      });

      expect(screen.getByRole('heading', { name: 'Auth route' })).toBeInTheDocument();
      expect(window.location.pathname).toBe('/');
   });

   it('renders protected content for authenticated users', () => {
      renderWithProviders(<ProtectedRoutes />, {
         auth: {
            currentUser: { uid: 'alice' } as never,
         },
         route: '/favorites',
      });

      expect(screen.getByRole('heading', { name: 'Protected favorites' })).toBeInTheDocument();
   });
});
