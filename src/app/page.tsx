import Landing from './component/landing1';
import PageTransition from './components/PageTransition';

export default function Home() {
  return (
    <PageTransition>
      <Landing />
    </PageTransition>
  );
}