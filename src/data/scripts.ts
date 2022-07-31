export const INIT_SCRIPT = `
CREATE SCHEMA IF NOT EXISTS raw;
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS raw.blocks (
  id bigint PRIMARY KEY,
  data JSONB
);

CREATE TABLE IF NOT EXISTS raw.transactions (
  transactionHash varchar(250) PRIMARY KEY,
  txto varchar(100),
  txfrom varchar(100),
  contractAddress varchar(100) NULL,
  transactionIndex smallint,
  root varchar(250),
  gasUsed varchar(250),
  logsBloom varchar(65000),
  blockHash varchar(250),
  blockNumber bigint,
  confirmations bigint,
  cumulativeGasUsed varchar(250),
  effectiveGasPrice varchar(250),
  byzantium boolean,
  type smallint,
  status smallint
);

CREATE TABLE IF NOT EXISTS raw.logs (
  blockNumber bigint,
  blockHash varchar(250),
  transactionIndex smallint,

  removed boolean,

  address varchar(100),
  data TEXT,

  topics JSONB,
  

  transactionHash varchar(250),
  logIndex bigint,

  PRIMARY KEY(blockNumber, transactionIndex, logIndex)
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

