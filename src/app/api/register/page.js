// src/app/register/page.js
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
      console.log(`Register Page: Attempting fetch to /api/register for ${email}`); // Debug Log
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      // Try to parse JSON regardless of status code, as API might send error details
      let data;
      try {
          data = await res.json();
          console.log("Register Page: API Response data:", data); // Debug Log
      } catch (jsonError) {
          // Handle cases where response is not JSON (e.g., HTML error page)
          console.error("Register Page: Failed to parse API response as JSON", jsonError);
          setError(`Registration failed. Server returned non-JSON response. Status: ${res.status}`);
          setIsLoading(false);
          return;
      }


      if (!res.ok) {
        // Use message from API response body if available, otherwise generic error
        setError(data.message || `Registration failed. Status: ${res.status}`);
      } else {
        // Success
        setSuccess('Registration successful! Redirecting to login...');
        setName('');
        setEmail('');
        setPassword('');
        setTimeout(() => {
          router.push('/login');
        }, 2000); // Redirect after 2s
      }
    } catch (err) {
      console.error('Register Page: Submission error:', err);
      setError('An error occurred during registration. Please try again.');
    } finally {
        // Ensure loading state is turned off even if errors occur before setIsLoading(false) in try/catch
        setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-900">Create Account</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Name Input */}
           <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input id="name" name="name" type="text" required
              className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" disabled={isLoading} />
          </div>
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
            <input id="password" name="password" type="password" autoComplete="new-password" required
              className="block w-full px-3 py-2 mt-1 text-gray-900 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              value={password} onChange={(e) => setPassword(e.target.value)} placeholder="•••••••• (min. 6 characters)" disabled={isLoading} />
          </div>
          {/* Feedback Messages */}
          {error && <p className="text-sm text-center text-red-600">{error}</p>}
          {success && <p className="text-sm text-center text-green-600">{success}</p>}
          {/* Submit Button */}
          <div>
            <button type="submit" disabled={isLoading}
              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </div>
        </form>
        {/* Link to Login */}
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">Login</Link>
        </p>
      </div>
    </div>
  );
}