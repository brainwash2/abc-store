import type { Metadata } from 'next';
import CheckoutInteractive from './components/CheckoutInteractive';

export const metadata: Metadata = {
  title: 'Checkout - ABC Informatique',
  description: 'Complete your order securely with multiple payment options including Baridi Mob and WhatsApp payment methods for IT products and electronics.',
};

export default function CheckoutPage() {
  return <CheckoutInteractive />;
}