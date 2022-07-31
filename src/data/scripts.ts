export const INIT_SCRIPT = `
CREATE SCHEMA IF NOT EXISTS raw;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS raw.blocks (
  id bigint PRIMARY KEY,
  data JSONB
);

CREATE TABLE IF NOT EXISTS raw.transactions (
  id varchar(100) PRIMARY KEY,
  data JSONB
);


CREATE TABLE IF NOT EXISTS contracts (
  id varchar(100) PRIMARY KEY,
  data JSONB
);

CREATE TABLE IF NOT EXISTS tokens (
  id varchar(100) PRIMARY KEY,
  data JSONB
);

CREATE TABLE IF NOT EXISTS collections (
  id varchar(100) PRIMARY KEY,
  data JSONB
);

SELECT 'ok' as init,  current_database() as dbname;

`;

