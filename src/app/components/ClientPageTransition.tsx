'use client';

import dynamic from 'next/dynamic';

const PageTransition = dynamic(() => import('./PageTransition'), { ssr: false });

const ClientPageTransition = ({ children }) => (
  <PageTransition>{children}</PageTransition>
);

export default ClientPageTransition;
