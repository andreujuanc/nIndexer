import { PoolClient } from "pg";

export async function getNextBlock(client: PoolClient) {
    const res = await client.query('SELECT id FROM raw.blocks ORDER BY id DESC LIMIT 1') as any;
    //console.log(res.rows)
    if (res.rows.length > 0) {

        return parseInt(res.rows[0].id) + 1;
    }
    return parseInt((process.env.BLOCK_START_AT ?? 0).toString());
}

export async function saveBlock(client: PoolClient, block: { number: number; data: any; }) {
    await client.query('INSERT INTO raw.blocks (id, data) VALUES ($1, $2)', [block.number, block.data]);
}
