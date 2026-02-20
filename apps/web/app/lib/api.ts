const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

const rawBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? '/api';
const baseUrl = trimTrailingSlash(rawBaseUrl);

export const buildApiUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${normalizedPath}`;
};
