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

  topic0 varchar(250) NULL,
  topic1 varchar(250) NULL,
  topic2 varchar(250) NULL,
  topic3 varchar(250) NULL,
  topic4 varchar(250) NULL,
  topic5 varchar(250) NULL,
  topic6 varchar(250) NULL,
  
  transactionHash varchar(250),
  logIndex bigint,


  PRIMARY KEY(blockNumber, transactionIndex, logIndex)
);

CREATE INDEX IF NOT EXISTS  ix_topic0 ON raw.logs (topic0);
CREATE INDEX IF NOT EXISTS  ix_topic1 ON raw.logs (topic1);
CREATE INDEX IF NOT EXISTS  ix_topic2 ON raw.logs (topic2);
CREATE INDEX IF NOT EXISTS  ix_topic3 ON raw.logs (topic3);
CREATE INDEX IF NOT EXISTS  ix_topic4 ON raw.logs (topic4);
CREATE INDEX IF NOT EXISTS  ix_topic5 ON raw.logs (topic5);
CREATE INDEX IF NOT EXISTS  ix_topic6 ON raw.logs (topic6);



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

