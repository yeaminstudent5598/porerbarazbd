// app/(auth)/layout.tsx
import React, { ReactNode } from 'react';
import Link from 'next/link';

type AuthLayoutProps = {
  children: ReactNode;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div>
      <header style={{ padding: '1rem', borderBottom: '1px solid #ccc' }}>
        <h1>Auth Section</h1>
        <nav>
          <Link href="/login" style={{ marginRight: '1rem' }}>Login</Link>
          <Link href="/register">Register</Link>
        </nav>
      </header>

      <main style={{ padding: '1rem' }}>
        {children}
      </main>

      <footer style={{ padding: '1rem', borderTop: '1px solid #ccc', marginTop: '2rem' }}>
        <p>&copy; 2025 ShotejFoods</p>
      </footer>
    </div>
  );
};

export default AuthLayout;
