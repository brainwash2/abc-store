import type { Metadata } from 'next';
import HomepageInteractive from './components/HomepageInteractive';

export const metadata: Metadata = {
  title: 'Accueil - ABC Informatique',
  description: 'Découvrez ABC Informatique, votre destination pour les dernières technologies. Ordinateurs, smartphones, tablettes et accessoires avec livraison en Algérie.',
};

export default function HomePage() {
  return <HomepageInteractive />;
}