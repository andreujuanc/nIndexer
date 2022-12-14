import { PoolClient } from 'pg';
import { multiInsert } from '../postgress';

type RawTransaction = {
    txto: string;
    txfrom: string;
    contractAddress: string;
    transactionIndex: number;
    root?: string;
    gasUsed: string;
    logsBloom: string;
    blockHash: string;
    transactionHash: string;
    blockNumber: number;
    confirmations: number;
    cumulativeGasUsed: string;
    effectiveGasPrice: string;
    byzantium: boolean;
    type: number;
    status?: number;
};

export const RawTransactionFields: (keyof RawTransaction)[] = [
    'txto',
    'txfrom',
    'contractAddress',
    'transactionIndex',
    'root',
    'gasUsed',
    'logsBloom',
    'blockHash',
    'transactionHash',
    'blockNumber',
    'confirmations',
    'cumulativeGasUsed',
    'effectiveGasPrice',
    'byzantium',
    'type',
    'status'
];

export async function saveTransactions(client: PoolClient, txs: RawTransaction[]) {
    await multiInsert(client, 'raw.transactions', RawTransactionFields, txs);
}
