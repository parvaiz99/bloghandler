// src/app/providers.js
'use client'; // Mandatory for components using Context/Hooks

import { SessionProvider } from 'next-auth/react';

// session prop is optional, SessionProvider handles fetching if not provided
export default function Providers({ children, session }) {
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}