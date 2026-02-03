import { render, screen } from '@testing-library/react';
import PaymentStatusCard from './PaymentStatusCard';

describe('PaymentStatusCard', () => {
  it('affiche les informations du paiement', () => {
    render(
      <PaymentStatusCard
        listing={{
          id: 'listing-1',
          title: 'Carte rare',
          price: 95,
          currency: 'EUR',
          status: 'Confirmé'
        }}
      />
    );

    expect(screen.getByText('Carte rare')).toBeInTheDocument();
    expect(screen.getByText('95')).toBeInTheDocument();
    expect(screen.getByText('Confirmé')).toBeInTheDocument();
  });
});
