import { Client, Pool } from 'pg'
import { INIT_SCRIPT } from './scripts'
const client = new Pool()

export async function connectToPostgress() {
    //await client.connect()
    // const res = await client.query('SELECT $1::text as message', ['Hello world!'])
    // console.log(res.rows[0].message)
    const res = await client.query(INIT_SCRIPT) as any
    console.log('🟢 CONNECTED TO POSTGRESS. DB:', res[res.length - 1].rows)
}

export async function disconnectFromPostgress() {
    await client.end()
}

export async function getNextBlock() {
    const res = await client.query('SELECT id FROM raw.blocks ORDER BY id DESC LIMIT 1') as any
    console.log(res.rows)
    if (res.rows.length > 0) {

        return parseInt(res.rows[0].id) + 1
    }
    return parseInt((process.env.BLOCK_START_AT ?? 0).toString())
}

export async function saveBlock(block: { number: number, data: any }) {
    await client.query('INSERT INTO raw.blocks (id, data) VALUES ($1, $2)', [block.number, block.data])
}



type RawTransaction = {
    txto: string;
    txfrom: string;
    contractAddress: string,
    transactionIndex: number,
    root?: string,
    gasUsed: string,
    logsBloom: string,
    blockHash: string,
    transactionHash: string,
    logs: string,//Array<Log>,
    blockNumber: number,
    confirmations: number,
    cumulativeGasUsed: string,
    effectiveGasPrice: string,
    byzantium: boolean,
    type: number;
    status?: number
}

const RawTransactionFields: (keyof RawTransaction)[] = [
    'txto',
    'txfrom',
    'contractAddress',
    'transactionIndex',
    'root',
    'gasUsed',
    'logsBloom',
    'blockHash',
    'transactionHash',
    'logs',
    'blockNumber',
    'confirmations',
    'cumulativeGasUsed',
    'effectiveGasPrice',
    'byzantium',
    'type',
    'status'
]
export interface Log {
    blockNumber: number;
    blockHash: string;
    transactionIndex: number;

    removed: boolean;

    address: string;
    data: string;

    topics: Array<string>;

    transactionHash: string;
    logIndex: number;
}



async function multiInsert<T>(tablename: string, columns: (keyof T)[], values: T[]) {

    function getPlaceholders(txs: T[]) {

        return txs.map((tx, i) => getLiteral(i, RawTransactionFields.length)).join(', ')

        function getLiteral(index: number, fields: number): string {
            return '(' + Array.from({ length: fields }, (_, i) => `$${index * fields + i + 1}`).join(', ') + ')'
        }
    }

    const getValues = (a: T) => {
        return columns.map(c => a[c])
    }

    const valuePlaceholder = getPlaceholders(values)
    const query = `INSERT INTO ${tablename} (${columns}) VALUES ${valuePlaceholder}`

    await client.query(query, values.flatMap(value => [...getValues(value)]))
}

export async function saveTransactions(txs: RawTransaction[]) {
    await multiInsert('raw.transactions', RawTransactionFields, txs)

}

