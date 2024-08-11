import Layout from '../components/Layout';
import ClientPageTransition from '../components/ClientPageTransition';

export default function ContactPage() {
  return (
    <Layout>
      <ClientPageTransition>
        <div className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Contact Us</h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Get in touch with our team for any inquiries.
            </p>
          </div>
        </div>
      </ClientPageTransition>
    </Layout>
  );
}