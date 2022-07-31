import { PoolClient } from "pg";
import { multiInsert } from "../postgress";

export interface Log {
    blockNumber: number;
    blockHash: string;
    transactionIndex: number;

    removed: boolean;

    address: string;
    data: string;

    topics: string//Array<string>;

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
    'topics',
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
