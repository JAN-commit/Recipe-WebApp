import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { notifyAuthChange } from '../useAuth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';
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
        localStorage.setItem('expiresIn', data.expiresIn);
        localStorage.setItem('idToken', data.idToken);
        localStorage.setItem('localId', data.localId);

        const timeoutInSeconds = Number(data.expiresIn);
        const currentTime = new Date();
        const expiryTime = new Date(currentTime.getTime() + timeoutInSeconds * 1000);
        localStorage.setItem('expiryTime', expiryTime);

        notifyAuthChange();
        navigate('/dashboard');
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
        <h1 className="font-display text-3xl font-semibold">Welcome back</h1>
        <p className="mt-2 text-sm text-base-content/60">Sign in to pick up where you left off.</p>
      </div>

      <div className="rounded-xl border border-base-300 bg-base-100 p-6 shadow-card sm:p-8">
        <form onSubmit={handleLogin} className="space-y-5">
          {error && (
            <p className="rounded-lg border border-error/30 bg-error/5 px-4 py-2.5 text-sm text-error">
              {error}
            </p>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-medium" htmlFor="login-email">
              Email
            </label>
            <input
              id="login-email"
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
            <label className="mb-1.5 block text-sm font-medium" htmlFor="login-password">
              Password
            </label>
            <input
              id="login-password"
              type="password"
              placeholder="Your password"
              className="input input-bordered w-full"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? <span className="loading loading-spinner loading-xs"></span> : 'Sign in'}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-base-content/60">
        New to Kusina?{' '}
        <Link to="/signup" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}