const DEFAULT_CORS_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'https://fluxorae.com',
  'https://www.fluxorae.com',
];

const parseNumber = (value: string | undefined, fallback: number) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const parseCorsOrigins = (value: string | undefined): string[] => {
  if (!value) {
    return DEFAULT_CORS_ORIGINS;
  }

  const origins = value
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean);

  return origins.length > 0 ? Array.from(new Set(origins)) : DEFAULT_CORS_ORIGINS;
};

const parseTrustProxy = (value: string | undefined): boolean | number | string => {
  if (!value) {
    return 1;
  }

  const normalized = value.trim().toLowerCase();

  if (normalized === 'true') {
    return true;
  }

  if (normalized === 'false') {
    return false;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : value;
};

export default () => ({
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseNumber(process.env.PORT, 3000),
  apiPrefix: process.env.API_PREFIX ?? 'api',
  corsOrigins: parseCorsOrigins(process.env.CORS_ORIGINS),
  trustProxy: parseTrustProxy(process.env.TRUST_PROXY),
  bodySizeLimit: process.env.BODY_SIZE_LIMIT ?? '1mb',
  rateLimitWindowMs: parseNumber(process.env.RATE_LIMIT_WINDOW_MS, 60000),
  rateLimitMax: parseNumber(process.env.RATE_LIMIT_MAX, 120),
  jwtSecret: process.env.JWT_SECRET ?? 'fluxorae-dev-secret-change-me',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '8h',
  databaseUrl:
    process.env.DATABASE_URL ??
    'postgresql://postgres:password@localhost:5432/fluxorae_erp',
});
