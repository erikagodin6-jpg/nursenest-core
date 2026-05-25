/**
 * Auth Status Component
 * 
 * Client-side component that checks auth status and displays
 * appropriate UI (login button or user menu).
 */
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface AuthState {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  loading: boolean;
}

export default function AuthStatus() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
  });

  useEffect(() => {
    // Check auth status client-side
    fetch('/api/auth/status')
      .then((res) => res.json())
      .then((data) => {
        setAuthState({
          isAuthenticated: data.authenticated,
          user: data.user,
          loading: false,
        });
      })
      .catch(() => {
        setAuthState({
          isAuthenticated: false,
          user: null,
          loading: false,
        });
      });
  }, []);

  if (authState.loading) {
    return (
      <div className="h-10 w-24 animate-pulse rounded bg-gray-200" />
    );
  }

  if (authState.isAuthenticated && authState.user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm">{authState.user.name}</span>
        <Link
          href="/app"
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
        >
          Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="text-sm text-gray-700 hover:text-gray-900"
      >
        Log In
      </Link>
      <Link
        href="/signup"
        className="rounded bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
      >
        Sign Up
      </Link>
    </div>
  );
}
