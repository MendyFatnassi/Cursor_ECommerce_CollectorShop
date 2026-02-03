import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DashboardLayout from './DashboardLayout';
import usePortalStore from '@store/usePortalStore';

describe('DashboardLayout', () => {
  it('affiche le lien de connexion pour un visiteur', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<div>Contenu</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Connexion')).toBeInTheDocument();
  });

  it('affiche les liens adaptés aux rôles', () => {
    usePortalStore.setState({
      profile: {
        id: '1',
        fullName: 'Jean',
        email: 'user@example.com',
        emailVerified: true,
        roles: ['SELLER'],
        preferredLocales: ['fr-FR'],
        reputation: 0,
        interestTags: []
      }
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<div>Contenu</div>} />
          </Route>
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Dashboard Vendeur')).toBeInTheDocument();
    expect(screen.queryByText('Connexion')).not.toBeInTheDocument();
  });
});
