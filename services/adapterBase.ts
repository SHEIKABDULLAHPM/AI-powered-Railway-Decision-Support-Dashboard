// services/adapterBase.ts - Base adapter for API communication
// Provides centralized URL management for switching between mock and production APIs

/**
 * Get the API base URL from environment or default to local mock APIs
 * This allows seamless switching between local mock APIs and production ML services
 * Set NEXT_PUBLIC_API_BASE environment variable to point to production endpoints
 */
export const getApiBaseUrl = (): string => {
  return process.env.NEXT_PUBLIC_API_BASE || '/api';
};

/**
 * Construct full API URL for a given endpoint path
 * @param path - API endpoint path (e.g., '/trains', '/recommendations')
 * @returns Full URL for the API endpoint
 */
export const apiUrl = (path: string): string => {
  const baseUrl = getApiBaseUrl();
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
};

/**
 * Common fetch wrapper with error handling and typing
 * @param url - Full URL to fetch
 * @param options - Fetch options
 * @returns Parsed JSON response
 */
export const apiFetch = async <T>(
  url: string, 
  options: RequestInit = {}
): Promise<T> => {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API request failed for ${url}:`, error);
    throw error;
  }
};

/**
 * GET request helper
 */
export const apiGet = async <T>(path: string): Promise<T> => {
  return apiFetch<T>(apiUrl(path), { method: 'GET' });
};

/**
 * POST request helper
 */
export const apiPost = async <T>(path: string, data?: any): Promise<T> => {
  return apiFetch<T>(apiUrl(path), {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * PUT request helper
 */
export const apiPut = async <T>(path: string, data?: any): Promise<T> => {
  return apiFetch<T>(apiUrl(path), {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * DELETE request helper
 */
export const apiDelete = async <T>(path: string): Promise<T> => {
  return apiFetch<T>(apiUrl(path), { method: 'DELETE' });
};

// Environment configuration helpers
export const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

export const isMockMode = (): boolean => {
  const apiBase = getApiBaseUrl();
  return apiBase.startsWith('/api') || apiBase.includes('localhost');
};

export const getEnvironmentInfo = () => ({
  nodeEnv: process.env.NODE_ENV,
  apiBase: getApiBaseUrl(),
  isMock: isMockMode(),
  isProduction: isProduction(),
});