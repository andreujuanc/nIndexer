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

export async function saveLogs(logs: Log[]) {
    await multiInsert('raw.logs', LogFields, logs);
}
