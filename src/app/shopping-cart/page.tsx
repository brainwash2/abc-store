import type { Metadata } from 'next';
import ShoppingCartInteractive from './components/ShoppingCartInteractive';

export const metadata: Metadata = {
  title: 'Panier d\'achat - ABC Informatique',
  description: 'Gérez vos articles sélectionnés, modifiez les quantités et procédez au paiement sécurisé pour vos produits informatiques.',
};

export default function ShoppingCartPage() {
  return <ShoppingCartInteractive />;
}