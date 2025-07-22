import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main style={{ minHeight: '80vh', padding: '32px 0' }}>{children}</main>
      <Footer />
    </>
  );
}