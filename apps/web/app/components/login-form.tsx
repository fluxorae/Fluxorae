'use client';

import { FormEvent, useMemo, useState } from 'react';
import { buildApiUrl } from '../lib/api';

type LoginResponse = {
  accessToken: string;
  expiresIn: string;
  user: {
    id: string;
    email: string;
    role: string;
    firstName: string;
    lastName?: string | null;
  };
};

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const endpoint = useMemo(() => buildApiUrl('/auth/login'), []);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = (await response.json()) as unknown;

      if (!response.ok) {
        const messageValue =
          typeof data === 'object' && data && 'message' in data
            ? (data as { message?: string | string[] }).message
            : undefined;
        const apiError = Array.isArray(messageValue)
          ? messageValue.join(', ')
          : messageValue;
        throw new Error(apiError || 'Login failed.');
      }

      const payload = data as LoginResponse;
      localStorage.setItem('fluxorae_access_token', payload.accessToken);
      localStorage.setItem('fluxorae_user', JSON.stringify(payload.user));
      setMessage(`Authenticated as ${payload.user.email} (${payload.user.role}).`);
    } catch (exception) {
      setError(exception instanceof Error ? exception.message : 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="card form-card reveal" onSubmit={submit}>
      <h3>ERP Portal Login</h3>
      <p className="muted">
        This screen authenticates directly against `POST /api/auth/login`.
      </p>

      <label>
        Work Email
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          autoComplete="email"
          required
        />
      </label>

      <label>
        Password
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          autoComplete="current-password"
          required
        />
      </label>

      <button className="button" type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Signing In...' : 'Sign In'}
      </button>

      {message ? <p className="status-ok">{message}</p> : null}
      {error ? <p className="status-error">{error}</p> : null}
    </form>
  );
}
