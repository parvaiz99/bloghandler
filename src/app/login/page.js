// src/app/login/page.js
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
      console.log(`Login Page: Attempting signIn for ${email}`); // Debug Log
      const result = await signIn('credentials', {
        redirect: false, // Handle redirect manually
        email: email,
        password: password,
      });

      console.log("Login Page: signIn result:", result); // Debug Log

      setIsLoading(false);

      if (result?.error) {
         console.error("Login Page: SignIn error:", result.error);
         // Check the specific error message from authorize function
         if (result.error === 'CredentialsSignin' || result.error.includes('Incorrect password') || result.error.includes('No user found') || result.error.includes('password set')) {
             setError('Invalid email or password.'); // Generic message for security
         } else {
             setError(`Login failed: ${result.error}`); // Show other NextAuth errors
         }
      } else if (result?.ok) {
        console.log('Login Page: Sign-in successful, redirecting...');
        // Redirect to home or dashboard
        router.push('/');
        router.refresh(); // Refresh server components if needed
      } else {
         // Handle unexpected cases where result is null/undefined or !ok without specific error
         setError('Login failed. Please try again.');
      }
    } catch (err) {
        setIsLoading(false);
        console.error('Login Page: Submission error:', err);
        setError('An error occurred during login.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Login</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required
              className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" disabled={isLoading} />
          </div>
          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input id="password" name="password" type="password" autoComplete="current-password" required
              className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" disabled={isLoading} />
          </div>
          {/* Error Message */}
          {error && <p className="text-sm text-center text-red-600">{error}</p>}
          {/* Submit Button */}
          <div>
            <button type="submit" disabled={isLoading}
              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>
        {/* Link to Register */}
        <p className="mt-4 text-sm text-center text-gray-600">
          No account?{' '}
          <Link href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">Register</Link>
        </p>
      </div>
    </div>
  );
}