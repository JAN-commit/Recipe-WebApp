import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    const url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
    const payload = {
      email: email,
      password: password,
      returnSecureToken: true
    };

    try {
      const response = await fetch(url + apiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        navigate('/login');
      } else {
        setError(data.error.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col justify-center px-4 py-12 sm:px-6">
      <div className="mb-8 text-center">
        <Link
          to="/"
          className="mx-auto mb-4 flex h-12 w-12 cursor-pointer items-center justify-center rounded-xl bg-primary text-primary-content"
        >
          <span className="material-symbols-outlined text-2xl">restaurant</span>
        </Link>
        <h1 className="font-display text-3xl font-semibold">Create your account</h1>
        <p className="mt-2 text-sm text-base-content/60">Save favorites and keep them close.</p>
      </div>

      <div className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-card sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <p className="rounded-lg border border-error/30 bg-error/5 px-4 py-2.5 text-sm text-error">
              {error}
            </p>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="signup-email">
              Email
            </label>
            <input
              id="signup-email"
              type="email"
              placeholder="you@example.com"
              className="input input-bordered w-full"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="signup-password">
              Password
            </label>
            <input
              id="signup-password"
              type="password"
              placeholder="At least 6 characters"
              className="input input-bordered w-full"
              required
              minLength={6}
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="signup-confirm">
              Confirm password
            </label>
            <input
              id="signup-confirm"
              type="password"
              placeholder="Repeat your password"
              className="input input-bordered w-full"
              required
              minLength={6}
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? <span className="loading loading-spinner loading-xs"></span> : 'Create account'}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-base-content/60">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}