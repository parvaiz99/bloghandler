'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please enter both email and password.');
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn('credentials', {
        redirect: false,
        email: email,
        password: password,
      });

      setIsLoading(false);

      if (result?.error) {
        if (result.error === 'CredentialsSignin' || result.error.includes('Incorrect password') || result.error.includes('No user found') || result.error.includes('password set')) {
          setError('Invalid email or password.');
        } else {
          setError(`Login failed: ${result.error}`);
        }
      } else if (result?.ok) {
        router.push('/');
        router.refresh();
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (err) {
      setIsLoading(false);
      setError('An error occurred during login.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start pt-0 sm:pt-0">
      <div className="w-full max-w-md mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          <div className="h-2 bg-blue-500 w-full"></div>

          <div className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Sign in</h2>
              <p className="mt-1 text-sm text-gray-600">
                Access your BlogHandler account
              </p>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all placeholder-gray-400"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all placeholder-gray-400"
                  placeholder="••••••••"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : 'Sign in'}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-100 text-center text-sm text-gray-600">
              Don't have an account?{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                Register
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}