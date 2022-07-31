import { Pool, PoolClient } from 'pg'
import { INIT_SCRIPT } from './scripts'
const pool = new Pool()

export async function connectToPostgress() {
    //await client.connect()
    // const res = await client.query('SELECT $1::text as message', ['Hello world!'])
    // console.log(res.rows[0].message)
    const res = await pool.query(INIT_SCRIPT) as any
    console.log('🟢 CONNECTED TO POSTGRESS. DB:', res[res.length - 1].rows)
}

export async function disconnectFromPostgress() {
    await pool.end()
}

export async function beginTransaction() {
    const client = await pool.connect()
    await client.query('BEGIN')
    return client
}

export async function commitTransaction(client: PoolClient){
    await client.query('COMMIT')
}

export async function rollbackTransaction(client: PoolClient){
    await client.query('ROLLBACK')
}



export async function multiInsert<T>(client: PoolClient, tablename: string, columns: (keyof T)[], values: T[]) {

    function getPlaceholders(txs: T[]) {

        return txs.map((tx, i) => getLiteral(i, columns.length)).join(', ')

        function getLiteral(index: number, fields: number): string {
            return '(' + Array.from({ length: fields }, (_, i) => `$${index * fields + i + 1}`).join(', ') + ')'
        }
    }

    const getValues = (a: T) => {
        return columns.map(c => a[c])
    }

    const valuePlaceholder = getPlaceholders(values)
    const query = `INSERT INTO ${tablename} (${columns}) VALUES ${valuePlaceholder}`
    const data = values.flatMap(value => [...getValues(value)])
    await pool.query(query, data)
}
