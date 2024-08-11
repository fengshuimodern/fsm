import RoomPlanner from '../component/component';
import Layout from '../components/Layout';

export default function PlannerPage() {
  return (
    <Layout>
      <main className="flex min-h-screen flex-col items-center justify-between">
        <RoomPlanner />
      </main>
    </Layout>
  );
}