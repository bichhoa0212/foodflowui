import React from 'react';

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main style={{ minHeight: '80vh', padding: '32px 0' }}>{children}</main>
    </>
  );
}