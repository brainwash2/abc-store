import type { Metadata } from 'next';
import OrderDetailsInteractive from './components/OrderDetailsInteractive';

export const metadata: Metadata = {
  title: 'Détails de la commande - ABC Informatique',
  description: 'Suivez votre commande et consultez les détails de livraison.',
};

export default function OrderDetailsPage() {
  return <OrderDetailsInteractive />;
}