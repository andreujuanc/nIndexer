import { Client } from 'pg'
import { INIT_SCRIPT } from './scripts'
const client = new Client()

export async function connectToPostgress() {
    await client.connect()
    // const res = await client.query('SELECT $1::text as message', ['Hello world!'])
    // console.log(res.rows[0].message)
    const res = await client.query(INIT_SCRIPT) as any
    console.log('🟢 CONNECTED TO POSTGRESS. DB:', res[res.length - 1].rows)
}

export async function disconnectFromPostgress() {
    await client.end()
}

export async function getNextBlock() {
    const res = await client.query('SELECT id FROM blocks ORDER BY id DESC LIMIT 1') as any
    console.log(res.rows)
    if (res.rows.length > 0) {
     
        return parseInt(res.rows[0].id) + 1
    }
    return parseInt((process.env.BLOCK_START_AT ?? 0).toString())
}

export async function saveBlock(block: { number: number, data: any }) {
    await client.query('INSERT INTO blocks (id, data) VALUES ($1, $2)', [block.number, block.data])
}