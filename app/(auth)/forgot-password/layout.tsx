// app/(auth)/forgot-password/layout.tsx
import React, { ReactNode } from 'react';

type ForgotPasswordLayoutProps = {
  children: ReactNode;
};

const ForgotPasswordLayout = ({ children }: ForgotPasswordLayoutProps) => {
  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h1>Forgot Password</h1>
      <main>{children}</main>
    </div>
  );
};

export default ForgotPasswordLayout;
