import Layout from '../components/Layout';
import ClientPageTransition from '../components/ClientPageTransition';

export default function AboutPage() {
  return (
    <Layout>
      <ClientPageTransition>
        <div className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">About Us</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Learn more about our company and mission.
            </p>
          </div>
        </div>
      </ClientPageTransition>
    </Layout>
  );
}