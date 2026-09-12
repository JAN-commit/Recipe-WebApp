import { useEffect, useState } from 'react';

export function isLoggedIn() {
  return !!localStorage.getItem('idToken');
}

export function notifyAuthChange() {
  window.dispatchEvent(new Event('authchange'));
}

export function useAuth() {
  const [loggedIn, setLoggedIn] = useState(isLoggedIn());

  useEffect(() => {
    const sync = () => setLoggedIn(isLoggedIn());
    window.addEventListener('authchange', sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener('authchange', sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return loggedIn;
}

export function clearSession() {
  localStorage.removeItem('expiresIn');
  localStorage.removeItem('idToken');
  localStorage.removeItem('localId');
  localStorage.removeItem('expiryTime');
  localStorage.removeItem('back');
}