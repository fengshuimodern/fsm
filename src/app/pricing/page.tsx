import Layout from '../components/Layout';
import PricingContent from './PricingContent';
import ClientPageTransition from '../components/ClientPageTransition';

export default function PricingPage() {
  return (
    <Layout>
      <ClientPageTransition>
        <PricingContent />
      </ClientPageTransition>
    </Layout>
  );
}