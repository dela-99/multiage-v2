import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';

/**
 * A reusable hook for making authenticated API requests.
 * @param {string} token - The JWT token for authorization.
 * @param {string} endpoint - The API endpoint to fetch (e.g., '/api/users').
 * @param {object} [options={}] - Optional fetch options.
 * @returns {{data: any, loading: boolean, error: Error|null, refetch: function}}
 */
export function useApi(token, endpoint, options = {}) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { logout } = useAuth();

  const fetchData = useCallback(async (signal) => {
    setLoading(true);
    setError(null);

    try {
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const response = await fetch(`/api${endpoint}`, { ...options, headers, signal });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          logout(); // Invalid token or permissions, log out user
          return;
        }
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err);
      }
    } finally {
      setLoading(false);
    }
  }, [token, endpoint, JSON.stringify(options), logout]);

  useEffect(() => {
    if (token && endpoint) {
      const controller = new AbortController();
      fetchData(controller.signal);
      return () => controller.abort();
    } else {
      setLoading(false);
    }
  }, [token, endpoint, fetchData]);

  return { data, loading, error, refetch: () => fetchData(new AbortController().signal) };
}