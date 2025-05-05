'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!name || !email || !password) {
      setError('Please fill in all fields.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      setIsLoading(false);

      if (!res.ok) {
        setError(data.message || `Registration failed. Status: ${res.status}`);
      } else {
        setSuccess('Registration successful! Redirecting to login...');
        setName('');
        setEmail('');
        setPassword('');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (err) {
      setIsLoading(false);
      setError('An error occurred during registration. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-start pt-0 sm:pt-0">
      <div className="w-full max-w-md mx-auto p-4 sm:p-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
          {/* Decorative header strip */}
          <div className="h-2 bg-blue-500 w-full"></div>

          <div className="p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
              <p className="mt-1 text-sm text-gray-600">
                Join BlogHandler today
              </p>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm">
                {success}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                  className="w-full px-4 py-3 text-gray-900 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 transition-all placeholder-gray-400"
                  placeholder="John Doe"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
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
                  placeholder="At least 6 characters"
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
                    Creating account...
                  </span>
                ) : 'Get Started'}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-gray-100 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}