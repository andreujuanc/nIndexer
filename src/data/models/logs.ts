import { PoolClient } from "pg";
import { multiInsert } from "../postgress";

export interface Log {
    blockNumber: number;
    blockHash: string;
    transactionIndex: number;

    removed: boolean;

    address: string;
    data: string;

    topic0: string;
    topic1: string;
    topic2: string;
    topic3: string;
    topic4: string;
    topic5: string;
    topic6: string;

    transactionHash: string;
    logIndex: number;
}


export const LogFields: (keyof Log)[] = [
    'blockNumber',
    'blockHash',
    'transactionIndex',
    'removed',
    'address',
    'data',
    'topic0',
    'topic1',
    'topic2',
    'topic3',
    'topic4',
    'topic5',
    'topic6',
    'transactionHash',
    'logIndex'
];

export async function saveLogs(client: PoolClient, logs: Log[]) {
    const size = 1000
    const chunks = Math.ceil(logs.length / size)

    await Promise.all([...new Array(chunks)].map((_, i) =>
        multiInsert(client, 'raw.logs', LogFields, logs.slice(i * size, (i * size) + size))
    ))
}
