export const INIT_SCRIPT = `

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TEMP TABLE IF NOT EXISTS tokens (
  id varchar(100) PRIMARY KEY,
  data JSONB
);

CREATE TEMP TABLE IF NOT EXISTS blocks (
  id bigint PRIMARY KEY,
  data JSONB
);

SELECT 'ok' as init;

`;

