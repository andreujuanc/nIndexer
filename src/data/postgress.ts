import { Client } from 'pg'
const client = new Client()

export async function connectToPostgress() {
    await client.connect()
    // const res = await client.query('SELECT $1::text as message', ['Hello world!'])
    // console.log(res.rows[0].message)
    console.log('🟢 CONNECTED TO POSTGRESS. DB:', client.database)
}

export async function disconnectFromPostgress() {
    await client.end()
}