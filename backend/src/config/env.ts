const REQUIRED_VARIABLES = ['PORT', 'DATABASE_URL', 'NODE_ENV', 'FRONTEND_URL'] as const;

export function validateEnvironment(): void {
  const missing = REQUIRED_VARIABLES.filter((name) => !process.env[name]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
}
